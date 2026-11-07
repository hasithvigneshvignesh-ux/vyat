import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { Metadata } from 'next';
import CourseDetailClient from './CourseDetailClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ courseId: string }>;
}): Promise<Metadata> {
  const { courseId } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from('courses')
    .select('name, description, branch:branches(name)')
    .eq('id', courseId)
    .single();

  const courseName = course?.name || 'Course Catalog';
  const branchName = (course?.branch as any)?.name || 'Engineering Specialization';
  const title = `${courseName} — Master CS Syllabus & Topics | Vyat`;
  const courseDesc = course?.description || `Explore ${courseName} under ${branchName} on Vyat. Complete lecture video modules, code implementation, and earn verified credentials.`;
  const canonicalUrl = `https://vyatai.com/classes/${courseId}`;

  return {
    title,
    description: courseDesc,
    keywords: [
      courseName,
      branchName,
      'Courses for CSE',
      'CSE Students India',
      'Engineering Placements',
      'Core Subjects CSE',
      'Data Structures Algorithms DSA',
      'Web Dev CSE',
      'AI Learning Engineering',
      'Computer Science Engineering syllabus',
      'B.Tech CSE classes',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description: courseDesc,
      url: canonicalUrl,
      type: 'article',
      siteName: 'Vyat',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: courseDesc,
    },
  };
}

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
            duration_minutes: 35,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            sort_order: 4,
            is_completed: false,
          },
          {
            id: 'lesson-dsa-5',
            title: '5. Graphs: Topological Sort, Dijkstra & Shortest Path',
            duration_minutes: 40,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            sort_order: 5,
            is_completed: false,
          },
          {
            id: 'lesson-dsa-6',
            title: '6. Dynamic Programming: 0/1 Knapsack & Memoization',
            duration_minutes: 45,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            sort_order: 6,
            is_completed: false,
          },
        ],
      },
      {
        id: 'skill-os',
        name: 'Operating Systems & Concurrency',
        short_description: 'Processes, threads, mutex locks, virtual memory paging, and Linux system calls',
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
            title: '1. Process Lifecycle, Forking & PCB Structure',
            duration_minutes: 30,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            sort_order: 1,
            is_completed: false,
          },
          {
            id: 'lesson-os-2',
            title: '2. Threads, Race Conditions & Mutex Synchronization',
            duration_minutes: 35,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            sort_order: 2,
            is_completed: false,
          },
          {
            id: 'lesson-os-3',
            title: '3. Virtual Memory, Paging & Translation Lookaside Buffers (TLB)',
            duration_minutes: 32,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            sort_order: 3,
            is_completed: false,
          },
          {
            id: 'lesson-os-4',
            title: '4. Deadlocks, Banker\'s Algorithm & Resource Allocation Graphs',
            duration_minutes: 28,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
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
        _completedLessons: 0,
        _status: 'active',
        lessons: [
          {
            id: 'lesson-ml-1',
            title: '1. NumPy Vectorization & Matrix Linear Algebra',
            duration_minutes: 25,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            sort_order: 1,
            is_completed: false,
          },
          {
            id: 'lesson-ml-2',
            title: '2. Exploratory Data Analysis & Feature Cleaning with Pandas',
            duration_minutes: 30,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            sort_order: 2,
            is_completed: false,
          },
          {
            id: 'lesson-ml-3',
            title: '3. Supervised Regression & Cost Function Optimization',
            duration_minutes: 35,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            sort_order: 3,
            is_completed: false,
          },
          {
            id: 'lesson-ml-4',
            title: '4. Classification Models: Logistic Regression & Decision Trees',
            duration_minutes: 40,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
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
        _completedLessons: 0,
        _status: 'active',
        lessons: [
          {
            id: 'lesson-cyber-1',
            title: '1. OSI Model Security & Packet Sniffing with Wireshark',
            duration_minutes: 28,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            sort_order: 1,
            is_completed: false,
          },
          {
            id: 'lesson-cyber-2',
            title: '2. Port Scanning, Service Enumeration & Nmap Scripts',
            duration_minutes: 32,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            sort_order: 2,
            is_completed: false,
          },
          {
            id: 'lesson-cyber-3',
            title: '3. Web Application Security: SQL Injection & XSS Vulnerabilities',
            duration_minutes: 40,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            sort_order: 3,
            is_completed: false,
          },
          {
            id: 'lesson-cyber-4',
            title: '4. Privilege Escalation Techniques & Defensive Hardening',
            duration_minutes: 35,
            video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
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

  const completedFromCookies = (cookieStore.get('completed_lessons')?.value || '')
    .split(',')
    .concat((cookieStore.get('demo_completed_lessons')?.value || '').split(','))
    .filter(Boolean);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch course with skills
  const { data: course } = await supabase
    .from('courses')
    .select(`
      *,
      branch:branches(name, icon),
      skills(id, name, short_description, description, difficulty, estimated_hours, sort_order, is_active, is_curriculum_complete, total_planned_lessons)
    `)
    .eq('id', courseId)
    .single();

  if (!course) {
    const fallbackCourse = DEMO_COURSES[courseId];
    if (fallbackCourse) {
      const enrichedFallback = {
        ...fallbackCourse,
        skills: (fallbackCourse.skills || []).map((s: any) => {
          const updatedLessons = (s.lessons || []).map((l: any) => ({
            ...l,
            is_completed: l.is_completed || completedFromCookies.includes(l.id),
          }));
          const completedCount = updatedLessons.filter((l: any) => l.is_completed).length;
          const isDone = completedCount >= (s._lessonCount || updatedLessons.length);
          return {
            ...s,
            _completedLessons: completedCount,
            _status: isDone ? 'completed' : s._status,
            lessons: updatedLessons,
          };
        }),
      };
      return <CourseDetailClient course={enrichedFallback} />;
    }
    notFound();
  }

  // Get student access for skills in this course (if authenticated)
  const skillIds = (course.skills || []).map((s: any) => s.id);
  let accessMap: Record<string, string> = {};
  let progressMap: Record<string, { total: number; completed: number }> = {};
  const lessonsBySkill: Record<string, any[]> = {};

  if (skillIds.length > 0) {
    if (user) {
      const { data: skillAccess } = await supabase
        .from('student_skill_access')
        .select('skill_id, status')
        .eq('student_id', user.id)
        .in('skill_id', skillIds);

      (skillAccess || []).forEach(sa => {
        accessMap[sa.skill_id] = sa.status;
      });
    }

    // Fetch lessons with metadata
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, title, duration_minutes, video_url, skill_id, sort_order')
      .in('skill_id', skillIds)
      .eq('is_active', true)
      .order('sort_order');

    // Fetch completed lessons for current student
    const completedLessonIds = new Set<string>();
    if (user) {
      const { data: lessonProgress } = await supabase
        .from('lesson_progress')
        .select('lesson_id, skill_id, is_completed')
        .eq('student_id', user.id)
        .in('skill_id', skillIds)
        .eq('is_completed', true);

      (lessonProgress || []).forEach(lp => completedLessonIds.add(lp.lesson_id));
    }

    // Merge completed from cookies
    completedFromCookies.forEach(id => completedLessonIds.add(id));

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
    .map((s: any) => {
      const completed = progressMap[s.id]?.completed || 0;
      const total = progressMap[s.id]?.total || 0;
      const targetRequired = s.total_planned_lessons || total;
      const isDone = targetRequired > 0 && completed >= targetRequired;

      return {
        ...s,
        _lessonCount: total,
        _completedLessons: completed,
        _status: isDone ? 'completed' : (accessMap[s.id] || null),
        lessons: lessonsBySkill[s.id] || [],
      };
    });

  return (
    <CourseDetailClient
      course={{
        ...course,
        skills: enrichedSkills,
      }}
    />
  );
}
