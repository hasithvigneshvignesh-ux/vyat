import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import SkillDetailClient from './SkillDetailClient';

const DEMO_SKILL_DETAILS: Record<string, any> = {
  'skill-dsa': {
    skill: {
      id: 'skill-dsa',
      name: 'Data Structures & Algorithms',
      slug: 'data-structures-and-algorithms',
      description: 'Master core computational problem solving, arrays, trees, dynamic programming, and complexity analysis.',
      difficulty: 'intermediate',
      estimated_hours: 45,
      course: {
        name: 'Core Programming & CS Foundations',
        branch: { name: 'CSE Core' },
      },
    },
    lessons: [
      { id: 'lesson-dsa-1', title: '1. Arrays, Memory Layout & Dynamic Sizing', duration_minutes: 25, video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', sort_order: 1, is_active: true },
      { id: 'lesson-dsa-2', title: '2. Two-Pointer & Sliding Window Techniques', duration_minutes: 32, video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', sort_order: 2, is_active: true },
      { id: 'lesson-dsa-3', title: '3. Singly & Doubly Linked List Inversion & Cycle Detection', duration_minutes: 28, video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', sort_order: 3, is_active: true },
      { id: 'lesson-dsa-4', title: '4. Binary Trees, Traversals & Breadth-First Search (BFS)', duration_minutes: 40, video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', sort_order: 4, is_active: true },
      { id: 'lesson-dsa-5', title: '5. Graphs: Topological Sort, Dijkstra & Shortest Path', duration_minutes: 45, video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', sort_order: 5, is_active: true },
      { id: 'lesson-dsa-6', title: '6. Dynamic Programming: 0/1 Knapsack & Memoization', duration_minutes: 50, video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4', sort_order: 6, is_active: true },
    ],
    lessonProgress: [
      { lesson_id: 'lesson-dsa-1', is_completed: true, is_started: true },
      { lesson_id: 'lesson-dsa-2', is_completed: true, is_started: true },
    ],
    questions: [],
    certificate: null,
  },
  'skill-os': {
    skill: {
      id: 'skill-os',
      name: 'Operating Systems',
      slug: 'operating-systems',
      description: 'Processes, threads, CPU scheduling, virtual memory management, and file systems architecture.',
      difficulty: 'intermediate',
      estimated_hours: 30,
      course: {
        name: 'Core Programming & CS Foundations',
        branch: { name: 'CSE Core' },
      },
    },
    lessons: [
      { id: 'lesson-os-1', title: '1. Introduction to Kernel Architecture & System Calls', duration_minutes: 24, video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', sort_order: 1, is_active: true },
      { id: 'lesson-os-2', title: '2. Process Lifecycle, Fork & Thread Concurrency', duration_minutes: 35, video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', sort_order: 2, is_active: true },
      { id: 'lesson-os-3', title: '3. CPU Scheduling Algorithms (CFS, Round Robin, Priority)', duration_minutes: 30, video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', sort_order: 3, is_active: true },
      { id: 'lesson-os-4', title: '4. Virtual Memory, Paging & Page Replacement Policies', duration_minutes: 42, video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', sort_order: 4, is_active: true },
    ],
    lessonProgress: [],
    questions: [],
    certificate: null,
  },
  'skill-python-ml': {
    skill: {
      id: 'skill-python-ml',
      name: 'Python for AI & Machine Learning',
      slug: 'python-for-ai-ml',
      description: 'NumPy, Pandas, Matplotlib, Scikit-learn, and end-to-end model development pipelines.',
      difficulty: 'beginner',
      estimated_hours: 35,
      course: {
        name: 'AI Foundations & Machine Learning',
        branch: { name: 'CSE AI & Machine Learning' },
      },
    },
    lessons: [
      { id: 'lesson-ml-1', title: '1. Vectorized Operations with NumPy & Multi-Dimensional Tensors', duration_minutes: 26, video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', sort_order: 1, is_active: true },
      { id: 'lesson-ml-2', title: '2. Exploratory Data Analysis & Feature Engineering with Pandas', duration_minutes: 38, video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', sort_order: 2, is_active: true },
      { id: 'lesson-ml-3', title: '3. Linear Regression & Gradient Descent Optimization', duration_minutes: 45, video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', sort_order: 3, is_active: true },
      { id: 'lesson-ml-4', title: '4. Decision Trees, Random Forests & Ensemble Methods', duration_minutes: 50, video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', sort_order: 4, is_active: true },
    ],
    lessonProgress: [
      { lesson_id: 'lesson-ml-1', is_completed: true, is_started: true },
    ],
    questions: [],
    certificate: null,
  },
  'skill-cyber-sec': {
    skill: {
      id: 'skill-cyber-sec',
      name: 'Ethical Hacking & Network Defense',
      slug: 'ethical-hacking-network-defense',
      description: 'Reconnaissance, vulnerability scanning, Kali Linux tools, and defensive architecture.',
      difficulty: 'intermediate',
      estimated_hours: 40,
      course: {
        name: 'Ethical Hacking & Penetration Testing',
        branch: { name: 'CSE Cyber Security' },
      },
    },
    lessons: [
      { id: 'lesson-sec-1', title: '1. Networking Fundamentals, TCP/IP Stack & Wireshark Packet Analysis', duration_minutes: 30, video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', sort_order: 1, is_active: true },
      { id: 'lesson-sec-2', title: '2. Network Scanning with Nmap & Banner Grabbing', duration_minutes: 35, video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', sort_order: 2, is_active: true },
      { id: 'lesson-sec-3', title: '3. Web Application Security: OWASP Top 10 Exploitation', duration_minutes: 48, video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', sort_order: 3, is_active: true },
      { id: 'lesson-sec-4', title: '4. Privilege Escalation & Post-Exploitation Tactics', duration_minutes: 52, video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', sort_order: 4, is_active: true },
    ],
    lessonProgress: [
      { lesson_id: 'lesson-sec-1', is_completed: true, is_started: true },
      { lesson_id: 'lesson-sec-2', is_completed: true, is_started: true },
    ],
    questions: [],
    certificate: null,
  },
};

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ skillId: string }>;
}) {
  const { skillId } = await params;
  const cookieStore = await cookies();
  const demoRole = cookieStore.get('demo_role')?.value;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && demoRole !== 'student') {
    redirect('/login');
  }

  // Demo fallback
  if (!user && demoRole === 'student') {
    const demoData = DEMO_SKILL_DETAILS[skillId] || DEMO_SKILL_DETAILS['skill-dsa'];
    return (
      <SkillDetailClient
        skill={demoData.skill as any}
        access={{ status: 'active' } as any}
        hasAccess={true}
        lessons={demoData.lessons as any}
        lessonProgress={demoData.lessonProgress as any}
        questions={demoData.questions as any}
        certificate={demoData.certificate}
      />
    );
  }

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
    .eq('student_id', user!.id)
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
      .eq('student_id', user!.id)
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
    .eq('student_id', user!.id)
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
