'use client';

import React from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Cpu,
  Terminal,
  Globe,
  Sparkles,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Container, SectionHeader, SpotlightCard, Reveal } from './primitives';
import { CodeSymbols } from './CodeSymbols';

export interface PillarData {
  id: string;
  title: string;
  hook: string;
  category: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  highlights: string[];
  tag: string;
  accent: string;
  span2?: boolean;
}

export const PILLARS_LIST: PillarData[] = [
  {
    id: 'placements',
    title: 'Campus Placements & Interview Prep',
    hook: 'Master high-yield coding rounds and viva interviews for Indian product companies and top recruiters.',
    category: 'Placement Ready',
    icon: Briefcase,
    highlights: [
      'High-frequency LeetCode interview problem patterns',
      'Technical viva questions & core system design fundamentals',
      'Resume project walkthroughs & GitHub portfolio guidance',
    ],
    tag: 'Tier-1 Placements',
    accent: '#0ea5e9', // Sky
    span2: true,
  },
  {
    id: 'core-subjects',
    title: 'Core Subjects (OS, DBMS, Networks, OOP)',
    hook: 'Score top SGPA in semester exams and master fundamental theory tested in tech interview viva rounds.',
    category: 'University + GATE',
    icon: Cpu,
    highlights: [
      'OS: Process scheduling, paging & virtual memory',
      'DBMS: SQL queries, normalization, ACID properties & indexing',
      'Networks & OOP: TCP/IP stack & C++/Java design patterns',
    ],
    tag: 'AKTU · VTU · JNTU',
    accent: '#6366f1', // Indigo
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms (DSA)',
    hook: 'Build unshakeable intuition in algorithmic complexity and problem-solving patterns.',
    category: 'Problem Solving',
    icon: Terminal,
    highlights: [
      'Linear & non-linear structures: Trees, Graphs & Heaps',
      'Dynamic Programming, Greedy & Recursion blueprints',
      'Optimized implementations in C++, Java, and Python',
    ],
    tag: '100+ Problems',
    accent: '#8b5cf6', // Violet
  },
  {
    id: 'web-dev',
    title: 'Full-Stack Web Development',
    hook: 'Go from frontend fundamentals to scalable backend architecture with production-grade code.',
    category: 'Modern Tech Stack',
    icon: Globe,
    highlights: [
      'Modern TypeScript, React 19 & Next.js App Router',
      'Node.js, Express, REST APIs & JWT authentication',
      'PostgreSQL, Supabase & cloud production deployments',
    ],
    tag: 'Production Apps',
    accent: '#10b981', // Emerald
  },
  {
    id: 'ai-learning',
    title: 'Applied AI & Machine Learning',
    hook: 'Code-first AI curriculum built for CSE undergraduates from Python math to modern LLMs.',
    category: 'Cutting-Edge',
    icon: Sparkles,
    highlights: [
      'Python for AI: NumPy, Pandas, Scikit-learn & pipelines',
      'Neural networks, Deep Learning & PyTorch foundations',
      'Generative AI: Embeddings, Vector DBs & RAG pipelines',
    ],
    tag: 'Intelligent Apps',
    accent: '#f59e0b', // Amber
  },
  {
    id: 'systems-scale',
    title: 'Full B.Tech 4-Year Roadmap',
    hook: 'The complete structured roadmap designed to make you a top 1% engineer in your batch.',
    category: 'Systems & Scale',
    icon: GraduationCap,
    highlights: [
      '1 Video a day habit system with zero binge burnout',
      'Interactive concept checkpoints for every single lesson',
      'LinkedIn verifiable credentials with anti-cheat protection',
    ],
    tag: '4-Year Journey',
    accent: '#f43f5e', // Rose
    span2: true,
  },
];

export function PillarsBento() {
  return (
    <section id="curriculum" className="w-full landing-section relative [isolation:isolate] overflow-clip border-b border-slate-200/70 dark:border-white/5">
      {/* ── Background Code Symbols ── */}
      <CodeSymbols sectionId="pillars" />

      {/* Background ambient wash */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[140px] opacity-25 dark:opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.2) 0%, rgba(99, 102, 241, 0.1) 50%, transparent 75%)',
        }}
      />

      <Container className="relative z-10">
        <SectionHeader
          pillText="Comprehensive CSE Curriculums"
          title="5 Essential Pillars Every CSE Student Must Master"
          subtitle="Whether you are aiming for high-paying product company campus placements or scoring top SGPA in semester exams, Vyat covers the entire Computer Science Engineering roadmap."
        />

        {/* ── Explicit 6-Column Grid on Desktop (lg+), 2-Col on Tablet (md), 1-Col on Mobile ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-7 [grid-auto-flow:dense]">
          {PILLARS_LIST.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            const isRoadmap = pillar.id === 'systems-scale';
            const isTopRow = pillar.id === 'placements' || pillar.id === 'core-subjects';

            // Desktop span: Row 1 = 3 cols each; Row 2 = 2 cols each; Row 3 (Roadmap) = all 6 cols
            const spanClass = isRoadmap
              ? 'col-span-1 md:col-span-2 lg:col-span-6'
              : isTopRow
              ? 'col-span-1 md:col-span-1 lg:col-span-3'
              : 'col-span-1 md:col-span-1 lg:col-span-2';

            return (
              <Reveal key={pillar.id} delayMs={idx * 60} className={`h-full min-w-0 ${spanClass}`}>
                <SpotlightCard
                  accentColor={pillar.accent}
                  style={{ padding: 'clamp(20px, 2.5vw, 32px)' }}
                  className="group relative h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl transition-all duration-200 border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0b1020] min-w-0"
                >
                  {isRoadmap ? (
                    /* ── Wide Horizontal Layout for 4-Year Roadmap (Row 3 on lg, normal card on mobile) ── */
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 lg:gap-10 w-full h-full min-w-0">
                      {/* Left: Info & Meta */}
                      <div className="flex-1 max-w-xl min-w-0">
                        {/* Header Row: Icon + Category Tag */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm shrink-0"
                            style={{
                              backgroundColor: `${pillar.accent}15`,
                              borderColor: `${pillar.accent}35`,
                              borderWidth: '1px',
                              color: pillar.accent,
                            }}
                          >
                            <IconComponent size={22} />
                          </div>
                          <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-white/5 shrink-0">
                            {pillar.category}
                          </span>
                        </div>

                        {/* Title (18-20px with 12px under it) */}
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-3 leading-snug">
                          {pillar.title}
                        </h3>

                        {/* Description (14-15px) */}
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal mb-5">
                          {pillar.hook}
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400">
                            {pillar.tag}
                          </span>
                          <Link
                            href="/courses"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 shrink-0 group/link"
                            style={{ color: pillar.accent }}
                          >
                            <span>Explore Full Track</span>
                            <ArrowRight size={14} className="transition-transform duration-200 group-hover/link:translate-x-1" />
                          </Link>
                        </div>
                      </div>

                      {/* Right: 3 Checklist items (flex row with 18px icon and flex:1 min-w-0 text) */}
                      <div className="w-full lg:w-auto lg:min-w-[440px] pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-200/70 dark:border-white/5 lg:pl-8 min-w-0">
                        <ul className="flex flex-col gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium min-w-0">
                          {pillar.highlights.map((item, hIdx) => (
                            <li key={hIdx} className="flex items-start gap-2.5 bg-slate-50/80 dark:bg-white/[0.02] p-3 rounded-xl border border-slate-200/60 dark:border-white/5 min-w-0">
                              <CheckCircle2
                                size={18}
                                className="shrink-0 mt-0.5"
                                style={{ color: pillar.accent }}
                              />
                              <span className="flex-1 min-w-0 leading-snug break-words">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    /* ── Standard Card Layout (Rows 1 & 2) ── */
                    <div className="flex flex-col justify-between h-full min-w-0">
                      <div className="min-w-0">
                        {/* Top Row: Icon + Category Pill with wrapping */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center shadow-sm shrink-0"
                            style={{
                              backgroundColor: `${pillar.accent}15`,
                              borderColor: `${pillar.accent}35`,
                              borderWidth: '1px',
                              color: pillar.accent,
                            }}
                          >
                            <IconComponent size={22} />
                          </div>

                          <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-white/5 shrink-0">
                            {pillar.category}
                          </span>
                        </div>

                        {/* Title (18-20px with 12px under it) */}
                        <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-3 leading-snug">
                          {pillar.title}
                        </h3>

                        {/* Description (14-15px) */}
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5 font-normal">
                          {pillar.hook}
                        </p>

                        {/* Checklist with fixed 18px icon and flex:1 text */}
                        <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium mb-6 min-w-0">
                          {pillar.highlights.map((item, hIdx) => (
                            <li key={hIdx} className="flex items-start gap-2.5 min-w-0">
                              <CheckCircle2
                                size={18}
                                className="shrink-0 mt-0.5"
                                style={{ color: pillar.accent }}
                              />
                              <span className="flex-1 min-w-0 leading-snug break-words">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Card Bottom Meta & Explore CTA */}
                      <div className="pt-3.5 border-t border-slate-200/70 dark:border-white/5 flex items-center justify-between gap-3 mt-auto">
                        <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 truncate max-w-[150px] sm:max-w-none">
                          {pillar.tag}
                        </span>

                        <Link
                          href="/courses"
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors duration-200 shrink-0 group/link"
                          style={{ color: pillar.accent }}
                        >
                          <span>Explore Track</span>
                          <ArrowRight
                            size={14}
                            className="transition-transform duration-200 group-hover/link:translate-x-1"
                          />
                        </Link>
                      </div>
                    </div>
                  )}
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
