import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Metadata } from 'next';
import CertificatesClient from './CertificatesClient';

export const metadata: Metadata = { title: 'Certificates — Vyat' };

export default async function CertificatesPage() {
  const cookieStore = await cookies();
  const demoRole = cookieStore.get('demo_role')?.value;
  const demoUserRaw = cookieStore.get('demo_user')?.value;
  const demoUser = demoUserRaw ? JSON.parse(demoUserRaw) : null;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && demoRole !== 'student') {
    redirect('/login');
  }

  const userId = user?.id || 'demo-student-id';

  // In demo mode without a real user, provide fallback mock data
  if (!user && demoRole === 'student') {
    const demoCertificates = [
      {
        id: 'cert-1',
        student_id: userId,
        skill_id: 'skill-cyber-sec',
        certificate_number: 'VYAT-2026-CSE-001',
        status: 'unlocked',
        issued_at: new Date(Date.now() - 5 * 86400000).toISOString(),
        created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
        skill: {
          name: 'Ethical Hacking & Network Defense',
          course: { name: 'Ethical Hacking & Penetration Testing', branch: { name: 'CSE Cyber Security' } },
        },
      },
      {
        id: 'cert-2',
        student_id: userId,
        skill_id: 'skill-web-basics',
        certificate_number: 'VYAT-2026-CSE-002',
        status: 'generated',
        issued_at: null,
        created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
        skill: {
          name: 'Web Development Fundamentals',
          course: { name: 'Core Programming & CS Foundations', branch: { name: 'CSE Core' } },
        },
      },
    ];

    return (
      <CertificatesClient
        certificates={demoCertificates as any}
        userName={demoUser?.full_name || 'Aarav Patel'}
      />
    );
  }

  const { data: certificates } = await supabase
    .from('certificates')
    .select(`
      *,
      skill:skills(name, course:courses(name, branch:branches(name)))
    `)
    .eq('student_id', userId)
    .order('created_at', { ascending: false });

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', userId)
    .single();

  return <CertificatesClient certificates={certificates || []} userName={profile?.full_name || ''} />;
}

