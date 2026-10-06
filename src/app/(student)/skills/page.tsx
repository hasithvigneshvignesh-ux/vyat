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
          price_inr: 499,
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
          price_inr: 499,
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
          price_inr: 499,
          course: { name: 'Ethical Hacking & Penetration Testing', branch: { name: 'CSE Cyber Security' } },
        },
      },
    ];

    return (
      <MySkillsClient
        skillAccess={demoSkillAccess as any}
        lessonProgress={[]}
        lessonCounts={{
          'skill-dsa': 18,
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
    .order('activated_at', { ascending: false });

  // Fetch lesson progress
  const { data: lessonProgress } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('student_id', userId);

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
