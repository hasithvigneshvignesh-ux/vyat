import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import LessonPageClient from './LessonPageClient';

const DEMO_LESSONS: Record<string, any> = {
  'lesson-dsa-1': {
    id: 'lesson-dsa-1',
    title: '1. Arrays, Memory Layout & Dynamic Sizing',
    duration_minutes: 25,
    video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    notes_content: `### Arrays & Memory Layout\n\nIn this lecture, we delve deep into:\n1. **Contiguous Memory Allocation** — cache line efficiency, O(1) random access indexing.\n2. **Dynamic Array Resizing** — amortized O(1) append analysis.\n3. **Pointer Arithmetic** — how compilers map index lookups to physical memory addresses.`,
    sort_order: 1,
    skill: {
      id: 'skill-dsa',
      name: 'Data Structures & Algorithms',
      course: {
        name: 'Core Programming & CS Foundations',
        branch: { name: 'CSE Core' },
      },
    },
  },
  'lesson-dsa-2': {
    id: 'lesson-dsa-2',
    title: '2. Two-Pointer & Sliding Window Techniques',
    duration_minutes: 32,
    video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    notes_content: `### Two-Pointer & Sliding Window\n\n- How to reduce O(N^2) brute force problems down to optimal O(N) linear time.\n- Fixed-size vs dynamic-size sliding windows.\n- Left and right convergence criteria.`,
    sort_order: 2,
    skill: {
      id: 'skill-dsa',
      name: 'Data Structures & Algorithms',
      course: {
        name: 'Core Programming & CS Foundations',
        branch: { name: 'CSE Core' },
      },
    },
  },
  'lesson-dsa-3': {
    id: 'lesson-dsa-3',
    title: '3. Singly & Doubly Linked List Inversion & Cycle Detection',
    duration_minutes: 28,
    video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    notes_content: `### Linked Lists & Floyd's Cycle Finding\n\n- In-place reversal of pointers without extra space.\n- Fast & Slow pointer (Tortoise and Hare algorithm) for cycle detection.`,
    sort_order: 3,
    skill: {
      id: 'skill-dsa',
      name: 'Data Structures & Algorithms',
      course: {
        name: 'Core Programming & CS Foundations',
        branch: { name: 'CSE Core' },
      },
    },
  },
};

const ALL_DEMO_DSA_LESSONS = [
  { id: 'lesson-dsa-1', title: '1. Arrays, Memory Layout & Dynamic Sizing', sort_order: 1 },
  { id: 'lesson-dsa-2', title: '2. Two-Pointer & Sliding Window Techniques', sort_order: 2 },
  { id: 'lesson-dsa-3', title: '3. Singly & Doubly Linked List Inversion & Cycle Detection', sort_order: 3 },
  { id: 'lesson-dsa-4', title: '4. Binary Trees, Traversals & Breadth-First Search (BFS)', sort_order: 4 },
  { id: 'lesson-dsa-5', title: '5. Graphs: Topological Sort, Dijkstra & Shortest Path', sort_order: 5 },
  { id: 'lesson-dsa-6', title: '6. Dynamic Programming: 0/1 Knapsack & Memoization', sort_order: 6 },
];

export default async function LessonPage({
  params,
}: {
  params: Promise<{ skillId: string; lessonId: string }>;
}) {
  const { skillId, lessonId } = await params;
  const cookieStore = await cookies();
  const demoRole = cookieStore.get('demo_role')?.value;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && demoRole !== 'student') {
    redirect('/login');
  }

  // Demo fallback
  if (!user && demoRole === 'student') {
    const demoLesson = DEMO_LESSONS[lessonId] || {
      id: lessonId,
      title: 'Interactive Video Lecture',
      duration_minutes: 30,
      video_path: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      notes_content: 'Comprehensive lesson notes and lecture slides for this session.',
      sort_order: 1,
      skill: {
        id: skillId,
        name: 'Technical Skill Masterclass',
        course: {
          name: 'Computer Science Curriculum',
          branch: { name: 'CSE Core' },
        },
      },
    };

    return (
      <LessonPageClient
        lesson={demoLesson}
        allLessons={ALL_DEMO_DSA_LESSONS}
        progress={{ id: 'prog-demo', student_id: 'demo-student', lesson_id: lessonId, is_completed: false, is_started: true, created_at: '', updated_at: '', last_watched_position: 0, skill_id: skillId } as any}
        allProgress={[
          { lesson_id: 'lesson-dsa-1', is_completed: true, is_started: true },
          { lesson_id: 'lesson-dsa-2', is_completed: true, is_started: true },
        ]}
        questions={[
          {
            id: 'q-demo-1',
            skill_id: skillId,
            lesson_id: lessonId,
            question_text: 'What is the amortized time complexity of inserting into a dynamic array?',
            question_type: 'mcq',
            options: [
              { id: 'a', text: 'O(1)' },
              { id: 'b', text: 'O(N)' },
              { id: 'c', text: 'O(log N)' },
              { id: 'd', text: 'O(N^2)' },
            ],
            correct_answer: 'a',
            explanation: 'Although resizing takes O(N), resizing occurs geometrically less often, yielding O(1) amortized time.',
            difficulty: 'medium',
            marks: 1,
            sort_order: 1,
            is_active: true,
            created_at: '',
          },
        ]}
        resources={[]}
        userId="demo-student"
        skillId={skillId}
      />
    );
  }

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
    .eq('student_id', user!.id)
    .eq('lesson_id', lessonId)
    .single();

  // Fetch all progress for sidebar
  const { data: allProgress } = await supabase
    .from('lesson_progress')
    .select('lesson_id, is_completed, is_started')
    .eq('student_id', user!.id)
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
      userId={user!.id}
      skillId={skillId}
    />
  );
}
