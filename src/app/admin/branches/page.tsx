import { createClient } from '@/lib/supabase/server';
import BranchesClient from './BranchesClient';

export const metadata = {
  title: 'Branches — Admin — Vyat',
};

const FALLBACK_BRANCHES = [
  { id: 'b1000000-0000-0000-0000-000000000001', name: 'CSE Core', slug: 'cse-core', description: 'Fundamental computer science subjects every engineer must master (DSA, OS, DBMS, Networks).', icon: '💻', sort_order: 1, is_active: true },
  { id: 'b1000000-0000-0000-0000-000000000002', name: 'CSE AI & ML', slug: 'cse-ai-ml', description: 'Artificial Intelligence, Machine Learning, Deep Learning, and Neural Networks.', icon: '🤖', sort_order: 2, is_active: true },
  { id: 'b1000000-0000-0000-0000-000000000003', name: 'CSE Data Science', slug: 'cse-data-science', description: 'Big Data, Predictive Analytics, Data Visualization, and Business Intelligence.', icon: '📊', sort_order: 3, is_active: true },
  { id: 'b1000000-0000-0000-0000-000000000004', name: 'CSE Cyber Security', slug: 'cse-cyber-security', description: 'Network Security, Ethical Hacking, Cryptography, and Threat Defense.', icon: '🔒', sort_order: 4, is_active: true },
];

export default async function BranchesPage() {
  const supabase = await createClient();
  const { data: branches } = await supabase
    .from('branches')
    .select('*, courses:courses(count)')
    .order('sort_order');

  const effectiveBranches = (branches && branches.length > 0) ? branches : FALLBACK_BRANCHES;

  return <BranchesClient initialBranches={effectiveBranches as any} />;
}
