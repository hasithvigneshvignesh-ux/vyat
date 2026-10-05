import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import MySkillsClient from './MySkillsClient';

export const metadata: Metadata = {
  title: 'My Skills — Vyat',
};

export default async function MySkillsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: skillAccess } = await supabase
    .from('student_skill_access')
    .select(`
      *,
      skill:skills(
        *,
        course:courses(name, branch:branches(name))
      )
    `)
    .eq('student_id', user.id)
    .order('activated_at', { ascending: false });

  // Fetch lesson progress
  const { data: lessonProgress } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('student_id', user.id);

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

  return (
    <MySkillsClient
      skillAccess={skillAccess || []}
      lessonProgress={lessonProgress || []}
      lessonCounts={lessonCounts}
    />
  );
}
