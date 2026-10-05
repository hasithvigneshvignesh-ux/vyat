import { createClient } from '@/lib/supabase/server';
import { Metadata } from 'next';
import StudentsListClient from './StudentsListClient';
import { SAMPLE_STUDENTS } from '@/lib/mockData';

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

  const hasStudents = students && students.length > 0;
  const effectiveStudents = hasStudents ? students : SAMPLE_STUDENTS;
  const effectiveCount = hasStudents ? (count || students.length) : SAMPLE_STUDENTS.length;

  return (
    <StudentsListClient
      initialStudents={effectiveStudents}
      totalCount={effectiveCount}
    />
  );
}
