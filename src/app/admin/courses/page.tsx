import { createClient } from '@/lib/supabase/server';
import CoursesClient from './CoursesClient';

export const metadata = {
  title: 'Courses — Admin — Vyat',
};

const FALLBACK_BRANCHES = [
  { id: 'b1000000-0000-0000-0000-000000000001', name: 'CSE Core', slug: 'cse-core', description: 'Fundamental computer science subjects.', icon: '💻', sort_order: 1, is_active: true, created_at: new Date().toISOString() },
  { id: 'b1000000-0000-0000-0000-000000000002', name: 'CSE AI & ML', slug: 'cse-ai-ml', description: 'Artificial Intelligence and Machine Learning.', icon: '🤖', sort_order: 2, is_active: true, created_at: new Date().toISOString() },
  { id: 'b1000000-0000-0000-0000-000000000003', name: 'CSE Data Science', slug: 'cse-data-science', description: 'Data Science, analytics, and visualization.', icon: '📊', sort_order: 3, is_active: true, created_at: new Date().toISOString() },
  { id: 'b1000000-0000-0000-0000-000000000004', name: 'CSE Cyber Security', slug: 'cse-cyber-security', description: 'Cyber security and ethical hacking.', icon: '🔒', sort_order: 4, is_active: true, created_at: new Date().toISOString() },
];

const FALLBACK_COURSES = [
  { id: 'c1000000-0000-0000-0000-000000000001', branch_id: 'b1000000-0000-0000-0000-000000000001', name: 'Programming & Foundations', slug: 'programming-foundations', description: 'Essential programming languages and computing principles.', sort_order: 1, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), branch: { name: 'CSE Core' } },
  { id: 'c1000000-0000-0000-0000-000000000002', branch_id: 'b1000000-0000-0000-0000-000000000001', name: 'Core Systems & Architecture', slug: 'core-systems-architecture', description: 'Operating systems, computer networks, and databases.', sort_order: 2, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), branch: { name: 'CSE Core' } },
  { id: 'c1000000-0000-0000-0000-000000000004', branch_id: 'b1000000-0000-0000-0000-000000000002', name: 'AI Foundations & Machine Learning', slug: 'ai-foundations-ml', description: 'From mathematical foundations to practical ML models.', sort_order: 1, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), branch: { name: 'CSE AI & ML' } },
  { id: 'c1000000-0000-0000-0000-000000000008', branch_id: 'b1000000-0000-0000-0000-000000000004', name: 'Network Security & Defense', slug: 'network-security-defense', description: 'Network protection, firewalls, and cryptography.', sort_order: 1, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), branch: { name: 'CSE Cyber Security' } },
];

export default async function CoursesPage() {
  const supabase = await createClient();

  const [{ data: courses }, { data: branches }] = await Promise.all([
    supabase.from('courses').select('*, branch:branches(name)').order('sort_order'),
    supabase.from('branches').select('*').order('sort_order'),
  ]);

  const effectiveCourses = (courses && courses.length > 0) ? courses : FALLBACK_COURSES;
  const effectiveBranches = (branches && branches.length > 0) ? branches : FALLBACK_BRANCHES;

  return (
    <CoursesClient
      initialCourses={(effectiveCourses as any) || []}
      branches={effectiveBranches as any}
    />
  );
}
