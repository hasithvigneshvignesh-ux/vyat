'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Container, SectionHeader, Reveal, useReducedMotion } from './primitives';

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
    <section id="advantages" className="w-full landing-section relative border-b border-slate-200/70 dark:border-white/5">
      <Container>
        <SectionHeader
          pillText="Engineered for Long-Term Retention"
          title="How Daily Drip Learning Guarantees Mastery"
          subtitle="Consistency beats 40-hour weekend marathons every single time."
        />

        <div ref={containerRef} className="relative mt-8 sm:mt-12">
          {/* ── Desktop Connecting Line (lg+) ── */}
          <div className="hidden lg:block absolute top-[52px] left-[6%] right-[6%] h-[2px] bg-slate-200 dark:bg-slate-800 z-0">
            <div
              className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${lineProgress * 100}%` }}
            />
          </div>

          {/* ── Mobile Connecting Line (Vertical on Left, <md) ── */}
          <div className="block md:hidden absolute top-8 bottom-8 left-6 w-[2px] bg-slate-200 dark:bg-slate-800 z-0">
            <div
              className="w-full bg-gradient-to-b from-sky-500 via-indigo-500 to-emerald-500 transition-all duration-300"
              style={{ height: `${lineProgress * 100}%` }}
            />
          </div>

          {/* ── Timeline Grid: Vertical list on base -> 2x2 on md -> Horizontal 4-col on lg ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-6 lg:gap-8 relative z-10">
            {STEPS.map((item, idx) => (
              <Reveal key={idx} delayMs={idx * 80} className="h-full">
                <div className="group relative h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#0b1020]/70 backdrop-blur-xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.8)] transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.99] pl-16 sm:pl-7">
                  <div>
                    {/* Step Number Badge */}
                    <div className="absolute left-3.5 top-6 sm:static sm:left-auto sm:top-auto mb-4 sm:mb-5">
                      <div
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center text-white bg-gradient-to-tr ${item.accentGradient} shadow-sm group-hover:scale-110 transition-transform duration-200`}
                      >
                        {item.step}
                      </div>
                    </div>

                    <div className="inline-block px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 mb-2">
                      {item.badge}
                    </div>

                    <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white mb-2 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-4 border-t border-slate-200/70 dark:border-white/5 flex items-center gap-1.5 text-[11px] text-sky-600 dark:text-sky-400 font-semibold">
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
