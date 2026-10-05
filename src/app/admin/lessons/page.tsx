import { createClient } from '@/lib/supabase/server';
import LessonsClient from './LessonsClient';

export const metadata = {
  title: 'Lessons — Admin — Vyat',
};

const FALLBACK_SKILLS = [
  { id: 'a1000000-0000-0000-0000-000000000001', name: 'Data Structures & Algorithms in C++', slug: 'dsa-cpp' },
  { id: 'a2000000-0000-0000-0000-000000000003', name: 'Machine Learning with Scikit-Learn', slug: 'ml-scikit-learn' },
  { id: 'a4000000-0000-0000-0000-000000000001', name: 'Network Security & Penetration Testing', slug: 'network-security-pentest' },
];

const FALLBACK_LESSONS = [
  { id: 'e1000000-0000-0000-0000-000000000001', skill_id: 'a1000000-0000-0000-0000-000000000001', title: 'Introduction to Asymptotic Complexity & Big-O', slug: 'intro-big-o', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration_minutes: 20, is_preview: true, is_active: true, sort_order: 1, skill: { name: 'Data Structures & Algorithms in C++', slug: 'dsa-cpp' } },
  { id: 'e1000000-0000-0000-0000-000000000002', skill_id: 'a1000000-0000-0000-0000-000000000001', title: 'Dynamic Arrays & Vector Implementation in C++', slug: 'vectors-cpp', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration_minutes: 25, is_preview: false, is_active: true, sort_order: 2, skill: { name: 'Data Structures & Algorithms in C++', slug: 'dsa-cpp' } },
  { id: 'e1000000-0000-0000-0000-000000000003', skill_id: 'a2000000-0000-0000-0000-000000000003', title: 'Supervised Learning & Linear Regression Math', slug: 'linear-regression-math', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration_minutes: 30, is_preview: true, is_active: true, sort_order: 1, skill: { name: 'Machine Learning with Scikit-Learn', slug: 'ml-scikit-learn' } },
];

export default async function AdminLessonsPage() {
  const supabase = await createClient();

  const [{ data: lessons }, { data: skills }] = await Promise.all([
    supabase
      .from('lessons')
      .select('*, skill:skills(name, slug)')
      .order('sort_order'),
    supabase.from('skills').select('*').order('sort_order'),
  ]);

  const effectiveLessons = (lessons && lessons.length > 0) ? lessons : FALLBACK_LESSONS;
  const effectiveSkills = (skills && skills.length > 0) ? skills : FALLBACK_SKILLS;

  return (
    <LessonsClient
      initialLessons={(effectiveLessons as any) || []}
      skills={effectiveSkills as any}
    />
  );
}
