'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  Shield,
  Clock,
  Award,
  Lock,
  CreditCard,
  BookOpen,
  Scale,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Printer,
  Search,
  Copy,
  Check,
  ChevronRight,
  Mail,
  Building,
  Calendar,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Container } from '@/components/landing/primitives';
import { CodeSymbols } from '@/components/landing/CodeSymbols';

interface SectionClause {
  id: string;
  number: string;
  title: string;
  icon: React.ElementType;
  badge?: string;
  summary: string;
  content: React.ReactNode;
}

export default function TermsClient() {
  const [activeSection, setActiveSection] = useState('acceptance');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sections: SectionClause[] = useMemo(
    () => [
      {
        id: 'acceptance',
        number: '01',
        title: 'Acceptance of Terms & Student Eligibility',
        icon: Scale,
        badge: 'Binding Agreement',
        summary:
          'By creating an account or accessing courses on Vyat, you agree to enter into a legally binding contract under the Indian Contract Act, 1872 and Information Technology Act, 2000.',
        content: (
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
              Welcome to <strong>Vyat</strong> (&ldquo;Vyat&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), operated as an educational technology platform dedicated to Computer Science &amp; Engineering students across India. These Terms and Conditions of Service (&ldquo;Terms&rdquo;) govern your access to and use of our website (including <code>vyat-v3.vercel.app</code> and associated domains), mobile applications, video lectures, coding exercises, doubt resolution, and credential verification services (collectively, the &ldquo;Platform&rdquo;).
            </p>
            <p>
              By signing up, logging in, or purchasing any course or curriculum on Vyat, you confirm that:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Age &amp; Education:</strong> You are at least 16 years of age, or are enrolled in an undergraduate engineering or technical degree program (e.g., B.Tech, B.E., BCA, MCA, B.Sc Computer Science, or allied STEM disciplines).
              </li>
              <li>
                <strong>Minor Consent:</strong> If you are under 18 years of age, you represent and warrant that your parent or legal guardian has reviewed and agreed to these Terms on your behalf.
              </li>
              <li>
                <strong>Accurate Information:</strong> All registration details provided (including legal name, college affiliation, phone number, and email address) are authentic, accurate, and kept up-to-date.
              </li>
            </ul>
            <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800/40 text-xs sm:text-sm text-sky-900 dark:text-sky-200 flex items-start gap-3">
              <CheckCircle2 size={18} className="text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <span>
                <strong>Important:</strong> If you do not agree to every clause within these Terms, you must immediately cease accessing the Platform and refrain from enrolling in any courses.
              </span>
            </div>
          </div>
        ),
      },
      {
        id: 'accounts',
        number: '02',
        title: 'Student Accounts, Authentication & Security',
        icon: Lock,
        badge: 'Single-User License',
        summary:
          'Your Vyat account is strictly personal. Sharing credentials, pooling subscriptions, or renting access is strictly prohibited and leads to immediate termination.',
        content: (
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
              To access course materials, you must register for an authenticated student account. You agree to maintain the security and confidentiality of your login credentials.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Single-User Personal License:</strong> Each course purchase grants a revocable, non-exclusive, non-transferable personal license to one individual student. Account pooling, group purchasing, or reselling login access is a violation of these Terms.
              </li>
              <li>
                <strong>Automated Security Heuristics:</strong> Our security system monitors concurrent sessions, anomalous IP ranges, and device signatures. If concurrent video streams from geographically disparate locations are detected, your account may be temporarily locked pending identity verification.
              </li>
              <li>
                <strong>Credential Integrity:</strong> You are solely responsible for all activities occurring under your account. If you suspect unauthorized access, contact <code>support@vyat.com</code> immediately.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: 'drip-engine',
        number: '03',
        title: 'Course Delivery & The "1 Video / Day" Drip Engine',
        icon: Clock,
        badge: 'Pedagogy Policy',
        summary:
          'Vyat employs a sequential daily unlocking model to prevent binge-forgetting and ensure habit-forming engineering retention.',
        content: (
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
              Unlike traditional tutorial repositories that encourage binge-watching without deep comprehension, Vyat courses are architected around a <strong>structured daily drip engine</strong>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-3">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/40">
                <h5 className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm mb-1">
                  1. Sequential Unlocking
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  New lessons unlock on a daily cycle (standard 24-hour interval or 00:00 IST), designed to match engineering college timetables.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900/40">
                <h5 className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm mb-1">
                  2. Continuous Retrospective Access
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Once a video, code lab, or study note is unlocked, it remains accessible for unlimited revision throughout your enrollment term.
                </p>
              </div>
            </div>
            <p>
              Pacing safeguards are fundamental to our teaching methodology and cannot be bypassed upon request. Students who miss a day can catch up at their own pace without penalty.
            </p>
          </div>
        ),
      },
      {
        id: 'credentials',
        number: '04',
        title: 'Verified Credentials & Skill Certificates',
        icon: Award,
        badge: 'Cryptographic Proof',
        summary:
          'Certificates are awarded only upon verified completion of 100% of curriculum milestones and code submissions, verifiable via unique public hash.',
        content: (
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
              Upon completing all mandatory video lessons, homework repositories, and skill evaluations of an enrolled course, students are awarded a <strong>Vyat Verified Certificate of Skill Completion</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Verifiable Public Ledger:</strong> Every certificate issued by Vyat carries a unique cryptographic identifier (e.g., <code>cert_...</code>) and a public verification URL (<code>vyat-v3.vercel.app/verify/[id]</code>) accessible by recruiters and university evaluation cells.
              </li>
              <li>
                <strong>Integrity &amp; Anti-Fraud:</strong> Generating mock certificates, altering student metadata, or distributing falsified credential URLs constitutes fraud. Vyat reserves the right to publicly revoke any falsified credential and notify your college placement cell.
              </li>
              <li>
                <strong>No Automatic Passing:</strong> Merely purchasing a course or skimming video progress bars without fulfilling active participation criteria does not qualify a student for a certificate.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: 'intellectual-property',
        number: '05',
        title: 'Intellectual Property Rights & Anti-Piracy Policy',
        icon: Shield,
        badge: 'Zero Tolerance',
        summary:
          'All lectures, animations, diagrams, and code snippets are proprietary property of Vyat. Screen recording, scraping, or re-distributing on Telegram, YouTube, or Drive is strictly illegal.',
        content: (
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
              All materials provided through the Platform—including video streams, audio commentary, code solutions, animation assets, practice tests, and curriculum taxonomies—are the exclusive intellectual property of Vyat and its licensors, protected under the <strong>Indian Copyright Act, 1957</strong> and international copyright treaties.
            </p>
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/40 text-xs sm:text-sm text-rose-950 dark:text-rose-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-400">
                <AlertTriangle size={16} />
                <span>Strictly Prohibited Infringements:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>Capturing, screen recording, or downloading raw video files using extensions or software.</li>
                <li>Sharing, uploading, or reselling course videos to Telegram groups, Discord servers, Google Drives, Mega, or torrent trackers.</li>
                <li>Scraping code exercises, quizzes, or answers to train commercial AI models or construct cloned services.</li>
                <li>Sublicensing, renting, or leasing course accounts to third parties for commercial gain.</li>
              </ul>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Violations are actively tracked using dynamic digital watermarking. Infringing accounts will be terminated immediately without refund and reported to local cybercrime cells under Section 66 of the Information Technology Act, 2000.
            </p>
          </div>
        ),
      },
      {
        id: 'refund-policy',
        number: '06',
        title: 'Pricing, Payments, Taxes & 7-Day Refund Policy',
        icon: CreditCard,
        badge: 'Transparent Terms',
        summary:
          'Clear, upfront pricing in INR (₹) inclusive of GST. 100% money-back guarantee within 7 days if less than 15% of the curriculum is accessed.',
        content: (
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
              Course fees on Vyat are displayed transparently in <strong>Indian National Rupees (INR, ₹)</strong> and are inclusive of statutory Goods &amp; Services Tax (GST at 18%) where applicable.
            </p>
            <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 space-y-3">
              <h5 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Our 7-Day Conditional Refund Guarantee:</span>
              </h5>
              <p className="text-xs sm:text-sm">
                We want you to learn with absolute confidence. If you determine that an enrolled course does not align with your learning goals, you are eligible for a <strong>100% full refund</strong> if all of the following conditions are met:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm space-y-1 text-slate-600 dark:text-slate-400">
                <li>Your refund request is submitted within <strong>7 calendar days</strong> from the exact date of purchase.</li>
                <li>You have completed or unlocked <strong>less than 15%</strong> of the total course curriculum.</li>
                <li>You have <strong>not generated or claimed</strong> any completion certificate for the enrolled course.</li>
              </ul>
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                To initiate a refund, email <code>support@vyat.com</code> with your registered email and payment transaction ID. Approved refunds are credited back to the original source method within 5–7 banking days.
              </p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              *Courses bundled with non-refundable third-party cloud credits or purchased during special flash sales with explicit non-refundable notices are exempt from this policy.
            </p>
          </div>
        ),
      },
      {
        id: 'student-conduct',
        number: '07',
        title: 'Student Code of Conduct & Academic Integrity',
        icon: BookOpen,
        badge: 'Community Standards',
        summary:
          'Vyat is a respectful, professional engineering ecosystem. Plagiarism, harassment, or malicious actions result in immediate suspension.',
        content: (
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
              All students enrolled in Vyat must conduct themselves with professionalism, empathy, and academic honesty.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Constructive Q&amp;A:</strong> Doubt resolution channels and peer forums must be used solely for technical discussion, conceptual inquiries, and collaborative problem-solving.
              </li>
              <li>
                <strong>No Cheating or Solution Leaks:</strong> Posting verbatim solutions or test cases to active coding challenges or assessments is prohibited.
              </li>
              <li>
                <strong>Zero Tolerance for Harassment:</strong> Any form of verbal abuse, hate speech, sexual harassment, discriminatory language, or spamming directed at fellow students or teaching assistants will result in immediate and permanent account expulsion.
              </li>
              <li>
                <strong>Security Testing Boundaries:</strong> Students may not attempt SQL injection, Cross-Site Scripting (XSS), DDoS attacks, or exploit API endpoints on the Platform. Legitimate security vulnerability reports should be directed to <code>security@vyat.com</code>.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: 'placement-disclaimer',
        number: '08',
        title: 'Placement Preparation & Career Disclaimer',
        icon: HelpCircle,
        badge: 'Realistic Prep',
        summary:
          'We provide industry-vetted technical curricula and placement preparation, but final job offers remain the sole prerogative of autonomous hiring companies.',
        content: (
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
              Vyat takes pride in delivering curriculum calibrated to the technical hiring standards of top product-based companies and tech service firms in India (including FAANG, top startups, and IT enterprises).
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Educational Purpose:</strong> Our placement curriculum provides frameworks, data structures, algorithms, system design intuition, and mock interviews to prepare you for technical rounds.
              </li>
              <li>
                <strong>No Guaranteed Job Guarantee:</strong> Vyat is an educational training provider, not an employment agency or staffing firm. We do not promise, guarantee, or warrant employment, minimum salary packages (LPA), or placement outcomes.
              </li>
              <li>
                <strong>Autonomous Hiring Decisions:</strong> Hiring criteria, recruitment drives, background checks, and candidate selections are conducted autonomously by prospective employers and college placement cells.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: 'platform-availability',
        number: '09',
        title: 'Platform Availability, Uptime & Maintenance',
        icon: Clock,
        summary:
          'We target 99.9% platform uptime while reserving necessary maintenance windows for software and database upgrades.',
        content: (
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
              We strive to deliver uninterrupted access to your daily drip lessons through globally distributed Content Delivery Networks (CDNs) and resilient database architecture.
            </p>
            <p>
              However, service interruptions may occur due to routine system upgrades, server maintenance, internet backbone issues, or force majeure events. Vyat shall not be held liable for temporary video buffering or transient unavailability during scheduled maintenance periods, which are typically scheduled during off-peak hours (02:00 AM – 05:00 AM IST).
            </p>
          </div>
        ),
      },
      {
        id: 'third-party',
        number: '10',
        title: 'Third-Party Tools & External Integrations',
        icon: Building,
        summary:
          'Our platform integrates with trusted external tools like Google Drive, GitHub, and cloud coding sandboxes.',
        content: (
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
              Certain course components rely on third-party services, such as video hosting pipelines (Google Drive / private CDN players), code repositories (GitHub), or embedded web IDEs.
            </p>
            <p>
              Your interactions with third-party software are governed by their respective terms of service. Vyat is not liable for changes in external APIs or outages experienced by third-party infrastructure beyond our direct operational control.
            </p>
          </div>
        ),
      },
      {
        id: 'privacy-policy',
        number: '11',
        title: 'Privacy Policy & Student Data Protection (DPDPA 2023)',
        icon: Lock,
        badge: 'DPDPA Compliant',
        summary:
          'We protect your personal data in full compliance with the Digital Personal Data Protection Act, 2023 and never sell student contacts.',
        content: (
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
              Your privacy is paramount. Vyat collects and processes student personal information strictly in accordance with the <strong>Digital Personal Data Protection Act, 2023 (DPDPA)</strong> and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Data Collected:</strong> Name, college/university name, degree branch, email address, phone number (for OTP authentication), and course progression metrics.
              </li>
              <li>
                <strong>Data Usage:</strong> Strictly utilized to authenticate your account, deliver daily lessons, calculate certificate eligibility, and issue payment invoices.
              </li>
              <li>
                <strong>No Telemarketing Sales:</strong> We do NOT sell, rent, or lease your phone number or email address to third-party marketing companies, coaching centers, or credit bureaus.
              </li>
            </ul>
          </div>
        ),
      },
      {
        id: 'limitation-liability',
        number: '12',
        title: 'Limitation of Liability & Indemnification',
        icon: Scale,
        summary:
          'Our aggregate financial liability is capped at the total amount paid by the student for the specific enrolled course in the preceding 6 months.',
        content: (
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
              To the maximum extent permitted under applicable law, Vyat, its founders, directors, employees, and instructors shall not be liable for any indirect, incidental, special, consequential, or punitive damages—including loss of profits, loss of data, loss of opportunity, or academic consequences—arising out of or relating to your use of or inability to use the Platform.
            </p>
            <p>
              In no event shall Vyat&apos;s total aggregate liability exceed the total fee actually paid by you for the specific course giving rise to the claim during the six (6) months immediately preceding the event.
            </p>
          </div>
        ),
      },
      {
        id: 'termination',
        number: '13',
        title: 'Termination & Suspension of Access',
        icon: AlertTriangle,
        summary:
          'We reserve the right to suspend or terminate accounts that breach these terms, engage in copyright piracy, or harass members.',
        content: (
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
              Vyat reserves the right to immediately suspend or permanently terminate your account and revoke access to all course materials without refund if:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You commit a material breach of these Terms (including piracy, scraping, or sharing credentials).</li>
              <li>You engage in fraudulent payment chargebacks or submit forged identity credentials.</li>
              <li>You violate the Student Code of Conduct or compromise platform security.</li>
            </ul>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upon termination, all licenses granted to you shall immediately cease, and you must destroy any downloaded study notes or cached resources in your possession.
            </p>
          </div>
        ),
      },
      {
        id: 'governing-law',
        number: '14',
        title: 'Governing Law, Jurisdiction & Dispute Resolution',
        icon: Building,
        badge: 'Indian Law',
        summary:
          'These terms are governed by the laws of India, with exclusive jurisdiction in Hyderabad, Telangana, and binding arbitration provisions.',
        content: (
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
              These Terms, their interpretation, and any disputes arising out of or related to your use of Vyat shall be governed exclusively by the substantive laws of the <strong>Republic of India</strong>, without regard to conflict of laws principles.
            </p>
            <p>
              Any legal proceeding, dispute, or claim that cannot be resolved amicably within thirty (30) days shall be referred to and resolved by binding arbitration in accordance with the <strong>Arbitration and Conciliation Act, 1996</strong>. The seat and venue of arbitration shall be <strong>Hyderabad, Telangana, India</strong>, conducted in the English language. Subject to arbitration, the courts of competent jurisdiction in Hyderabad shall have exclusive jurisdiction.
            </p>
          </div>
        ),
      },
      {
        id: 'contact',
        number: '15',
        title: 'Grievance Officer & Official Notice Details',
        icon: Mail,
        badge: 'IT Act Compliance',
        summary:
          'Statutory compliance details under Rule 3(2) of the Information Technology Rules, 2021 for student grievances and legal communications.',
        content: (
          <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
            <p>
              In accordance with the Information Technology Act, 2000 and rules made thereunder, including the <strong>Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</strong>, the name and contact details of our designated Grievance Officer are provided below:
            </p>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/5 space-y-2 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-200/60 dark:border-white/5">
                <span className="font-semibold text-slate-900 dark:text-white">Designated Grievance Officer</span>
                <span className="text-slate-500 dark:text-slate-400">Vyat Learning &amp; Engineering</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-700 dark:text-slate-300">
                <div>
                  <span className="font-medium text-slate-500 dark:text-slate-400">Grievance Desk:</span>{' '}
                  <a href="mailto:grievance@vyat.com" className="text-sky-600 dark:text-sky-400 hover:underline">
                    grievance@vyat.com
                  </a>
                </div>
                <div>
                  <span className="font-medium text-slate-500 dark:text-slate-400">Support Desk:</span>{' '}
                  <a href="mailto:support@vyat.com" className="text-sky-600 dark:text-sky-400 hover:underline">
                    support@vyat.com
                  </a>
                </div>
                <div>
                  <span className="font-medium text-slate-500 dark:text-slate-400">Response SLA:</span>{' '}
                  <span>Acknowledgment within 24 hours</span>
                </div>
                <div>
                  <span className="font-medium text-slate-500 dark:text-slate-400">Resolution SLA:</span>{' '}
                  <span>Within 15 business days</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              For security vulnerability disclosures, please review our responsible disclosure policy or write directly to <code>security@vyat.com</code>.
            </p>
          </div>
        ),
      },
    ],
    []
  );

  // Active section scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase();
    return sections.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.summary.toLowerCase().includes(query) ||
        s.id.toLowerCase().includes(query)
    );
  }, [sections, searchQuery]);

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/terms#${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 dark:bg-[#05070f] text-slate-900 dark:text-slate-100 antialiased selection:bg-sky-500/20 selection:text-sky-900 dark:selection:bg-sky-500/30 dark:selection:text-sky-200">
      {/* ── Top Navigation Bar ── */}
      <Navbar />

      {/* ── Main Legal Container ── */}
      <main className="flex-1 w-full relative [isolation:isolate] overflow-x-clip pt-4 sm:pt-8 pb-16">
        {/* Subtle background code symbols */}
        <CodeSymbols variant="section" sectionId="general" density="low" />

        <Container>
          {/* Header Banner */}
          <div className="max-w-4xl mx-auto text-center pt-4 pb-8 sm:pb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <FileText size={13} />
              <span>Official Policy &bull; Version 2.4</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
              Terms &amp; Conditions of Service
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Clear, transparent guidelines designed for Indian B.Tech / CSE students, college partners, and developers learning on Vyat.
            </p>

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-6 pt-4 border-t border-slate-200/80 dark:border-white/10 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-sky-500" />
                <span>Last Updated: October 2026</span>
              </span>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">&bull;</span>
              <span className="flex items-center gap-1.5">
                <Building size={13} className="text-purple-500" />
                <span>Jurisdiction: Republic of India</span>
              </span>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">&bull;</span>
              <span className="flex items-center gap-1.5">
                <Shield size={13} className="text-emerald-500" />
                <span>Information Technology Act, 2000 Compliant</span>
              </span>
            </div>

            {/* Quick Action Bar: Search & Print */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md shadow-xs">
              <div className="relative w-full sm:w-80 flex items-center">
                <Search size={16} className="absolute left-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search clause (e.g. refund, certificate, drip)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-transparent focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  title="Print or Save as PDF"
                >
                  <Printer size={14} />
                  <span>Print Document</span>
                </button>
                <Link
                  href="/explore"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-colors cursor-pointer shadow-xs"
                >
                  <span>Explore Courses</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* ── Two Column Layout (Sidebar + Content) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-4">
            {/* Desktop Sticky Table of Contents (Col 1-4) */}
            <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-4">
              <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur-md shadow-xs">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/70 dark:border-white/5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Table of Contents
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    {filteredSections.length} Sections
                  </span>
                </div>

                <nav className="space-y-0.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                  {filteredSections.map((sec) => {
                    const isSelected = activeSection === sec.id;
                    return (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        className={`group flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all ${
                          isSelected
                            ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-bold border-l-2 border-sky-500 pl-3'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white font-medium'
                        }`}
                      >
                        <span className="truncate pr-2">
                          <span className="font-mono text-[11px] opacity-60 mr-1.5">{sec.number}.</span>
                          {sec.title}
                        </span>
                        <ChevronRight
                          size={12}
                          className={`shrink-0 transition-transform ${
                            isSelected ? 'translate-x-0.5 text-sky-500' : 'opacity-0 group-hover:opacity-100'
                          }`}
                        />
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* Quick Contact & Assistance Card */}
              <div className="p-4 rounded-2xl border border-slate-200/90 dark:border-white/10 bg-gradient-to-br from-slate-50 to-sky-50/50 dark:from-slate-900/60 dark:to-sky-950/20 text-xs text-slate-600 dark:text-slate-400 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Need clarification?</span>
                </h4>
                <p className="text-[11px] leading-relaxed">
                  Questions about our 7-day refund guarantee or credential verification? Our grievance and student support desks are happy to help.
                </p>
                <div className="pt-1">
                  <a
                    href="mailto:support@vyat.com"
                    className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold hover:underline text-xs"
                  >
                    <span>Email Student Support</span>
                    <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            </aside>

            {/* Clauses Content (Col 5-12) */}
            <div className="lg:col-span-8 space-y-8">
              {filteredSections.length === 0 ? (
                <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-white/10 bg-white/40 dark:bg-white/5">
                  <HelpCircle size={32} className="mx-auto text-slate-400 mb-2" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    No clauses match &ldquo;{searchQuery}&rdquo;
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-3 text-xs text-sky-600 dark:text-sky-400 font-semibold hover:underline"
                  >
                    Clear search filter
                  </button>
                </div>
              ) : (
                filteredSections.map((sec) => {
                  const Icon = sec.icon;
                  return (
                    <article
                      key={sec.id}
                      id={sec.id}
                      className="scroll-mt-24 p-5 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#070b14]/80 shadow-xs hover:border-slate-300 dark:hover:border-white/20 transition-all"
                    >
                      {/* Section Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-200/60 dark:border-white/10">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200/70 dark:border-sky-800/40 flex items-center justify-center text-sky-600 dark:text-sky-400 font-mono text-xs font-bold shrink-0">
                            {sec.number}
                          </span>
                          <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{sec.title}</span>
                          </h2>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-center">
                          {sec.badge && (
                            <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                              {sec.badge}
                            </span>
                          )}
                          <button
                            onClick={() => handleCopyLink(sec.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                            title="Copy link to clause"
                            aria-label={`Copy link to ${sec.title}`}
                          >
                            {copiedId === sec.id ? (
                              <Check size={14} className="text-emerald-500" />
                            ) : (
                              <Copy size={14} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* TL;DR Summary Box */}
                      <div className="p-3.5 mb-5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-white/5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
                        <Icon size={16} className="text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900 dark:text-white">Summary: </strong>
                          <span>{sec.summary}</span>
                        </div>
                      </div>

                      {/* Body Content */}
                      <div>{sec.content}</div>
                    </article>
                  );
                })
              )}

              {/* End of Document Confirmation */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-gradient-to-r from-sky-50/50 via-white to-purple-50/50 dark:from-slate-900/60 dark:via-[#070b14] dark:to-purple-950/20 text-center space-y-3">
                <CheckCircle2 size={28} className="mx-auto text-emerald-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Ready to Start Building Your Engineering Career?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Master campus placement interviews, core CS subjects, DSA, and Web Development with verified credentials.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/explore"
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition-all"
                  >
                    Browse All CSE Courses
                  </Link>
                  <Link
                    href="/login"
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Student Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      {/* ── Multi-Column Footer ── */}
      <Footer />
    </div>
  );
}
