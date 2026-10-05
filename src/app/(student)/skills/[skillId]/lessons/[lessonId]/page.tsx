import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import LessonPageClient from './LessonPageClient';

export default async function LessonPage({
  params,
}: {
  params: Promise<{ skillId: string; lessonId: string }>;
}) {
  const { skillId, lessonId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch lesson (RLS enforces access)
  const { data: lesson } = await supabase
    .from('lessons')
    .select(`
      *,
      skill:skills(id, name, course:courses(name, branch:branches(name)))
    `)
    .eq('id', lessonId)
    .eq('skill_id', skillId)
    .single();

  if (!lesson) {
    notFound();
  }

  // Fetch all lessons in this skill for navigation
  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id, title, sort_order')
    .eq('skill_id', skillId)
    .eq('is_active', true)
    .order('sort_order');

  // Fetch progress for this lesson
  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('student_id', user.id)
    .eq('lesson_id', lessonId)
    .single();

  // Fetch all progress for sidebar
  const { data: allProgress } = await supabase
    .from('lesson_progress')
    .select('lesson_id, is_completed, is_started')
    .eq('student_id', user.id)
    .eq('skill_id', skillId);

  // Fetch questions for this lesson
  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .eq('lesson_id', lessonId)
    .eq('is_active', true)
    .order('sort_order');

  // Fetch resources
  const { data: resources } = await supabase
    .from('lesson_resources')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('sort_order');

  return (
    <LessonPageClient
      lesson={lesson}
      allLessons={allLessons || []}
      progress={progress}
      allProgress={allProgress || []}
      questions={questions || []}
      resources={resources || []}
      userId={user.id}
      skillId={skillId}
    />
  );
}
