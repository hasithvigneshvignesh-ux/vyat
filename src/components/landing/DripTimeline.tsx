'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Container, SectionHeader, Reveal, useReducedMotion } from './primitives';
import { CodeSymbols } from './CodeSymbols';

interface StepData {
  step: number;
  title: string;
  description: string;
  badge: string;
  accentGradient: string;
}

const STEPS: StepData[] = [
  {
    step: 1,
    title: '1 Video Per Day',
    description: 'New video lessons release daily. Prevents bingeing and forgetting, building rock-solid recall.',
    badge: 'Daily Drip',
    accentGradient: 'from-sky-500 to-indigo-500',
  },
  {
    step: 2,
    title: 'Placement Coding',
    description: 'Step-by-step problem breakdowns that mimic the exact coding rounds used by leading recruiters.',
    badge: 'Code Pattern',
    accentGradient: 'from-indigo-500 to-violet-500',
  },
  {
    step: 3,
    title: 'Interactive MCQs',
    description: 'Instant checkpoints and concept tests after every lesson to verify understanding immediately.',
    badge: 'Active Recall',
    accentGradient: 'from-violet-500 to-emerald-500',
  },
  {
    step: 4,
    title: 'Verified Credentials',
    description: 'Tamper-proof verifiable certificates issued only when the full curriculum is completed.',
    badge: 'Proof of Work',
    accentGradient: 'from-emerald-500 to-sky-500',
  },
];

export function DripTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lineProgress, setLineProgress] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setLineProgress(1);
      return;
    }

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const visible = windowHeight - rect.top;
      const total = rect.height + windowHeight * 0.4;
      const progress = Math.min(Math.max(visible / total, 0), 1);
      setLineProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [reducedMotion]);

  return (
    <section id="advantages" className="w-full landing-section relative [isolation:isolate] overflow-clip border-b border-slate-200/70 dark:border-white/5">
      {/* ── Background Code Symbols ── */}
      <CodeSymbols sectionId="timeline" />

      <Container>
        <SectionHeader
          pillText="Engineered for Long-Term Retention"
          title="How Daily Drip Learning Guarantees Mastery"
          subtitle="Consistency beats 40-hour weekend marathons every single time."
        />

        <div ref={containerRef} className="relative mt-8 sm:mt-12">
          {/* ── Desktop Connecting Line (lg+ only) ── */}
          <div className="hidden lg:block absolute top-6 left-[10%] right-[10%] h-[2px] bg-slate-200 dark:bg-slate-800 z-0 pointer-events-none">
            <div
              className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${lineProgress * 100}%` }}
            />
          </div>

          {/* ── Mobile & Tablet: Strict Vertical Timeline (<lg) ── */}
          <div className="flex flex-col gap-4 sm:gap-5 lg:hidden">
            {STEPS.map((item, idx) => {
              const isLast = idx === STEPS.length - 1;
              return (
                <Reveal key={idx} delayMs={idx * 80} className="w-full">
                  <div className="flex items-start gap-3 w-full">
                    {/* Left Column (44px wide with 36px circular badge and vertical line) */}
                    <div className="w-[44px] shrink-0 flex flex-col items-center relative self-stretch">
                      {/* 36px Circular Badge */}
                      <div
                        className={`w-9 h-9 rounded-full font-bold text-sm flex items-center justify-center text-white bg-gradient-to-tr ${item.accentGradient} shadow-sm z-10 ring-4 ring-slate-50 dark:ring-[#05070f] shrink-0`}
                      >
                        {item.step}
                      </div>

                      {/* Connecting Line connecting badge to badge */}
                      {!isLast && (
                        <div className="w-[2px] bg-slate-200 dark:bg-slate-800 absolute top-9 bottom-[-16px] left-1/2 -translate-x-1/2 z-0" />
                      )}
                    </div>

                    {/* Right Column: Card (Padded 18-20px, flex: 1, min-w-0, never covered by badge) */}
                    <div
                      className="flex-1 min-w-0 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0b1020] shadow-[0_2px_12px_rgba(15,23,42,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] p-5 flex flex-col justify-between min-h-[150px]"
                    >
                      <div>
                        <div className="inline-block px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-md bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 mb-2 border border-slate-200/60 dark:border-white/5">
                          {item.badge}
                        </div>
                        {/* Title: 18px */}
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 leading-snug">
                          {item.title}
                        </h3>
                        {/* Description: 14-15px */}
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-3 mt-4 border-t border-slate-200/70 dark:border-white/5 flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 font-semibold">
                        <span>Phase 0{item.step} of 04</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* ── Desktop Horizontal 4-Column Grid (lg+) ── */}
          <div className="hidden lg:grid grid-cols-4 gap-7 relative z-10">
            {STEPS.map((item, idx) => (
              <Reveal key={idx} delayMs={idx * 80} className="h-full">
                <div
                  className="group relative h-full min-h-[280px] flex flex-col justify-between rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#0b1020] shadow-[0_2px_12px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.8)] transition-all duration-300 hover:-translate-y-1.5 p-7"
                >
                  <div>
                    {/* Step Number Badge */}
                    <div className="mb-5 z-10">
                      <div
                        className={`w-12 h-12 rounded-xl font-bold text-lg flex items-center justify-center text-white bg-gradient-to-tr ${item.accentGradient} shadow-md group-hover:scale-110 transition-transform duration-200 ring-4 ring-white dark:ring-[#0b1020]`}
                      >
                        {item.step}
                      </div>
                    </div>

                    <div className="inline-block px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded-md bg-slate-100/90 dark:bg-white/5 text-slate-700 dark:text-slate-300 mb-2 border border-slate-200/60 dark:border-white/5">
                      {item.badge}
                    </div>

                    {/* Title: 18-20px */}
                    <h3 className="font-bold text-lg lg:text-xl text-slate-900 dark:text-white mb-2.5 leading-snug">
                      {item.title}
                    </h3>

                    {/* Description: 14-15px */}
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3.5 mt-5 border-t border-slate-200/70 dark:border-white/5 flex items-center gap-1.5 text-xs text-sky-600 dark:text-sky-400 font-semibold">
                    <span>Phase 0{item.step} of 04</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
