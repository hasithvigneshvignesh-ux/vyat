import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Metadata } from 'next';
import StudentDashboardClient from './StudentDashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard — Vyat',
  description: 'View your learning progress, active skills, and certificates.',
};

export default async function StudentDashboardPage() {
  const cookieStore = await cookies();
  const demoRole = cookieStore.get('demo_role')?.value;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && demoRole !== 'student') {
    redirect('/login');
  }

  // Fetch profile
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  if (!profile && demoRole === 'student') {
    profile = {
      id: 'demo-student-id',
      email: 'student@vyat.com',
      full_name: 'Aarav Patel',
      role: 'student',
      branch: 'CSE Core',
      year_of_study: 3,
      college_name: 'National Institute of Technology',
      is_active: true,
    } as any;
  }

  if (!profile) redirect('/login');

  // Read completed lessons from cookies
  const completedFromCookies = (cookieStore.get('completed_lessons')?.value || '')
    .split(',')
    .concat((cookieStore.get('demo_completed_lessons')?.value || '').split(','))
    .filter(Boolean);

  // Concurrent parallel data fetching with Promise.all
  const [
    { data: skillAccess },
    { data: lessonProgress },
    { data: certificates },
    { data: recentActivity },
    { data: allSkills },
  ] = await Promise.all([
    supabase
      .from('student_skill_access')
      .select(`
        *,
        skill:skills(
          *,
          course:courses(
            *,
            branch:branches(*)
          )
        )
      `)
      .eq('student_id', profile.id)
      .order('activated_at', { ascending: false }),

    supabase
      .from('lesson_progress')
      .select('*')
      .eq('student_id', profile.id),

    supabase
      .from('certificates')
      .select('*, skill:skills(name)')
      .eq('student_id', profile.id),

    supabase
      .from('student_activity')
      .select('*')
      .eq('student_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(10),

    supabase
      .from('skills')
      .select(`
        *,
        course:courses(
          *,
          branch:branches(*)
        )
      `)
      .eq('is_active', true)
      .order('sort_order'),
  ]);

  // Fetch lessons count per skill for progress calculation
  const activeSkillIds = (skillAccess || [])
    .filter(sa => sa.status === 'active' || sa.status === 'completed')
    .map(sa => sa.skill_id);

  let lessonCounts: { skill_id: string; count: number }[] = [];
  const skillLessonMap: Record<string, string> = {
    'lesson-dsa-1': 'skill-dsa',
    'lesson-dsa-2': 'skill-dsa',
    'lesson-dsa-3': 'skill-dsa',
    'lesson-dsa-4': 'skill-dsa',
    'lesson-dsa-5': 'skill-dsa',
    'lesson-dsa-6': 'skill-dsa',
  };

  if (activeSkillIds.length > 0) {
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, skill_id')
      .in('skill_id', activeSkillIds)
      .eq('is_active', true);

    const countMap: Record<string, number> = {};
    (lessons || []).forEach(l => {
      countMap[l.skill_id] = (countMap[l.skill_id] || 0) + 1;
      skillLessonMap[l.id] = l.skill_id;
    });
    lessonCounts = Object.entries(countMap).map(([skill_id, count]) => ({ skill_id, count }));
  }

  // Merge completed lessons from cookies into lessonProgress
  const lpMap = new Map<string, any>();
  (lessonProgress || []).forEach(lp => lpMap.set(lp.lesson_id, lp));

  completedFromCookies.forEach(lId => {
    const existing = lpMap.get(lId);
    if (existing) {
      lpMap.set(lId, { ...existing, is_completed: true });
    } else {
      const matchedSkillId = skillLessonMap[lId] || activeSkillIds[0] || 'skill-dsa';
      lpMap.set(lId, {
        id: 'prog-cookie-' + lId,
        student_id: profile.id,
        lesson_id: lId,
        skill_id: matchedSkillId,
        is_started: true,
        is_completed: true,
        video_watched: true,
        completed_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });
    }
  });

  const effectiveLessonProgress = Array.from(lpMap.values());

  const accessedSkillIds = (skillAccess || []).map(sa => sa.skill_id);
  const recommendedSkills = (allSkills || []).filter(
    s => !accessedSkillIds.includes(s.id)
  ).slice(0, 6);

  // Fallback demo data for immediate testing
  const demoFallbackSkills = [
    {
      id: 'access-1',
      student_id: profile.id,
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
        course: {
          name: 'Core Programming & CS Foundations',
          branch: { name: 'CSE Core' }
        }
      }
    },
    {
      id: 'access-2',
      student_id: profile.id,
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
        course: {
          name: 'AI Foundations & Machine Learning',
          branch: { name: 'CSE AI & Machine Learning' }
        }
      }
    },
    {
      id: 'access-3',
      student_id: profile.id,
      skill_id: 'skill-cyber-sec',
      status: 'active',
      validity_days: 180,
      activated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      access_expiry_date: new Date(Date.now() + 178 * 86400000).toISOString(),
      skill: {
        id: 'skill-cyber-sec',
        name: 'Ethical Hacking & Network Defense',
        slug: 'ethical-hacking-network-defense',
        short_description: 'Reconnaissance, vulnerability scanning, Kali Linux tools, and defensive architecture',
        difficulty_level: 'intermediate',
        duration_hours: 40,
        estimated_hours: 40,
        price_inr: 499,
        course: {
          name: 'Ethical Hacking & Penetration Testing',
          branch: { name: 'CSE Cyber Security' }
        }
      }
    },
  ];

  let rawSkillAccess = (skillAccess && skillAccess.length > 0) ? skillAccess : demoFallbackSkills;
  const effectiveLessonCounts = lessonCounts.length > 0 ? lessonCounts : [
    { skill_id: 'skill-dsa', count: 6 },
    { skill_id: 'skill-python-ml', count: 14 },
    { skill_id: 'skill-cyber-sec', count: 16 },
  ];

  // Check if any active skill has reached 100% completion based on effectiveLessonProgress
  const lessonCountsLookup: Record<string, number> = {};
  effectiveLessonCounts.forEach(lc => { lessonCountsLookup[lc.skill_id] = lc.count; });

  const completedLessonsCountBySkill: Record<string, number> = {};
  effectiveLessonProgress.forEach(lp => {
    if (lp.is_completed) {
      completedLessonsCountBySkill[lp.skill_id] = (completedLessonsCountBySkill[lp.skill_id] || 0) + 1;
    }
  });

  const effectiveSkillAccess = rawSkillAccess.map(sa => {
    const total = sa.skill?.total_planned_lessons || lessonCountsLookup[sa.skill_id] || 0;
    const completed = completedLessonsCountBySkill[sa.skill_id] || 0;
    if (total > 0 && completed >= total) {
      return { ...sa, status: 'completed' };
    }
    return sa;
  });

  return (
    <StudentDashboardClient
      profile={profile}
      skillAccess={effectiveSkillAccess as any}
      lessonProgress={effectiveLessonProgress}
      lessonCounts={effectiveLessonCounts}
      certificates={certificates || []}
      recentActivity={recentActivity || []}
      recommendedSkills={recommendedSkills || []}
    />
  );
}
