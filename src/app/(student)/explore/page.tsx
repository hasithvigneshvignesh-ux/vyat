import { createClient } from '@/lib/supabase/server';
import { Metadata } from 'next';
import ExploreClient from './ExploreClient';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vyatai.com';

export const metadata: Metadata = {
  title: 'Courses for CSE: Placements, Core Subjects, DSA, Web Dev & AI Learning Catalog | Vyat',
  description: 'Explore verified courses and skills for CSE & engineering students in India. Master campus placements, core subjects (OS, DBMS, Computer Networks), Data Structures & Algorithms (DSA), Full-Stack Web Development, and AI learning.',
  keywords: [
    'Courses for CSE',
    'CSE students India',
    'Placements preparation CSE',
    'Core subjects CSE',
    'DSA courses for placements',
    'Web Dev courses for CSE',
    'AI learning engineering',
    'B.Tech CSE courses',
    'Engineering placement catalog',
  ],
  alternates: {
    canonical: `${BASE_URL}/explore`,
  },
  openGraph: {
    title: 'Courses for CSE: Placements, Core Subjects, DSA, Web Dev & AI Learning Catalog | Vyat',
    description: 'Explore verified courses and skills for CSE & engineering students in India. Master campus placements, core CS, DSA, Web Dev, and AI learning.',
    url: `${BASE_URL}/explore`,
    type: 'website',
    siteName: 'Vyat',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Courses for CSE: Placements, Core Subjects, DSA, Web Dev & AI Learning Catalog | Vyat',
    description: 'Explore verified courses and skills for CSE & engineering students in India. Master campus placements, core CS, DSA, Web Dev, and AI learning.',
  },
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
