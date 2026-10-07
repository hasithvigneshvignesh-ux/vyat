import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// POST: Create a new student account
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify the requester is admin
    const { data: { user } } = await supabase.auth.getUser();
    const demoRole = request.cookies.get('demo_role')?.value;
    
    let isAdmin = false;
    let adminId = null;

    if (user) {
      const { data: adminProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (adminProfile?.role === 'admin') {
        isAdmin = true;
        adminId = user.id;
      }
    } else if (demoRole === 'admin') {
      isAdmin = true;
      // adminId remains null for demo
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      full_name,
      email,
      phone,
      university,
      student_id_number,
      branch_name,
      year,
      password,
      award_certificate,
      certificate_skill_id,
      certificate_number,
      certificate_file_path,
      certificate_issue_date,
    } = body;

    // Validate required fields
    if (!full_name || !email || !password) {
      return NextResponse.json(
        { error: 'Full name, email, and password are required' },
        { status: 400 }
      );
    }

    // Create auth user using service role (bypasses email confirmation)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
        role: 'student',
      },
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    // Upsert the profile to guarantee data is saved regardless of trigger success
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email: authData.user.email || email,
        role: 'student',
        full_name,
        phone,
        university,
        student_id_number,
        branch_name,
        year,
      });

    if (profileError) {
      console.error('Profile update error:', profileError);
    }

    // If award_certificate was chosen, create the certificate entry
    if (award_certificate && certificate_skill_id) {
      try {
        const certNum = certificate_number || `CF-${new Date().getFullYear()}-STD-${Math.floor(10000 + Math.random() * 90000)}`;
        const { data: certData, error: certError } = await supabaseAdmin
          .from('certificates')
          .insert({
            student_id: authData.user.id,
            skill_id: certificate_skill_id,
            certificate_number: certNum,
            status: 'unlocked',
            file_path: certificate_file_path || null,
            issued_at: certificate_issue_date ? new Date(certificate_issue_date).toISOString() : new Date().toISOString(),
          })
          .select()
          .single();

        if (certError) {
          console.error('Certificate creation error:', certError);
        } else if (certData) {
          // Grant completed access on student_skill_access
          await supabaseAdmin.from('student_skill_access').upsert({
            student_id: authData.user.id,
            skill_id: certificate_skill_id,
            status: 'completed',
            activated_by: adminId,
            access_start_date: new Date().toISOString(),
            completion_date: new Date().toISOString(),
            certificate_id: certData.id,
          });
        }
      } catch (certEx) {
        console.error('Exception issuing certificate upon student creation:', certEx);
      }
    }

    // Grant specific course/lesson access
    if (body.grant_course_access && body.course_accesses) {
      const accesses = Object.entries(body.course_accesses as Record<string, string[]>);
      
      for (const [skillId, lessonIds] of accesses) {
        const allowedLessons = lessonIds && lessonIds.length > 0 ? lessonIds : null;
        try {
          await supabaseAdmin.from('student_skill_access').upsert({
            student_id: authData.user.id,
            skill_id: skillId,
            status: 'active',
            activated_by: adminId,
            access_start_date: new Date().toISOString(),
            allowed_lesson_ids: allowedLessons,
          });
        } catch (accessEx) {
          console.error(`Exception granting course access for ${skillId}:`, accessEx);
        }
      }
    }

    // Process Payment Details
    if (body.amount_paid && parseFloat(body.amount_paid) > 0) {
      try {
        await supabaseAdmin.from('payments').insert({
          student_id: authData.user.id,
          amount: parseFloat(body.amount_paid),
          payment_method: 'upi', // Default payment method
          payment_status: 'paid',
          notes: body.number_of_courses ? `Paid for ${body.number_of_courses} course(s)` : 'Initial account creation payment',
          recorded_by: adminId,
          received_at: new Date().toISOString()
        });
      } catch (paymentEx) {
        console.error('Exception recording payment:', paymentEx);
      }
    }

    // Log admin action
    if (adminId) {
      await supabaseAdmin.from('admin_actions').insert({
        admin_id: adminId,
        action_type: 'student_created',
        description: `Created student account for ${full_name} (${email})${award_certificate ? ' with certificate awarded' : ''}`,
        metadata: { student_id: authData.user.id },
      }).catch(() => {}); // ignore errors for logging
    }

    return NextResponse.json({
      success: true,
      student: {
        id: authData.user.id,
        email: authData.user.email,
        full_name,
      },
    });
  } catch (error) {
    console.error('Student creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: List students (admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (adminProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('profiles')
      .select('*', { count: 'exact' })
      .eq('role', 'student')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    const { data: students, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      students: students || [],
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    console.error('Student list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
