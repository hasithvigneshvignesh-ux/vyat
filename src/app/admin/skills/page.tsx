import { createClient } from '@/lib/supabase/server';
import SkillsClient from './SkillsClient';

export const metadata = {
  title: 'Skills — Admin — Vyat',
};

const FALLBACK_COURSES = [
  { id: 'c1000000-0000-0000-0000-000000000001', name: 'Programming & Foundations' },
  { id: 'c1000000-0000-0000-0000-000000000004', name: 'AI Foundations & Machine Learning' },
  { id: 'c1000000-0000-0000-0000-000000000008', name: 'Network Security & Defense' },
];

const FALLBACK_SKILLS = [
  { id: 'a1000000-0000-0000-0000-000000000001', course_id: 'c1000000-0000-0000-0000-000000000001', name: 'Data Structures & Algorithms in C++', slug: 'dsa-cpp', description: 'Comprehensive DSA with arrays, linked lists, trees, graphs, and DP.', short_description: 'Master core DSA patterns and LeetCode problem solving.', difficulty: 'intermediate', price: 499, duration_hours: 45, is_active: true, course: { name: 'Programming & Foundations' } },
  { id: 'a2000000-0000-0000-0000-000000000003', course_id: 'c1000000-0000-0000-0000-000000000004', name: 'Machine Learning with Scikit-Learn', slug: 'ml-scikit-learn', description: 'Supervised and unsupervised learning, regression, classification, clustering.', short_description: 'Build predictive AI models with Python & Scikit-learn.', difficulty: 'intermediate', price: 599, duration_hours: 40, is_active: true, course: { name: 'AI Foundations & Machine Learning' } },
  { id: 'a4000000-0000-0000-0000-000000000001', course_id: 'c1000000-0000-0000-0000-000000000008', name: 'Network Security & Penetration Testing', slug: 'network-security-pentest', description: 'TCP/IP vulnerabilities, packet sniffing, firewalls, and ethical hacking.', short_description: 'Defend networks and run authorized security penetration tests.', difficulty: 'advanced', price: 699, duration_hours: 35, is_active: true, course: { name: 'Network Security & Defense' } },
];

export default async function AdminSkillsPage() {
  const supabase = await createClient();

  const [{ data: skills }, { data: courses }] = await Promise.all([
    supabase
      .from('skills')
      .select('*, course:courses(name, branch:branches(name))')
      .order('sort_order'),
    supabase.from('courses').select('*').order('sort_order'),
  ]);

  const effectiveSkills = (skills && skills.length > 0) ? skills : FALLBACK_SKILLS;
  const effectiveCourses = (courses && courses.length > 0) ? courses : FALLBACK_COURSES;

  return (
    <SkillsClient
      initialSkills={(effectiveSkills as any) || []}
      courses={effectiveCourses as any}
    />
  );
}
