'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  X,
  ArrowRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Sparkles,
  Layers,
  Terminal,
  Calendar,
  Award,
  Zap,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';
import { Branch, Skill, SyllabusDay } from '@/data/branches';
import { Container } from '@/components/landing/primitives';

interface CoursesClientProps {
  branches: Branch[];
  skills: Skill[];
  initialBranch?: string;
}

export default function CoursesClient({
  branches,
  skills,
  initialBranch = 'all',
}: CoursesClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Selected Branch state (synced with URL ?branch=)
  const [selectedBranch, setSelectedBranch] = useState<string>(() => {
    const branchParam = searchParams.get('branch');
    if (branchParam && (branchParam === 'all' || branches.some((b) => b.slug === branchParam))) {
      return branchParam;
    }
    return initialBranch || 'all';
  });

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');

  // Active drawer skill (synced with URL ?skill=)
  const [drawerSkillSlug, setDrawerSkillSlug] = useState<string | null>(() => {
    return searchParams.get('skill') || null;
  });

  // Tab list refs for arrow-key navigation and mobile auto-scroll
  const tabListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Sync state if URL changes externally (e.g. browser back/forward)
  useEffect(() => {
    const branchParam = searchParams.get('branch');
    if (branchParam && (branchParam === 'all' || branches.some((b) => b.slug === branchParam))) {
      setSelectedBranch(branchParam);
    } else if (!branchParam) {
      setSelectedBranch('all');
    }

    const skillParam = searchParams.get('skill');
    setDrawerSkillSlug(skillParam);
  }, [searchParams, branches]);

  // Update URL helper without full reload
  const updateUrl = useCallback((newBranch: string, newSkill?: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (newBranch && newBranch !== 'all') {
      params.set('branch', newBranch);
    } else {
      params.delete('branch');
    }

    if (newSkill) {
      params.set('skill', newSkill);
    } else {
      params.delete('skill');
    }

    const queryString = params.toString();
    const newPath = queryString ? `/courses?${queryString}` : '/courses';
    window.history.pushState(null, '', newPath);
  }, []);

  // Handle Tab Switch
  const handleSelectBranch = (branchSlug: string) => {
    setSelectedBranch(branchSlug);
    updateUrl(branchSlug, drawerSkillSlug);

    // Auto-scroll mobile tab into view
    const tabEl = tabRefs.current[branchSlug];
    if (tabEl) {
      tabEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  // Keyboard navigation for tablist
  const handleTabKeyDown = (e: React.KeyboardEvent, currentSlug: string) => {
    const allSlugs = ['all', ...branches.map((b) => b.slug)];
    const currentIndex = allSlugs.indexOf(currentSlug);
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % allSlugs.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + allSlugs.length) % allSlugs.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = allSlugs.length - 1;
    }

    if (nextIndex !== currentIndex) {
      const nextSlug = allSlugs[nextIndex];
      handleSelectBranch(nextSlug);
      tabRefs.current[nextSlug]?.focus();
    }
  };

  // Open / Close Syllabus Drawer
  const openSyllabus = (skill: Skill, triggerEl?: HTMLElement) => {
    if (triggerEl) triggerRef.current = triggerEl;
    setDrawerSkillSlug(skill.slug);
    updateUrl(selectedBranch, skill.slug);
  };

  const closeSyllabus = () => {
    setDrawerSkillSlug(null);
    updateUrl(selectedBranch, null);
    if (triggerRef.current) {
      triggerRef.current.focus();
    }
  };

  // Drawer ESC and body scroll lock
  useEffect(() => {
    if (drawerSkillSlug) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeSyllabus();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [drawerSkillSlug]);

  // Filter skills based on branch and search query
  const filteredSkills = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return skills.filter((skill) => {
      // Branch filter
      const matchesBranch = selectedBranch === 'all' || skill.branchSlug === selectedBranch;
      if (!matchesBranch) return false;

      // Query filter
      if (!q) return true;
      const inName = skill.name.toLowerCase().includes(q);
      const inSummary = skill.summary.toLowerCase().includes(q);
      const inTech = skill.tech.some((t) => t.toLowerCase().includes(q));
      const inOutcomes = skill.outcomes.some((o) => o.toLowerCase().includes(q));
      return inName || inSummary || inTech || inOutcomes;
    });
  }, [skills, selectedBranch, searchQuery]);

  // Skill counts map
  const skillCounts = useMemo(() => {
    const counts: { [key: string]: number } = { all: skills.length };
    branches.forEach((b) => {
      counts[b.slug] = skills.filter((s) => s.branchSlug === b.slug).length;
    });
    return counts;
  }, [branches, skills]);

  // Current active skill in drawer
  const activeDrawerSkill = useMemo(() => {
    if (!drawerSkillSlug) return null;
    return skills.find((s) => s.slug === drawerSkillSlug) || null;
  }, [drawerSkillSlug, skills]);

  const activeDrawerBranch = useMemo(() => {
    if (!activeDrawerSkill) return null;
    return branches.find((b) => b.slug === activeDrawerSkill.branchSlug) || null;
  }, [activeDrawerSkill, branches]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* ── 1. Page Hero (Compact, High-Density, Instant Search) ── */}
      <section className="relative pt-8 sm:pt-14 pb-8 sm:pb-12 border-b border-slate-200/70 dark:border-white/5 [isolation:isolate] overflow-clip">
        {/* Subtle radial glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-[110px] pointer-events-none -z-10"
          aria-hidden="true"
        />

        <Container>
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-100/80 dark:bg-sky-500/10 border border-sky-200/80 dark:border-sky-500/20 text-sky-700 dark:text-sky-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-2xs">
              <Sparkles size={14} className="text-sky-600 dark:text-sky-400" />
              <span>45 CSE &amp; AI Placements Skills Roadmap</span>
            </div>

            {/* H1 Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white mb-3 sm:mb-4 leading-[1.12]">
              Pick your branch.{' '}
              <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 dark:from-sky-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
                Master the skills.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-6 sm:mb-8 font-normal leading-relaxed text-pretty">
              Structured daily drip curriculums with hands-on projects, interview algorithms, and verified credentials for Indian engineering undergraduates.
            </p>

            {/* Search Input Box */}
            <div className="w-full max-w-xl relative">
              <div className="relative flex items-center">
                <Search
                  size={19}
                  className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search skills: DSA, Python, SQL, Neural Networks, OWASP..."
                  aria-label="Search skills"
                  id="courses-search-input"
                  className="w-full h-12 sm:h-14 pl-12 pr-12 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm sm:text-base font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search query"
                    className="absolute right-3.5 w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Active Search Meta */}
              {searchQuery && (
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between px-2">
                  <span>
                    Found <strong className="text-slate-900 dark:text-white">{filteredSkills.length}</strong> matching skill{filteredSkills.length === 1 ? '' : 's'}
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                  >
                    Reset filter
                  </button>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ── 2. Sticky Branch Selector Bar ── */}
      <section className="sticky top-[56px] sm:top-[64px] z-30 bg-white/85 dark:bg-[#07090e]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 py-3 transition-colors shadow-2xs">
        <Container>
          <div
            ref={tabListRef}
            role="tablist"
            aria-label="Computer Science Engineering Branches"
            className="flex items-center gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory py-1 px-1 -mx-1"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {/* "All" Tab */}
            <button
              ref={(el) => {
                tabRefs.current['all'] = el;
              }}
              role="tab"
              id="tab-all"
              aria-selected={selectedBranch === 'all'}
              aria-controls="panel-all"
              tabIndex={selectedBranch === 'all' ? 0 : -1}
              onClick={() => handleSelectBranch('all')}
              onKeyDown={(e) => handleTabKeyDown(e, 'all')}
              className={`shrink-0 h-11 min-h-[44px] px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 cursor-pointer snap-start select-none ${
                selectedBranch === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                  : 'bg-slate-100/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
              }`}
            >
              <Layers size={16} />
              <span>All Branches</span>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                  selectedBranch === 'all'
                    ? 'bg-white/20 text-white dark:bg-slate-950/20 dark:text-slate-950'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {skillCounts['all']}
              </span>
            </button>

            {/* Individual Branch Tabs */}
            {branches.map((b) => {
              const isSelected = selectedBranch === b.slug;
              return (
                <button
                  key={b.slug}
                  ref={(el) => {
                    tabRefs.current[b.slug] = el;
                  }}
                  role="tab"
                  id={`tab-${b.slug}`}
                  aria-selected={isSelected}
                  aria-controls={`panel-${b.slug}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => handleSelectBranch(b.slug)}
                  onKeyDown={(e) => handleTabKeyDown(e, b.slug)}
                  className={`shrink-0 h-11 min-h-[44px] px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 cursor-pointer snap-start select-none ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm'
                      : 'bg-slate-100/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-base" role="img" aria-hidden="true">
                    {b.icon}
                  </span>
                  <span>{b.shortName}</span>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-white/20 text-white dark:bg-slate-950/20 dark:text-slate-950'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {skillCounts[b.slug]}
                  </span>
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ── 3. Branch Content & Skills Grid ── */}
      <main className="flex-1 py-8 sm:py-12">
        <Container>
          {/* Empty Search State */}
          {filteredSkills.length === 0 ? (
            <div className="py-16 text-center max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-amber-600 dark:text-amber-400">
                <Search size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                No skills found
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                No skills match &quot;{searchQuery}&quot; in{' '}
                {selectedBranch === 'all'
                  ? 'any branch'
                  : branches.find((b) => b.slug === selectedBranch)?.name}
                . Try a different keyword or clear your search.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBranch('all');
                  updateUrl('all', null);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold transition-all cursor-pointer shadow-sm"
              >
                <RotateCcw size={16} />
                <span>Clear search &amp; show all</span>
              </button>
            </div>
          ) : selectedBranch === 'all' && !searchQuery ? (
            /* ── Case A: "All" view (Shows each branch as a titled group with its skills) ── */
            <div className="space-y-16">
              {branches.map((branch) => {
                const branchSkills = skills.filter((s) => s.branchSlug === branch.slug);
                return (
                  <div key={branch.slug} className="scroll-mt-32" id={`branch-group-${branch.slug}`}>
                    {/* Branch Header Banner */}
                    <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-100/90 to-slate-50/50 dark:from-slate-900/80 dark:to-slate-950/50 border border-slate-200/80 dark:border-white/10 mb-8">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5 max-w-2xl">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl" role="img" aria-hidden="true">
                              {branch.icon}
                            </span>
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                              {branch.name}
                            </h2>
                            <span
                              className="text-xs font-semibold px-2.5 py-0.5 rounded-full border"
                              style={{
                                color: branch.accent,
                                borderColor: `${branch.accent}40`,
                                backgroundColor: `${branch.accent}15`,
                              }}
                            >
                              {branchSkills.length} Skills
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                            {branch.description}
                          </p>
                        </div>

                        {/* Careers chips */}
                        <div className="flex flex-wrap items-center gap-1.5 md:max-w-xs md:justify-end">
                          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
                            <TrendingUp size={12} /> Target Careers:
                          </span>
                          {branch.careers.map((career) => (
                            <span
                              key={career}
                              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5"
                            >
                              {career}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Skills Grid: 2 per row desktop, 1 per row mobile */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                      {branchSkills.map((skill, index) => (
                        <SkillCard
                          key={skill.slug}
                          skill={skill}
                          branch={branch}
                          priority={index < 2}
                          onViewSyllabus={(el) => openSyllabus(skill, el)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── Case B: Single Branch selected or Active Search query ── */
            <div>
              {/* Branch Header if single branch */}
              {selectedBranch !== 'all' && (
                <div className="p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-100/90 to-slate-50/50 dark:from-slate-900/80 dark:to-slate-950/50 border border-slate-200/80 dark:border-white/10 mb-8">
                  {(() => {
                    const currentBranch = branches.find((b) => b.slug === selectedBranch);
                    if (!currentBranch) return null;
                    return (
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5 max-w-2xl">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl" role="img" aria-hidden="true">
                              {currentBranch.icon}
                            </span>
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                              {currentBranch.name}
                            </h2>
                            <span
                              className="text-xs font-semibold px-2.5 py-0.5 rounded-full border"
                              style={{
                                color: currentBranch.accent,
                                borderColor: `${currentBranch.accent}40`,
                                backgroundColor: `${currentBranch.accent}15`,
                              }}
                            >
                              {filteredSkills.length} Skills
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                            {currentBranch.description}
                          </p>
                        </div>

                        {/* Careers chips */}
                        <div className="flex flex-wrap items-center gap-1.5 md:max-w-xs md:justify-end">
                          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
                            <TrendingUp size={12} /> Target Careers:
                          </span>
                          {currentBranch.careers.map((career) => (
                            <span
                              key={career}
                              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5"
                            >
                              {career}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Skills Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                {filteredSkills.map((skill, index) => {
                  const branch = branches.find((b) => b.slug === skill.branchSlug) || branches[0];
                  return (
                    <SkillCard
                      key={skill.slug}
                      skill={skill}
                      branch={branch}
                      priority={index < 4}
                      onViewSyllabus={(el) => openSyllabus(skill, el)}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </Container>
      </main>

      {/* ── 4. Closing Strip CTA ── */}
      <section className="py-12 sm:py-16 border-t border-slate-200/80 dark:border-white/10 bg-white/50 dark:bg-slate-900/30">
        <Container>
          <div className="max-w-3xl mx-auto text-center p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-100/90 to-white dark:from-slate-900/90 dark:to-slate-950/80 border border-slate-200 dark:border-white/10 shadow-sm">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white mb-2">
              Not sure which skill track to start with?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto mb-6">
              Sign in with your student account to get personalized course recommendations, track daily streak goals, and earn verified credentials.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/login"
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-sm transition-all text-center cursor-pointer"
              >
                Sign in to Track Your Progress
              </Link>
              <Link
                href="/#advantages"
                className="w-full sm:w-auto px-7 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-center cursor-pointer"
              >
                How 1 Video/Day Works
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 5. Side Drawer / Mobile Bottom Sheet (Syllabus & Roadmap) ── */}
      {activeDrawerSkill && activeDrawerBranch && (
        <SyllabusDrawer
          skill={activeDrawerSkill}
          branch={activeDrawerBranch}
          onClose={closeSyllabus}
        />
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Skill Card Component (Horizontal Layout, Images + Text beside it)
   ────────────────────────────────────────────────────────── */
interface SkillCardProps {
  skill: Skill;
  branch: Branch;
  priority?: boolean;
  onViewSyllabus: (triggerEl: HTMLElement) => void;
}

function SkillCard({ skill, branch, priority = false, onViewSyllabus }: SkillCardProps) {
  const levelColor =
    skill.level === 'Beginner'
      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
      : skill.level === 'Intermediate'
      ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20'
      : 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';

  return (
    <div
      className="group relative flex flex-col md:flex-row items-stretch rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/10 shadow-[0_2px_12px_rgba(15,23,42,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-xl dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
      style={{
        padding: 'clamp(18px, 2.2vw, 28px)',
        gap: 'clamp(14px, 1.8vw, 24px)',
      }}
    >
      {/* ── Left Side (Desktop 40% width, aspect 4:3 or full card height) / Top on Mobile (aspect 16:10) ── */}
      <div className="relative w-full md:w-[40%] md:shrink-0 aspect-[16/10] md:aspect-auto md:min-h-[280px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/40">
        <Image
          src={skill.image}
          alt={skill.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
          priority={priority}
          unoptimized
          className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
        />
      </div>

      {/* ── Right Side (Text & Meta, flex flex-col justify-between) ── */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          {/* Top Row: Skill Name & Level Chip */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-[20px] font-bold text-slate-950 dark:text-white leading-snug tracking-tight">
              {skill.name}
            </h3>
            <span
              className={`shrink-0 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${levelColor}`}
            >
              {skill.level}
            </span>
          </div>

          {/* Plain English summary sentence */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3.5 font-normal">
            {skill.summary}
          </p>

          {/* What you'll build/learn: 3 outcome bullets */}
          <div className="space-y-1.5 mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              What you&apos;ll build &amp; master:
            </p>
            <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 font-medium">
              {skill.outcomes.map((outcome, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2
                    size={14}
                    className="shrink-0 mt-0.5 text-emerald-500 dark:text-emerald-400"
                  />
                  <span className="leading-snug">{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section: Meta + Action Buttons (pinned to bottom with margin-top: auto) */}
        <div className="mt-auto pt-3.5 border-t border-slate-200/80 dark:border-white/5 space-y-3">
          {/* Meta row: Lessons, Minutes, Tech chips */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3 font-medium">
              <span className="flex items-center gap-1">
                <BookOpen size={13} className="text-slate-400" />
                {skill.lessons} Lessons
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-slate-400" />
                {skill.minutesPerLesson} min/day
              </span>
            </div>

            {/* Tech chips */}
            <div className="flex flex-wrap items-center gap-1">
              {skill.tech.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-white/5"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center justify-between gap-3 pt-1">
            {/* View Syllabus secondary text link */}
            <button
              onClick={(e) => onViewSyllabus(e.currentTarget)}
              className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1.5 transition-colors cursor-pointer py-1.5"
            >
              <span>View syllabus</span>
              <ChevronRight size={15} />
            </button>

            {/* Start Learning primary button -> /login?next=/courses/<branch>/<skill> */}
            <Link
              href={`/login?next=/courses/${skill.branchSlug}/${skill.slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-xs hover:shadow-sm transition-all duration-200 cursor-pointer group/btn"
            >
              <span>Start learning</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-200 group-hover/btn:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Syllabus Drawer Component (Slide-over desktop, Bottom Sheet mobile)
   ────────────────────────────────────────────────────────── */
interface SyllabusDrawerProps {
  skill: Skill;
  branch: Branch;
  onClose: () => void;
}

function SyllabusDrawer({ skill, branch, onClose }: SyllabusDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Focus trap inside drawer
  useEffect(() => {
    const drawerEl = drawerRef.current;
    if (!drawerEl) return;

    const focusableElements = drawerEl.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (firstElement) firstElement.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleTabKey);
    return () => window.removeEventListener('keydown', handleTabKey);
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${skill.name} Syllabus`}
      className="fixed inset-0 z-50 flex justify-end animate-fade-in"
    >
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Drawer Container (Desktop: Right slide-over; Mobile: Bottom sheet) */}
      <div
        ref={drawerRef}
        className="relative z-10 w-full md:max-w-xl h-[85vh] md:h-full mt-auto md:mt-0 bg-white dark:bg-[#090D16] border-t md:border-t-0 md:border-l border-slate-200 dark:border-white/10 shadow-2xl rounded-t-3xl md:rounded-none flex flex-col overflow-hidden animate-slide-up md:animate-slide-left"
      >
        {/* Mobile Pull Handle */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
        </div>

        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-slate-900/50 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                style={{
                  color: branch.accent,
                  borderColor: `${branch.accent}40`,
                  backgroundColor: `${branch.accent}15`,
                }}
              >
                {branch.name}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                {skill.level}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white leading-tight">
              {skill.name}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {skill.summary}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close syllabus drawer"
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body (Scrollable Roadmap & Lessons) */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5 text-center">
            <div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {skill.lessons}
              </div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Daily Lessons
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">
                {skill.minutesPerLesson}m
              </div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Per Video
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-sky-600 dark:text-sky-400">
                Verified
              </div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Credential
              </div>
            </div>
          </div>

          {/* Technology Stack Covered */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
              Tools &amp; Languages Mastered:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {skill.tech.map((tool) => (
                <span
                  key={tool}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/10"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Visual Roadmap & Day-by-Day Topics */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-1.5">
              <Calendar size={14} />
              <span>Day-by-Day Learning Roadmap:</span>
            </h4>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-white/10">
              {skill.syllabus.map((milestone, idx) => (
                <div key={idx} className="relative group">
                  {/* Step Node */}
                  <div
                    className="absolute -left-6 top-0.5 w-5 h-5 rounded-full border-2 bg-white dark:bg-slate-900 flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                    style={{ borderColor: branch.accent }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: branch.accent }}
                    />
                  </div>

                  {/* Content Card */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-mono font-bold text-sky-600 dark:text-sky-400">
                        DAY {milestone.day}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {milestone.topic}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                      {milestone.title}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Sticky Bottom Action */}
        <div className="p-4 sm:p-5 border-t border-slate-200/80 dark:border-white/10 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            <span>Free student preview • Sign in required</span>
          </div>

          <Link
            href={`/login?next=/courses/${skill.branchSlug}/${skill.slug}`}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>Start Learning {skill.name}</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
