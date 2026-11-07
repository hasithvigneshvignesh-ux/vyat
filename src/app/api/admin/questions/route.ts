import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const demoRole = cookieStore.get('demo_role')?.value;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let isAdmin = false;
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (profile?.role === 'admin') isAdmin = true;
    } else if (demoRole === 'admin') {
      isAdmin = true;
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      skill_id,
      lesson_id,
      question_text,
      options,
      correct_answer,
      explanation,
      difficulty,
      marks,
      sort_order,
    } = body;

    const { data, error } = await supabaseAdmin
      .from('questions')
      .insert({
        skill_id,
        lesson_id: lesson_id || null,
        question_text,
        question_type: 'mcq',
        options,
        correct_answer,
        explanation: explanation || null,
        difficulty: difficulty || 'medium',
        marks: Number(marks) || 1,
        sort_order: sort_order || 10,
        is_active: true,
      })
      .select('*, skill:skills(name), lesson:lessons(title)')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to create question' },
      { status: 500 }
    );
  }
}

