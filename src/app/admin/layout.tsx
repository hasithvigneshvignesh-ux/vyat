import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel — Vyat',
  description: 'Manage students, courses, skills, and certificates on the Vyat platform.',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const demoRole = cookieStore.get('demo_role')?.value;

  if (demoRole === 'admin') {
    return (
      <div className="sidebar-layout">
        <AdminSidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="sidebar-layout">
      <AdminSidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
