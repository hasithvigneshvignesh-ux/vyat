import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { Metadata } from 'next';
import CourseDetailClient from './CourseDetailClient';

export const metadata: Metadata = {
  title: 'Course Modules & Classes — Vyat',
};

/* ─── Rich Demo Data for Demo Students ─── */
const DEMO_COURSES: Record<string, any> = {
  'course-core-prog': {
    id: 'course-core-prog',
    name: 'Core Programming & CS Foundations',
    slug: 'core-programming',
    description: 'Build a rock-solid foundation in programming, data structures, algorithms, and core computer science concepts.',
    branch: { name: 'CSE Core', icon: '💻' },
    skills: [
      {
        id: 'skill-dsa',
        name: 'Data Structures & Algorithms',
        short_description: 'Master Arrays, Linked Lists, Trees, Graphs, Dynamic Programming & LeetCode patterns',
        difficulty: 'intermediate',
        estimated_hours: 45,
        sort_order: 1,
        is_active: true,
        _lessonCount: 6,
        _completedLessons: 2,
        _status: 'active',
        lessons: [
          {
            id: 'lesson-dsa-1',
            title: '1. Arrays, Memory Layout & Dynamic Sizing',
            duration_minutes: 25,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            sort_order: 1,
            is_completed: true,
          },
          {
            id: 'lesson-dsa-2',
            title: '2. Two-Pointer & Sliding Window Techniques',
            duration_minutes: 32,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            sort_order: 2,
            is_completed: true,
          },
          {
            id: 'lesson-dsa-3',
            title: '3. Singly & Doubly Linked List Inversion & Cycle Detection',
            duration_minutes: 28,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            sort_order: 3,
            is_completed: false,
          },
          {
            id: 'lesson-dsa-4',
            title: '4. Binary Trees, Traversals & Breadth-First Search (BFS)',
            duration_minutes: 40,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            sort_order: 4,
            is_completed: false,
          },
          {
            id: 'lesson-dsa-5',
            title: '5. Graphs: Topological Sort, Dijkstra & Shortest Path',
            duration_minutes: 45,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            sort_order: 5,
            is_completed: false,
          },
          {
            id: 'lesson-dsa-6',
            title: '6. Dynamic Programming: 0/1 Knapsack & Memoization',
            duration_minutes: 50,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
            sort_order: 6,
            is_completed: false,
          },
        ],
      },
      {
        id: 'skill-os',
        name: 'Operating Systems',
        short_description: 'Processes, threads, CPU scheduling, virtual memory management, and file systems architecture',
        difficulty: 'intermediate',
        estimated_hours: 30,
        sort_order: 2,
        is_active: true,
        _lessonCount: 4,
        _completedLessons: 0,
        _status: 'active',
        lessons: [
          {
            id: 'lesson-os-1',
            title: '1. Introduction to Kernel Architecture & System Calls',
            duration_minutes: 24,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            sort_order: 1,
            is_completed: false,
          },
          {
            id: 'lesson-os-2',
            title: '2. Process Lifecycle, Fork & Thread Concurrency',
            duration_minutes: 35,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            sort_order: 2,
            is_completed: false,
          },
          {
            id: 'lesson-os-3',
            title: '3. CPU Scheduling Algorithms (CFS, Round Robin, Priority)',
            duration_minutes: 30,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            sort_order: 3,
            is_completed: false,
          },
          {
            id: 'lesson-os-4',
            title: '4. Virtual Memory, Paging & Page Replacement Policies',
            duration_minutes: 42,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            sort_order: 4,
            is_completed: false,
          },
        ],
      },
    ],
  },
  'course-ai-ml': {
    id: 'course-ai-ml',
    name: 'AI Foundations & Machine Learning',
    slug: 'ai-foundations',
    description: 'Dive into artificial intelligence, machine learning algorithms, and hands-on model building with Python.',
    branch: { name: 'CSE AI & Machine Learning', icon: '🤖' },
    skills: [
      {
        id: 'skill-python-ml',
        name: 'Python for AI & Machine Learning',
        short_description: 'NumPy, Pandas, Matplotlib, Scikit-learn, and end-to-end model development pipelines',
        difficulty: 'beginner',
        estimated_hours: 35,
        sort_order: 1,
        is_active: true,
        _lessonCount: 4,
        _completedLessons: 1,
        _status: 'active',
        lessons: [
          {
            id: 'lesson-ml-1',
            title: '1. Vectorized Operations with NumPy & Multi-Dimensional Tensors',
            duration_minutes: 26,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            sort_order: 1,
            is_completed: true,
          },
          {
            id: 'lesson-ml-2',
            title: '2. Exploratory Data Analysis & Feature Engineering with Pandas',
            duration_minutes: 38,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            sort_order: 2,
            is_completed: false,
          },
          {
            id: 'lesson-ml-3',
            title: '3. Linear Regression & Gradient Descent Optimization',
            duration_minutes: 45,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            sort_order: 3,
            is_completed: false,
          },
          {
            id: 'lesson-ml-4',
            title: '4. Decision Trees, Random Forests & Ensemble Methods',
            duration_minutes: 50,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            sort_order: 4,
            is_completed: false,
          },
        ],
      },
    ],
  },
  'course-cyber': {
    id: 'course-cyber',
    name: 'Ethical Hacking & Penetration Testing',
    slug: 'ethical-hacking',
    description: 'Learn real-world cybersecurity skills including reconnaissance, vulnerability assessment, and defensive strategies.',
    branch: { name: 'CSE Cyber Security', icon: '🔒' },
    skills: [
      {
        id: 'skill-cyber-sec',
        name: 'Ethical Hacking & Network Defense',
        short_description: 'Reconnaissance, vulnerability scanning, Kali Linux tools, and defensive architecture',
        difficulty: 'intermediate',
        estimated_hours: 40,
        sort_order: 1,
        is_active: true,
        _lessonCount: 4,
        _completedLessons: 2,
        _status: 'active',
        lessons: [
          {
            id: 'lesson-sec-1',
            title: '1. Networking Fundamentals, TCP/IP Stack & Wireshark Packet Analysis',
            duration_minutes: 30,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            sort_order: 1,
            is_completed: true,
          },
          {
            id: 'lesson-sec-2',
            title: '2. Network Scanning with Nmap & Banner Grabbing',
            duration_minutes: 35,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            sort_order: 2,
            is_completed: true,
          },
          {
            id: 'lesson-sec-3',
            title: '3. Web Application Security: OWASP Top 10 Exploitation',
            duration_minutes: 48,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            sort_order: 3,
            is_completed: false,
          },
          {
            id: 'lesson-sec-4',
            title: '4. Privilege Escalation & Post-Exploitation Tactics',
            duration_minutes: 52,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            sort_order: 4,
            is_completed: false,
          },
        ],
      },
    ],
  },
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const cookieStore = await cookies();
  const demoRole = cookieStore.get('demo_role')?.value;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && demoRole !== 'student') {
    redirect('/login');
  }

  // Demo mode
  if (!user && demoRole === 'student') {
    const demoCourse = DEMO_COURSES[courseId];
    if (!demoCourse) notFound();
    return <CourseDetailClient course={demoCourse} />;
  }

  // Real user: fetch course with skills + student access
  const { data: course } = await supabase
    .from('courses')
    .select(`
      *,
      branch:branches(name, icon),
      skills(id, name, short_description, description, difficulty, estimated_hours, sort_order, is_active)
    `)
    .eq('id', courseId)
    .single();

  if (!course) notFound();

  // Get student access for skills in this course
  const skillIds = (course.skills || []).map((s: any) => s.id);
  let accessMap: Record<string, string> = {};
  let progressMap: Record<string, { total: number; completed: number }> = {};
  const lessonsBySkill: Record<string, any[]> = {};

  if (skillIds.length > 0) {
    const { data: skillAccess } = await supabase
      .from('student_skill_access')
      .select('skill_id, status')
      .eq('student_id', user!.id)
      .in('skill_id', skillIds);

    (skillAccess || []).forEach(sa => {
      accessMap[sa.skill_id] = sa.status;
    });

    // Fetch lessons with metadata
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, title, duration_minutes, video_url, skill_id, sort_order')
      .in('skill_id', skillIds)
      .eq('is_active', true)
      .order('sort_order');

    // Fetch completed lessons for current student
    const { data: lessonProgress } = await supabase
      .from('lesson_progress')
      .select('lesson_id, skill_id, is_completed')
      .eq('student_id', user!.id)
      .in('skill_id', skillIds)
      .eq('is_completed', true);

    const completedLessonIds = new Set((lessonProgress || []).map(lp => lp.lesson_id));

    (lessons || []).forEach(l => {
      if (!lessonsBySkill[l.skill_id]) {
        lessonsBySkill[l.skill_id] = [];
      }
      lessonsBySkill[l.skill_id].push({
        ...l,
        is_completed: completedLessonIds.has(l.id),
      });
    });

    skillIds.forEach((id: string) => {
      const allSkillLessons = lessonsBySkill[id] || [];
      const completedCount = allSkillLessons.filter((l: any) => l.is_completed).length;
      progressMap[id] = {
        total: allSkillLessons.length,
        completed: completedCount,
      };
    });
  }

  // Attach metadata and lessons to skills
  const enrichedSkills = (course.skills || [])
    .filter((s: any) => s.is_active)
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((s: any) => ({
      ...s,
      _lessonCount: progressMap[s.id]?.total || 0,
      _completedLessons: progressMap[s.id]?.completed || 0,
      _status: accessMap[s.id] || null,
      lessons: lessonsBySkill[s.id] || [],
    }));

  return (
    <CourseDetailClient
      course={{
        ...course,
        skills: enrichedSkills,
      }}
    />
  );
}
