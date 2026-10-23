'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import { Container } from './primitives';

export function Footer() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';

  return (
    <footer
      className="w-full relative border-t border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-[#07090e] text-sm text-slate-500 dark:text-slate-400"
      style={{
        paddingTop: '56px',
        paddingBottom: 'max(32px, calc(32px + env(safe-area-inset-bottom, 0px)))',
      }}
    >
      {/* Gradient Hairline on Top */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-500/40 dark:via-sky-400/40 to-transparent" />

      <Container>
        {/* 4-Column Grid with Wider Brand Column & 2-Col Mobile Links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 sm:pb-12 border-b border-slate-200/60 dark:border-white/10">
          {/* Col 1: Brand Info (Wider: 5 of 12 cols on desktop, top on mobile) */}
          <div className="lg:col-span-5 space-y-3.5">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-sky-500/25 group-hover:scale-105 transition-transform">
                <BookOpen size={16} />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                Vyat
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal max-w-sm">
              Structured daily drip courses built specifically for Indian B.Tech / BE Computer Science students.
            </p>

            <div className="pt-1">
              <button
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                aria-label="Toggle visual theme"
              >
                {isDark ? (
                  <Sun size={13} className="text-amber-400" />
                ) : (
                  <Moon size={13} className="text-sky-500" />
                )}
                <span>Switch to {isDark ? 'Light' : 'Dark'} Mode</span>
              </button>
            </div>
          </div>

          {/* Links Cluster: 2-column on mobile, 3 individual columns on lg */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Curriculums */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3.5">
                Curriculums
              </h4>
              <ul className="space-y-[10px] text-xs sm:text-sm">
                <li>
                  <a href="#curriculum" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    Campus Placements
                  </a>
                </li>
                <li>
                  <a href="#curriculum" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    Data Structures &amp; Algorithms
                  </a>
                </li>
                <li>
                  <a href="#curriculum" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    Core CS (OS, DBMS, Networks)
                  </a>
                </li>
                <li>
                  <a href="#curriculum" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    Full-Stack Web Dev
                  </a>
                </li>
                <li>
                  <a href="#curriculum" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    Applied AI &amp; ML
                  </a>
                </li>
              </ul>
            </div>

            {/* Why Vyat */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3.5">
                Why Vyat
              </h4>
              <ul className="space-y-[10px] text-xs sm:text-sm">
                <li>
                  <a href="#engineering-context" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    Timetable Friendly
                  </a>
                </li>
                <li>
                  <a href="#advantages" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    1 Video / Day Engine
                  </a>
                </li>
                <li>
                  <a href="#credentials" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    Verified Credentials
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Platform */}
            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3.5">
                Platform
              </h4>
              <ul className="space-y-[10px] text-xs sm:text-sm">
                <li>
                  <Link href="/explore" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    All Courses Catalog
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    Student Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/explore" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
                    Start Placement Prep
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution separated by border */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Vyat. All rights reserved.</p>
          <p className="font-medium text-slate-600 dark:text-slate-400">Built for Indian CSE &amp; B.Tech undergraduates.</p>
        </div>
      </Container>
    </footer>
  );
}
