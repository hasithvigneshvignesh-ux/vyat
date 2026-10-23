'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import { Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const NAV_LINKS = [
  { href: '/courses', label: 'Courses' },
  { href: '/#engineering-context', label: 'Why Vyat' },
  { href: '/#advantages', label: '1 Video/Day' },
  { href: '/#credentials', label: 'Credentials' },
  { href: '/#faq', label: 'FAQ' },
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
            setActiveSection(`/#${id}`);
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
          isScrolled ? 'py-2 sm:py-3' : 'py-3 sm:py-4'
        }`}
      >
        <div className="w-full mx-auto px-3 sm:px-6 flex justify-center">
          <div
            className={`w-[calc(100%-24px)] max-w-[1200px] mx-auto px-3.5 sm:px-5 h-[56px] sm:h-[64px] rounded-full flex items-center justify-between gap-2 sm:gap-6 transition-all duration-300 ${
              isScrolled
                ? 'bg-white/90 dark:bg-[#080d1a]/90 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.03)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]'
                : 'bg-white/75 dark:bg-[#07090e]/70 backdrop-blur-md border border-slate-200/60 dark:border-white/10'
            }`}
          >
            {/* 1. Left Brand Logo (40px desktop, 34px mobile, wordmark + sublabel with 12px+ free space to right) */}
            <div className="shrink-0 flex items-center mr-2 lg:mr-4">
              <div className="hidden sm:block">
                <Logo
                  size="navbar"
                  withWordmark={true}
                  sublabel="COURSES FOR CSE"
                  href="/"
                  id="nav-brand-logo"
                />
              </div>
              <div className="sm:hidden">
                <Logo
                  size="mobile"
                  withWordmark={true}
                  sublabel="COURSES FOR CSE"
                  href="/"
                  id="nav-brand-logo-mobile"
                />
              </div>
            </div>

            {/* 2. Middle Desktop Floating Pill Nav Links (hidden <1024px; gap clamp(8px,1.2vw,20px), padding 8px 14px, nowrap) */}
            <nav
              className="hidden lg:flex items-center rounded-full bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5 text-xs font-semibold backdrop-blur-md p-1 shrink-0"
              style={{ gap: 'clamp(8px, 1.2vw, 20px)' }}
            >
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`relative rounded-full transition-all duration-200 whitespace-nowrap select-none ${
                      isActive
                        ? 'text-sky-600 dark:text-sky-400 font-bold bg-white dark:bg-slate-800 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                    style={{ padding: '8px 14px', whiteSpace: 'nowrap' }}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            {/* 3. Right Action Cluster (Theme toggle, Sign In, Explore Catalog button, Hamburger) */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Theme Toggle Button (40x40 tap target) */}
              <button
                onClick={toggleTheme}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                id="theme-toggle-btn"
                className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-slate-800/80 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all text-slate-700 dark:text-amber-400 shrink-0"
              >
                {isDark ? (
                  <Sun size={17} className="rotate-0 hover:rotate-90 transition-transform duration-300" />
                ) : (
                  <Moon size={17} className="rotate-0 hover:-rotate-12 transition-transform duration-300" />
                )}
              </button>

              {/* Sign In link (text button, nowrap, min-h-[40px]) */}
              <Link href="/login" id="nav-login-btn" className="shrink-0">
                <button className="min-h-[40px] px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors cursor-pointer flex items-center justify-center whitespace-nowrap">
                  Sign In
                </button>
              </Link>

              {/* Explore Catalog -> primary button (nowrap, padding 10px 18px, height 44px, hidden on <768px mobile) */}
              <Link href="/courses" id="nav-explore-btn" className="hidden md:inline-flex shrink-0">
                <button className="relative group overflow-hidden px-[18px] h-[44px] text-xs sm:text-sm font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5 whitespace-nowrap">
                  <span>Explore Catalog</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              </Link>

              {/* Hamburger Button: visible on <1024px (both tablets and phones) */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
                className="lg:hidden w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-slate-800/80 flex items-center justify-center text-slate-700 dark:text-slate-200 cursor-pointer active:scale-95 transition-transform shrink-0"
              >
                <Menu size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile & Tablet Glass Sheet Menu Overlay (lg:hidden) ── */}
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
            <Logo size="mobile" withWordmark={true} sublabel="COURSES FOR CSE" href="/" />

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
            <Link href="/courses" onClick={() => setMobileMenuOpen(false)} className="block w-full">
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
