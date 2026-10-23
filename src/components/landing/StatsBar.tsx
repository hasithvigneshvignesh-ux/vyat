'use client';

import React from 'react';
import { Container, CountUp, Reveal } from './primitives';

interface StatItem {
  numberText: string;
  isNumeric?: boolean;
  countEnd?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  subtext: string;
  highlight?: boolean;
}

const STATS: StatItem[] = [
  {
    numberText: '5 Pillars',
    isNumeric: true,
    countEnd: 5,
    suffix: ' Pillars',
    label: '5 Pillars',
    subtext: 'Placements, DSA, OS, Web & AI',
  },
  {
    numberText: '1 Video/Day',
    isNumeric: true,
    countEnd: 1,
    prefix: '',
    suffix: ' Video/Day',
    label: '1 Video/Day',
    subtext: 'Drip habit without burnout',
    highlight: true,
  },
  {
    numberText: 'Dual Syllabus',
    label: 'Dual Syllabus',
    subtext: 'Semester marks + Viva prep',
  },
  {
    numberText: '100% Verified',
    isNumeric: true,
    countEnd: 100,
    prefix: '',
    suffix: '% Verified',
    label: '100% Verified',
    subtext: 'Tamper-proof credentials',
    highlight: true,
  },
];

export function StatsBar() {
  return (
    <div className="relative w-full pt-2 pb-10 sm:pb-14 z-20">
      <Container>
        <Reveal delayMs={100}>
          <div className="w-full max-w-5xl mx-auto rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-[#0b1020]/85 backdrop-blur-xl shadow-[0_8px_30px_rgba(15,23,42,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden">
            {/* Responsive 2x2 grid on mobile, 4-in-a-row on md+ with equal cells */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-y divide-slate-200/70 dark:divide-white/10 md:divide-y-0 md:divide-x">
              {STATS.map((stat, idx) => (
                <div
                  key={idx}
                  className="group flex flex-col justify-center transition-all duration-200 hover:bg-slate-50/60 dark:hover:bg-white/[0.02]"
                  style={{
                    padding: 'clamp(20px, 3vw, 32px)',
                  }}
                >
                  <p
                    className={`text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight ${
                      stat.highlight
                        ? 'bg-clip-text text-transparent bg-gradient-to-r from-sky-600 to-indigo-600 dark:from-sky-400 dark:to-indigo-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {stat.isNumeric && stat.countEnd ? (
                      <CountUp
                        end={stat.countEnd}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        durationMs={1200 + idx * 200}
                      />
                    ) : (
                      stat.numberText
                    )}
                  </p>
                  <p className="text-xs sm:text-sm font-medium mt-1 sm:mt-1.5 leading-snug text-slate-500 dark:text-slate-400">
                    {stat.subtext}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
