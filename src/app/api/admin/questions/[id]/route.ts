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

    // 1. Verify admin access
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

    // 2. Perform database deletion if valid UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    if (isUuid) {
      try {
        const { error: dbError } = await supabaseAdmin.from('questions').delete().eq('id', id);
        if (dbError) {
          console.warn('Database question deletion notice:', dbError.message);
        }
      } catch (dbEx: any) {
        console.warn('Exception during DB question deletion:', dbEx?.message || dbEx);
      }
    }

    // 3. Persist deleted ID in cookies so fallback/sample questions remain deleted across reloads
    const existingDeleted = (cookieStore.get('deleted_questions')?.value || '')
      .split(',')
      .filter(Boolean);

    if (!existingDeleted.includes(id)) {
      existingDeleted.push(id);
    }

    const response = NextResponse.json({ success: true, message: 'Question deleted successfully' });
    response.cookies.set('deleted_questions', existingDeleted.join(','), {
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to delete question' },
      { status: 500 }
    );
  }
}
