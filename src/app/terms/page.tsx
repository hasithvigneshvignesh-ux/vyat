import type { Metadata } from 'next';
import TermsClient from './TermsClient';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vyat-v3.vercel.app';

export const metadata: Metadata = {
  title: 'Terms and Conditions of Service | Vyat',
  description:
    'Read the official Terms and Conditions of Vyat. Learn about student eligibility, single-user licenses, the 1 Video/Day drip learning engine, verified credentials, intellectual property, and our 7-day refund guarantee.',
  alternates: {
    canonical: `${BASE_URL}/terms`,
  },
  openGraph: {
    title: 'Terms and Conditions of Service | Vyat',
    description:
      'Official Terms and Conditions for Indian B.Tech / CSE students learning on Vyat. Clear policies on 1 video/day drip learning, verified certificates, and transparent 7-day refunds.',
    url: `${BASE_URL}/terms`,
    siteName: 'Vyat',
    locale: 'en_IN',
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: 'Terms and Conditions of Service | Vyat',
    description:
      'Official Terms and Conditions for Vyat courses: drip learning engine, verified credentials, and 7-day refund guarantee.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const termsJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Terms and Conditions of Service — Vyat',
  url: `${BASE_URL}/terms`,
  description:
    'Official Terms and Conditions governing student access, single-user licenses, daily drip learning, verified credentials, and 7-day refunds on Vyat.',
  publisher: {
    '@type': 'EducationalOrganization',
    name: 'Vyat',
    url: BASE_URL,
    logo: `${BASE_URL}/icon.png`,
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Terms & Conditions',
        item: `${BASE_URL}/terms`,
      },
    ],
  },
};

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termsJsonLd) }}
      />
      <TermsClient />
    </>
  );
}
