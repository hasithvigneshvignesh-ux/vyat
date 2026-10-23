'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Container, Reveal } from './primitives';

export function FinalCta() {
  return (
    <section className="w-full landing-section relative overflow-hidden border-b border-slate-200/70 dark:border-white/5">
      {/* Background Gradient Mesh Panel */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(14, 165, 233, 0.25) 0%, rgba(99, 102, 241, 0.2) 40%, transparent 75%)',
        }}
      />

      {/* Floating Glow Orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/4 w-72 h-72 rounded-full blur-[100px] bg-sky-500/20 opacity-50 dark:opacity-30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-1/4 w-72 h-72 rounded-full blur-[100px] bg-indigo-500/20 opacity-50 dark:opacity-30"
      />

      {/* Faint Grid Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40 dark:opacity-20"
        style={{
          maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent 80%)',
        }}
      />

      <Container className="relative z-10 w-full mx-auto">
        <Reveal>
          {/* ── Closing Hero Panel (Step 3: max-w-[1100px], padding clamp(40px, 6vw, 88px)) ── */}
          <div
            className="w-full max-w-[1100px] mx-auto rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/85 dark:bg-[#0b1020]/85 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(14,165,233,0.15)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.8)] text-center relative overflow-hidden"
            style={{
              padding: 'clamp(40px, 6vw, 88px)',
            }}
          >
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300 mb-6 shadow-2xs">
              <span className="text-amber-500">⚡</span>
              <span>Accelerate Your Career</span>
            </div>

            {/* H2 Title (2-3 lines max on mobile) */}
            <h2
              className="font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 sm:mb-5 leading-tight text-balance"
              style={{ fontSize: 'clamp(1.85rem, 4.2vw, 3.25rem)' }}
            >
              Ready to Master Computer Science?
            </h2>

            {/* Subtitle (max-width 560px centered) */}
            <p className="text-slate-600 dark:text-slate-300 max-w-[560px] mx-auto mb-8 sm:mb-10 leading-relaxed font-normal text-pretty text-sm sm:text-base">
              Join thousands of engineering students across India mastering core computer science,
              DSA, Web Dev, and AI to secure top engineering placements.
            </p>

            {/* Dual CTAs (16px gap, stacked full-width on mobile, centered inline on desktop) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto">
              <Link href="/explore" className="w-full sm:w-auto group">
                <button className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-[0_4px_16px_rgba(14,165,233,0.35)] hover:shadow-[0_6px_24px_rgba(14,165,233,0.5)] transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2.5 text-sm sm:text-base cursor-pointer">
                  <span>Explore All CSE Courses</span>
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </button>
              </Link>

              <Link href="/login" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 font-semibold rounded-xl border border-slate-300/80 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-slate-100 backdrop-blur-md shadow-2xs hover:shadow-xs transition-all duration-200 active:scale-[0.98] text-sm sm:text-base cursor-pointer">
                  Sign In to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
