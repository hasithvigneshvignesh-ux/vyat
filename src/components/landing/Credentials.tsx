'use client';

import React, { useRef } from 'react';
import { Award, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { Container, SectionHeader, TiltCard, Reveal, useMediaQuery } from './primitives';

export function Credentials() {
  const isFinePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const certRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isFinePointer || !certRef.current) return;
    const rect = certRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    certRef.current.style.setProperty('--sheen-x', `${x}%`);
    certRef.current.style.setProperty('--sheen-y', `${y}%`);
  };

  return (
    <section id="credentials" className="w-full landing-section relative border-b border-slate-200/70 dark:border-white/5">
      {/* Background ambient wash */}
      <div
        className="pointer-events-none absolute -bottom-20 right-10 w-[500px] h-[500px] rounded-full blur-[140px] opacity-20 dark:opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, transparent 70%)',
        }}
      />

      <Container>
        <SectionHeader
          pillText="Verifiable Career Advantage"
          title="Credentials That Truly Prove Practical Competency"
          subtitle="Unlike platforms where users skip videos for a badge, Vyat strictly unlocks credentials only after every lesson and concept test is completed."
        />

        <Reveal delayMs={100} className="w-full">
          {/* ── Main Showcase Glass Container (padding 20px on mobile, clamp(24px, 4vw, 56px) on desktop) ── */}
          <div
            className="w-full rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/95 dark:bg-[#0b1020]/95 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] grid grid-cols-1 lg:grid-cols-[1fr_460px] items-center gap-8 lg:gap-12 min-w-0"
            style={{
              padding: 'clamp(20px, 4vw, 56px)',
            }}
          >
            {/* Left Content Column */}
            <div className="w-full text-left min-w-0">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300 mb-4">
                <Award size={14} className="text-sky-600 dark:text-sky-400" />
                <span>Verified Anti-Cheat Credential</span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3 sm:mb-4 leading-tight text-balance">
                Share Verifiable Proof with Hiring Managers
              </h3>

              <p className="text-sm lg:text-base leading-relaxed text-slate-600 dark:text-slate-300 mb-6 font-normal">
                Every Vyat credential comes with an authentic public verification link and
                fraud-proof ID. Add it to LinkedIn and your resume with total confidence when
                applying to top tech firms.
              </p>

              {/* Glass Trust Chips - Wrapping neatly with 8px gaps and 6px 12px padding */}
              <div className="flex flex-wrap gap-2 text-xs font-medium">
                <div
                  className="flex items-center gap-2 border border-slate-200/80 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-slate-200 shadow-2xs"
                  style={{ padding: '6px 12px' }}
                >
                  <CheckCircle2 size={14} className="text-sky-500 shrink-0" />
                  <span>Unique Credential ID</span>
                </div>
                <div
                  className="flex items-center gap-2 border border-slate-200/80 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-slate-200 shadow-2xs"
                  style={{ padding: '6px 12px' }}
                >
                  <CheckCircle2 size={14} className="text-sky-500 shrink-0" />
                  <span>Public Verification URL</span>
                </div>
                <div
                  className="flex items-center gap-2 border border-slate-200/80 dark:border-white/10 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-slate-200 shadow-2xs"
                  style={{ padding: '6px 12px' }}
                >
                  <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                  <span>Anti-Fraud Guaranteed</span>
                </div>
              </div>
            </div>

            {/* Right: Realistic Mini-Certificate (width: 100%, max-w 420px, NO fixed pixel width, padding 18px) */}
            <div className="w-full flex justify-center min-w-0">
              <TiltCard maxTiltDeg={5} className="w-full max-w-[420px] mx-auto min-w-0">
                <div
                  ref={certRef}
                  onMouseMove={handleMouseMove}
                  className="relative group rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#070b16] text-slate-900 dark:text-white shadow-xl dark:shadow-2xl overflow-hidden transition-all duration-300 w-full min-w-0"
                  style={{
                    padding: '18px',
                    backgroundImage:
                      'radial-gradient(circle at var(--sheen-x, 50%) var(--sheen-y, 50%), rgba(14, 165, 233, 0.12) 0%, transparent 60%)',
                  }}
                >
                  {/* Subtle Ornamental Geometric Border Pattern */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-2 rounded-xl border border-dashed border-sky-500/20 dark:border-sky-400/20"
                  />

                  {/* Top Certificate Header: Brand Logo + Anti-Cheat Verified Badge */}
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-100 dark:border-white/10">
                    <div className="flex items-center gap-2.5">
                      <Logo size="certificate" withWordmark={false} href={null} />
                      <div className="flex flex-col">
                        <span className="font-extrabold text-xs sm:text-sm tracking-tight leading-none text-slate-900 dark:text-white">
                          Vyat Engineering
                        </span>
                        <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider mt-0.5">
                          Council of Tech
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Anti-Cheat Verified
                    </span>
                  </div>

                  {/* Certificate Body */}
                  <div className="relative z-10 py-4 sm:py-5 text-center min-w-0">
                    <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400 font-mono">
                      Certificate of Completion
                    </p>
                    <p className="text-lg sm:text-xl font-extrabold mt-1 text-slate-900 dark:text-white">
                      Aarav Patel
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      has demonstrated practical mastery in
                    </p>
                    <p className="text-sm sm:text-base font-extrabold text-sky-600 dark:text-sky-400 mt-0.5 break-words">
                      Data Structures &amp; Algorithms
                    </p>
                  </div>

                  {/* Certificate Footer with QR & Authenticated Badge (flex-wrap with 8px gap) */}
                  <div className="relative z-10 pt-3 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-slate-500 dark:text-slate-400 font-mono">
                    <div className="flex items-center gap-2 min-w-0">
                      <QrCode size={20} className="text-slate-400 dark:text-slate-500 shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="truncate text-[10px] text-slate-700 dark:text-slate-300">ID: VYAT-2026-CSE-8A92</span>
                        <span className="text-[9px] text-slate-400">Issued Oct 2026</span>
                      </div>
                    </div>

                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 shrink-0 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 text-[10px]">
                      <CheckCircle2 size={12} />
                      <span>Authenticated</span>
                    </span>
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
