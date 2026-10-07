import { createClient } from '@/lib/supabase/server';
import { Metadata } from 'next';
import StudentsListClient from './StudentsListClient';

export const metadata: Metadata = {
  title: 'Students — Admin — Vyat',
};

export default async function StudentsPage() {
  const supabase = await createClient();

  const { data: students, count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .eq('role', 'student')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <StudentsListClient
      initialStudents={students || []}
      totalCount={count || students?.length || 0}
    />
  );
}
