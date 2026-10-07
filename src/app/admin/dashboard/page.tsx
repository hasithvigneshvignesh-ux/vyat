import { createClient } from '@/lib/supabase/server';
import { Metadata } from 'next';
import AdminDashboardClient from './AdminDashboardClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard — Vyat',
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Total students
  const { count: totalStudents } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'student');

  // Active students (with at least one active skill)
  const { data: activeStudentData } = await supabase
    .from('student_skill_access')
    .select('student_id')
    .eq('status', 'active');
  const activeStudents = new Set(activeStudentData?.map(d => d.student_id) || []).size;

  // Total active skill access records
  const { count: totalActiveSkills } = await supabase
    .from('student_skill_access')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  // Completed skill count
  const { count: completedSkillsCount } = await supabase
    .from('student_skill_access')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed');

  // Certificates issued
  const { count: certificatesIssued } = await supabase
    .from('certificates')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'unlocked');

  // Expiring access (within 30 days)
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  const { count: expiringAccess } = await supabase
    .from('student_skill_access')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed')
    .lt('access_expiry_date', thirtyDaysFromNow.toISOString())
    .gt('access_expiry_date', new Date().toISOString());

  // Recent students
  const { data: recentStudents } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('created_at', { ascending: false })
    .limit(5);

  // Recent completions
  const { data: recentCompletions } = await supabase
    .from('student_skill_access')
    .select(`
      *,
      student:profiles!student_skill_access_student_id_fkey(full_name, email),
      skill:skills(name)
    `)
    .eq('status', 'completed')
    .order('completion_date', { ascending: false })
    .limit(5);

  // Recent payments
  const { data: recentPayments } = await supabase
    .from('payments')
    .select(`
      *,
      student:profiles!payments_student_id_fkey(full_name)
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <AdminDashboardClient
      stats={{
        totalStudents: totalStudents || 0,
        activeStudents: activeStudents || 0,
        totalActiveSkills: totalActiveSkills || 0,
        completedSkills: completedSkillsCount || 0,
        certificatesIssued: certificatesIssued || 0,
        expiringAccess: expiringAccess || 0,
      }}
      recentStudents={recentStudents || []}
      recentCompletions={recentCompletions || []}
      recentPayments={recentPayments || []}
    />
  );
}
