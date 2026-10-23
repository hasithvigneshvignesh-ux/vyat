'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import { ScrollProgressBar, CursorFollower } from '@/components/landing/primitives';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { StatsBar } from '@/components/landing/StatsBar';
import { PillarsBento, PILLARS_LIST } from '@/components/landing/PillarsBento';
import { WhyVyat } from '@/components/landing/WhyVyat';
import { DripTimeline } from '@/components/landing/DripTimeline';
import { Credentials } from '@/components/landing/Credentials';
import { FaqAccordion, FAQS_DATA } from '@/components/landing/FaqAccordion';
import { FinalCta } from '@/components/landing/FinalCta';
import { Footer } from '@/components/landing/Footer';

interface Props {
  branches: any[];
  skillsCount: number;
  coursesCount: number;
}

export default function PublicLanding({ branches, skillsCount, coursesCount }: Props) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';

  // Structured Data for SEO: FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS_DATA.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  // Structured Data for SEO: Course ItemList Schema
  const courseListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: PILLARS_LIST.map((p, index) => ({
      '@type': 'Course',
      position: index + 1,
      name: p.title,
      description: p.hook,
      provider: {
        '@type': 'Organization',
        name: 'Vyat',
        sameAs: 'https://vyat-v3.vercel.app',
      },
    })),
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col antialiased transition-colors duration-200 bg-slate-50 dark:bg-[#05070f] text-slate-900 dark:text-slate-100 selection:bg-sky-500/20 selection:text-sky-900 dark:selection:bg-sky-500/30 dark:selection:text-sky-200"
    >
      {/* ── SEO Structured Data (JSON-LD) ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseListSchema) }}
      />

      {/* ── Accessibility: Skip to Content ── */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-sky-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400"
      >
        Skip to main content
      </a>

      {/* ── Top Scroll Progress Bar ── */}
      <ScrollProgressBar />

      {/* ── Ambient Desktop Cursor Follower Glow ── */}
      <CursorFollower />

      {/* ── 1. NAVBAR (Sticky Floating Glass Pill + Full Mobile Sheet) ── */}
      <Navbar />

      {/* ── Main Landing Flow ── */}
      <main id="main-content" className="w-full flex flex-col items-center flex-1">
        {/* ── 2. HERO SECTION ── */}
        <Hero />

        {/* ── 3. STATS STRIP ── */}
        <StatsBar />

        {/* ── 4. PILLARS BENTO SECTION ── */}
        <PillarsBento />

        {/* ── 5. WHY ENGINEERING STUDENTS CHOOSE VYAT ── */}
        <WhyVyat />

        {/* ── 6. 1 VIDEO / DAY HABIT ENGINE ── */}
        <DripTimeline />

        {/* ── 7. VERIFIED CREDENTIALS SPOTLIGHT ── */}
        <Credentials />

        {/* ── 8. FAQ ACCORDION ── */}
        <FaqAccordion />

        {/* ── 9. PRE-FOOTER CTA ── */}
        <FinalCta />
      </main>

      {/* ── 10. MULTI-COLUMN FOOTER ── */}
      <Footer />
    </div>
  );
}
