import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Metadata } from 'next';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import EmptyState from '@/components/ui/EmptyState';
import { Map as MapIcon, CheckCircle2, Lock, ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export const metadata: Metadata = { title: 'Roadmaps — Vyat' };

export default async function RoadmapsPage() {
  const cookieStore = await cookies();
  const demoRole = cookieStore.get('demo_role')?.value;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && demoRole !== 'student') {
    redirect('/login');
  }

  const userId = user?.id || 'demo-student-id';

  let roadmaps: any[] | null = null;
  let accessMap = new Map<string, string>();

  if (user) {
    // Real user: fetch from database
    const { data: roadmapData } = await supabase
      .from('roadmaps')
      .select(`
        *,
        branch:branches(name),
        skills:roadmap_skills(
          sort_order,
          skill:skills(id, name, short_description)
        )
      `)
      .eq('is_active', true)
      .order('created_at');

    const { data: skillAccess } = await supabase
      .from('student_skill_access')
      .select('skill_id, status')
      .eq('student_id', userId);

    roadmaps = roadmapData;
    accessMap = new Map((skillAccess || []).map(sa => [sa.skill_id, sa.status]));
  } else {
    // Demo mode: provide mock roadmaps
    roadmaps = [
      {
        id: 'roadmap-1',
        name: 'Full-Stack Web Development',
        description: 'Go from zero to deploying production-ready web applications with modern frameworks and best practices.',
        is_active: true,
        branch: { name: 'CSE Core' },
        skills: [
          { sort_order: 1, skill: { id: 'skill-html-css', name: 'HTML & CSS Fundamentals', short_description: 'Semantic markup, Flexbox, Grid, and responsive design' } },
          { sort_order: 2, skill: { id: 'skill-js', name: 'JavaScript Essentials', short_description: 'ES6+, async/await, closures, and DOM manipulation' } },
          { sort_order: 3, skill: { id: 'skill-react', name: 'React & Next.js', short_description: 'Component architecture, hooks, server components, and app router' } },
          { sort_order: 4, skill: { id: 'skill-node', name: 'Node.js & APIs', short_description: 'Express, REST APIs, middleware, and database integration' } },
          { sort_order: 5, skill: { id: 'skill-deploy', name: 'DevOps & Deployment', short_description: 'Docker, CI/CD, cloud hosting, and monitoring' } },
        ],
      },
      {
        id: 'roadmap-2',
        name: 'AI & Machine Learning Foundations',
        description: 'Build a strong foundation in AI/ML from math fundamentals to deploying trained models in production.',
        is_active: true,
        branch: { name: 'CSE AI & Machine Learning' },
        skills: [
          { sort_order: 1, skill: { id: 'skill-python-ml', name: 'Python for AI & Machine Learning', short_description: 'NumPy, Pandas, Matplotlib, Scikit-learn' } },
          { sort_order: 2, skill: { id: 'skill-math-ml', name: 'Mathematics for ML', short_description: 'Linear algebra, calculus, probability & statistics' } },
          { sort_order: 3, skill: { id: 'skill-deep-learning', name: 'Deep Learning with PyTorch', short_description: 'Neural networks, CNNs, RNNs, and transformers' } },
        ],
      },
    ];
    // Demo access map: some skills completed/active
    accessMap = new Map([
      ['skill-html-css', 'completed'],
      ['skill-js', 'completed'],
      ['skill-react', 'active'],
      ['skill-python-ml', 'active'],
    ]);
  }

  return (
    <div className="page-container flex flex-col gap-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Learning Roadmaps</h1>
        <p className="text-base mt-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
          Follow structured paths to master a domain
        </p>
      </div>

      {(!roadmaps || roadmaps.length === 0) ? (
        <EmptyState
          icon={<MapIcon size={32} style={{ color: 'var(--text-tertiary)' }} />}
          title="No Roadmaps Available"
          description="Roadmaps will appear here once the administrator creates them."
        />
      ) : (
        <div className="flex flex-col gap-10">
          {roadmaps.map(roadmap => {
            const skills = (roadmap.skills || []).sort((a: any, b: any) => a.sort_order - b.sort_order);
            const completed = skills.filter((rs: any) => accessMap.get(rs.skill?.id) === 'completed').length;
            const progress = skills.length > 0 ? Math.round((completed / skills.length) * 100) : 0;

            return (
              <div 
                key={roadmap.id} 
                className="rounded-[24px] p-8 shadow-sm border"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-6">
                  <div>
                    <span 
                      className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full mb-3"
                      style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                    >
                      {roadmap.branch?.name}
                    </span>
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {roadmap.name}
                    </h2>
                    {roadmap.description && (
                      <p className="text-base mt-2 leading-relaxed max-w-3xl" style={{ color: 'var(--text-secondary)' }}>
                        {roadmap.description}
                      </p>
                    )}
                  </div>
                  <div 
                    className="text-right shrink-0 px-5 py-3 rounded-2xl border"
                    style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-secondary)' }}
                  >
                    <p className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>{progress}%</p>
                    <p className="text-sm font-semibold mt-1 uppercase tracking-widest" style={{ color: 'var(--text-tertiary)' }}>{completed}/{skills.length} skills</p>
                  </div>
                </div>
                <ProgressBar value={progress} size="lg" className="mb-8" color="brand" />
                
                <div className="flex flex-col gap-3">
                  {skills.map((rs: any, idx: number) => {
                    const status = accessMap.get(rs.skill?.id);
                    return (
                      <div
                        key={rs.skill?.id || idx}
                        className="flex items-center gap-4 py-3 px-4 rounded-lg border transition-colors hover:bg-[var(--bg-tertiary)]"
                        style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-secondary)' }}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          status === 'completed' ? 'bg-emerald-100 text-emerald-600' :
                          status === 'active' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'
                        }`}
                        >
                          {status === 'completed' ? <CheckCircle2 size={18} strokeWidth={2.5} /> : idx + 1}
                        </div>
                        
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <p 
                            className="text-base font-bold truncate"
                            style={{ color: status ? 'var(--text-primary)' : 'var(--text-muted)' }}
                          >
                            {rs.skill?.name}
                          </p>
                          {rs.skill?.short_description && (
                            <p className="text-xs sm:text-sm truncate mt-0.5 font-medium" style={{ color: 'var(--text-tertiary)' }}>
                              {rs.skill.short_description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0 pl-4">
                          {status === 'completed' && (
                            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-wider rounded-md border border-emerald-100">
                              Done
                            </span>
                          )}
                          {status === 'active' && (
                            <Link href={`/skills/${rs.skill?.id}`}>
                              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider rounded-md border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer inline-block">
                                In Progress
                              </span>
                            </Link>
                          )}
                          {!status && <Lock size={16} style={{ color: 'var(--text-muted)', margin: '0 8px' }} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

