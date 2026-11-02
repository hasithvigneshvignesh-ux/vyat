import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PublicLanding from './PublicLanding';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    absolute: 'VYAt-Ai | Multilingual AI Voice Agents for Business',
  },
  description:
    'VYAt-Ai provides multilingual AI voice agents for businesses, supporting Telugu, Hindi, English, and more. Automate customer calls, improve customer engagement, and grow your business with AI-powered voice solutions.',
  alternates: {
    canonical: 'https://vyatai.com/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'VYAt-Ai | Multilingual AI Voice Agents for Business',
    description:
      'VYAt-Ai provides multilingual AI voice agents for businesses, supporting Telugu, Hindi, English, and more. Automate customer calls, improve customer engagement, and grow your business with AI-powered voice solutions.',
    url: 'https://vyatai.com/',
    siteName: 'VYAt-Ai',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VYAt-Ai | Multilingual AI Voice Agents for Business',
    description:
      'VYAt-Ai provides multilingual AI voice agents for businesses, supporting Telugu, Hindi, English, and more. Automate customer calls, improve customer engagement, and grow your business with AI-powered voice solutions.',
  },
};

export default async function Home() {
  let branches = null;
  let skillsCount = 24;
  let coursesCount = 6;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // If authenticated user visits home, route to their relevant dashboard
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role === 'admin') {
        redirect('/admin/dashboard');
      }

      redirect('/dashboard');
    }

    // Unauthenticated guests and Search Engine Crawlers see the high-converting SEO landing page
    const [{ data: bData }, { count: sCount }, { count: cCount }] = await Promise.all([
      supabase.from('branches').select('*').eq('is_active', true).order('sort_order'),
      supabase.from('skills').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('courses').select('*', { count: 'exact', head: true }).eq('is_active', true),
    ]);

    branches = bData;
    if (sCount !== null && sCount !== undefined) skillsCount = sCount;
    if (cCount !== null && cCount !== undefined) coursesCount = cCount;
  } catch (error) {
    if ((error as any)?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    console.error('Error fetching landing page data:', error);
  }

  return (
    <PublicLanding
      branches={branches || []}
      skillsCount={skillsCount || 24}
      coursesCount={coursesCount || 6}
    />
  );
}
