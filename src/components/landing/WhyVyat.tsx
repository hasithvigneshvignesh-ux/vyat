'use client';

import React, { useRef, useState } from 'react';
import { Container, SectionHeader, Reveal } from './primitives';

interface WhyCardData {
  number: string;
  badge: string;
  title: string;
  bodyBefore: string;
  highlightText: string;
  bodyAfter: string;
  footerChip: string;
  accentGradient: string;
}

const WHY_CARDS: WhyCardData[] = [
  {
    number: '01',
    badge: '01 · College Timetable Friendly',
    title: '1 Daily Lesson Fits Your Schedule',
    bodyBefore: 'Indian engineering colleges enforce 75% mandatory attendance, long lab sessions, and internal assignments. Vyat’s ',
    highlightText: '1 lesson/day rhythm (15–25 mins)',
    bodyAfter: ' fits seamlessly into your evening routine without late-night burnout.',
    footerChip: '✓ Zero binge burnout · Steady progress',
    accentGradient: 'from-sky-500 to-indigo-500',
  },
  {
    number: '02',
    badge: '02 · Dual Syllabus Coverage',
    title: 'Semester GPA + Placement Coding',
    bodyBefore: 'You don’t have to sacrifice university marks to prepare for tech companies. Our courses cover both ',
    highlightText: 'university semester theoretical deep-dives',
    bodyAfter: ' (OS, DBMS, Computer Networks) and rigorous LeetCode coding patterns.',
    footerChip: '✓ Matches AKTU, VTU, Anna Univ & JNTU',
    accentGradient: 'from-indigo-500 to-violet-500',
  },
  {
    number: '03',
    badge: '03 · Modern Industry Tech',
    title: 'Full-Stack & Generative AI',
    bodyBefore: 'College syllabi rarely teach modern Next.js, TypeScript, cloud deployments, or Generative AI. Vyat brings ',
    highlightText: 'production engineering directly to your screen',
    bodyAfter: ' with hands-on projects recruiters love.',
    footerChip: '✓ 3 Full-stack & AI capstones',
    accentGradient: 'from-violet-500 to-rose-500',
  },
];

export function WhyVyat() {
  return (
    <section
      id="engineering-context"
      className="w-full landing-section relative border-b border-slate-200/70 dark:border-white/5"
    >
      <Container>
        <SectionHeader
          pillText="The Indian College Reality"
          title="Why Engineering Students Across India Choose Vyat"
          subtitle="College lectures and traditional online courses fail Indian engineering students in predictable ways: outdated syllabi and unmanageable 60-hour video dumps."
        />

        {/* ── 3 Stacked Cards on Mobile (16px gap), 3-col Grid on Desktop ── */}
        <div className="flex flex-col md:grid md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full">
          {WHY_CARDS.map((card, idx) => (
            <Reveal key={idx} delayMs={idx * 80} className="w-full h-full min-w-0">
              <div
                className="group relative h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0b1020] shadow-[0_2px_12px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.8)] transition-all duration-300 overflow-hidden min-w-0"
                style={{
                  padding: '22px',
                }}
              >
                {/* Animated Gradient Top Line */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${card.accentGradient} opacity-60 group-hover:opacity-100 group-hover:h-[3px] transition-all duration-300`}
                />

                {/* Faded Watermark Number in Top-Right Corner (z-0, opacity .08) */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-3.5 right-4 text-5xl sm:text-6xl font-black font-mono text-slate-900/[0.08] dark:text-white/[0.08] select-none z-0"
                >
                  {card.number}
                </span>

                <div className="relative z-10 min-w-0">
                  {/* Top Pill */}
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300 mb-3.5">
                    {card.badge}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-2.5 leading-snug">
                    {card.title}
                  </h3>

                  {/* Body with Animated Underlined Phrase */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {card.bodyBefore}
                    <strong className="relative font-semibold text-slate-900 dark:text-white inline-block">
                      {card.highlightText}
                      <span
                        aria-hidden="true"
                        className="absolute left-0 bottom-0.5 w-full h-[2px] bg-sky-500/40 dark:bg-sky-400/50 rounded-full"
                      />
                    </strong>
                    {card.bodyAfter}
                  </p>
                </div>

                {/* Footer Chip */}
                <div className="relative z-10 pt-3.5 mt-5 border-t border-slate-200/70 dark:border-white/5 flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 min-w-0">
                  <span className="text-sky-600 dark:text-sky-400 font-bold shrink-0">✓</span>
                  <span className="truncate">{card.footerChip.replace('✓ ', '')}</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
