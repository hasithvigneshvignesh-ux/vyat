'use client';

import React, { memo, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Profile, StudentSkillAccess, LessonProgress, Certificate, StudentActivity, Skill } from '@/types/database';
import { calculateProgress } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import Link from 'next/link';
import {
  BookOpen, Award, TrendingUp, Clock,
  ArrowRight, Sparkles, CheckCircle2, PlayCircle,
  Target, ShieldCheck, GraduationCap, Flame, Compass
} from 'lucide-react';

/* ─── Below-the-fold lazy loaded sections with instant skeletons ─── */
const ActivityAndCredentialsSection = dynamic(
  () => import('./ActivityAndCredentialsSection'),
  {
    loading: () => <ActivityAndCredentialsSkeleton />,
  }
);

const RecommendedTracksSection = dynamic(
  () => import('./RecommendedTracksSection'),
  {
    loading: () => <RecommendedTracksSkeleton />,
  }
);

function ActivityAndCredentialsSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
      {[1, 2].map((i) => (
        <div
          key={i}
          className="animate-pulse"
          style={{
            padding: 28,
            borderRadius: 12,
            border: '1px solid var(--border-primary)',
            backgroundColor: 'var(--bg-card)',
            minHeight: 280,
          }}
        >
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'var(--border-secondary)' }} />
            <div style={{ width: 160, height: 20, borderRadius: 6, backgroundColor: 'var(--border-secondary)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map((j) => (
              <div key={j} style={{ height: 48, borderRadius: 10, backgroundColor: 'var(--border-secondary)' }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RecommendedTracksSkeleton() {
  return (
    <div className="space-y-6 pt-4">
      <div style={{ width: 220, height: 28, borderRadius: 6, backgroundColor: 'var(--border-primary)' }} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse !p-7 sm:!p-8 rounded-2xl border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
              minHeight: 240,
            }}
          >
            <div style={{ width: 90, height: 20, borderRadius: 8, backgroundColor: 'var(--border-secondary)', marginBottom: 16 }} />
            <div style={{ width: '80%', height: 24, borderRadius: 6, backgroundColor: 'var(--border-primary)', marginBottom: 12 }} />
            <div style={{ width: '100%', height: 16, borderRadius: 4, backgroundColor: 'var(--border-secondary)', marginBottom: 8 }} />
            <div style={{ width: '60%', height: 16, borderRadius: 4, backgroundColor: 'var(--border-secondary)' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   1. Memoized Welcome Banner Component
   ────────────────────────────────────────────────────────── */
interface WelcomeBannerProps {
  profile: Profile;
  activeSkill?: (StudentSkillAccess & { skill: Skill & { course: { name: string; branch: { name: string } } } });
  hasActiveSkills: boolean;
  activeSkillsCount: number;
  overallProgress: number;
  completedLessonsAll: number;
  totalLessonsAll: number;
}

const WelcomeBanner = memo(function WelcomeBanner({
  profile,
  activeSkill,
  hasActiveSkills,
  activeSkillsCount,
  overallProgress,
  completedLessonsAll,
  totalLessonsAll,
}: WelcomeBannerProps) {
  const greeting = useMemo(() => {
    const hours = new Date().getHours();
    return hours < 12 ? 'Good Morning' : hours < 17 ? 'Good Afternoon' : 'Good Evening';
  }, []);

  const firstName = useMemo(() => {
    return profile.full_name ? profile.full_name.split(' ')[0] : 'Student';
  }, [profile.full_name]);

  return (
    <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 lg:p-12 bg-gradient-to-br from-blue-600/15 via-violet-600/10 to-indigo-600/10 border border-blue-500/20 shadow-lg min-h-[340px] flex flex-col justify-center gpu-layer">
      {/* Ambient background glow */}
      <div
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-500/15 blur-3xl pointer-events-none"
        style={{ pointerEvents: 'none' }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-violet-500/15 blur-3xl pointer-events-none"
        style={{ pointerEvents: 'none' }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Greeting, Title, Description & Action Buttons */}
        <div className="lg:col-span-7 xl:col-span-7">
          {/* Top Badges */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span
              style={{
                position: 'relative',
                zIndex: 10,
                pointerEvents: 'auto',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '999px',
                backgroundColor: '#FEF3C7',
                color: '#92400E',
                border: '1px solid #FDE68A',
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: '1.2',
              }}
            >
              <Sparkles size={14} style={{ color: '#B45309', flexShrink: 0 }} />
              <span>{greeting}</span>
            </span>

            <span
              style={{
                position: 'relative',
                zIndex: 10,
                pointerEvents: 'auto',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '999px',
                backgroundColor: '#E0E7FF',
                color: '#312E81',
                border: '1px solid #C7D2FE',
                fontSize: '12px',
                fontWeight: 600,
                lineHeight: '1.2',
              }}
            >
              <GraduationCap size={14} style={{ color: '#4338CA', flexShrink: 0 }} />
              <span>{profile.branch_name || 'Computer Science & Engineering'}</span>
            </span>
          </div>

          {/* Welcome Header */}
          <h1
            className="text-2xl sm:text-3xl lg:text-[2.25rem] font-bold tracking-tight"
            style={{
              color: 'var(--text-primary)',
              marginBottom: '10px',
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
            }}
          >
            Welcome back, {firstName}!
          </h1>

          {/* Description Text */}
          <p
            className="text-sm sm:text-base font-normal max-w-lg"
            style={{
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              marginBottom: '28px',
              opacity: 0.85,
            }}
          >
            {hasActiveSkills
              ? 'Continue your learning journey. Complete module lectures, practice interactive topic MCQs, and earn verifiable cryptographic certificates.'
              : 'Your journey starts here. Explore comprehensive engineering programs, practice questions, and begin mastering skills.'}
          </p>

          {/* Action Button Container & Buttons */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            {activeSkill ? (
              <Link
                href={`/skills/${activeSkill.skill_id}`}
                style={{
                  position: 'relative',
                  zIndex: 10,
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  textDecoration: 'none',
                }}
              >
                <Button
                  size="md"
                  icon={<PlayCircle size={18} style={{ flexShrink: 0 }} />}
                  style={{
                    position: 'relative',
                    zIndex: 10,
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                    fontWeight: 500,
                  }}
                  className="shadow-md"
                >
                  <span style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>
                    Resume: {activeSkill.skill?.name}
                  </span>
                </Button>
              </Link>
            ) : (
              <Link
                href="/explore"
                style={{
                  position: 'relative',
                  zIndex: 10,
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  textDecoration: 'none',
                }}
              >
                <Button
                  size="md"
                  icon={<Compass size={18} style={{ flexShrink: 0 }} />}
                  style={{
                    position: 'relative',
                    zIndex: 10,
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                    fontWeight: 500,
                  }}
                  className="shadow-md"
                >
                  <span style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>
                    Explore Skills Catalog
                  </span>
                </Button>
              </Link>
            )}
            <Link
              href="/roadmaps"
              style={{
                position: 'relative',
                zIndex: 10,
                pointerEvents: 'auto',
                cursor: 'pointer',
                display: 'inline-flex',
                textDecoration: 'none',
              }}
            >
              <Button
                variant="secondary"
                size="md"
                icon={<Target size={18} style={{ flexShrink: 0 }} />}
                style={{
                  position: 'relative',
                  zIndex: 10,
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  whiteSpace: 'nowrap',
                  fontWeight: 500,
                }}
              >
                <span style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>
                  View Career Roadmaps
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Contained Progress Hub Card */}
        {hasActiveSkills && (
          <div className="lg:col-span-5 xl:col-span-5 w-full">
            <div
              className="rounded-2xl border flex flex-col"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-primary)',
                padding: '32px 36px',
                gap: '0',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.08)',
              }}
            >
              {/* Header Row: Label + Fire Icon */}
              <div className="flex items-start justify-between" style={{ marginBottom: '20px' }}>
                <div>
                  <p
                    style={{
                      fontSize: '10px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: 'var(--text-tertiary)',
                      marginBottom: '10px',
                    }}
                  >
                    Overall Progress
                  </p>
                  <span
                    style={{
                      display: 'block',
                      fontSize: 'clamp(2.5rem, 5vw, 3.25rem)',
                      fontWeight: 700,
                      letterSpacing: '-0.04em',
                      lineHeight: 1,
                      color: '#3b82f6',
                      fontFamily: 'var(--font-mono, monospace)',
                    }}
                  >
                    {overallProgress}%
                  </span>
                </div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    backgroundColor: 'rgba(245,158,11,0.12)',
                    border: '1px solid rgba(245,158,11,0.20)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f59e0b',
                    flexShrink: 0,
                  }}
                >
                  <Flame size={20} />
                </div>
              </div>

              {/* Progress track */}
              <div
                style={{
                  width: '100%',
                  height: 6,
                  borderRadius: 999,
                  backgroundColor: 'var(--border-primary)',
                  overflow: 'hidden',
                  marginBottom: '28px',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    borderRadius: 999,
                    background: 'linear-gradient(90deg, #3b82f6, #6366f1, #8b5cf6)',
                    width: `${Math.min(100, Math.max(0, overallProgress))}%`,
                    transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </div>

              {/* Divider */}
              <div style={{ borderTop: '1px solid var(--border-secondary)', marginBottom: '20px' }} />

              {/* Metrics Breakdown Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div
                  style={{
                    padding: '16px 18px',
                    borderRadius: 12,
                    border: '1px solid var(--border-secondary)',
                    backgroundColor: 'var(--bg-tertiary)',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      fontSize: '10px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--text-tertiary)',
                      marginBottom: '8px',
                    }}
                  >
                    Lectures Completed
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '4px',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontWeight: 700,
                      fontSize: '1.125rem',
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {completedLessonsAll}
                    <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-tertiary)' }}>/ {totalLessonsAll}</span>
                  </span>
                </div>
                <div
                  style={{
                    padding: '16px 18px',
                    borderRadius: 12,
                    border: '1px solid var(--border-secondary)',
                    backgroundColor: 'var(--bg-tertiary)',
                  }}
                >
                  <span
                    style={{
                      display: 'block',
                      fontSize: '10px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: 'var(--text-tertiary)',
                      marginBottom: '8px',
                    }}
                  >
                    Active Modules
                  </span>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '4px',
                      fontFamily: 'var(--font-mono, monospace)',
                      fontWeight: 700,
                      fontSize: '1.125rem',
                      color: '#10b981',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {activeSkillsCount}
                    <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-tertiary)' }}>Enrolled</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

/* ──────────────────────────────────────────────────────────
   2. Memoized Stats Cards Grid Component
   ────────────────────────────────────────────────────────── */
interface StatsCardsGridProps {
  activeCount: number;
  completedCount: number;
  unlockedCertsCount: number;
  overallProgress: number;
}

const StatsCardsGrid = memo(function StatsCardsGrid({
  activeCount,
  completedCount,
  unlockedCertsCount,
  overallProgress,
}: StatsCardsGridProps) {
  return (
    <div className="stats-grid">
      <div className="stat-card" style={{ '--hover-border': 'rgba(59,130,246,0.4)' } as React.CSSProperties}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-tertiary)', letterSpacing: '0.09em' }}>
              Active Programs
            </p>
            <p className="text-[2.25rem] font-bold tracking-tight leading-none" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em', fontFamily: 'var(--font-mono, monospace)' }}>
              {activeCount}
            </p>
          </div>
          <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(59,130,246,0.10)', border: '1px solid rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', flexShrink: 0 }}>
            <BookOpen size={20} />
          </div>
        </div>
        <p className="text-xs font-medium text-blue-500 mt-4" style={{ opacity: 0.85 }}>
          In-progress modules
        </p>
      </div>

      <div className="stat-card">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-tertiary)', letterSpacing: '0.09em' }}>
              Completed Skills
            </p>
            <p className="text-[2.25rem] font-bold tracking-tight leading-none" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em', fontFamily: 'var(--font-mono, monospace)' }}>
              {completedCount}
            </p>
          </div>
          <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', flexShrink: 0 }}>
            <CheckCircle2 size={20} />
          </div>
        </div>
        <p className="text-xs font-medium text-emerald-500 flex items-center gap-1 mt-4" style={{ opacity: 0.85 }}>
          <CheckCircle2 size={11} /> Passed assessments
        </p>
      </div>

      <div className="stat-card">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-tertiary)', letterSpacing: '0.09em' }}>
              Certificates Issued
            </p>
            <p className="text-[2.25rem] font-bold tracking-tight leading-none" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em', fontFamily: 'var(--font-mono, monospace)' }}>
              {unlockedCertsCount}
            </p>
          </div>
          <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', flexShrink: 0 }}>
            <Award size={20} />
          </div>
        </div>
        <p className="text-xs font-medium text-amber-500 flex items-center gap-1 mt-4" style={{ opacity: 0.85 }}>
          <ShieldCheck size={11} /> 100% Verified
        </p>
      </div>

      <div className="stat-card">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-tertiary)', letterSpacing: '0.09em' }}>
              Total Mastery
            </p>
            <p className="text-[2.25rem] font-bold tracking-tight leading-none" style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em', fontFamily: 'var(--font-mono, monospace)' }}>
              {overallProgress}%
            </p>
          </div>
          <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(139,92,246,0.10)', border: '1px solid rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6', flexShrink: 0 }}>
            <Target size={20} />
          </div>
        </div>
        <p className="text-xs font-medium text-violet-500 flex items-center gap-1 mt-4" style={{ opacity: 0.85 }}>
          <TrendingUp size={11} /> Curriculum Progress
        </p>
      </div>
    </div>
  );
});

/* ──────────────────────────────────────────────────────────
   3. Memoized Active Skill Programs List Component
   ────────────────────────────────────────────────────────── */
interface ActiveProgramsListProps {
  activeSkills: (StudentSkillAccess & { skill: Skill & { course: { name: string; branch: { name: string } } } })[];
  lessonCountsMap: Record<string, number>;
  getSkillProgress: (skillId: string) => number;
}

const ActiveProgramsList = memo(function ActiveProgramsList({
  activeSkills,
  lessonCountsMap,
  getSkillProgress,
}: ActiveProgramsListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-primary)',
          gap: '12px',
        }}
      >
        <div>
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Active Skill Programs
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Structured learning tracks with video lectures, code demonstrations, and post-lecture MCQs
          </p>
        </div>
        <Link href="/skills">
          <Button variant="ghost" size="sm" icon={<ArrowRight size={14} />}>
            View All Skills
          </Button>
        </Link>
      </div>

      {activeSkills.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={36} style={{ color: 'var(--text-tertiary)' }} />}
          title="No Active Skills Yet"
          description="Explore our curated engineering programs to enroll and start learning."
          action={
            <Link href="/explore">
              <Button size="md" icon={<Compass size={16} />}>
                Explore Skills Catalog
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="skill-programs-grid">
          {activeSkills.map((sa, idx) => {
            const progress = getSkillProgress(sa.skill_id);
            const lessonCount = lessonCountsMap[sa.skill_id] || 12;

            return (
              <div
                key={sa.id}
                className={`skill-card animate-fade-in stagger-${idx + 1}`}
              >
                {/* Top content grows to push footer down */}
                <div className="skill-card-content" style={{ gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <span className="text-xs font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider bg-blue-500/10 px-3 py-1 rounded-xl border border-blue-500/20">
                      {sa.skill?.course?.branch?.name || 'Computer Science'}
                    </span>
                    <Badge variant="info">Active Access</Badge>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold leading-snug mb-2" style={{ color: 'var(--text-primary)' }}>
                      {sa.skill?.name}
                    </h3>
                    <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      {sa.skill?.short_description || sa.skill?.description || 'Master core data abstractions, complexity analysis, and algorithmic implementations.'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', fontSize: 12, color: 'var(--text-tertiary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                      <PlayCircle size={15} className="text-blue-500" />
                      {lessonCount} Video Lessons
                    </span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                      <Clock size={15} className="text-amber-500" />
                      {sa.skill?.estimated_hours || 30} Hours
                    </span>
                  </div>
                </div>

                {/* Footer pinned to bottom */}
                <div className="skill-card-footer" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, fontWeight: 700, marginBottom: 8 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
                      <span className="text-blue-500 dark:text-blue-400" style={{ fontFamily: 'monospace' }}>{progress}%</span>
                    </div>
                    <ProgressBar value={progress} size="md" color="brand" />
                  </div>

                  <Link href={`/skills/${sa.skill_id}`} className="block">
                    <Button className="w-full justify-center text-sm font-bold" icon={<ArrowRight size={16} />}>
                      Continue Learning
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

/* ──────────────────────────────────────────────────────────
   Main StudentDashboardClient Page Component
   ────────────────────────────────────────────────────────── */
interface Props {
  profile: Profile;
  skillAccess: (StudentSkillAccess & { skill: Skill & { course: { name: string; branch: { name: string } } } })[];
  lessonProgress: LessonProgress[];
  lessonCounts: { skill_id: string; count: number }[];
  certificates: (Certificate & { skill: { name: string } })[];
  recentActivity: StudentActivity[];
  recommendedSkills: (Skill & { course: { name: string; branch: { name: string } } })[];
}

export default function StudentDashboardClient({
  profile,
  skillAccess,
  lessonProgress,
  lessonCounts,
  certificates,
  recentActivity,
  recommendedSkills,
}: Props) {
  // Memoized skill categorizations
  const activeSkills = useMemo(() => {
    return skillAccess.filter(sa => sa.status === 'active');
  }, [skillAccess]);

  const completedSkills = useMemo(() => {
    return skillAccess.filter(sa => sa.status === 'completed');
  }, [skillAccess]);

  // Fast O(1) map lookups for lessons and progress
  const lessonCountsMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const lc of lessonCounts) {
      map[lc.skill_id] = lc.count;
    }
    return map;
  }, [lessonCounts]);

  const completedLessonsBySkill = useMemo(() => {
    const map: Record<string, number> = {};
    for (const lp of lessonProgress) {
      if (lp.is_completed) {
        map[lp.skill_id] = (map[lp.skill_id] || 0) + 1;
      }
    }
    return map;
  }, [lessonProgress]);

  // Stable progress calculation callback
  const getSkillProgress = useCallback((skillId: string) => {
    const totalLessons = lessonCountsMap[skillId] || 0;
    const completedLessons = completedLessonsBySkill[skillId] || 0;
    return calculateProgress(completedLessons, totalLessons);
  }, [lessonCountsMap, completedLessonsBySkill]);

  // Overall progress calculations
  const totalLessonsAll = useMemo(() => {
    return lessonCounts.reduce((sum, lc) => sum + lc.count, 0);
  }, [lessonCounts]);

  const completedLessonsAll = useMemo(() => {
    return lessonProgress.filter(lp => lp.is_completed).length;
  }, [lessonProgress]);

  const overallProgress = useMemo(() => {
    return calculateProgress(completedLessonsAll, totalLessonsAll);
  }, [completedLessonsAll, totalLessonsAll]);

  const unlockedCerts = useMemo(() => {
    return certificates.filter(c => c.status === 'unlocked');
  }, [certificates]);

  return (
    <div
      className="page-container animate-fade-in pb-12"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '32px',
      }}
    >
      {/* 1. Memoized Hero Welcome Banner */}
      <WelcomeBanner
        profile={profile}
        activeSkill={activeSkills[0]}
        hasActiveSkills={activeSkills.length > 0}
        activeSkillsCount={activeSkills.length}
        overallProgress={overallProgress}
        completedLessonsAll={completedLessonsAll}
        totalLessonsAll={totalLessonsAll}
      />

      {/* 2. Memoized Key Metrics Stats Cards Grid */}
      <StatsCardsGrid
        activeCount={activeSkills.length}
        completedCount={completedSkills.length}
        unlockedCertsCount={unlockedCerts.length}
        overallProgress={overallProgress}
      />

      {/* 3. Memoized Active Skill Programs List */}
      <ActiveProgramsList
        activeSkills={activeSkills}
        lessonCountsMap={lessonCountsMap}
        getSkillProgress={getSkillProgress}
      />

      {/* 4. Lazy-loaded Dual Section: Activity Stream & Verified Certificates */}
      <ActivityAndCredentialsSection
        recentActivity={recentActivity}
        certificates={certificates}
      />

      {/* 5. Lazy-loaded Recommended Specialized Tracks */}
      <RecommendedTracksSection
        recommendedSkills={recommendedSkills}
      />
    </div>
  );
}
