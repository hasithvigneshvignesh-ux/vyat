import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import SkillDetailClient from './SkillDetailClient';

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ skillId: string }>;
}) {
  const { skillId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch the skill (RLS allows reading skill metadata for browsing)
  const { data: skill } = await supabase
    .from('skills')
    .select(`
      *,
      course:courses(*, branch:branches(*))
    `)
    .eq('id', skillId)
    .single();

  if (!skill) notFound();

  // Check access
  const { data: access } = await supabase
    .from('student_skill_access')
    .select('*')
    .eq('student_id', user.id)
    .eq('skill_id', skillId)
    .single();

  const hasAccess = access && (access.status === 'active' || access.status === 'completed') &&
    (!access.access_expiry_date || new Date(access.access_expiry_date) > new Date());

  // Fetch lessons only if the student has access (RLS enforces this)
  let lessons: any[] = [];
  let lessonProgress: any[] = [];
  let questions: any[] = [];

  if (hasAccess) {
    const { data: lessonData } = await supabase
      .from('lessons')
      .select('*')
      .eq('skill_id', skillId)
      .eq('is_active', true)
      .order('sort_order');

    lessons = lessonData || [];

    const { data: progressData } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('student_id', user.id)
      .eq('skill_id', skillId);

    lessonProgress = progressData || [];

    const { data: questionData } = await supabase
      .from('questions')
      .select('*')
      .eq('skill_id', skillId)
      .eq('is_active', true)
      .order('sort_order');

    questions = questionData || [];
  }

  // Certificate
  const { data: certificate } = await supabase
    .from('certificates')
    .select('*')
    .eq('student_id', user.id)
    .eq('skill_id', skillId)
    .single();

  return (
    <SkillDetailClient
      skill={skill}
      access={access}
      hasAccess={!!hasAccess}
      lessons={lessons}
      lessonProgress={lessonProgress}
      questions={questions}
      certificate={certificate}
    />
  );
}
