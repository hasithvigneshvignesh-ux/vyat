import { createClient } from '@/lib/supabase/server';
import { SAMPLE_CERTIFICATES, SAMPLE_STUDENTS } from '@/lib/mockData';
import CertificatesClient from './CertificatesClient';

export default async function AdminCertificatesPage() {
  const supabase = await createClient();

  // Fetch certificates
  const { data: dbCerts } = await supabase
    .from('certificates')
    .select('*, student:profiles(full_name, email, branch_name), skill:skills(name, slug)')
    .order('created_at', { ascending: false });

  // Fetch students for selector
  const { data: dbStudents } = await supabase
    .from('profiles')
    .select('id, full_name, email, branch_name')
    .eq('role', 'student')
    .order('full_name');

  // Fetch skills for selector
  const { data: dbSkills } = await supabase
    .from('skills')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('name');

  const certificates = (dbCerts && dbCerts.length > 0) ? dbCerts : SAMPLE_CERTIFICATES;
  const students = (dbStudents && dbStudents.length > 0) ? dbStudents : SAMPLE_STUDENTS;
  const skills = (dbSkills && dbSkills.length > 0) ? dbSkills : [
    { id: 'a1000000-0000-0000-0000-000000000001', name: 'Data Structures & Algorithms in C++', slug: 'dsa-cpp' },
    { id: 'a2000000-0000-0000-0000-000000000003', name: 'Machine Learning Fundamentals with Scikit-Learn', slug: 'ml-fundamentals' },
    { id: 'a4000000-0000-0000-0000-000000000001', name: 'Network Security & Penetration Testing', slug: 'network-security' },
    { id: 'a3000000-0000-0000-0000-000000000001', name: 'Exploratory Data Analysis with Pandas & Seaborn', slug: 'eda-pandas' },
  ];

  return (
    <CertificatesClient
      initialCertificates={certificates}
      students={students}
      skills={skills}
    />
  );
}
