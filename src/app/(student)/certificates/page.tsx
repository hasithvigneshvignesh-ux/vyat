import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import CertificatesClient from './CertificatesClient';

export const metadata: Metadata = { title: 'Certificates — Vyat' };

export default async function CertificatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: certificates } = await supabase
    .from('certificates')
    .select(`
      *,
      skill:skills(name, course:courses(name, branch:branches(name)))
    `)
    .eq('student_id', user.id)
    .order('created_at', { ascending: false });

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  return <CertificatesClient certificates={certificates || []} userName={profile?.full_name || ''} />;
}
