import { createClient } from '@/lib/supabase/server';
import { Metadata } from 'next';
import ExploreClient from './ExploreClient';

export const metadata: Metadata = {
  title: 'Explore Skills — Vyat',
  description: 'Browse all available skills across branches and courses.',
};

export default async function ExplorePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch all active skills with course and branch info
  const { data: allSkills } = await supabase
    .from('skills')
    .select(`
      *,
      course:courses(
        *,
        branch:branches(*)
      )
    `)
    .eq('is_active', true)
    .order('sort_order');

  // Fetch student's active skill access
  const { data: skillAccess } = await supabase
    .from('student_skill_access')
    .select('skill_id, status')
    .eq('student_id', user?.id || '');

  // Fetch branches for filtering
  const { data: branches } = await supabase
    .from('branches')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  return (
    <ExploreClient
      allSkills={allSkills || []}
      skillAccess={skillAccess || []}
      branches={branches || []}
    />
  );
}
