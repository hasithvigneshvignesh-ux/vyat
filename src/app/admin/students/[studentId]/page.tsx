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

  // Fetch student profile
  const { data: student } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', studentId)
    .eq('role', 'student')
    .single();

  if (!student) {
    notFound();
  }

  // Fetch student's skill access
  const { data: skillAccess } = await supabase
    .from('student_skill_access')
    .select(`
      *,
      skill:skills(*, course:courses(name, branch:branches(name)))
    `)
    .eq('student_id', studentId)
    .order('activated_at', { ascending: false });

  // Fetch all available skills (for activation UI)
  const { data: allSkills } = await supabase
    .from('skills')
    .select(`
      *,
      course:courses(*, branch:branches(*))
    `)
    .eq('is_active', true)
    .order('sort_order');

  // Fetch student's payments
  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });

  // Fetch certificates
  const { data: certificates } = await supabase
    .from('certificates')
    .select('*, skill:skills(name)')
    .eq('student_id', studentId);

  // Fetch lesson progress for skill progress calculation
  const { data: lessonProgress } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('student_id', studentId);

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
