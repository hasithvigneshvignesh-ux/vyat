'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { Skill } from '@/types/database';
import { formatCurrency } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Zap, Compass, Lock, MessageCircle } from 'lucide-react';

interface Props {
  recommendedSkills: (Skill & { course: { name: string; branch: { name: string } } })[];
}

export const RecommendedTracksSection = memo(function RecommendedTracksSection({
  recommendedSkills,
}: Props) {
  if (recommendedSkills.length === 0) return null;

  return (
    <div className="space-y-6 pt-4 gpu-layer" style={{ contain: 'content' }}>
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b"
        style={{ borderColor: 'var(--border-primary)' }}
      >
        <div>
          <h2
            className="text-2xl font-bold tracking-tight flex items-center gap-2"
            style={{ color: 'var(--text-primary)' }}
          >
            <Zap size={22} className="text-amber-500" /> Recommended Specialized Tracks
          </h2>
          <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            Explore high-impact domains in Cloud, AI/ML, Cyber Security, and Algorithms
          </p>
        </div>
        <Link href="/explore">
          <Button variant="ghost" size="sm" icon={<Compass size={15} />}>
            Explore Catalog
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
        {recommendedSkills.map((skill) => (
          <Card
            key={skill.id}
            hover
            className="!p-7 sm:!p-8 flex flex-col justify-between border hover:border-violet-500/40 shadow-sm hover:shadow-xl transition-all duration-200 gpu-layer"
            style={{ contain: 'content' }}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-violet-500 uppercase tracking-wider bg-violet-500/10 px-3 py-1 rounded-xl border border-violet-500/20">
                  {skill.course?.branch?.name || 'Specialization'}
                </span>
                <Lock size={16} className="text-muted" />
              </div>

              <h3 className="text-lg sm:text-xl font-bold leading-snug" style={{ color: 'var(--text-primary)' }}>
                {skill.name}
              </h3>

              <p className="text-xs sm:text-sm line-clamp-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {skill.short_description || skill.description || 'Master this program with industry projects and hands-on coding.'}
              </p>
            </div>

            <div
              className="pt-6 mt-6 border-t flex items-center justify-between"
              style={{ borderColor: 'var(--border-secondary)' }}
            >
              <div>
                <p className="text-[11px] font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                  Tuition / Access
                </p>
                <p className="text-base sm:text-lg font-extrabold text-emerald-500 font-mono">
                  {formatCurrency(skill.price)}
                </p>
              </div>
              <Button variant="secondary" size="sm" icon={<MessageCircle size={15} />}>
                Request Access
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
});

export default RecommendedTracksSection;
