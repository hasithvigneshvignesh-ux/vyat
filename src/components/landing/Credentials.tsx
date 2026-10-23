'use client';

import React, { useRef } from 'react';
import { Award, CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';
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

        <Reveal delayMs={100}>
          {/* ── Main Showcase Glass Container ── */}
          <div className="w-full rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#0b1020]/70 backdrop-blur-xl shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14">
            
            {/* Left Content Column */}
            <div className="w-full lg:max-w-xl text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300 mb-4">
                <Award size={14} className="text-sky-600 dark:text-sky-400" />
                <span>Verified Anti-Cheat Credential</span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3 sm:mb-4 leading-tight text-balance">
                Share Verifiable Proof with Hiring Managers
              </h3>

              <p className="text-xs sm:text-sm lg:text-base leading-relaxed text-slate-600 dark:text-slate-300 mb-6 font-normal">
                Every Vyat credential comes with an authentic public verification link and
                fraud-proof ID. Add it to LinkedIn and your resume with total confidence when
                applying to top tech firms.
              </p>

              {/* Glass Trust Chips */}
              <div className="flex flex-wrap gap-2.5 text-xs font-medium">
                <div className="flex items-center gap-2 border border-slate-200/80 dark:border-white/10 px-3.5 py-2 rounded-xl bg-slate-50/80 dark:bg-white/5 text-slate-800 dark:text-slate-200 backdrop-blur-sm shadow-2xs">
                  <CheckCircle2 size={15} className="text-sky-500 shrink-0" />
                  <span>Unique Credential ID</span>
                </div>
                <div className="flex items-center gap-2 border border-slate-200/80 dark:border-white/10 px-3.5 py-2 rounded-xl bg-slate-50/80 dark:bg-white/5 text-slate-800 dark:text-slate-200 backdrop-blur-sm shadow-2xs">
                  <CheckCircle2 size={15} className="text-sky-500 shrink-0" />
                  <span>Public Verification URL</span>
                </div>
                <div className="flex items-center gap-2 border border-slate-200/80 dark:border-white/10 px-3.5 py-2 rounded-xl bg-slate-50/80 dark:bg-white/5 text-slate-800 dark:text-slate-200 backdrop-blur-sm shadow-2xs">
                  <ShieldCheck size={15} className="text-emerald-500 shrink-0" />
                  <span>Anti-Fraud Guaranteed</span>
                </div>
              </div>
            </div>

            {/* Right: Realistic Mini-Certificate (Stacks Under on Mobile, Scaled to Fit) */}
            <div className="w-full sm:w-auto flex justify-center shrink-0">
              <TiltCard maxTiltDeg={6} className="w-full max-w-[380px] sm:max-w-[420px]">
                <div
                  ref={certRef}
                  onMouseMove={handleMouseMove}
                  className="relative group rounded-2xl p-5 sm:p-7 border border-slate-200 dark:border-white/15 bg-white dark:bg-[#070b16] text-slate-900 dark:text-white shadow-xl dark:shadow-2xl overflow-hidden transition-all duration-300"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at var(--sheen-x, 50%) var(--sheen-y, 50%), rgba(14, 165, 233, 0.12) 0%, transparent 60%)',
                  }}
                >
                  {/* Subtle Ornamental Geometric Border Pattern */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-2.5 rounded-xl border border-dashed border-sky-500/20 dark:border-sky-400/20"
                  />

                  {/* Top Certificate Header */}
                  <div className="relative z-10 flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                        V
                      </div>
                      <div className="flex flex-col">
                        <span className="font-extrabold text-xs sm:text-sm tracking-tight leading-none">
                          Vyat Engineering
                        </span>
                        <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider mt-0.5">
                          Council of Tech
                        </span>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold border border-emerald-500/30 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Anti-Cheat Verified
                    </span>
                  </div>

                  {/* Certificate Body */}
                  <div className="relative z-10 py-5 sm:py-7 text-center">
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold text-slate-400 font-mono">
                      Certificate of Completion
                    </p>
                    <p className="text-xl sm:text-2xl font-extrabold mt-1 text-slate-900 dark:text-white">
                      Aarav Patel
                    </p>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1">
                      has demonstrated practical mastery in
                    </p>
                    <p className="text-sm sm:text-base font-extrabold text-sky-600 dark:text-sky-400 mt-1">
                      Data Structures &amp; Algorithms
                    </p>
                  </div>

                  {/* Certificate Footer with QR & Authenticated Badge */}
                  <div className="relative z-10 pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <div className="flex items-center gap-2">
                      <QrCode size={22} className="text-slate-400 dark:text-slate-500 shrink-0" />
                      <div className="flex flex-col">
                        <span className="truncate max-w-[140px] text-[10px]">ID: VYAT-2026-CSE-8A92</span>
                        <span className="text-[9px] text-slate-400">Issued Oct 2026</span>
                      </div>
                    </div>

                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5 shrink-0 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                      <CheckCircle2 size={13} />
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
