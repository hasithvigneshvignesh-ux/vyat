'use client';

import { StudentSkillAccess, Skill, LessonProgress } from '@/types/database';
import { calculateProgress, formatDate } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import Link from 'next/link';
import { BookOpen, ArrowRight, CheckCircle2, Award, MessageCircle, Clock } from 'lucide-react';

interface Props {
  skillAccess: (StudentSkillAccess & { skill: Skill & { course: { name: string; branch: { name: string } } } })[];
  lessonProgress: LessonProgress[];
  lessonCounts: Record<string, number>;
}

export default function MySkillsClient({ skillAccess, lessonProgress, lessonCounts }: Props) {
  const activeSkills = skillAccess.filter(sa => sa.status === 'active');
  const completedSkills = skillAccess.filter(sa => sa.status === 'completed');

  const getProgress = (skillId: string) => {
    const total = lessonCounts[skillId] || 0;
    const completed = lessonProgress.filter(lp => lp.skill_id === skillId && lp.is_completed).length;
    return calculateProgress(completed, total);
  };

  if (skillAccess.length === 0) {
    return (
      <div className="page-container">
        <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>My Skills</h1>
        <EmptyState
          icon={<BookOpen size={32} style={{ color: 'var(--text-tertiary)' }} />}
          title="No Skills Yet"
          description="You don't have any active skills yet. Contact your mentor to activate your first skill and begin learning."
          action={
            <Link href="/explore">
              <Button variant="secondary" icon={<MessageCircle size={16} />}>
                Explore Skills
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="page-container space-y-8 animate-fade-in">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>My Skills</h1>

      {/* Active Skills */}
      {activeSkills.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            Active Skills
            <Badge variant="info">{activeSkills.length}</Badge>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeSkills.map((sa, idx) => {
              const progress = getProgress(sa.skill_id);
              return (
                <Link key={sa.id} href={`/skills/${sa.skill_id}`}>
                  <Card
                    hover
                    className={`!p-5 h-full animate-fade-in stagger-${idx + 1}`}
                    style={{ opacity: 0, animationFillMode: 'forwards' } as React.CSSProperties}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                          {sa.skill?.course?.branch?.name} → {sa.skill?.course?.name}
                        </p>
                        <h3 className="font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                          {sa.skill?.name}
                        </h3>
                      </div>
                      <Badge variant="info">Active</Badge>
                    </div>
                    <ProgressBar value={progress} showLabel size="sm" className="mb-3" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                        <Clock size={12} />
                        {sa.skill?.estimated_hours ? `${sa.skill.estimated_hours}h` : 'In progress'}
                      </span>
                      <span className="text-xs font-medium text-blue-400 flex items-center gap-1">
                        Continue <ArrowRight size={12} />
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Skills */}
      {completedSkills.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            Completed
            <Badge variant="success">{completedSkills.length}</Badge>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedSkills.map((sa) => (
              <Link key={sa.id} href={`/skills/${sa.skill_id}`}>
                <Card hover className="!p-5 h-full">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                        {sa.skill?.course?.branch?.name}
                      </p>
                      <h3 className="font-semibold mt-1" style={{ color: 'var(--text-primary)' }}>
                        {sa.skill?.name}
                      </h3>
                    </div>
                    <Badge variant="success"><CheckCircle2 size={12} /> Done</Badge>
                  </div>
                  <ProgressBar value={100} color="success" size="sm" className="mb-3" />
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Completed {formatDate(sa.completion_date)}
                    </span>
                    <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                      <Award size={12} /> Certificate
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
