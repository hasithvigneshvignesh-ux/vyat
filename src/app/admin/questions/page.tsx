import { createClient } from '@/lib/supabase/server';
import QuestionsClient from './QuestionsClient';

const SAMPLE_QUESTIONS_DATA = [
  {
    id: 'q-sample-1',
    skill_id: 'a1000000-0000-0000-0000-000000000001',
    lesson_id: 'l1000000-0000-0000-0000-000000000001',
    question_text: 'What is the worst-case time complexity of QuickSort when using naive pivot selection on a sorted array?',
    question_type: 'mcq' as const,
    options: [
      { id: 'a', text: 'O(n log n)' },
      { id: 'b', text: 'O(n²)' },
      { id: 'c', text: 'O(n)' },
      { id: 'd', text: 'O(log n)' },
    ],
    correct_answer: 'b',
    explanation: 'When the array is already sorted and the first or last element is chosen as pivot, the partition produces unbalanced subproblems of sizes 0 and n-1, leading to O(n²) worst-case runtime.',
    difficulty: 'medium' as const,
    marks: 1,
    sort_order: 10,
    is_active: true,
    created_at: new Date().toISOString(),
    skill: { name: 'Data Structures & Algorithms in C++' },
    lesson: { title: 'Asymptotic Notation & Big-O Analysis' },
  },
  {
    id: 'q-sample-2',
    skill_id: 'a1000000-0000-0000-0000-000000000001',
    lesson_id: 'l1000000-0000-0000-0000-000000000002',
    question_text: 'Which data structure is primarily used to implement Depth First Search (DFS) in a graph?',
    question_type: 'mcq' as const,
    options: [
      { id: 'a', text: 'Queue' },
      { id: 'b', text: 'Stack (or Call Stack Recursion)' },
      { id: 'c', text: 'Min-Heap' },
      { id: 'd', text: 'Hash Table' },
    ],
    correct_answer: 'b',
    explanation: 'DFS uses a Last-In First-Out (LIFO) stack mechanism (either explicitly or via the system call stack in recursive implementations).',
    difficulty: 'easy' as const,
    marks: 1,
    sort_order: 20,
    is_active: true,
    created_at: new Date().toISOString(),
    skill: { name: 'Data Structures & Algorithms in C++' },
    lesson: { title: 'Arrays & Dynamic Arrays in Memory' },
  },
  {
    id: 'q-sample-3',
    skill_id: 'a2000000-0000-0000-0000-000000000003',
    lesson_id: 'l2000000-0000-0000-0000-000000000001',
    question_text: 'Which loss function is standardly used for binary classification in Logistic Regression?',
    question_type: 'mcq' as const,
    options: [
      { id: 'a', text: 'Mean Squared Error (MSE)' },
      { id: 'b', text: 'Binary Cross-Entropy (Log Loss)' },
      { id: 'c', text: 'Hinge Loss' },
      { id: 'd', text: 'Mean Absolute Error (MAE)' },
    ],
    correct_answer: 'b',
    explanation: 'Binary Cross-Entropy (Log Loss) measures the performance of a classification model whose output is a probability value between 0 and 1.',
    difficulty: 'easy' as const,
    marks: 1,
    sort_order: 30,
    is_active: true,
    created_at: new Date().toISOString(),
    skill: { name: 'Machine Learning Fundamentals with Scikit-Learn' },
    lesson: { title: 'Supervised vs Unsupervised Learning Paradigms' },
  },
];

export default async function AdminQuestionsPage() {
  const supabase = await createClient();

  // Fetch questions
  const { data: dbQuestions } = await supabase
    .from('questions')
    .select('*, skill:skills(name), lesson:lessons(title)')
    .order('sort_order', { ascending: true });

  // Fetch skills
  const { data: dbSkills } = await supabase
    .from('skills')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('name');

  // Fetch lessons
  const { data: dbLessons } = await supabase
    .from('lessons')
    .select('id, title, skill_id, sort_order')
    .eq('is_active', true)
    .order('sort_order');

  const questions = (dbQuestions && dbQuestions.length > 0) ? dbQuestions : SAMPLE_QUESTIONS_DATA;
  const skills = (dbSkills && dbSkills.length > 0) ? dbSkills : [
    { id: 'a1000000-0000-0000-0000-000000000001', name: 'Data Structures & Algorithms in C++', slug: 'dsa-cpp' },
    { id: 'a2000000-0000-0000-0000-000000000003', name: 'Machine Learning Fundamentals with Scikit-Learn', slug: 'ml-fundamentals' },
    { id: 'a4000000-0000-0000-0000-000000000001', name: 'Network Security & Penetration Testing', slug: 'network-security' },
    { id: 'a3000000-0000-0000-0000-000000000001', name: 'Exploratory Data Analysis with Pandas & Seaborn', slug: 'eda-pandas' },
  ];
  const lessons = (dbLessons && dbLessons.length > 0) ? dbLessons : [
    { id: 'l1000000-0000-0000-0000-000000000001', title: 'Asymptotic Notation & Big-O Analysis', skill_id: 'a1000000-0000-0000-0000-000000000001', sort_order: 1 },
    { id: 'l1000000-0000-0000-0000-000000000002', title: 'Arrays & Dynamic Arrays in Memory', skill_id: 'a1000000-0000-0000-0000-000000000001', sort_order: 2 },
    { id: 'l2000000-0000-0000-0000-000000000001', title: 'Supervised vs Unsupervised Learning Paradigms', skill_id: 'a2000000-0000-0000-0000-000000000003', sort_order: 1 },
  ];

  return (
    <QuestionsClient
      initialQuestions={questions as any}
      skills={skills as any}
      lessons={lessons as any}
    />
  );
}
