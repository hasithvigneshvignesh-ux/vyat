import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Metadata } from 'next';
import ClassesClient from './ClassesClient';

export const metadata: Metadata = {
  title: 'Classes — Vyat',
  description: 'Browse your active courses and continue learning.',
};

export default async function ClassesPage() {
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

  // Demo mode: provide rich mock data
  if (!user && demoRole === 'student') {
    const dsaLessons = ['lesson-dsa-1', 'lesson-dsa-2', 'lesson-dsa-3', 'lesson-dsa-4', 'lesson-dsa-5', 'lesson-dsa-6'];
    const completedDsaCount = dsaLessons.filter(id => completedFromCookies.includes(id)).length;
    const isDsaCompleted = completedDsaCount >= dsaLessons.length;

    const demoCourses = [
      {
        id: 'course-core-prog',
        name: 'Core Programming & CS Foundations',
        slug: 'core-programming',
        description: 'Build a rock-solid foundation in programming, data structures, algorithms, and core computer science concepts.',
        thumbnail_url: null,
        sort_order: 1,
        is_active: true,
        branch: { name: 'CSE Core', slug: 'cse-core', icon: '💻' },
        skills: [
          {
            id: 'skill-dsa',
            name: 'Data Structures & Algorithms',
            short_description: 'Master Arrays, Linked Lists, Trees, Graphs, Dynamic Programming & LeetCode patterns',
            difficulty: 'intermediate',
            estimated_hours: 45,
            sort_order: 1,
            _completedLessons: completedDsaCount,
            _totalLessons: 6,
          },
          {
            id: 'skill-os',
            name: 'Operating Systems',
            short_description: 'Processes, threads, scheduling, memory management, and file systems',
            difficulty: 'intermediate',
            estimated_hours: 30,
            sort_order: 2,
            _completedLessons: 0,
            _totalLessons: 4,
          },
        ],
        _skillCount: 2,
        _activeCount: isDsaCompleted ? 0 : 1,
        _completedCount: isDsaCompleted ? 1 : 0,
      },
      {
        id: 'course-ai-ml',
        name: 'AI Foundations & Machine Learning',
        slug: 'ai-foundations',
        description: 'Dive into artificial intelligence, machine learning algorithms, and hands-on model building with Python.',
        thumbnail_url: null,
        sort_order: 2,
        is_active: true,
        branch: { name: 'CSE AI & Machine Learning', slug: 'cse-ai-ml', icon: '🤖' },
        skills: [
          {
            id: 'skill-python-ml',
            name: 'Python for AI & Machine Learning',
            short_description: 'NumPy, Pandas, Matplotlib, Scikit-learn, and end-to-end model development pipelines',
            difficulty: 'beginner',
            estimated_hours: 35,
            sort_order: 1,
            _completedLessons: 0,
            _totalLessons: 4,
          },
        ],
        _skillCount: 1,
        _activeCount: 1,
        _completedCount: 0,
      },
      {
        id: 'course-cyber',
        name: 'Ethical Hacking & Penetration Testing',
        slug: 'ethical-hacking',
        description: 'Learn real-world cybersecurity skills including reconnaissance, vulnerability assessment, and defensive strategies.',
        thumbnail_url: null,
        sort_order: 3,
        is_active: true,
        branch: { name: 'CSE Cyber Security', slug: 'cse-cyber-security', icon: '🔒' },
        skills: [
          {
            id: 'skill-cyber-sec',
            name: 'Ethical Hacking & Network Defense',
            short_description: 'Reconnaissance, vulnerability scanning, Kali Linux tools, and defensive architecture',
            difficulty: 'intermediate',
            estimated_hours: 40,
            sort_order: 1,
            _completedLessons: 0,
            _totalLessons: 4,
          },
        ],
        _skillCount: 1,
        _activeCount: 1,
        _completedCount: 0,
      },
    ];

    return <ClassesClient courses={demoCourses as any} />;
  }

  // Real user: fetch courses that have at least one skill the student has access to
  const { data: skillAccess } = await supabase
    .from('student_skill_access')
    .select(`
      skill_id,
      status,
      skill:skills(
        id, name, short_description, difficulty, estimated_hours, sort_order,
        course_id, total_planned_lessons, is_curriculum_complete,
        course:courses(
          id, name, slug, description, thumbnail_url, sort_order,
          branch:branches(name, slug, icon)
        )
      )
    `)
    .eq('student_id', userId)
    .in('status', ['active', 'completed']);

  // Fetch completed lessons count per skill
  const skillIds = (skillAccess || []).map((sa: any) => sa.skill_id);
  const completedLessonsBySkill: Record<string, number> = {};

  if (skillIds.length > 0) {
    const { data: lessonProgress } = await supabase
      .from('lesson_progress')
      .select('lesson_id, skill_id')
      .eq('student_id', userId)
      .in('skill_id', skillIds)
      .eq('is_completed', true);

    (lessonProgress || []).forEach(lp => {
      completedLessonsBySkill[lp.skill_id] = (completedLessonsBySkill[lp.skill_id] || 0) + 1;
    });
  }

  // Group skills by course
  const courseMap = new Map<string, any>();
  (skillAccess || []).forEach((sa: any) => {
    const skill = sa.skill;
    const course = skill?.course;
    if (!course) return;

    if (!courseMap.has(course.id)) {
      courseMap.set(course.id, {
        ...course,
        skills: [],
        _skillCount: 0,
        _activeCount: 0,
        _completedCount: 0,
      });
    }

    const entry = courseMap.get(course.id);
    entry.skills.push(skill);
    entry._skillCount++;

    const totalPlanned = skill?.total_planned_lessons || 0;
    const completedCount = completedLessonsBySkill[sa.skill_id] || 0;
    const isCompleted = sa.status === 'completed' || (totalPlanned > 0 && completedCount >= totalPlanned);

    if (isCompleted) {
      entry._completedCount++;
    } else {
      entry._activeCount++;
    }
  });

  const courses = Array.from(courseMap.values()).sort((a, b) => a.sort_order - b.sort_order);

  return <ClassesClient courses={courses} />;
}
