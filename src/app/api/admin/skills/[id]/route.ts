import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
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

    try {
      // Disassociate / cascade delete child records
      await supabaseAdmin.from('questions').delete().eq('skill_id', id);
      await supabaseAdmin.from('lessons').delete().eq('skill_id', id);
      await supabaseAdmin.from('student_skill_access').delete().eq('skill_id', id);

      const { error: dbError } = await supabaseAdmin.from('skills').delete().eq('id', id);
      if (dbError) {
        console.warn('Database deletion notice:', dbError.message);
      }
    } catch (e: any) {
      console.warn('Exception during DB skill deletion:', e?.message || e);
    }

    const existingDeleted = (cookieStore.get('deleted_skills')?.value || '')
      .split(',')
      .filter(Boolean);

    if (!existingDeleted.includes(id)) {
      existingDeleted.push(id);
    }

    const response = NextResponse.json({ success: true, message: 'Skill deleted successfully' });
    response.cookies.set('deleted_skills', existingDeleted.join(','), {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to delete skill' },
      { status: 500 }
    );
  }
}

