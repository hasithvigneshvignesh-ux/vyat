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
    <section id="curriculum" className="w-full landing-section relative border-b border-slate-200/70 dark:border-white/5">
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
              <Reveal key={pillar.id} delayMs={idx * 60} className={`h-full ${spanClass}`}>
                <SpotlightCard
                  accentColor={pillar.accent}
                  className="group relative h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.99] border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0b1020]/75 backdrop-blur-xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.8)] overflow-hidden"
                >
                  {/* Subtle Accent Glow Ring in Card Corner */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                    style={{ backgroundColor: pillar.accent }}
                  />

                  {isRoadmap ? (
                    /* ── Wide Horizontal Layout for 4-Year Roadmap (Row 3, 6 cols) ── */
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 lg:gap-10 w-full h-full">
                      {/* Left: Info & Meta */}
                      <div className="flex-1 max-w-xl">
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm shrink-0"
                            style={{
                              backgroundColor: `${pillar.accent}15`,
                              borderColor: `${pillar.accent}35`,
                              borderWidth: '1px',
                              color: pillar.accent,
                            }}
                          >
                            <IconComponent size={22} />
                          </div>
                          <span className="px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-lg bg-slate-100/80 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-white/5">
                            {pillar.category}
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 leading-snug">
                          {pillar.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal mb-4">
                          {pillar.hook}
                        </p>

                        <div className="flex items-center gap-3">
                          <span className="text-[10px] sm:text-xs font-mono font-medium px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400">
                            {pillar.tag}
                          </span>
                          <Link
                            href="/explore"
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors duration-200 shrink-0 group/link"
                            style={{ color: pillar.accent }}
                          >
                            <span>Explore Full Track</span>
                            <ArrowRight size={14} className="transition-transform duration-200 group-hover/link:translate-x-1" />
                          </Link>
                        </div>
                      </div>

                      {/* Right: 3 Checklist items in a row on lg */}
                      <div className="w-full lg:w-auto lg:min-w-[460px] pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-200/70 dark:border-white/5 lg:pl-8">
                        <ul className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                          {pillar.highlights.map((item, hIdx) => (
                            <li key={hIdx} className="flex items-start gap-2.5 bg-slate-50/70 dark:bg-white/[0.02] p-2.5 rounded-xl border border-slate-200/60 dark:border-white/5">
                              <CheckCircle2
                                size={16}
                                className="shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110"
                                style={{ color: pillar.accent }}
                              />
                              <span className="leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    /* ── Standard Card Layout (Rows 1 & 2) ── */
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        {/* Top Row: Icon with Gradient Glow + Category Pill */}
                        <div className="flex items-center justify-between mb-4 sm:mb-5">
                          <div
                            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm shrink-0"
                            style={{
                              backgroundColor: `${pillar.accent}15`,
                              borderColor: `${pillar.accent}35`,
                              borderWidth: '1px',
                              color: pillar.accent,
                            }}
                          >
                            <IconComponent size={22} />
                          </div>

                          <span className="px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-lg bg-slate-100/80 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-white/5">
                            {pillar.category}
                          </span>
                        </div>

                        {/* Title & Hook */}
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 leading-snug">
                          {pillar.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5 font-normal line-clamp-3 sm:line-clamp-none">
                          {pillar.hook}
                        </p>

                        {/* Checklist with animated/glowing icons */}
                        <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium mb-6">
                          {pillar.highlights.map((item, hIdx) => (
                            <li key={hIdx} className="flex items-start gap-2.5">
                              <CheckCircle2
                                size={16}
                                className="shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110"
                                style={{ color: pillar.accent }}
                              />
                              <span className="leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Card Bottom Meta & Explore CTA */}
                      <div className="pt-4 border-t border-slate-200/70 dark:border-white/5 flex items-center justify-between gap-3 mt-auto">
                        <span className="text-[10px] sm:text-xs font-mono font-medium px-2.5 py-1 rounded-md border border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 truncate max-w-[150px] sm:max-w-none">
                          {pillar.tag}
                        </span>

                        <Link
                          href="/explore"
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
