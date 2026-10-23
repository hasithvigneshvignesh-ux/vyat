'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';
import {
  BookOpen, Award, CheckCircle2, ArrowRight,
  Cpu, Terminal, Sparkles, ChevronRight, Briefcase,
  Globe, GraduationCap, Sun, Moon
} from 'lucide-react';

interface Props {
  branches: any[];
  skillsCount: number;
  coursesCount: number;
}

const FAQS = [
  {
    q: 'What courses are available for CSE students on Vyat?',
    a: 'Vyat provides specialized curriculums covering Campus Placement Preparation, Core CS Subjects (Operating Systems, DBMS, Computer Networks), Data Structures & Algorithms (DSA), Full-Stack Web Development, and AI & Machine Learning. Every track is built specifically for Indian B.Tech / BE Computer Science students.'
  },
  {
    q: 'How does Vyat prepare Indian engineering students for campus placements?',
    a: 'Vyat bridges the gap between university theory and competitive hiring. Students learn high-frequency placement coding questions (LeetCode patterns), technical viva questions for core subjects, aptitude fundamentals, and how to build resume-worthy Full-Stack and AI projects.'
  },
  {
    q: 'Which core computer science subjects are covered for semester exams & interviews?',
    a: 'Vyat covers Operating Systems (concurrency, scheduling, memory management), Database Management Systems (SQL, normalization, ACID, indexing), Computer Networks (TCP/IP stack, routing, sockets), and Object-Oriented Programming (OOP in C++ and Java) matching Indian university syllabi (AKTU, VTU, Anna University, JNTU, SPPU) and placement interviews.'
  },
  {
    q: 'Are DSA (Data Structures & Algorithms) and Web Development included?',
    a: 'Yes. The DSA track covers Arrays, Linked Lists, Trees, Graphs, and Dynamic Programming with time-complexity analysis. The Web Development track teaches modern Full-Stack engineering using JavaScript, TypeScript, React, Next.js, Node.js, and databases to build real-world applications.'
  },
  {
    q: 'How does the AI Learning track help CSE students stand out to recruiters?',
    a: 'The AI Learning track teaches practical Python for data science, NumPy, Pandas, Scikit-learn, Neural Networks, and Generative AI applications. Rather than just theory, students build AI-powered applications that directly showcase modern engineering skills on their resumes and GitHub.'
  },
  {
    q: 'How does the daily drip video format fit an engineering student\'s timetable?',
    a: 'Engineering students in India balance 8 AM–4 PM college lectures, mandatory 75% attendance, and lab submissions. Vyat releases 1 focused lesson (15–25 mins) per day. This prevents binge burnout, builds consistent coding habits, and ensures steady progress throughout the semester.'
  },
  {
    q: 'Are Vyat certificates verified and accepted on resumes and LinkedIn?',
    a: 'Yes. Every Vyat certificate is tamper-proof with a unique verification ID and a public link. Unlike other platforms where users can skip videos to get certificates, Vyat strictly unlocks credentials only after every lesson and checkpoint in the curriculum has been completed.'
  }
];

const CURRICULUM_PILLARS = [
  {
    id: 'placements',
    title: 'Campus Placements & Interview Prep',
    hook: 'Master high-yield coding rounds and viva interviews for Indian product companies and top recruiters.',
    category: 'Placement Ready',
    icon: Briefcase,
    highlights: [
      'High-frequency LeetCode interview problem patterns',
      'Technical viva questions & core system design fundamentals',
      'Resume project walkthroughs & GitHub portfolio guidance'
    ],
    tag: 'Tier-1 Placements'
  },
  {
    id: 'core-subjects',
    title: 'Core Subjects (OS, DBMS, Networks, OOP)',
    hook: 'Score top SGPA in semester exams and master fundamental theory tested in tech interview viva rounds.',
    category: 'University + GATE',
    icon: Cpu,
    highlights: [
      'OS: Process scheduling, paging & virtual memory',
      'DBMS: SQL queries, normalization, ACID properties & indexing',
      'Networks & OOP: TCP/IP stack & C++/Java design patterns'
    ],
    tag: 'AKTU · VTU · JNTU Syllabi'
  },
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms (DSA)',
    hook: 'Build unshakeable intuition in algorithmic complexity and problem-solving patterns.',
    category: 'Problem Solving',
    icon: Terminal,
    highlights: [
      'Linear & non-linear structures: Trees, Graphs & Heaps',
      'Dynamic Programming, Greedy & Recursion blueprints',
      'Optimized implementations in C++, Java, and Python'
    ],
    tag: '100+ Curated Problems'
  },
  {
    id: 'web-dev',
    title: 'Full-Stack Web Development',
    hook: 'Go from frontend fundamentals to scalable backend architecture with production-grade code.',
    category: 'Modern Tech Stack',
    icon: Globe,
    highlights: [
      'Modern TypeScript, React 19 & Next.js App Router',
      'Node.js, Express, REST APIs & JWT authentication',
      'PostgreSQL, Supabase & cloud production deployments'
    ],
    tag: 'Ship Production Apps'
  },
  {
    id: 'ai-learning',
    title: 'Applied AI & Machine Learning',
    hook: 'Code-first AI curriculum built for CSE undergraduates from Python math to modern LLMs.',
    category: 'Cutting-Edge',
    icon: Sparkles,
    highlights: [
      'Python for AI: NumPy, Pandas, Scikit-learn & data pipelines',
      'Neural networks, Deep Learning & PyTorch foundations',
      'Generative AI: Embeddings, Vector DBs & RAG pipelines'
    ],
    tag: 'Build Intelligent Apps'
  },
  {
    id: 'systems-scale',
    title: 'Full B.Tech 4-Year Roadmap',
    hook: 'The complete structured roadmap designed to make you a top 1% engineer in your batch.',
    category: 'Systems & Scale',
    icon: GraduationCap,
    highlights: [
      '1 Video a day habit system with zero binge burnout',
      'Interactive concept checkpoints for every single lesson',
      'LinkedIn verifiable credentials with anti-cheat protection'
    ],
    tag: 'Complete 4-Year Journey'
  }
];

export default function PublicLanding({ branches, skillsCount, coursesCount }: Props) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': FAQS.map((faq) => ({
      '@type': 'Question',
      'name': faq.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.a,
      },
    })),
  };

  const courseListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': CURRICULUM_PILLARS.map((p, index) => ({
      '@type': 'Course',
      'position': index + 1,
      'name': p.title,
      'description': p.hook,
      'provider': {
        '@type': 'Organization',
        'name': 'Vyat',
        'sameAs': 'https://vyat-v3.vercel.app'
      }
    }))
  };

  return (
    <div className={`min-h-screen w-full font-sans flex flex-col antialiased overflow-x-hidden transition-colors duration-300 ${
      isDark
        ? 'bg-[#07090E] text-slate-100 selection:bg-sky-500/30 selection:text-sky-200'
        : 'bg-[#F8FAFC] text-slate-900 selection:bg-sky-500/20 selection:text-sky-900'
    }`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseListSchema) }}
      />

      {/* ── 1. NAVBAR (GLASSMORPHISM WITH THEME TOGGLE) ── */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all w-full shadow-xs ${
        isDark ? 'bg-[#0B0F17]/90 border-slate-800' : 'bg-white/90 border-sky-100'
      }`}>
        <div className="w-full max-w-[1780px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-20 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 group" id="nav-brand-logo">
            <div className="w-10 h-10 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-sm shadow-sky-600/30 group-hover:scale-105 transition-transform">
              <BookOpen size={20} />
            </div>
            <div className="flex flex-col">
              <span className={`font-extrabold text-xl tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                Vyat
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-sky-500 -mt-1">
                Courses for CSE
              </span>
            </div>
          </Link>

          <nav className={`hidden lg:flex items-center gap-10 text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            <a href="#curriculum" className="hover:text-sky-500 transition-colors">Courses &amp; Pillars</a>
            <a href="#engineering-context" className="hover:text-sky-500 transition-colors">Why Engineering Students</a>
            <a href="#advantages" className="hover:text-sky-500 transition-colors">1 Video / Day Habit</a>
            <a href="#credentials" className="hover:text-sky-500 transition-colors">Verified Credentials</a>
            <a href="#faq" className="hover:text-sky-500 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3.5">
            {/* ── THEME TOGGLE OPTION BUTTON ── */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              id="theme-toggle-btn"
              className={`w-10 h-10 rounded-xl border transition-all duration-200 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 ${
                isDark
                  ? 'bg-slate-800/90 border-slate-700 text-amber-400 hover:bg-slate-700 shadow-sm'
                  : 'bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100 shadow-xs'
              }`}
            >
              {isDark ? (
                <Sun size={18} className="transition-transform duration-300" />
              ) : (
                <Moon size={18} className="transition-transform duration-300" />
              )}
            </button>

            <Link href="/login" id="nav-login-btn">
              <button className={`px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:text-slate-900 hover:bg-sky-50'
              }`}>
                Sign In
              </button>
            </Link>
            <Link href="/explore" id="nav-explore-btn">
              <button className="px-6 py-2.5 text-sm font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
                Explore Catalog
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full flex flex-col items-center">
        {/* ── 2. HERO SECTION ── */}
        <section className={`w-full pt-16 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-36 border-b relative overflow-hidden ${
          isDark
            ? 'border-slate-800/80 bg-gradient-to-b from-[#07090E] via-[#0D131F] to-[#07090E]'
            : 'border-sky-100 bg-gradient-to-b from-white via-sky-50/30 to-[#F8FAFC]'
        }`}>
          <div className="w-full max-w-[1780px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-20 text-center flex flex-col items-center">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#FEF08A] border border-amber-300 text-amber-950 shadow-xs mb-6">
              <span>⚡</span>
              <span>#1 Learning Platform for CSE Students in India</span>
            </div>

            {/* Main H1 */}
            <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.12] mb-6 ${
              isDark ? 'text-white' : 'text-[#0F172A]'
            }`}>
              Master Computer Science.
              <span className="block mt-2 text-sky-500">Ace Placements &amp; Semester Exams.</span>
            </h1>

            {/* Subtitle */}
            <p className={`text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-10 font-normal ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Built specifically for Indian B.Tech / BE engineering students. Fast-track campus placements and university exams with structured daily drip lessons in Core CS, DSA, Web Dev, and AI.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto mb-20 sm:mb-24">
              <Link href="/explore" className="w-full sm:w-auto" id="hero-cta-explore">
                <button className="w-full sm:w-auto px-9 py-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl shadow-lg shadow-sky-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-base">
                  Browse All CSE Courses
                  <ArrowRight size={18} />
                </button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto" id="hero-cta-login">
                <button className={`w-full sm:w-auto px-9 py-4 font-semibold rounded-xl border-2 shadow-sm transition-all flex items-center justify-center gap-2 text-base ${
                  isDark
                    ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                    : 'bg-white hover:bg-sky-50 text-slate-700 border-sky-200'
                }`}>
                  Student Sign In
                </button>
              </Link>
            </div>

            {/* ── METRICS BAR (ADAPTIVE SKY-BLUE / DARK CARD) ── */}
            <div className={`w-full max-w-[1600px] 2xl:max-w-[1720px] mx-auto p-8 sm:p-10 lg:p-12 backdrop-blur-md rounded-3xl border-2 ${
              isDark
                ? 'bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 border-slate-700 shadow-2xl'
                : 'bg-gradient-to-r from-sky-100/90 via-sky-50 to-sky-100/90 border-sky-300/80 shadow-lg shadow-sky-500/10'
            }`}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-left">
                <div className={`md:border-r last:border-r-0 pr-4 ${isDark ? 'border-slate-700' : 'border-sky-300/80'}`}>
                  <p className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>5 Pillars</p>
                  <p className={`text-sm sm:text-base font-semibold mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Placements, DSA, OS, Web &amp; AI</p>
                </div>
                <div className={`md:border-r last:border-r-0 pr-4 ${isDark ? 'border-slate-700' : 'border-sky-300/80'}`}>
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-sky-500 tracking-tight">1 Video/Day</p>
                  <p className={`text-sm sm:text-base font-semibold mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Drip habit without burnout</p>
                </div>
                <div className={`md:border-r last:border-r-0 pr-4 ${isDark ? 'border-slate-700' : 'border-sky-300/80'}`}>
                  <p className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Dual Syllabus</p>
                  <p className={`text-sm sm:text-base font-semibold mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Semester marks + Viva prep</p>
                </div>
                <div>
                  <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-sky-500 tracking-tight">100% Verified</p>
                  <p className={`text-sm sm:text-base font-semibold mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Tamper-proof credentials</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── 3. PILLAR CARDS SECTION ("5 ESSENTIAL PILLARS") ── */}
        <section id="curriculum" className={`w-full pt-28 pb-32 sm:pt-36 sm:pb-40 lg:pt-44 lg:pb-48 border-b relative ${
          isDark ? 'bg-[#0B0F17] border-slate-800' : 'bg-white border-sky-100'
        }`}>
          <div className="w-full max-w-[1780px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-20">
            
            {/* Centered Heading Block */}
            <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20 lg:mb-24">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-2xs mb-5 ${
                isDark ? 'bg-sky-950/80 text-sky-300 border-sky-800' : 'bg-sky-100 text-sky-800 border-sky-300'
              }`}>
                <span className={isDark ? 'text-sky-400' : 'text-sky-600'}>✦</span> Comprehensive CSE Curriculums
              </div>
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2] mb-5 text-balance ${
                isDark ? 'text-white' : 'text-[#0F172A]'
              }`}>
                5 Essential Pillars Every CSE Student Must Master
              </h2>
              <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Whether you are aiming for high-paying product company campus placements or scoring top SGPA in semester exams, Vyat covers the entire Computer Science Engineering roadmap.
              </p>
            </div>

            {/* 6 Adaptive Sky-Blue / Dark Pillar Cards */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {CURRICULUM_PILLARS.map((pillar) => {
                const IconComponent = pillar.icon;

                return (
                  <article
                    key={pillar.id}
                    className={`rounded-2xl border-2 p-8 sm:p-9 transition-all duration-200 hover:-translate-y-1.5 h-full flex flex-col justify-between group ${
                      isDark
                        ? 'bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-900/90 border-slate-800 hover:border-sky-500 hover:bg-slate-800/50 shadow-black/50'
                        : 'bg-gradient-to-b from-sky-50 via-sky-100/40 to-sky-50/80 border-sky-200 hover:border-sky-400 hover:bg-sky-50/90 shadow-md shadow-sky-500/5 hover:shadow-xl hover:shadow-sky-500/15'
                    }`}
                  >
                    <div>
                      {/* Top Row: Icon + Badge */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-xl bg-sky-600 text-white border border-sky-500 flex items-center justify-center shadow-md shadow-sky-600/30 group-hover:scale-110 group-hover:bg-sky-500 transition-all">
                          <IconComponent size={24} />
                        </div>
                        <span className={`px-3 py-1 text-xs font-bold rounded-lg border shadow-2xs ${
                          isDark ? 'bg-slate-800 text-sky-300 border-slate-700' : 'bg-white/95 text-sky-900 border-sky-300'
                        }`}>
                          {pillar.category}
                        </span>
                      </div>

                      {/* Title & Sub-hook */}
                      <h3 className={`text-xl sm:text-2xl font-bold mb-3 leading-snug min-h-[3.5rem] flex items-center ${
                        isDark ? 'text-white' : 'text-[#0F172A]'
                      }`}>
                        {pillar.title}
                      </h3>
                      
                      <p className={`text-sm sm:text-base leading-relaxed mb-6 font-normal min-h-[3rem] ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {pillar.hook}
                      </p>

                      {/* 3-Point Checklist */}
                      <ul className={`space-y-3.5 text-sm font-medium mb-8 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {pillar.highlights.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <CheckCircle2 size={18} className="text-sky-500 shrink-0 mt-0.5" />
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Action Area */}
                    <div className={`pt-6 border-t flex items-center justify-between mt-auto ${
                      isDark ? 'border-slate-800' : 'border-sky-200/90'
                    }`}>
                      <span className={`text-xs font-mono font-semibold px-3 py-1.5 rounded-md border shadow-2xs ${
                        isDark ? 'text-sky-300 bg-slate-800 border-slate-700' : 'text-sky-900 bg-white border-sky-300'
                      }`}>
                        {pillar.tag}
                      </span>
                      <Link
                        href="/explore"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-sky-500 hover:text-sky-400 transition-colors group-hover:translate-x-1"
                      >
                        Explore Track <ArrowRight size={15} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 4. WHY ENGINEERING STUDENTS CHOOSE VYAT (BENTO SECTION) ── */}
        <section id="engineering-context" className={`w-full pt-28 pb-32 sm:pt-36 sm:pb-40 lg:pt-44 lg:pb-48 border-b relative ${
          isDark ? 'bg-[#07090E] border-slate-800' : 'bg-[#F8FAFC] border-sky-100'
        }`}>
          <div className="w-full max-w-[1780px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-20">
            
            {/* Centered Heading Block */}
            <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20 lg:mb-24">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-2xs mb-5 ${
                isDark ? 'bg-sky-950/80 text-sky-300 border-sky-800' : 'bg-sky-100 text-sky-800 border-sky-300'
              }`}>
                <span className={isDark ? 'text-sky-400' : 'text-sky-600'}>✦</span> The Indian College Reality
              </div>
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2] mb-5 text-balance ${
                isDark ? 'text-white' : 'text-[#0F172A]'
              }`}>
                Why Engineering Students Across India Choose Vyat
              </h2>
              <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                College lectures and traditional online courses fail Indian engineering students in predictable ways: outdated syllabi and unmanageable 60-hour video dumps.
              </p>
            </div>

            {/* Bento Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {/* Card 1 */}
              <div className={`p-8 sm:p-10 rounded-2xl border-2 transition-all hover:-translate-y-1 flex flex-col justify-between ${
                isDark
                  ? 'bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-900/90 text-slate-100 border-slate-800 hover:border-sky-500 shadow-black/50'
                  : 'bg-gradient-to-b from-sky-50 via-sky-100/50 to-sky-50 text-slate-900 border-sky-300/80 shadow-md shadow-sky-500/5 hover:border-sky-400 hover:shadow-xl'
              }`}>
                <div>
                  <span className={`inline-block px-3.5 py-1.5 text-xs font-bold rounded-lg border mb-6 ${
                    isDark ? 'bg-sky-950/80 text-sky-300 border-sky-800' : 'bg-sky-200/80 text-sky-900 border-sky-300'
                  }`}>
                    01 · College Timetable Friendly
                  </span>
                  <h3 className={`text-xl sm:text-2xl font-bold mb-3.5 leading-snug ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                    1 Daily Lesson Fits Your Schedule
                  </h3>
                  <p className={`text-sm sm:text-base leading-relaxed font-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Indian engineering colleges enforce 75% mandatory attendance, long lab sessions, and internal assignments. Vyat’s <strong className="text-sky-500 font-semibold">1 lesson/day rhythm (15–25 mins)</strong> fits seamlessly into your evening routine without late-night burnout.
                  </p>
                </div>
                <div className={`pt-6 border-t mt-8 text-xs font-semibold flex items-center gap-1.5 ${
                  isDark ? 'border-slate-800 text-sky-400' : 'border-sky-200 text-sky-800'
                }`}>
                  <span>✓</span> Zero binge burnout · Consistent daily progress
                </div>
              </div>

              {/* Card 2 */}
              <div className={`p-8 sm:p-10 rounded-2xl border-2 transition-all hover:-translate-y-1 flex flex-col justify-between ${
                isDark
                  ? 'bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-900/90 text-slate-100 border-slate-800 hover:border-sky-500 shadow-black/50'
                  : 'bg-gradient-to-b from-sky-50 via-sky-100/50 to-sky-50 text-slate-900 border-sky-300/80 shadow-md shadow-sky-500/5 hover:border-sky-400 hover:shadow-xl'
              }`}>
                <div>
                  <span className={`inline-block px-3.5 py-1.5 text-xs font-bold rounded-lg border mb-6 ${
                    isDark ? 'bg-sky-950/80 text-sky-300 border-sky-800' : 'bg-sky-200/80 text-sky-900 border-sky-300'
                  }`}>
                    02 · Dual Syllabus Coverage
                  </span>
                  <h3 className={`text-xl sm:text-2xl font-bold mb-3.5 leading-snug ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                    Semester GPA + Placement Coding
                  </h3>
                  <p className={`text-sm sm:text-base leading-relaxed font-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    You don’t have to sacrifice university marks to prepare for tech companies. Our courses cover both university semester theoretical deep-dives (OS, DBMS, Computer Networks) and rigorous LeetCode coding patterns.
                  </p>
                </div>
                <div className={`pt-6 border-t mt-8 text-xs font-semibold flex items-center gap-1.5 ${
                  isDark ? 'border-slate-800 text-sky-400' : 'border-sky-200 text-sky-800'
                }`}>
                  <span>✓</span> Matches AKTU, VTU, Anna Univ &amp; JNTU syllabi
                </div>
              </div>

              {/* Card 3 */}
              <div className={`p-8 sm:p-10 rounded-2xl border-2 transition-all hover:-translate-y-1 flex flex-col justify-between ${
                isDark
                  ? 'bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-900/90 text-slate-100 border-slate-800 hover:border-sky-500 shadow-black/50'
                  : 'bg-gradient-to-b from-sky-50 via-sky-100/50 to-sky-50 text-slate-900 border-sky-300/80 shadow-md shadow-sky-500/5 hover:border-sky-400 hover:shadow-xl'
              }`}>
                <div>
                  <span className={`inline-block px-3.5 py-1.5 text-xs font-bold rounded-lg border mb-6 ${
                    isDark ? 'bg-sky-950/80 text-sky-300 border-sky-800' : 'bg-sky-200/80 text-sky-900 border-sky-300'
                  }`}>
                    03 · Modern Industry Tech
                  </span>
                  <h3 className={`text-xl sm:text-2xl font-bold mb-3.5 leading-snug ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                    Full-Stack &amp; Generative AI
                  </h3>
                  <p className={`text-sm sm:text-base leading-relaxed font-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    College syllabi rarely teach modern Next.js, TypeScript, cloud deployments, or Generative AI. Vyat brings production engineering directly to your screen with hands-on projects recruiters love.
                  </p>
                </div>
                <div className={`pt-6 border-t mt-8 text-xs font-semibold flex items-center gap-1.5 ${
                  isDark ? 'border-slate-800 text-sky-400' : 'border-sky-200 text-sky-800'
                }`}>
                  <span>✓</span> 3 Full-stack &amp; AI portfolio capstones
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. 1 VIDEO / DAY HABIT ENGINE (WITH EXPANSIVE BOTTOM SPACING) ── */}
        <section id="advantages" className={`w-full pt-28 pb-40 sm:pt-36 sm:pb-52 lg:pt-44 lg:pb-60 border-b relative ${
          isDark ? 'bg-[#0B0F17] border-slate-800' : 'bg-white border-sky-100'
        }`}>
          <div className="w-full max-w-[1780px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-20">
            
            {/* Centered Heading Block */}
            <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20 lg:mb-24">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-2xs mb-5 ${
                isDark ? 'bg-sky-950/80 text-sky-300 border-sky-800' : 'bg-sky-100 text-sky-800 border-sky-300'
              }`}>
                <span className={isDark ? 'text-sky-400' : 'text-sky-600'}>✦</span> Engineered for Long-Term Retention
              </div>
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2] mb-5 text-balance ${
                isDark ? 'text-white' : 'text-[#0F172A]'
              }`}>
                How Daily Drip Learning Guarantees Mastery
              </h2>
              <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Consistency beats 40-hour weekend marathons every single time.
              </p>
            </div>

            {/* 4 Habit Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className={`p-8 sm:p-9 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between ${
                isDark
                  ? 'bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-900/90 border-slate-800 hover:border-sky-500'
                  : 'bg-gradient-to-b from-sky-50 via-sky-100/40 to-sky-50/80 border-sky-200 hover:border-sky-400 hover:shadow-xl'
              }`}>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-sky-600 text-white font-extrabold flex items-center justify-center mb-6 text-base shadow-md shadow-sky-600/30">
                    1
                  </div>
                  <h3 className={`font-bold text-lg mb-2.5 min-h-[1.75rem] ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>1 Video Per Day</h3>
                  <p className={`text-sm leading-relaxed font-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    New video lessons release daily. Prevents bingeing and forgetting, building rock-solid recall for viva and interviews.
                  </p>
                </div>
              </div>

              <div className={`p-8 sm:p-9 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between ${
                isDark
                  ? 'bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-900/90 border-slate-800 hover:border-sky-500'
                  : 'bg-gradient-to-b from-sky-50 via-sky-100/40 to-sky-50/80 border-sky-200 hover:border-sky-400 hover:shadow-xl'
              }`}>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-sky-600 text-white font-extrabold flex items-center justify-center mb-6 text-base shadow-md shadow-sky-600/30">
                    2
                  </div>
                  <h3 className={`font-bold text-lg mb-2.5 min-h-[1.75rem] ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Placement Coding Rounds</h3>
                  <p className={`text-sm leading-relaxed font-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Step-by-step problem breakdowns that mimic the exact coding rounds used by leading tech recruiters.
                  </p>
                </div>
              </div>

              <div className={`p-8 sm:p-9 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between ${
                isDark
                  ? 'bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-900/90 border-slate-800 hover:border-sky-500'
                  : 'bg-gradient-to-b from-sky-50 via-sky-100/40 to-sky-50/80 border-sky-200 hover:border-sky-400 hover:shadow-xl'
              }`}>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-sky-600 text-white font-extrabold flex items-center justify-center mb-6 text-base shadow-md shadow-sky-600/30">
                    3
                  </div>
                  <h3 className={`font-bold text-lg mb-2.5 min-h-[1.75rem] ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Interactive MCQs</h3>
                  <p className={`text-sm leading-relaxed font-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Instant checkpoints and concept tests after every lesson to verify your understanding immediately.
                  </p>
                </div>
              </div>

              <div className={`p-8 sm:p-9 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between ${
                isDark
                  ? 'bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-900/90 border-slate-800 hover:border-sky-500'
                  : 'bg-gradient-to-b from-sky-50 via-sky-100/40 to-sky-50/80 border-sky-200 hover:border-sky-400 hover:shadow-xl'
              }`}>
                <div>
                  <div className="w-12 h-12 rounded-xl bg-sky-600 text-white font-extrabold flex items-center justify-center mb-6 text-base shadow-md shadow-sky-600/30">
                    4
                  </div>
                  <h3 className={`font-bold text-lg mb-2.5 min-h-[1.75rem] ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>Verified Credentials</h3>
                  <p className={`text-sm leading-relaxed font-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Tamper-proof verifiable certificates issued only when the full planned curriculum has been completed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. VERIFIED CERTIFICATE SPOTLIGHT (WITH LUXURIOUS SPACE & DEDICATED HEADING ABOVE CARD) ── */}
        <section id="credentials" className={`w-full pt-36 pb-36 sm:pt-48 sm:pb-48 lg:pt-56 lg:pb-56 border-b relative ${
          isDark ? 'bg-[#07090E] border-slate-800' : 'bg-[#F8FAFC] border-sky-100'
        }`}>
          <div className="w-full max-w-[1780px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-20">
            
            {/* Added Dedicated Section Heading Block Above Card (Creates Huge Breathing Room) */}
            <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20 lg:mb-24">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-2xs mb-5 ${
                isDark ? 'bg-sky-950/80 text-sky-300 border-sky-800' : 'bg-sky-100 text-sky-800 border-sky-300'
              }`}>
                <span className={isDark ? 'text-sky-400' : 'text-sky-600'}>✦</span> Verifiable Career Advantage
              </div>
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2] mb-5 text-balance ${
                isDark ? 'text-white' : 'text-[#0F172A]'
              }`}>
                Credentials That Truly Prove Practical Competency
              </h2>
              <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Unlike platforms where users skip videos for a badge, Vyat strictly unlocks credentials only after every lesson and concept test is completed.
              </p>
            </div>

            {/* Spotlight Card */}
            <div className={`rounded-3xl p-8 sm:p-12 lg:p-16 xl:p-20 border-2 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 ${
              isDark
                ? 'bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 text-white border-slate-800 shadow-2xl'
                : 'bg-gradient-to-br from-sky-100/90 via-sky-50 to-white text-slate-900 border-sky-300 shadow-xl'
            }`}>
              <div className="max-w-2xl">
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border mb-5 shadow-2xs ${
                  isDark ? 'bg-sky-950/90 text-sky-300 border-sky-800' : 'bg-sky-200 text-sky-900 border-sky-300'
                }`}>
                  <Award size={14} className={isDark ? 'text-sky-400' : 'text-sky-700'} /> Verified Anti-Cheat Credential
                </span>
                <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-5 leading-tight ${
                  isDark ? 'text-white' : 'text-[#0F172A]'
                }`}>
                  Share Verifiable Proof with Hiring Managers
                </h3>
                <p className={`text-base sm:text-lg leading-relaxed mb-8 font-normal ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Every Vyat credential comes with an authentic public verification link and fraud-proof ID. Add it to LinkedIn and your resume with total confidence when applying to top tech firms.
                </p>
                <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
                  <div className={`flex items-center gap-2 border px-4 py-2.5 rounded-xl font-medium shadow-2xs ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-white border-sky-200 text-slate-700'
                  }`}>
                    <CheckCircle2 size={16} className="text-sky-500 shrink-0" /> Unique Credential ID
                  </div>
                  <div className={`flex items-center gap-2 border px-4 py-2.5 rounded-xl font-medium shadow-2xs ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-white border-sky-200 text-slate-700'
                  }`}>
                    <CheckCircle2 size={16} className="text-sky-500 shrink-0" /> Public Verification URL
                  </div>
                  <div className={`flex items-center gap-2 border px-4 py-2.5 rounded-xl font-medium shadow-2xs ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-white border-sky-200 text-slate-700'
                  }`}>
                    <CheckCircle2 size={16} className="text-sky-500 shrink-0" /> Anti-Fraud Guaranteed
                  </div>
                </div>
              </div>

              {/* Realistic Certificate Mockup Visual */}
              <div className="w-full max-w-md bg-white text-slate-900 border-2 border-sky-300 shadow-2xl rounded-2xl p-7 sm:p-9 relative shrink-0">
                <div className="flex items-center justify-between pb-4 border-b border-sky-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      V
                    </div>
                    <span className="font-bold text-sm tracking-tight text-[#0F172A]">Vyat Engineering</span>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-bold bg-sky-100 text-sky-800 border border-sky-200 rounded-full">
                    Anti-Cheat Verified
                  </span>
                </div>
                <div className="py-8 text-center">
                  <p className="text-[11px] uppercase tracking-widest font-bold text-slate-400">Certificate of Completion</p>
                  <p className="text-2xl font-extrabold text-[#0F172A] mt-2">Aarav Patel</p>
                  <p className="text-xs text-slate-500 mt-1">has demonstrated practical mastery in</p>
                  <p className="text-base font-bold text-sky-600 mt-1">Data Structures &amp; Algorithms</p>
                </div>
                <div className="pt-4 border-t border-sky-100 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>ID: VYAT-2026-CSE-84920</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} /> Authenticated
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 7. FAQ SECTION ── */}
        <section id="faq" className={`w-full pt-28 pb-32 sm:pt-36 sm:pb-40 lg:pt-44 lg:pb-48 border-b relative ${
          isDark ? 'bg-[#0B0F17] border-slate-800' : 'bg-white border-sky-100'
        }`}>
          <div className="w-full max-w-5xl mx-auto px-6 sm:px-10">
            
            {/* Centered Heading Block */}
            <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20 lg:mb-24">
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border shadow-2xs mb-5 ${
                isDark ? 'bg-sky-950/80 text-sky-300 border-sky-800' : 'bg-sky-100 text-sky-800 border-sky-300'
              }`}>
                <span className={isDark ? 'text-sky-400' : 'text-sky-600'}>✦</span> Got Questions?
              </div>
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.2] mb-5 text-balance ${
                isDark ? 'text-white' : 'text-[#0F172A]'
              }`}>
                Frequently Asked Questions for CSE Students
              </h2>
              <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Everything you need to know about Vyat courses, placements, and learning format.
              </p>
            </div>

            {/* Accordion List */}
            <div className="space-y-5">
              {FAQS.map((faq, idx) => (
                <details
                  key={idx}
                  className={`group p-6 sm:p-8 rounded-2xl border-2 transition-colors ${
                    isDark
                      ? 'bg-slate-900/80 border-slate-800 open:border-sky-500 open:bg-slate-900 shadow-black/50 hover:border-slate-700'
                      : 'bg-gradient-to-b from-sky-50 via-white to-sky-50/60 border-sky-200 shadow-2xs open:border-sky-500 open:bg-sky-50/90 hover:border-sky-300'
                  }`}
                >
                  <summary className={`flex items-center justify-between font-bold text-base sm:text-lg cursor-pointer list-none select-none ${
                    isDark ? 'text-white' : 'text-[#0F172A]'
                  }`}>
                    <span>{faq.q}</span>
                    <ChevronRight size={20} className="text-sky-500 group-open:rotate-90 transition-transform shrink-0 ml-4" />
                  </summary>
                  <p className={`mt-4 text-sm sm:text-base leading-relaxed font-normal pt-4 border-t ${
                    isDark ? 'text-slate-300 border-slate-800' : 'text-slate-600 border-sky-200'
                  }`}>
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. PRE-FOOTER CTA BANNER ── */}
        <section className={`w-full pt-28 pb-32 sm:pt-36 sm:pb-40 lg:pt-44 lg:pb-48 text-center relative overflow-hidden border-b ${
          isDark
            ? 'bg-gradient-to-b from-[#07090E] via-[#0D131F] to-[#07090E] border-slate-800'
            : 'bg-gradient-to-b from-white via-sky-50 to-sky-100/60 border-sky-200'
        }`}>
          <div className="w-full max-w-5xl mx-auto px-6 sm:px-10 text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border mb-6 shadow-2xs ${
              isDark ? 'bg-sky-950/80 text-sky-300 border-sky-800' : 'bg-sky-200 text-sky-900 border-sky-300'
            }`}>
              <span className="text-sky-500">⚡</span> Accelerate Your Career
            </div>
            <h2 className={`text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight text-balance ${
              isDark ? 'text-white' : 'text-[#0F172A]'
            }`}>
              Ready to Master Computer Science?
            </h2>
            <p className={`text-base sm:text-lg max-w-2xl mx-auto mb-12 leading-relaxed font-normal ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Join thousands of engineering students across India mastering core computer science, DSA, Web Dev, and AI to secure top engineering placements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/explore">
                <button className="w-full sm:w-auto px-9 py-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl shadow-lg shadow-sky-600/30 transition-all hover:scale-105 flex items-center justify-center gap-2 text-base">
                  Explore All CSE Courses <ArrowRight size={18} />
                </button>
              </Link>
              <Link href="/login">
                <button className={`w-full sm:w-auto px-9 py-4 font-semibold rounded-xl border-2 shadow-sm transition-all text-base ${
                  isDark
                    ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                    : 'bg-white hover:bg-sky-50 text-slate-700 border-sky-200'
                }`}>
                  Sign In to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── 9. FOOTER (DARK THEME WITH QUICK THEME SWITCHER) ── */}
      <footer className="w-full bg-[#0B0F17] border-t border-slate-800 py-14 text-sm text-slate-400">
        <div className="w-full max-w-[1780px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-sky-600/30">
              V
            </div>
            <span className="font-bold text-white text-base">Vyat</span>
            <span className="text-xs text-slate-500">· Courses for CSE &amp; Engineering Students in India</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-semibold text-slate-400">
            <Link href="/explore" className="hover:text-white transition-colors">All Courses</Link>
            <a href="#curriculum" className="hover:text-white transition-colors">Placements &amp; Core CS</a>
            <a href="#engineering-context" className="hover:text-white transition-colors">Why Engineering</a>
            <Link href="/login" className="hover:text-white transition-colors">Student Login</Link>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>

            {/* Quick theme toggle in footer */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-slate-300 transition-colors ml-2"
            >
              {isDark ? <Sun size={13} className="text-amber-400" /> : <Moon size={13} className="text-sky-400" />}
              <span>{isDark ? 'Light' : 'Dark'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Vyat. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
