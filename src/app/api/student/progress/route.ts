import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// POST: Record student lesson progress and auto-complete skills/certificates
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const demoRole = cookieStore.get('demo_role')?.value;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Verify user is student (authenticated or demo)
    const isDemo = !user && demoRole === 'student';
    if (!user && !isDemo) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      lesson_id,
      skill_id,
      is_completed = true,
      video_watched = true,
      watch_duration_seconds = 0,
    } = body;

    if (!lesson_id || !skill_id) {
      return NextResponse.json(
        { error: 'lesson_id and skill_id are required' },
        { status: 400 }
      );
    }

    let skillCompleted = false;
    let unlockedCertId: string | null = null;

    // 1. If real authenticated user, persist via supabaseAdmin
    if (user) {
      try {
        // Upsert into lesson_progress avoiding duplicate key violations
        const { error: lpError } = await supabaseAdmin
          .from('lesson_progress')
          .upsert(
            {
              student_id: user.id,
              lesson_id,
              skill_id,
              is_started: true,
              is_completed: is_completed,
              video_watched: video_watched,
              watch_duration_seconds: watch_duration_seconds || 0,
              completed_at: is_completed ? new Date().toISOString() : null,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: 'student_id,lesson_id',
            }
          );

        if (lpError) {
          console.warn('lesson_progress upsert warning:', lpError.message);
        }

        // Check if all lessons for this skill are now completed
        if (is_completed) {
          const [{ data: allSkillLessons }, { data: completedSkillLessons }, { data: skillInfo }] = await Promise.all([
            supabaseAdmin
              .from('lessons')
              .select('id')
              .eq('skill_id', skill_id)
              .eq('is_active', true),
            supabaseAdmin
              .from('lesson_progress')
              .select('lesson_id')
              .eq('student_id', user.id)
              .eq('skill_id', skill_id)
              .eq('is_completed', true),
            supabaseAdmin
              .from('skills')
              .select('id, name, total_planned_lessons, is_curriculum_complete')
              .eq('id', skill_id)
              .single(),
          ]);

          const totalLessons = (allSkillLessons || []).length;
          const completedCount = (completedSkillLessons || []).length;
          const targetRequired = skillInfo?.total_planned_lessons || totalLessons;

          // If all required lessons completed, mark skill completed & unlock certificate
          if (targetRequired > 0 && completedCount >= targetRequired) {
            skillCompleted = true;

            // Update student_skill_access
            await supabaseAdmin
              .from('student_skill_access')
              .update({
                status: 'completed',
                completion_date: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq('student_id', user.id)
              .eq('skill_id', skill_id);

            // Unlock certificate
            const { data: cert } = await supabaseAdmin
              .from('certificates')
              .update({
                status: 'unlocked',
                issued_at: new Date().toISOString(),
              })
              .eq('student_id', user.id)
              .eq('skill_id', skill_id)
              .select('id')
              .single();

            if (cert) unlockedCertId = cert.id;
          }

          // Record student activity
          await supabaseAdmin.from('student_activity').insert({
            student_id: user.id,
            activity_type: skillCompleted ? 'skill_completed' : 'lesson_completed',
            description: skillCompleted
              ? `Completed skill masterclass: ${skillInfo?.name || 'Skill'}`
              : 'Completed a video lesson lecture',
            metadata: { lesson_id, skill_id, skillCompleted },
          });
        }
      } catch (dbEx: any) {
        console.warn('Database progress exception:', dbEx?.message || dbEx);
      }
    }

    // 2. Persist in cookies so progress is universally synchronized across all pages & demo mode
    const existingCompleted = (cookieStore.get('completed_lessons')?.value || '')
      .split(',')
      .concat((cookieStore.get('demo_completed_lessons')?.value || '').split(','))
      .filter(Boolean);

    if (is_completed && !existingCompleted.includes(lesson_id)) {
      existingCompleted.push(lesson_id);
    } else if (!is_completed) {
      const idx = existingCompleted.indexOf(lesson_id);
      if (idx !== -1) existingCompleted.splice(idx, 1);
    }

    const uniqueCompleted = Array.from(new Set(existingCompleted));

    const response = NextResponse.json({
      success: true,
      lesson_id,
      skill_id,
      is_completed,
      skill_completed: skillCompleted,
      unlocked_cert_id: unlockedCertId,
    });

    // Save cookies (30 days persistence)
    const cookieValue = uniqueCompleted.join(',');
    response.cookies.set('completed_lessons', cookieValue, {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    });

    if (isDemo) {
      response.cookies.set('demo_completed_lessons', cookieValue, {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return response;
  } catch (error: any) {
    console.error('Progress recording error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to record progress' },
      { status: 500 }
    );
  }
}

