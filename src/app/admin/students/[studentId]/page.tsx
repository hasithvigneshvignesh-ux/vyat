import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import StudentDetailClient from './StudentDetailClient';

export default async function StudentDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const supabase = await createClient();

  let student = null;
  const isMock = studentId.startsWith('std-');

  if (isMock) {
    const { SAMPLE_STUDENTS } = await import('@/lib/mockData');
    student = SAMPLE_STUDENTS.find(s => s.id === studentId);
  } else {
    // Fetch student profile
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', studentId)
      .eq('role', 'student')
      .single();
    student = data;
  }

  if (!student) {
    notFound();
  }

  let skillAccess: any[] = [];
  let payments: any[] = [];
  let certificates: any[] = [];
  let lessonProgress: any[] = [];

  if (isMock) {
    const { SAMPLE_PAYMENTS, SAMPLE_CERTIFICATES } = await import('@/lib/mockData');
    payments = SAMPLE_PAYMENTS.filter(p => p.student_id === studentId);
    certificates = SAMPLE_CERTIFICATES.filter(c => c.student_id === studentId);
    // skillAccess and lessonProgress left empty for mock to simplify
  } else {
    // Fetch student's skill access
    const { data: sa } = await supabase
      .from('student_skill_access')
      .select(`
        *,
        skill:skills(*, course:courses(name, branch:branches(name)))
      `)
      .eq('student_id', studentId)
      .order('activated_at', { ascending: false });
    skillAccess = sa || [];

    // Fetch student's payments
    const { data: p } = await supabase
      .from('payments')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    payments = p || [];

    // Fetch certificates
    const { data: c } = await supabase
      .from('certificates')
      .select('*, skill:skills(name)')
      .eq('student_id', studentId);
    certificates = c || [];

    // Fetch lesson progress for skill progress calculation
    const { data: lp } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('student_id', studentId);
    lessonProgress = lp || [];
  }

  // Fetch all available skills (for activation UI)
  const { data: allSkills } = await supabase
    .from('skills')
    .select(`
      *,
      course:courses(*, branch:branches(*))
    `)
    .eq('is_active', true)
    .order('sort_order');

  // Fetch lesson counts per skill
  const skillIds = (skillAccess || []).map(sa => sa.skill_id);
  let lessonCounts: Record<string, number> = {};
  if (skillIds.length > 0) {
    const { data: lessons } = await supabase
      .from('lessons')
      .select('skill_id')
      .in('skill_id', skillIds)
      .eq('is_active', true);

    (lessons || []).forEach(l => {
      lessonCounts[l.skill_id] = (lessonCounts[l.skill_id] || 0) + 1;
    });
  }

  // Pricing rules
  const { data: pricingRules } = await supabase
    .from('pricing_rules')
    .select('*')
    .eq('is_active', true)
    .order('skill_count');

  return (
    <StudentDetailClient
      student={student}
      skillAccess={skillAccess || []}
      allSkills={allSkills || []}
      payments={payments || []}
      certificates={certificates || []}
      lessonProgress={lessonProgress || []}
      lessonCounts={lessonCounts}
      pricingRules={pricingRules || []}
    />
  );
}
