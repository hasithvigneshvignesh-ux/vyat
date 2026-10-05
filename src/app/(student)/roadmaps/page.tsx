import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: roadmaps } = await supabase
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
    .eq('student_id', user.id);

  const accessMap = new Map((skillAccess || []).map(sa => [sa.skill_id, sa.status]));

  return (
    <div className="page-container space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Learning Roadmaps</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
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
        <div className="space-y-6">
          {roadmaps.map(roadmap => {
            const skills = (roadmap.skills || []).sort((a: any, b: any) => a.sort_order - b.sort_order);
            const completed = skills.filter((rs: any) => accessMap.get(rs.skill?.id) === 'completed').length;
            const progress = skills.length > 0 ? Math.round((completed / skills.length) * 100) : 0;

            return (
              <Card key={roadmap.id} className="!p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge className="mb-2">{roadmap.branch?.name}</Badge>
                    <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {roadmap.name}
                    </h2>
                    {roadmap.description && (
                      <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                        {roadmap.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{progress}%</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{completed}/{skills.length} skills</p>
                  </div>
                </div>
                <ProgressBar value={progress} size="md" className="mb-6" />
                <div className="space-y-2">
                  {skills.map((rs: any, idx: number) => {
                    const status = accessMap.get(rs.skill?.id);
                    return (
                      <div
                        key={rs.skill?.id || idx}
                        className="flex items-center gap-3 p-3 rounded-xl"
                        style={{ backgroundColor: 'var(--bg-tertiary)' }}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                          status === 'active' ? 'bg-blue-500/10 text-blue-400' : ''
                        }`}
                        style={!status ? { backgroundColor: 'var(--bg-elevated)', color: 'var(--text-muted)' } : undefined}
                        >
                          {status === 'completed' ? <CheckCircle2 size={16} /> : idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: status ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                            {rs.skill?.name}
                          </p>
                        </div>
                        {status === 'completed' && <Badge variant="success" size="sm">Done</Badge>}
                        {status === 'active' && (
                          <Link href={`/skills/${rs.skill?.id}`}>
                            <Badge variant="info" size="sm">In Progress</Badge>
                          </Link>
                        )}
                        {!status && <Lock size={14} style={{ color: 'var(--text-muted)' }} />}
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
