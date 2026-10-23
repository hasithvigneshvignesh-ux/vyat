'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Container, SectionHeader, Reveal } from './primitives';

export const FAQS_DATA = [
  {
    q: 'What courses are available for CSE students on Vyat?',
    a: 'Vyat provides specialized curriculums covering Campus Placement Preparation, Core CS Subjects (Operating Systems, DBMS, Computer Networks), Data Structures & Algorithms (DSA), Full-Stack Web Development, and AI & Machine Learning. Every track is built specifically for Indian B.Tech / BE Computer Science students.',
  },
  {
    q: 'How does Vyat prepare Indian engineering students for campus placements?',
    a: 'Vyat bridges the gap between university theory and competitive hiring. Students learn high-frequency placement coding questions (LeetCode patterns), technical viva questions for core subjects, aptitude fundamentals, and how to build resume-worthy Full-Stack and AI projects.',
  },
  {
    q: 'Which core computer science subjects are covered for semester exams & interviews?',
    a: 'Vyat covers Operating Systems (concurrency, scheduling, memory management), Database Management Systems (SQL, normalization, ACID, indexing), Computer Networks (TCP/IP stack, routing, sockets), and Object-Oriented Programming (OOP in C++ and Java) matching Indian university syllabi (AKTU, VTU, Anna University, JNTU, SPPU) and placement interviews.',
  },
  {
    q: 'Are DSA (Data Structures & Algorithms) and Web Development included?',
    a: 'Yes. The DSA track covers Arrays, Linked Lists, Trees, Graphs, and Dynamic Programming with time-complexity analysis. The Web Development track teaches modern Full-Stack engineering using JavaScript, TypeScript, React, Next.js, Node.js, and databases to build real-world applications.',
  },
  {
    q: 'How does the AI Learning track help CSE students stand out to recruiters?',
    a: 'The AI Learning track teaches practical Python for data science, NumPy, Pandas, Scikit-learn, Neural Networks, and Generative AI applications. Rather than just theory, students build AI-powered applications that directly showcase modern engineering skills on their resumes and GitHub.',
  },
  {
    q: "How does the daily drip video format fit an engineering student's timetable?",
    a: 'Engineering students in India balance 8 AM–4 PM college lectures, mandatory 75% attendance, and lab submissions. Vyat releases 1 focused lesson (15–25 mins) per day. This prevents binge burnout, builds consistent coding habits, and ensures steady progress throughout the semester.',
  },
  {
    q: 'Are Vyat certificates verified and accepted on resumes and LinkedIn?',
    a: 'Yes. Every Vyat certificate is tamper-proof with a unique verification ID and a public link. Unlike other platforms where users can skip videos to get certificates, Vyat strictly unlocks credentials only after every lesson and checkpoint in the curriculum has been completed.',
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="w-full landing-section relative border-b border-slate-200/70 dark:border-white/5">
      <Container>
        <SectionHeader
          pillText="Got Questions?"
          title="Frequently Asked Questions for CSE Students"
          subtitle="Everything you need to know about Vyat courses, placements, and learning format."
        />

        {/* ── Centered max-w-[780px] FAQ container with 12px gap ── */}
        <div className="w-full max-w-[780px] mx-auto space-y-3">
          {FAQS_DATA.map((faq, idx) => {
            const isOpen = openIndex === idx;
            const headingId = `faq-heading-${idx}`;
            const panelId = `faq-panel-${idx}`;

            return (
              <Reveal key={idx} delayMs={idx * 50}>
                <div
                  className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
                    isOpen
                      ? 'border-sky-500/50 dark:border-sky-400/50 bg-white dark:bg-[#0d1424] shadow-[0_8px_28px_rgba(14,165,233,0.08)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.6)]'
                      : 'border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-[#0b1020]/75 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                  style={{
                    borderLeftWidth: isOpen ? '4px' : undefined,
                    borderLeftColor: isOpen ? '#0ea5e9' : undefined,
                  }}
                >
                  <button
                    type="button"
                    id={headingId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(idx)}
                    className="w-full min-h-[56px] flex items-center justify-between gap-4 text-left cursor-pointer transition-colors"
                    style={{ padding: '18px 22px' }}
                  >
                    <span
                      className={`font-semibold text-sm sm:text-base leading-snug transition-colors ${
                        isOpen
                          ? 'text-sky-600 dark:text-sky-400 font-bold'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {faq.q}
                    </span>

                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? 'rotate-180 bg-sky-500/10 text-sky-600 dark:text-sky-400'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      <ChevronDown size={17} />
                    </span>
                  </button>

                  {/* Smooth animated accordion panel with grid-template-rows */}
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headingId}
                    className="grid transition-all duration-300 ease-in-out"
                    style={{
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                    }}
                  >
                    <div className="overflow-hidden">
                      <div
                        className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-white/5 font-normal"
                        style={{
                          padding: '12px 22px 18px 22px',
                        }}
                      >
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
