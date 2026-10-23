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
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const scrollLeft = carouselRef.current.scrollLeft;
    const width = carouselRef.current.offsetWidth * 0.85;
    const index = Math.round(scrollLeft / width);
    setActiveSlide(Math.min(Math.max(index, 0), WHY_CARDS.length - 1));
  };

  const scrollToSlide = (index: number) => {
    if (!carouselRef.current) return;
    const width = carouselRef.current.offsetWidth * 0.85;
    carouselRef.current.scrollTo({
      left: index * width,
      behavior: 'smooth',
    });
    setActiveSlide(index);
  };

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

        {/* ── Mobile: Scroll-Snap Carousel (with visible peek of next card) | Desktop: 3-col Grid ── */}
        <div className="relative">
          {/* Scroll container on mobile (<md), standard 3-col grid on lg+ */}
          <div
            ref={carouselRef}
            onScroll={handleScroll}
            className="flex md:grid md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-0 scrollbar-none"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {WHY_CARDS.map((card, idx) => (
              <div
                key={idx}
                className="w-[85vw] max-w-[340px] md:w-auto md:max-w-none shrink-0 snap-center md:shrink flex flex-col"
              >
                <Reveal delayMs={idx * 100} className="h-full">
                  <div className="group relative h-full flex flex-col justify-between rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0b1020]/75 backdrop-blur-xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.8)] transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.99] overflow-hidden">
                    {/* Animated Gradient Top Line */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${card.accentGradient} opacity-60 group-hover:opacity-100 group-hover:h-[3px] transition-all duration-300`}
                    />

                    {/* Oversized Faded Number in Background */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-4 -right-2 text-7xl sm:text-8xl font-black font-mono text-slate-900/[0.03] dark:text-white/[0.04] select-none group-hover:text-slate-900/[0.06] dark:group-hover:text-white/[0.08] transition-colors duration-300"
                    >
                      {card.number}
                    </span>

                    <div className="relative z-10">
                      {/* Top Pill */}
                      <span className="inline-block px-3 py-1 text-[11px] sm:text-xs font-semibold rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300 mb-4">
                        {card.badge}
                      </span>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-3 leading-snug">
                        {card.title}
                      </h3>

                      {/* Body with Animated Underlined Phrase */}
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
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
                    <div className="relative z-10 pt-4 mt-6 border-t border-slate-200/70 dark:border-white/5 flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                      <span className="text-sky-600 dark:text-sky-400 font-bold shrink-0">✓</span>
                      <span className="truncate">{card.footerChip.replace('✓ ', '')}</span>
                    </div>
                  </div>
                </Reveal>
              </div>
            ))}
          </div>

          {/* Dots Indicator for Mobile Carousel */}
          <div className="flex md:hidden justify-center items-center gap-2 mt-4" aria-hidden="true">
            {WHY_CARDS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeSlide === idx ? 'w-6 bg-sky-600 dark:bg-sky-400' : 'w-2 bg-slate-300 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
