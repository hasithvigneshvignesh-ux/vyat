'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';
import { Container, TiltCard, useMediaQuery, useReducedMotion } from './primitives';

export function Hero() {
  const isFinePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reducedMotion = useReducedMotion();
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const [ctaOffset, setCtaOffset] = useState({ x: 0, y: 0 });

  // Magnetic CTA for desktop pointer
  const handleCtaMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isFinePointer || reducedMotion || !ctaRef.current) return;
    const rect = ctaRef.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * 0.22;
    const y = (e.clientY - (rect.top + rect.height / 2)) * 0.22;
    setCtaOffset({ x, y });
  };

  const handleCtaMouseLeave = () => {
    setCtaOffset({ x: 0, y: 0 });
  };

  return (
    <section className="relative w-full overflow-hidden pt-10 sm:pt-16 lg:pt-24 pb-20 sm:pb-28 lg:pb-36">
      {/* ── Background Aurora Mesh (Drifting CSS Gradient) ── */}
      <div
        className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] lg:w-[1200px] h-[500px] sm:h-[650px] lg:h-[800px] rounded-full blur-[90px] sm:blur-[130px] opacity-60 dark:opacity-40 animate-aurora-drift"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(14, 165, 233, 0.28) 0%, rgba(99, 102, 241, 0.2) 40%, rgba(139, 92, 246, 0.12) 70%, transparent 85%)',
        }}
      />

      {/* ── Additional Secondary Accent Wash ── */}
      <div
        className="pointer-events-none absolute top-40 -right-20 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-[100px] opacity-35 dark:opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
        }}
      />

      {/* ── Faint Grid Pattern with Radial Vignette ── */}
      <div
        className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-60 dark:opacity-30"
        style={{
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 35%, black 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 35%, black 20%, transparent 75%)',
        }}
      />

      {/* ── Floating Code Symbols at Low Opacity ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-28 left-[6%] text-xl sm:text-2xl font-mono font-bold text-sky-500/20 dark:text-sky-400/15 animate-float select-none hidden sm:block"
        style={{ animationDuration: '7s' }}
      >
        {'{ }'}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-48 right-[8%] text-xl sm:text-2xl font-mono font-bold text-indigo-500/20 dark:text-indigo-400/15 animate-float select-none hidden sm:block"
        style={{ animationDuration: '9s', animationDelay: '1.5s' }}
      >
        {'</>'}
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-40 left-[10%] text-sm sm:text-base font-mono font-bold text-violet-500/20 dark:text-violet-400/15 animate-float select-none hidden lg:block"
        style={{ animationDuration: '8s', animationDelay: '2.5s' }}
      >
        O(n)
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-52 right-[12%] text-sm sm:text-base font-mono font-bold text-sky-500/20 dark:text-sky-400/15 animate-float select-none hidden lg:block"
        style={{ animationDuration: '10s', animationDelay: '0.8s' }}
      >
        {'const [drip] = vyat;'}
      </div>

      <Container className="relative z-10 flex flex-col items-center text-center">
        {/* ── Conic Gradient Rotating Badge ── */}
        <div className="relative inline-flex items-center p-[1px] rounded-full mb-6 group cursor-default max-w-full">
          {/* Animated Conic Border */}
          <div
            className="absolute inset-0 rounded-full animate-rotate-conic opacity-70 group-hover:opacity-100 transition-opacity"
            style={{
              background:
                'conic-gradient(from 0deg, #f59e0b, #0ea5e9, #6366f1, #8b5cf6, #f59e0b)',
            }}
          />
          {/* Inner Badge Content */}
          <div className="relative flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full bg-white/90 dark:bg-[#07090e]/90 backdrop-blur-md text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm leading-tight text-center">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="text-amber-500 dark:text-amber-400 font-bold shrink-0">⚡</span>
            <span className="text-balance">
              #1 Learning Platform for CSE Students in India
            </span>
          </div>
        </div>

        {/* ── Fluid H1 Headline ── */}
        <h1 className="font-fluid-h1 font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto mb-5 sm:mb-6 leading-[1.12] text-balance">
          Master Computer Science.
          <span className="block mt-1 sm:mt-2 bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 dark:from-sky-400 dark:via-indigo-300 dark:to-violet-400">
            Ace Placements &amp; Semester Exams.
          </span>
        </h1>

        {/* ── Body Subtitle ── */}
        <p className="font-fluid-body text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 font-normal text-pretty">
          Built specifically for Indian B.Tech / BE engineering students. Fast-track campus
          placements and university exams with structured daily drip lessons in Core CS, DSA, Web
          Dev, and AI.
        </p>

        {/* ── Dual CTA Action Row (Stacked on Mobile, Inline on Desktop) ── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto mb-12 sm:mb-16">
          <Link
            href="/explore"
            ref={ctaRef}
            onMouseMove={handleCtaMouseMove}
            onMouseLeave={handleCtaMouseLeave}
            id="hero-cta-explore"
            className="w-full sm:w-auto group relative"
            style={{
              transform: `translate3d(${ctaOffset.x}px, ${ctaOffset.y}px, 0)`,
              transition: isFinePointer && (ctaOffset.x !== 0 || ctaOffset.y !== 0) ? 'none' : 'transform 0.25s ease-out',
            }}
          >
            <button className="w-full sm:w-auto min-h-[48px] px-7 py-3.5 bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-[0_4px_16px_rgba(14,165,233,0.35)] hover:shadow-[0_6px_24px_rgba(14,165,233,0.5)] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5 text-sm sm:text-base cursor-pointer">
              <span>Browse All CSE Courses</span>
              <ArrowRight
                size={17}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>
          </Link>

          <Link href="/login" id="hero-cta-login" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto min-h-[48px] px-7 py-3.5 font-semibold rounded-xl border border-slate-300/80 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-100 backdrop-blur-md shadow-2xs hover:shadow-xs transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer">
              Student Sign In
            </button>
          </Link>
        </div>

        {/* ── Floating Product Preview Card (3D Tilt on Desktop, Clean Static/Float on Mobile) ── */}
        <div className="w-full max-w-4xl mx-auto px-1 sm:px-4">
          <TiltCard maxTiltDeg={5} className="w-full">
            <div className="w-full rounded-2xl sm:rounded-3xl p-1 bg-gradient-to-b from-sky-500/20 via-indigo-500/10 to-transparent shadow-[0_20px_60px_-15px_rgba(14,165,233,0.15)] dark:shadow-[0_25px_70px_-20px_rgba(0,0,0,0.8)]">
              <div className="w-full rounded-[14px] sm:rounded-[22px] bg-white/90 dark:bg-[#0b1020]/90 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 p-3.5 sm:p-6 text-left overflow-hidden">
                {/* Preview Window Header */}
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-200/70 dark:border-white/5 mb-4">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="text-[11px] sm:text-xs font-mono text-slate-400 dark:text-slate-500 ml-2 truncate">
                      vyat-curriculum // daily-drip-engine.ts
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Day 14 Active
                    </span>
                  </div>
                </div>

                {/* Preview Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Left: Code / Algorithm Snippet */}
                  <div className="md:col-span-7 bg-slate-900 text-slate-200 rounded-xl p-3.5 sm:p-4 font-mono text-[11px] sm:text-xs leading-relaxed border border-slate-800 shadow-inner">
                    <div className="text-slate-500">// Track: Data Structures &amp; Algorithms (DSA)</div>
                    <div className="text-sky-400 font-semibold mt-1">
                      function <span className="text-indigo-300">maxPlacementWater</span>(height: number[]): number &#123;
                    </div>
                    <div className="pl-3 sm:pl-4 text-slate-400">
                      let left = 0, right = height.length - 1;
                    </div>
                    <div className="pl-3 sm:pl-4 text-emerald-400">
                      // Two-pointer pattern: O(n) Time · O(1) Space
                    </div>
                    <div className="pl-3 sm:pl-4 text-slate-300">
                      while (left &lt; right) &#123; /* optimal swap */ &#125;
                    </div>
                    <div className="text-sky-400">&#125;</div>
                    <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                      <span>✓ Passed 18/18 LeetCode test cases</span>
                      <span className="text-sky-400 font-bold">100% Match</span>
                    </div>
                  </div>

                  {/* Right: Quick Checkpoint Card */}
                  <div className="md:col-span-5 flex flex-col justify-between gap-3 bg-slate-50 dark:bg-white/[0.03] p-3.5 sm:p-4 rounded-xl border border-slate-200/80 dark:border-white/5">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                        Interactive Checkpoint
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5 leading-snug">
                        Why does two-pointer eliminate O(n²) brute force?
                      </h3>
                      <div className="mt-2.5 space-y-1.5 text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                          <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                          <span>Greedily contracts the smaller boundary</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                          <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                          <span>Guaranteed single pass through array</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/70 dark:border-white/5 flex items-center justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      <span>Daily Drip: 20 min</span>
                      <span className="text-amber-500 font-bold flex items-center gap-1">
                        🔥 14-day habit streak
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </Container>
    </section>
  );
}
