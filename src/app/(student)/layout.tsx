import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import SidebarShell from '@/components/layout/SidebarShell';

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const demoRole = cookieStore.get('demo_role')?.value;
  const demoUserRaw = cookieStore.get('demo_user')?.value;
  const demoUser = demoUserRaw ? JSON.parse(demoUserRaw) : null;

  if (demoRole === 'student') {
    return (
      <SidebarShell userName={demoUser?.full_name || 'Demo Student'}>
        {children}
      </SidebarShell>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, is_active')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role === 'admin') {
    redirect('/admin/dashboard');
  }

  if (!profile.is_active) {
    redirect('/login');
  }

  return (
    <SidebarShell userName={profile.full_name}>
      {children}
    </SidebarShell>
  );
}
