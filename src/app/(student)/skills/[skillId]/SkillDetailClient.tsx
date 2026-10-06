'use client';

import { Skill, StudentSkillAccess, Lesson, LessonProgress, Question, Certificate } from '@/types/database';
import { calculateProgress, formatDate } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import ProgressBar from '@/components/ui/ProgressBar';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import {
  ArrowLeft, Lock, CheckCircle2, PlayCircle, FileText,
  HelpCircle, Award, MessageCircle, Clock, ArrowRight,
  BookOpen,
} from 'lucide-react';

interface Props {
  skill: Skill & { course: { name: string; branch: { name: string } } };
  access: StudentSkillAccess | null;
  hasAccess: boolean;
  lessons: Lesson[];
  lessonProgress: LessonProgress[];
  questions: Question[];
  certificate: Certificate | null;
}

export default function SkillDetailClient({
  skill,
  access,
  hasAccess,
  lessons,
  lessonProgress,
  questions,
  certificate,
}: Props) {
  const completedLessons = lessonProgress.filter(lp => lp.is_completed).length;
  const progress = calculateProgress(completedLessons, lessons.length);
  const isCompleted = access?.status === 'completed';

  const isLessonCompleted = (lessonId: string) =>
    lessonProgress.some(lp => lp.lesson_id === lessonId && lp.is_completed);

  const isLessonStarted = (lessonId: string) =>
    lessonProgress.some(lp => lp.lesson_id === lessonId && lp.is_started);

  // Find next lesson to continue
  const nextLesson = lessons.find(l => !isLessonCompleted(l.id));

  return (
    <div className="page-container flex flex-col gap-8 animate-fade-in">
      {/* Back button */}
      <Link href="/skills">
        <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />}>
          Back to My Skills
        </Button>
      </Link>

      {/* ── 1. PREMIUM HERO CARD (Matched Course Detail Style) ── */}
      <div className="rounded-[32px] p-6 sm:p-8 md:p-10 shadow-[0_12px_40px_rgba(37,99,235,0.15)] relative overflow-hidden flex flex-col bg-gradient-to-br from-[#2563eb] via-[#7c3aed] to-[#d946ef] text-white mb-2">
        
        {/* Subtle background layering pattern */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-32 -right-32 w-[32rem] h-[32rem] rounded-full bg-white/20 blur-3xl"></div>
          <div className="absolute -bottom-20 left-20 w-64 h-64 rounded-full bg-blue-300/30 blur-2xl"></div>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 m-6 sm:m-8" style={{ marginTop: '24px', marginLeft: '24px', marginBottom: '24px' }}>
          
          <div className="flex flex-col gap-6 max-w-5xl">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase bg-white/20 text-white border border-white/30 backdrop-blur-md shadow-sm">
                <span className="text-sm leading-none">{skill.course?.branch?.icon || '💻'}</span>
                {skill.course?.branch?.name || 'Curriculum'} → {skill.course?.name || 'Course'}
              </span>
              
              {access && (
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase text-white border backdrop-blur-md shadow-sm ${
                  isCompleted ? 'bg-emerald-500/90 border-emerald-400/50' : 'bg-blue-500/90 border-blue-400/50'
                }`}>
                  {isCompleted ? <><CheckCircle2 size={14} strokeWidth={2.5} /> Completed</> : 'Active'}
                </span>
              )}

              {skill.difficulty && (
                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase text-white border backdrop-blur-md shadow-sm ${
                  skill.difficulty === 'beginner' ? 'bg-emerald-500/90 border-emerald-400/50' : 
                  skill.difficulty === 'intermediate' ? 'bg-amber-500/90 border-amber-400/50' : 
                  'bg-red-500/90 border-red-400/50'
                }`}>
                  {skill.difficulty}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.1] drop-shadow-md">
              {skill.name}
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-3xl font-medium mt-1">
              {skill.description || 'Master this skill through structured lessons and hands-on practice.'}
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm font-bold text-slate-800">
              <div className="flex items-center gap-2.5 bg-white px-5 py-2.5 rounded-2xl shadow-sm">
                <BookOpen size={18} className="text-[#3b82f6]" strokeWidth={2.5} />
                <span>{lessons.length} Lessons</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white px-5 py-2.5 rounded-2xl shadow-sm">
                <HelpCircle size={18} className="text-[#8b5cf6]" strokeWidth={2.5} />
                <span>{questions.length} Questions</span>
              </div>
              {skill.estimated_hours && (
                <div className="flex items-center gap-2.5 bg-white px-5 py-2.5 rounded-2xl shadow-sm">
                  <Clock size={18} className="text-[#ec4899]" strokeWidth={2.5} />
                  <span>{skill.estimated_hours} Hours</span>
                </div>
              )}
            </div>

            {/* Progress */}
            {hasAccess && (
              <div className="mt-4 max-w-2xl">
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="font-bold text-white/90 uppercase tracking-wider text-xs">Progress</span>
                  <span className="font-bold text-white">
                    {completedLessons}/{lessons.length} lessons · {progress}%
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm overflow-hidden">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${isCompleted ? 'bg-emerald-400' : 'bg-white'}`}
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Certificate status */}
          {certificate && (
            <div className="text-right shrink-0">
              {certificate.status === 'unlocked' ? (
                <div className="inline-flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md">
                  <Award size={32} className="text-amber-300 drop-shadow-md" />
                  <p className="text-sm font-bold text-white">Certificate Available</p>
                  <button className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2">
                    <Award size={16} /> Download
                  </button>
                </div>
              ) : (
                <div className="inline-flex flex-col items-center gap-2 p-5 rounded-2xl bg-black/10 border border-white/10 backdrop-blur-md">
                  <Lock size={28} className="text-white/50" />
                  <p className="text-xs font-medium text-white/70">Complete to unlock</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Locked state */}
      {!hasAccess && (
        <Card className="text-center !py-12">
          <Lock size={40} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            {access?.status === 'expired' ? 'Access Expired' : 'Skill Locked'}
          </h2>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--text-tertiary)' }}>
            {access?.status === 'expired'
              ? 'Your access to this skill has expired. Contact the administrator to extend your access.'
              : 'You don\'t have access to this skill. Contact your mentor to activate it.'}
          </p>
          <Button icon={<MessageCircle size={16} />}>
            Contact Mentor
          </Button>
        </Card>
      )}

      {/* Lessons list */}
      {hasAccess && (
        <div className="bg-white dark:bg-[#14141e] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Lessons
            </h2>
            {nextLesson && (
              <Link href={`/skills/${skill.id}/lessons/${nextLesson.id}`} className="shrink-0">
                <Button size="sm" icon={<PlayCircle size={14} />}>
                  {completedLessons > 0 ? 'Continue' : 'Start Learning'}
                </Button>
              </Link>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {lessons.map((lesson, idx) => {
              const completed = isLessonCompleted(lesson.id);
              const started = isLessonStarted(lesson.id);

              return (
                <Link key={lesson.id} href={`/skills/${skill.id}/lessons/${lesson.id}`}>
                  <div
                    className={`
                      flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a24] shadow-sm hover:shadow-md transition-all
                      ${completed ? 'border-emerald-200 dark:border-emerald-800/30' : started ? 'border-blue-200 dark:border-blue-800/30' : 'hover:border-indigo-300 dark:hover:border-indigo-700'}
                    `}
                  >
                    {/* Lesson number */}
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold
                      ${completed
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
                        : started
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }
                    `}
                    >
                      {completed ? <CheckCircle2 size={18} /> : idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold truncate text-gray-900 dark:text-gray-100">
                        {lesson.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {lesson.duration_minutes && (
                          <span className="flex items-center gap-1.5">
                            <Clock size={12} className="text-pink-500" /> {lesson.duration_minutes} min
                          </span>
                        )}
                        {lesson.video_path && (
                          <span className="flex items-center gap-1.5">
                            <PlayCircle size={12} className="text-indigo-500" /> Video
                          </span>
                        )}
                        {lesson.notes_content && (
                          <span className="flex items-center gap-1.5">
                            <FileText size={12} className="text-amber-500" /> Notes
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex-shrink-0 pl-2">
                       <ArrowRight size={18} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
