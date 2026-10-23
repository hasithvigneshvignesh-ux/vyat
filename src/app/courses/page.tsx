import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import CoursesClient from './CoursesClient';
import { branches, skills } from '@/data/branches';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vyat-v3.vercel.app';

export const metadata: Metadata = {
  title: 'Browse All CSE Courses & Skills by Branch',
  description:
    'Explore 45 comprehensive computer science roadmaps and skills across CSE Core & AI, Machine Learning, Data Science, and Cyber Security. Daily guided lessons engineered for Indian engineering undergraduates.',
  keywords: [
    'CSE courses',
    'computer science skills roadmap',
    'B.Tech CSE curriculum',
    'machine learning courses',
    'data structures and algorithms',
    'cyber security training',
    'data science roadmap',
    'Vyat courses',
  ],
  alternates: {
    canonical: `${BASE_URL}/courses`,
  },
  openGraph: {
    title: 'Browse All CSE Courses & Skills by Branch | Vyat',
    description:
      'Explore 45 comprehensive computer science roadmaps across CSE Core, Machine Learning, Data Science, and Cyber Security.',
    url: `${BASE_URL}/courses`,
    siteName: 'Vyat',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse All CSE Courses & Skills by Branch | Vyat',
    description:
      '45 comprehensive CSE and AI skill curriculums engineered for Indian engineering students to crack product placements.',
  },
};

export default function CoursesPage() {
  // Course/ItemList JSON-LD Schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Vyat CSE Courses & Skills Catalog',
    description:
      'Comprehensive 45-skill catalog across CSE Core, Machine Learning, Data Science, and Cyber Security for Indian engineering students.',
    numberOfItems: skills.length,
    itemListElement: skills.map((skill, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Course',
        name: skill.name,
        description: skill.summary,
        provider: {
          '@type': 'Organization',
          name: 'Vyat Engineering',
          sameAs: BASE_URL,
        },
        educationalLevel: skill.level,
        numberOfLessons: skill.lessons,
        courseCode: skill.slug,
        url: `${BASE_URL}/courses/${skill.branchSlug}?skill=${skill.slug}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#07090e]">
        <Navbar />
        <Suspense fallback={<CoursesSkeleton />}>
          <CoursesClient branches={branches} skills={skills} initialBranch="all" />
        </Suspense>
        <Footer />
      </div>
    </>
  );
}

function CoursesSkeleton() {
  return (
    <div className="min-h-screen py-16 animate-pulse">
      <div className="max-w-3xl mx-auto px-4 text-center mb-12">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-4" />
        <div className="h-10 w-96 bg-slate-200 dark:bg-slate-800 rounded-2xl mx-auto mb-4" />
        <div className="h-4 w-72 bg-slate-200 dark:bg-slate-800 rounded-lg mx-auto" />
      </div>
      <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-white/5"
          />
        ))}
      </div>
    </div>
  );
}
