import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#07090E" },
  ],
};

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vyat-v3.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Courses for CSE Students in India — Placements, Core Subjects, DSA, Web Dev & AI | Vyat",
    template: "%s | Vyat",
  },
  description: "India's premier learning platform for CSE & engineering students. Master campus placements, core CS subjects (OS, DBMS, Computer Networks), Data Structures & Algorithms (DSA), Full-Stack Web Development, and AI learning with structured daily lessons and verified certificates.",
  keywords: [
    "Courses for CSE",
    "CSE students India",
    "Engineering students India",
    "Campus placements preparation",
    "Core subjects CSE",
    "Operating Systems DBMS Computer Networks",
    "Data Structures and Algorithms",
    "DSA for placements",
    "Web Dev courses for CSE",
    "Full stack web development",
    "AI learning for engineering students",
    "Artificial Intelligence Machine Learning CSE",
    "B.Tech CSE courses",
    "Engineering placements India",
    "Technical interview preparation",
    "Computer Science Engineering syllabus",
    "Vyat learning platform",
  ],
  authors: [{ name: "Vyat Learning" }],
  creator: "Vyat",
  publisher: "Vyat",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  openGraph: {
    title: "Courses for CSE Students in India — Placements, Core Subjects, DSA, Web Dev & AI | Vyat",
    description: "India's dedicated learning hub for CSE & engineering students. Master campus placements, core CS subjects (OS, DBMS, Networks), DSA, Web Dev, and AI learning with daily drip lessons.",
    url: BASE_URL,
    siteName: "Vyat",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/brand/vyat-og.png`,
        width: 1200,
        height: 630,
        alt: "Vyat — Courses for CSE Students in India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Courses for CSE Students in India — Placements, Core Subjects, DSA, Web Dev & AI | Vyat",
    description: "Master campus placements, core CS subjects (OS, DBMS, Networks), DSA, Full-Stack Web Dev, and AI learning with verified certificates.",
    images: [`${BASE_URL}/brand/vyat-og.png`],
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
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${BASE_URL}/#organization`,
      "name": "Vyat — Courses for CSE & Engineering Students",
      "url": BASE_URL,
      "logo": `${BASE_URL}/icon.png`,
      "description": "Comprehensive online learning platform for Computer Science & Engineering students in India. Specialized in Campus Placements, Core Subjects (Operating Systems, DBMS, Computer Networks), DSA, Full-Stack Web Development, and AI Learning.",
      "areaServed": {
        "@type": "Country",
        "name": "India"
      },
      "audience": {
        "@type": "EducationalAudience",
        "educationalRole": "student",
        "audienceType": "CSE & Engineering Students in India"
      },
      "knowsAbout": [
        "Computer Science Engineering",
        "Campus Placements Preparation",
        "Data Structures and Algorithms (DSA)",
        "Core Subjects (OS, DBMS, Computer Networks, OOP)",
        "Full-Stack Web Development",
        "AI Learning and Machine Learning"
      ],
      "educationalCredentialAwarded": "Verified Certificate of Skill Completion"
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      "url": BASE_URL,
      "name": "Vyat",
      "description": "Courses for CSE Students in India — Placements, Core Subjects, DSA, Web Dev & AI Learning",
      "publisher": {
        "@id": `${BASE_URL}/#organization`
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${BASE_URL}/explore?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('vyat-theme') || localStorage.getItem('codefundas-theme');
                  var theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  document.documentElement.setAttribute('data-theme', theme);
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-slate-50 dark:bg-[#05070f] text-slate-900 dark:text-slate-100 selection:bg-sky-500/20 selection:text-sky-900 dark:selection:bg-sky-500/30 dark:selection:text-sky-200">
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
