import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Metadata } from 'next';
import MySkillsClient from './MySkillsClient';

export const metadata: Metadata = {
  title: 'My Skills — Vyat',
};

export default async function MySkillsPage() {
  const cookieStore = await cookies();
  const demoRole = cookieStore.get('demo_role')?.value;

  const completedFromCookies = (cookieStore.get('completed_lessons')?.value || '')
    .split(',')
    .concat((cookieStore.get('demo_completed_lessons')?.value || '').split(','))
    .filter(Boolean);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && demoRole !== 'student') {
    redirect('/login');
  }

  const userId = user?.id || 'demo-student-id';

  // In demo mode without a real user, provide fallback mock data
  if (!user && demoRole === 'student') {
    const demoSkillAccess = [
      {
        id: 'access-1',
        student_id: userId,
        skill_id: 'skill-dsa',
        status: 'active',
        validity_days: 180,
        activated_at: new Date(Date.now() - 15 * 86400000).toISOString(),
        access_expiry_date: new Date(Date.now() + 165 * 86400000).toISOString(),
        skill: {
          id: 'skill-dsa',
          name: 'Data Structures & Algorithms',
          slug: 'data-structures-and-algorithms',
          short_description: 'Master Arrays, Linked Lists, Trees, Graphs, Dynamic Programming & LeetCode patterns',
          difficulty_level: 'intermediate',
          duration_hours: 45,
          estimated_hours: 45,
          price_inr: 499,
          total_planned_lessons: 6,
          is_curriculum_complete: true,
          course: { name: 'Core Programming & CS Foundations', branch: { name: 'CSE Core' } },
        },
      },
      {
        id: 'access-2',
        student_id: userId,
        skill_id: 'skill-python-ml',
        status: 'active',
        validity_days: 180,
        activated_at: new Date(Date.now() - 7 * 86400000).toISOString(),
        access_expiry_date: new Date(Date.now() + 173 * 86400000).toISOString(),
        skill: {
          id: 'skill-python-ml',
          name: 'Python for AI & Machine Learning',
          slug: 'python-for-ai-ml',
          short_description: 'NumPy, Pandas, Matplotlib, Scikit-learn, and end-to-end model development pipelines',
          difficulty_level: 'beginner',
          duration_hours: 35,
          estimated_hours: 35,
          price_inr: 499,
          total_planned_lessons: 4,
          is_curriculum_complete: true,
          course: { name: 'AI Foundations & Machine Learning', branch: { name: 'CSE AI & Machine Learning' } },
        },
      },
      {
        id: 'access-3',
        student_id: userId,
        skill_id: 'skill-cyber-sec',
        status: 'completed',
        validity_days: 180,
        activated_at: new Date(Date.now() - 60 * 86400000).toISOString(),
        access_expiry_date: new Date(Date.now() + 120 * 86400000).toISOString(),
        completion_date: new Date(Date.now() - 5 * 86400000).toISOString(),
        skill: {
          id: 'skill-cyber-sec',
          name: 'Ethical Hacking & Network Defense',
          slug: 'ethical-hacking-network-defense',
          short_description: 'Reconnaissance, vulnerability scanning, Kali Linux tools, and defensive architecture',
          difficulty_level: 'intermediate',
          duration_hours: 40,
          estimated_hours: 40,
          price_inr: 499,
          total_planned_lessons: 4,
          is_curriculum_complete: true,
          course: { name: 'Ethical Hacking & Penetration Testing', branch: { name: 'CSE Cyber Security' } },
        },
      },
    ];

    const demoProgressList = [
      { id: 'p-1', lesson_id: 'lesson-dsa-1', skill_id: 'skill-dsa', is_completed: true, is_started: true },
      { id: 'p-2', lesson_id: 'lesson-dsa-2', skill_id: 'skill-dsa', is_completed: true, is_started: true },
    ];
    completedFromCookies.forEach(lId => {
      if (!demoProgressList.some(p => p.lesson_id === lId)) {
        demoProgressList.push({
          id: 'p-cookie-' + lId,
          lesson_id: lId,
          skill_id: 'skill-dsa',
          is_completed: true,
          is_started: true,
        });
      }
    });

    return (
      <MySkillsClient
        skillAccess={demoSkillAccess as any}
        lessonProgress={demoProgressList as any}
        lessonCounts={{
          'skill-dsa': 6,
          'skill-python-ml': 14,
          'skill-cyber-sec': 16,
        }}
      />
    );
  }

  const { data: skillAccess } = await supabase
    .from('student_skill_access')
    .select(`
      *,
      skill:skills(
        *,
        course:courses(name, branch:branches(name))
      )
    `)
    .eq('student_id', userId)
    .in('status', ['active', 'completed'])
    .order('activated_at', { ascending: false });

  // Fetch lesson progress
  const { data: lessonProgress } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('student_id', userId);

  // Merge completed from cookies
  const lpMap = new Map<string, any>();
  (lessonProgress || []).forEach(lp => lpMap.set(lp.lesson_id, lp));

  completedFromCookies.forEach(lId => {
    const existing = lpMap.get(lId);
    if (existing) {
      lpMap.set(lId, { ...existing, is_completed: true });
    } else {
      lpMap.set(lId, {
        id: 'prog-cookie-' + lId,
        student_id: userId,
        lesson_id: lId,
        skill_id: skillAccess?.[0]?.skill_id || '',
        is_completed: true,
        is_started: true,
      });
    }
  });

  const effectiveLessonProgress = Array.from(lpMap.values());

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
      lessonProgress={effectiveLessonProgress}
      lessonCounts={lessonCounts}
    />
  );
}
