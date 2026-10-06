'use client';

import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import EmptyState from '@/components/ui/EmptyState';
import {
  Compass, BookOpen, ArrowRight, GraduationCap,
  Clock, Layers, CheckCircle2,
} from 'lucide-react';

interface CourseData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  sort_order: number;
  branch?: { name: string; slug?: string; icon?: string };
  skills: {
    id: string;
    name: string;
    short_description: string | null;
    difficulty: string;
    estimated_hours: number | null;
    sort_order: number;
  }[];
  _skillCount: number;
  _activeCount: number;
  _completedCount: number;
}

interface Props {
  courses: CourseData[];
}

/* ── Gradient palette per course index ── */
const GRADIENTS = [
  'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
  'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
  'linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)',
  'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
  'linear-gradient(135deg, #dc2626 0%, #e11d48 100%)',
];

const GLOW_COLORS = [
  'rgba(37,99,235,0.15)',
  'rgba(5,150,105,0.15)',
  'rgba(217,70,239,0.15)',
  'rgba(234,88,12,0.15)',
  'rgba(2,132,199,0.15)',
  'rgba(220,38,38,0.15)',
];

export default function ClassesClient({ courses }: Props) {
  if (courses.length === 0) {
    return (
      <div className="page-container">
        <div style={{ marginBottom: 32 }}>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>My Classes</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Your active courses and learning programs
          </p>
        </div>
        <EmptyState
          icon={<Compass size={32} style={{ color: 'var(--text-tertiary)' }} />}
          title="No Active Classes"
          description="You don't have any active courses yet. Ask your mentor to activate a skill to get started."
        />
      </div>
    );
  }

  const totalSkills = courses.reduce((s, c) => s + c._skillCount, 0);
  const totalCompleted = courses.reduce((s, c) => s + c._completedCount, 0);

  return (
    <div className="min-h-screen bg-[#F7F9FC] dark:bg-slate-950 text-[#172033] dark:text-slate-100 p-6 sm:p-10 lg:p-12 transition-colors">
      <div className="w-full flex-1 md:px-4 lg:px-6 xl:px-10 mx-auto max-w-[1800px] animate-fade-in">
        {/* ── Header ── */}
        <div className="mb-6">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: 'linear-gradient(135deg, #4F7CFF, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(79,124,255,0.25)',
            }}>
              <GraduationCap size={22} color="#fff" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#172033] dark:text-white">My Classes</h1>
              <p className="text-sm text-[#667085] dark:text-slate-400">
                {courses.length} active course{courses.length !== 1 ? 's' : ''} · {totalSkills} module{totalSkills !== 1 ? 's' : ''} enrolled
              </p>
            </div>
          </div>
        </div>

        {/* ── Quick Stats (Courses, Active Modules, Completed) ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 16,
            marginBottom: 48,
          }}
        >
          {[
            { label: 'Courses', value: courses.length, icon: <Layers size={18} />, color: '#4F7CFF' },
            { label: 'Active Modules', value: totalSkills - totalCompleted, icon: <BookOpen size={18} />, color: '#f59e0b' },
            { label: 'Completed', value: totalCompleted, icon: <CheckCircle2 size={18} />, color: '#10b981' },
          ].map((stat) => (
            <div key={stat.label} style={{
              padding: '16px 20px',
              borderRadius: 16,
              border: '1px solid var(--border-primary)',
              backgroundColor: 'var(--bg-card)',
              display: 'flex', alignItems: 'center', gap: 14,
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                backgroundColor: `${stat.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: stat.color,
              }}>
                {stat.icon}
              </div>
              <div>
                <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
                  {stat.value}
                </p>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Section Title: Enrolled Courses ── */}
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            Active Courses & Programs
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 2 }}>
            Choose a course to explore its syllabus, modules, and video lectures
          </p>
        </div>

        {/* ── Course Cards Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 24,
        }}>
        {courses.map((course, idx) => {
          const gradient = GRADIENTS[idx % GRADIENTS.length];
          const glow = GLOW_COLORS[idx % GLOW_COLORS.length];
          const progress = course._skillCount > 0
            ? Math.round((course._completedCount / course._skillCount) * 100)
            : 0;

          return (
            <Link
              key={course.id}
              href={`/classes/${course.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                className="animate-fade-in"
                style={{
                  borderRadius: 20,
                  border: '1px solid var(--border-primary)',
                  backgroundColor: 'var(--bg-card)',
                  overflow: 'hidden',
                  transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
                  cursor: 'pointer',
                  animationDelay: `${idx * 80}ms`,
                  animationFillMode: 'backwards',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = `0 12px 40px ${glow}`;
                  e.currentTarget.style.borderColor = 'var(--border-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'var(--border-primary)';
                }}
              >
                {/* ── Gradient Header Strip ── */}
                <div style={{
                  height: 8,
                  background: gradient,
                }} />

                {/* ── Content ── */}
                <div style={{ padding: '24px 24px 20px' }}>
                  {/* Branch + Skills count */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <Badge variant="info">
                      {course.branch?.icon && <span style={{ marginRight: 4 }}>{course.branch.icon}</span>}
                      {course.branch?.name || 'General'}
                    </Badge>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
                      {course._skillCount} module{course._skillCount !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Course name */}
                  <h3 style={{
                    fontSize: 17, fontWeight: 700,
                    color: 'var(--text-primary)',
                    lineHeight: 1.35,
                    marginBottom: 6,
                  }}>
                    {course.name}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: 13, color: 'var(--text-tertiary)',
                    lineHeight: 1.5, marginBottom: 16,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {course.description || 'Structured learning path with video lectures and assessments.'}
                  </p>

                  {/* Progress */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                        Progress
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: progress === 100 ? '#10b981' : '#3b82f6' }}>
                        {progress}%
                      </span>
                    </div>
                    <ProgressBar
                      value={progress}
                      size="sm"
                      color={progress === 100 ? 'success' : 'brand'}
                    />
                  </div>

                  {/* Footer */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    paddingTop: 14,
                    borderTop: '1px solid var(--border-primary)',
                  }}>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {course._activeCount > 0 && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#3b82f6', fontWeight: 600 }}>
                          <BookOpen size={13} /> {course._activeCount} active
                        </span>
                      )}
                      {course._completedCount > 0 && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#10b981', fontWeight: 600 }}>
                          <CheckCircle2 size={13} /> {course._completedCount} done
                        </span>
                      )}
                    </div>
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      fontSize: 12, fontWeight: 700, color: '#3b82f6',
                    }}>
                      Open <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      </div>
    </div>
  );
}
