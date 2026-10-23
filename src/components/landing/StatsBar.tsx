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
    <div className="relative w-full -mt-8 sm:-mt-12 lg:-mt-16 z-20">
      <Container>
        <Reveal delayMs={100}>
          <div className="w-full max-w-5xl mx-auto rounded-2xl sm:rounded-3xl p-1 bg-gradient-to-r from-sky-500/20 via-indigo-500/15 to-violet-500/20 shadow-[0_12px_40px_-10px_rgba(15,23,42,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="w-full rounded-[14px] sm:rounded-[22px] bg-white/90 dark:bg-[#0b1020]/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 p-4 sm:p-6 lg:p-8">
              {/* Responsive 2x2 grid on mobile, 4-in-a-row on md+ */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 sm:gap-y-0 text-left divide-y sm:divide-y-0 divide-slate-200/60 dark:divide-white/5 sm:divide-x sm:divide-slate-200/60 sm:dark:divide-white/5">
                {STATS.map((stat, idx) => (
                  <div
                    key={idx}
                    className={`group transition-transform duration-200 hover:-translate-y-0.5 ${
                      idx === 0
                        ? 'pr-3 sm:pr-4 sm:pl-0'
                        : idx === 1
                        ? 'pl-3 sm:px-4'
                        : idx === 2
                        ? 'pt-4 sm:pt-0 pr-3 sm:px-4'
                        : 'pt-4 sm:pt-0 pl-3 sm:pl-4 sm:pr-0'
                    }`}
                  >
                    <p
                      className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight ${
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
                    <p className="text-[11px] sm:text-xs lg:text-sm font-medium mt-1 sm:mt-1.5 leading-snug text-slate-500 dark:text-slate-400">
                      {stat.subtext}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </div>
  );
}
