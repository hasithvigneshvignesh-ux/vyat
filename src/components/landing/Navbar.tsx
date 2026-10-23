'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import { BookOpen, Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';

const NAV_LINKS = [
  { href: '#curriculum', label: 'Courses & Pillars' },
  { href: '#engineering-context', label: 'Why Engineering' },
  { href: '#advantages', label: '1 Video / Day' },
  { href: '#credentials', label: 'Verified Credentials' },
  { href: '#faq', label: 'FAQ' },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for sliding active-link pill on desktop
  useEffect(() => {
    const sectionIds = ['curriculum', 'engineering-context', 'advantages', 'credentials', 'faq'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${id}`);
          }
        },
        { rootMargin: '-20% 0px -65% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  // Body scroll locking & Esc key handler when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const isDark = mounted && theme === 'dark';

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 w-full ${
          isScrolled
            ? 'py-2 sm:py-3'
            : 'py-3 sm:py-4'
        }`}
      >
        <div className="landing-container">
          <div
            className={`w-full mx-auto px-4 sm:px-6 h-14 sm:h-16 rounded-2xl flex items-center justify-between transition-all duration-300 ${
              isScrolled
                ? 'bg-white/80 dark:bg-[#080d1a]/85 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.03)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
                : 'bg-white/50 dark:bg-[#07090e]/40 backdrop-blur-md border border-slate-200/50 dark:border-white/5'
            }`}
          >
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0" id="nav-brand-logo">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-sky-500/25 group-hover:scale-105 transition-transform duration-200">
                <BookOpen size={17} />
              </div>
              <div className="flex flex-col">
                <span className={`font-extrabold text-base sm:text-lg tracking-tight leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Vyat
                </span>
                <span className="text-[9px] uppercase font-semibold tracking-wider text-sky-600 dark:text-sky-400 mt-0.5">
                  Courses for CSE
                </span>
              </div>
            </Link>

            {/* Desktop Floating Pill Nav Links */}
            <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5 text-xs font-semibold backdrop-blur-md">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`relative px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'text-sky-600 dark:text-sky-400 font-bold bg-white dark:bg-slate-800 shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            {/* Right Action Cluster */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle Button with morphing animation */}
              <button
                onClick={toggleTheme}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                id="theme-toggle-btn"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-slate-800/80 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all text-slate-700 dark:text-amber-400"
              >
                {isDark ? (
                  <Sun size={15} className="rotate-0 hover:rotate-90 transition-transform duration-300" />
                ) : (
                  <Moon size={15} className="rotate-0 hover:-rotate-12 transition-transform duration-300" />
                )}
              </button>

              {/* Sign In link */}
              <Link href="/login" id="nav-login-btn">
                <button className="px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors cursor-pointer">
                  Sign In
                </button>
              </Link>

              {/* Desktop Primary CTA */}
              <Link href="/explore" id="nav-explore-btn" className="hidden sm:inline-flex">
                <button className="relative group overflow-hidden px-4 py-2 text-xs sm:text-sm font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5">
                  <span>Explore Catalog</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open mobile menu"
                aria-expanded={mobileMenuOpen}
                className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-slate-800/80 flex items-center justify-center text-slate-700 dark:text-slate-200 cursor-pointer active:scale-95 transition-transform"
              >
                <Menu size={17} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Full-Screen Glass Sheet Overlay ── */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-[99] lg:hidden flex flex-col justify-between bg-white/95 dark:bg-[#07090e]/95 backdrop-blur-2xl animate-fade-in p-6"
          style={{
            paddingTop: 'max(24px, env(safe-area-inset-top))',
            paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
          }}
        >
          {/* Top Sheet Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                <BookOpen size={16} />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">Vyat</span>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="w-10 h-10 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 flex items-center justify-center text-slate-700 dark:text-slate-200 cursor-pointer active:scale-95"
            >
              <X size={20} />
            </button>
          </div>

          {/* Links list with large 48px tap targets */}
          <nav className="flex flex-col justify-center space-y-2 py-8 my-auto">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between h-12 px-4 rounded-xl text-base font-semibold text-slate-800 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <span>{link.label}</span>
                <ArrowRight size={16} className="text-slate-400" />
              </a>
            ))}
          </nav>

          {/* Bottom Pinned CTAs */}
          <div className="space-y-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
            <Link href="/explore" onClick={() => setMobileMenuOpen(false)} className="block w-full">
              <button className="w-full h-12 rounded-xl bg-sky-600 text-white font-semibold flex items-center justify-center gap-2 shadow-sm text-base">
                <span>Explore All CSE Courses</span>
                <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full">
              <button className="w-full h-12 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold flex items-center justify-center text-base">
                Student Sign In
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
