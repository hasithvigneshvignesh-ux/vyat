import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// POST: Deactivate or reactivate a skill for a student
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const cookieStore = (await request.headers.get('cookie')) || '';

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    let isAdmin = false;
    let adminId: string | null = null;

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (profile?.role === 'admin') {
        isAdmin = true;
        adminId = user.id;
      }
    } else if (cookieStore.includes('demo_role=admin')) {
      isAdmin = true;
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { student_id, skill_id, action = 'deactivate' } = body;

    if (!student_id || !skill_id) {
      return NextResponse.json(
        { error: 'Student ID and Skill ID are required' },
        { status: 400 }
      );
    }

    const newStatus = action === 'reactivate' ? 'active' : 'revoked';

    const updatePayload: Record<string, any> = {
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (newStatus === 'revoked') {
      updatePayload.access_expiry_date = new Date().toISOString();
    } else {
      updatePayload.access_expiry_date = null;
      updatePayload.activated_at = new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
      .from('student_skill_access')
      .update(updatePayload)
      .eq('student_id', student_id)
      .eq('skill_id', skill_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating skill access status:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log admin action
    if (adminId) {
      try {
        await supabaseAdmin.from('admin_actions').insert({
          admin_id: adminId,
          action_type: action === 'reactivate' ? 'skill_reactivated' : 'skill_deactivated',
          description: `${action === 'reactivate' ? 'Reactivated' : 'Deactivated'} skill access for student`,
          metadata: { student_id, skill_id, status: newStatus },
        });
      } catch (logErr) {
        console.error('Admin action log warning:', logErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Skill access ${action === 'reactivate' ? 'reactivated' : 'deactivated'} successfully`,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
