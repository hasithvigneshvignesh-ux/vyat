import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import CoursesClient from '../CoursesClient';
import { branches, skills } from '@/data/branches';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vyat-v3.vercel.app';

interface BranchPageProps {
  params: Promise<{ branch: string }>;
}

export async function generateStaticParams() {
  return branches.map((b) => ({
    branch: b.slug,
  }));
}

export async function generateMetadata({ params }: BranchPageProps): Promise<Metadata> {
  const { branch: branchSlug } = await params;
  const branch = branches.find((b) => b.slug === branchSlug);

  if (!branch) {
    return {
      title: 'Branch Not Found | Vyat',
    };
  }

  return {
    title: `${branch.name} Courses & Skills Roadmap`,
    description: branch.description,
    keywords: [
      `${branch.name} roadmap`,
      `${branch.shortName} skills`,
      'CSE curriculum',
      ...branch.careers,
    ],
    alternates: {
      canonical: `${BASE_URL}/courses/${branch.slug}`,
    },
    openGraph: {
      title: `${branch.name} Courses & Roadmap | Vyat`,
      description: branch.description,
      url: `${BASE_URL}/courses/${branch.slug}`,
      siteName: 'Vyat',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${branch.name} Courses & Roadmap | Vyat`,
      description: branch.description,
    },
  };
}

export default async function BranchCoursesPage({ params }: BranchPageProps) {
  const { branch: branchSlug } = await params;
  const branch = branches.find((b) => b.slug === branchSlug);

  if (!branch) {
    notFound();
  }

  const branchSkills = skills.filter((s) => s.branchSlug === branch.slug);

  // Structured Data for Branch
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${branch.name} Skills Roadmap`,
    description: branch.description,
    numberOfItems: branchSkills.length,
    itemListElement: branchSkills.map((skill, index) => ({
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
        courseCode: skill.slug,
        url: `${BASE_URL}/courses/${branch.slug}?skill=${skill.slug}`,
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
        <Suspense fallback={<BranchSkeleton />}>
          <CoursesClient branches={branches} skills={skills} initialBranch={branch.slug} />
        </Suspense>
        <Footer />
      </div>
    </>
  );
}

function BranchSkeleton() {
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
