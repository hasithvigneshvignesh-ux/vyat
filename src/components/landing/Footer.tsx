'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import { useTheme } from '@/providers/ThemeProvider';
import { Container } from './primitives';
import { CodeSymbols } from './CodeSymbols';

export function Footer() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';

  return (
    <footer
      className="w-full relative [isolation:isolate] overflow-clip border-t border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-[#07090e] text-sm text-slate-500 dark:text-slate-400"
      style={{
        paddingTop: '48px',
        paddingBottom: 'max(28px, calc(28px + env(safe-area-inset-bottom, 0px)))',
      }}
    >
      {/* ── Background Code Symbols ── */}
      <CodeSymbols variant="footer" sectionId="footer" />

      {/* Gradient Hairline on Top */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-500/40 dark:via-sky-400/40 to-transparent" />

      <Container>
        {/* Main Grid: Brand Block on top, Link columns in 2-col grid on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-8">
          {/* Brand Block on top (16px gap between logo, tagline, theme toggle) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Logo size="footer" withWordmark={true} sublabel="COURSES FOR CSE" href="/" />

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal max-w-sm">
              Structured daily drip courses built specifically for Indian B.Tech / BE Computer Science students.
            </p>

            <div className="pt-0.5">
              <button
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 min-h-[36px] rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                aria-label="Toggle visual theme"
              >
                {isDark ? (
                  <Sun size={14} className="text-amber-400" />
                ) : (
                  <Moon size={14} className="text-sky-500" />
                )}
                <span>Switch to {isDark ? 'Light' : 'Dark'} Mode</span>
              </button>
            </div>
          </div>

          {/* Link Columns: 2-column grid on mobile with 28px row gap, 3 columns on sm/lg */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-7">
            {/* Curriculums */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Curriculums
              </h4>
              <ul className="space-y-1 text-xs sm:text-sm">
                <li>
                  <a href="#curriculum" className="min-h-[36px] flex items-center hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    Campus Placements
                  </a>
                </li>
                <li>
                  <a href="#curriculum" className="min-h-[36px] flex items-center hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    Data Structures &amp; Algorithms
                  </a>
                </li>
                <li>
                  <a href="#curriculum" className="min-h-[36px] flex items-center hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    Core CS (OS, DBMS, Networks)
                  </a>
                </li>
                <li>
                  <a href="#curriculum" className="min-h-[36px] flex items-center hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    Full-Stack Web Dev
                  </a>
                </li>
                <li>
                  <a href="#curriculum" className="min-h-[36px] flex items-center hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    Applied AI &amp; ML
                  </a>
                </li>
              </ul>
            </div>

            {/* Why Vyat */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Why Vyat
              </h4>
              <ul className="space-y-1 text-xs sm:text-sm">
                <li>
                  <a href="#engineering-context" className="min-h-[36px] flex items-center hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    Timetable Friendly
                  </a>
                </li>
                <li>
                  <a href="#advantages" className="min-h-[36px] flex items-center hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    1 Video / Day Engine
                  </a>
                </li>
                <li>
                  <a href="#credentials" className="min-h-[36px] flex items-center hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    Verified Credentials
                  </a>
                </li>
                <li>
                  <a href="#faq" className="min-h-[36px] flex items-center hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Platform (col-span-2 on mobile, col-span-1 on sm+) */}
            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Platform
              </h4>
              <ul className="space-y-1 text-xs sm:text-sm">
                <li>
                  <Link href="/courses" className="min-h-[36px] flex items-center hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    All Courses Catalog
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="min-h-[36px] flex items-center hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    Student Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="min-h-[36px] flex items-center hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    Terms &amp; Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Normal flow, separated by border-top with 24px above, 8px apart */}
        <div className="pt-6 border-t border-slate-200/60 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
          <div>
            <p>© {new Date().getFullYear()} Vyat. All rights reserved.</p>
            <p className="font-medium text-slate-600 dark:text-slate-400">
              Built for Indian CSE &amp; B.Tech undergraduates.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs">
            <Link href="/terms" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors underline-offset-4 hover:underline">
              Terms &amp; Conditions
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/terms#refund-policy" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors underline-offset-4 hover:underline">
              Refund Policy
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/terms#privacy-policy" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors underline-offset-4 hover:underline">
              Privacy &amp; Data
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link href="/terms#contact" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors underline-offset-4 hover:underline">
              Grievance &amp; Contact
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
