'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, CheckCircle2, Play, PlayCircle, Clock,
  Video, ChevronDown, ChevronUp, ArrowRight, Layers,
  BookOpen, Sparkles, Award
} from 'lucide-react';

export interface LessonItem {
  id: string;
  title: string;
  duration_minutes?: number | null;
  video_url?: string | null;
  sort_order?: number;
  is_completed?: boolean;
}

export interface SkillItem {
  id: string;
  name: string;
  short_description?: string | null;
  description?: string | null;
  difficulty?: string;
  estimated_hours?: number | null;
  sort_order: number;
  is_active: boolean;
  _lessonCount: number;
  _completedLessons: number;
  _status: 'active' | 'completed' | 'expired' | null;
  lessons?: LessonItem[];
}

export interface CourseData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnail_url?: string | null;
  branch?: { name: string; icon?: string };
  skills: SkillItem[];
}

interface Props {
  course: CourseData;
}

// Retain the core visual identity
const MODULE_COLORS = [
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#f59e0b', // amber-500
  '#10b981', // emerald-500
  '#06b6d4', // cyan-500
];

export default function CourseDetailClient({ course }: Props) {
  const [expandedSkills, setExpandedSkills] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    course.skills.forEach(s => {
      initial[s.id] = true;
    });
    return initial;
  });

  const toggleExpand = (skillId: string) => {
    setExpandedSkills(prev => ({
      ...prev,
      [skillId]: !prev[skillId],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    course.skills.forEach(s => {
      all[s.id] = true;
    });
    setExpandedSkills(all);
  };

  const collapseAll = () => {
    setExpandedSkills({});
  };

  const totalSkills = course.skills.length;
  const totalLessons = course.skills.reduce(
    (acc, s) => acc + (s._lessonCount || s.lessons?.length || 0),
    0
  );
  const totalCompletedLessons = course.skills.reduce(
    (acc, s) => acc + (s._completedLessons || (s.lessons?.filter(l => l.is_completed).length ?? 0)),
    0
  );
  const totalHours = course.skills.reduce((acc, s) => acc + (s.estimated_hours || 0), 0);
  const overallProgress = totalLessons > 0 ? Math.round((totalCompletedLessons / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F4F7FB] dark:bg-[#0a0a0f] text-slate-900 dark:text-slate-100 pb-20 font-sans flex flex-col w-full">
      
      {/* 
        MAIN CONTENT CONTAINER 
        Uses explicit gaps and spacing to create a clean, structured layout.
      */}
      <div className="w-full flex-1 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pt-6 pb-24 flex flex-col gap-6 md:gap-8 mx-auto max-w-[1800px] animate-fade-in">
        
        {/* Navigation */}
        <div className="mb-2">
          <Link
            href="/classes"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors text-sm font-bold"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            Back to Classes
          </Link>
        </div>

        {/* ── 1. PREMIUM HERO CARD (Restored gradient identity) ── */}
        <div className="rounded-[32px] p-6 sm:p-8 md:p-10 shadow-[0_12px_40px_rgba(37,99,235,0.15)] relative overflow-hidden flex flex-col bg-gradient-to-br from-[#2563eb] via-[#7c3aed] to-[#d946ef] text-white">
          
          {/* Subtle background layering pattern */}
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <div className="absolute -top-32 -right-32 w-[32rem] h-[32rem] rounded-full bg-white/20 blur-3xl"></div>
            <div className="absolute -bottom-20 left-20 w-64 h-64 rounded-full bg-blue-300/30 blur-2xl"></div>
          </div>

          <div className="relative z-10 flex flex-col gap-6 max-w-5xl m-6 sm:m-8" style={{ marginTop: '24px', marginLeft: '24px', marginBottom: '24px' }}>
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase bg-white/20 text-white border border-white/30 backdrop-blur-md shadow-sm">
                <span className="text-sm leading-none">{course.branch?.icon || '💻'}</span>
                {course.branch?.name || 'Curriculum'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase bg-emerald-500/90 text-white border border-emerald-400/50 backdrop-blur-md shadow-sm">
                <Award size={14} strokeWidth={2.5} /> Official
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.1] drop-shadow-md">
              {course.name}
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-3xl font-medium mt-1">
              {course.description ||
                'Build a rock-solid foundation in programming, data structures, algorithms, and core computer science concepts.'}
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm font-bold text-slate-800">
              <div className="flex items-center gap-2.5 bg-white px-5 py-2.5 rounded-2xl shadow-sm">
                <Layers size={18} className="text-[#3b82f6]" strokeWidth={2.5} />
                <span>{totalSkills} Modules</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white px-5 py-2.5 rounded-2xl shadow-sm">
                <Video size={18} className="text-[#8b5cf6]" strokeWidth={2.5} />
                <span>{totalLessons} Lessons</span>
              </div>
              {totalHours > 0 && (
                <div className="flex items-center gap-2.5 bg-white px-5 py-2.5 rounded-2xl shadow-sm">
                  <Clock size={18} className="text-[#ec4899]" strokeWidth={2.5} />
                  <span>{totalHours} Hours</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── 2. YOUR JOURNEY CARD ── */}
        <div className="bg-white dark:bg-[#14141e] rounded-[24px] p-6 lg:p-8 shadow-sm border border-slate-200 dark:border-slate-800/80 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="w-full lg:w-3/5 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Your Journey</h3>
              <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{overallProgress}%</span>
            </div>
            
            {/* Bold, thick progress bar */}
            <div className="h-5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner mb-8">
              <div 
                className="h-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${overallProgress}%` }}
              >
                <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress-stripes_1s_linear_infinite]"></div>
              </div>
            </div>
            
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Completed <strong className="text-slate-700 dark:text-slate-300">{totalCompletedLessons}</strong> out of <strong className="text-slate-700 dark:text-slate-300">{totalLessons}</strong> lessons
            </p>
          </div>

          <div className="flex-shrink-0 w-full lg:w-auto">
            {overallProgress === 100 ? (
              <div className="w-full lg:w-auto inline-flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-8 py-4 rounded-[16px] font-bold border border-emerald-200 dark:border-emerald-800/50 shadow-sm text-base">
                <Award size={22} strokeWidth={2.5} /> Course Completed!
              </div>
            ) : (
              <div className="w-full lg:w-auto inline-flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-8 py-4 rounded-[16px] font-bold border border-indigo-200 dark:border-indigo-800/50 shadow-sm text-base">
                <Sparkles size={20} strokeWidth={2.5} /> Keep Learning
              </div>
            )}
          </div>
        </div>

        {/* ── 3. COURSE MODULES ── */}
        <div className="flex flex-col space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Curriculum Modules
            </h2>
            <div className="flex items-center bg-white dark:bg-[#14141e] rounded-xl p-1 shadow-sm border border-slate-200 dark:border-slate-800">
              <button
                onClick={expandAll}
                className="px-4 py-2 text-sm font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 transition-colors"
              >
                Expand All
              </button>
              <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
              <button
                onClick={collapseAll}
                className="px-4 py-2 text-sm font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 transition-colors"
              >
                Collapse All
              </button>
            </div>
          </div>

          {course.skills.length === 0 ? (
             <div className="bg-white dark:bg-[#14141e] border border-slate-200 dark:border-slate-800 rounded-[24px] p-16 text-center shadow-sm">
               <BookOpen size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
               <h3 className="text-lg font-bold text-slate-800 dark:text-white">Coming Soon</h3>
               <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">The curriculum is currently being prepared.</p>
             </div>
          ) : (
            // GAP BETWEEN EVERY MODULE CARD
            <div className="flex flex-col gap-6 sm:gap-8">
              {course.skills.map((skill, index) => {
                const accentColor = MODULE_COLORS[index % MODULE_COLORS.length];
                const skillLessons = skill.lessons || [];
                const lessonCount = skill._lessonCount || skillLessons.length;
                const completedLessons = skill._completedLessons || skillLessons.filter(l => l.is_completed).length;
                const skillProgress = lessonCount > 0 ? Math.round((completedLessons / lessonCount) * 100) : 0;
                const isCompleted = skill._status === 'completed' || (lessonCount > 0 && completedLessons === lessonCount);
                const isExpanded = !!expandedSkills[skill.id];

                const nextLesson = skillLessons.find(l => !l.is_completed) || skillLessons[0];
                const continueUrl = nextLesson
                  ? `/skills/${skill.id}/lessons/${nextLesson.id}`
                  : `/skills/${skill.id}`;

                return (
                  // DISTINCT MODULE CARD
                  <div
                    key={skill.id}
                    className="bg-white dark:bg-[#14141e] rounded-[24px] shadow-sm border border-slate-200 dark:border-slate-800/80 transition-all duration-300 overflow-hidden relative group hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
                  >
                    {/* Strong colorful left border accent matching module identity */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-2.5 opacity-90"
                      style={{ backgroundColor: accentColor }}
                    />

                    {/* ── MODULE HEADER ── */}
                    <div className="p-8 lg:p-10 pl-11 lg:pl-12">
                      <div className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-center">
                        
                        {/* Info Section */}
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-4">
                            {/* Number Badge */}
                            <div 
                              className="w-12 h-12 rounded-[14px] flex items-center justify-center font-black text-white shadow-sm text-lg"
                              style={{ backgroundColor: accentColor }}
                            >
                              {String(index + 1).padStart(2, '0')}
                            </div>
                            
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                              {skill.name}
                            </h3>

                            {isCompleted && (
                              <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs px-3.5 py-1.5 rounded-full font-black uppercase tracking-wider">
                                Completed
                              </span>
                            )}
                          </div>

                          <p className="text-slate-600 dark:text-slate-400 text-base max-w-3xl leading-relaxed font-medium">
                            {skill.short_description || skill.description || 'Dive into core concepts, practical examples, and master this section.'}
                          </p>

                          {/* Stats Row */}
                          <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-600 dark:text-slate-300 pt-1">
                            <span className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700/50">
                              <Video size={16} style={{ color: accentColor }} strokeWidth={2.5} />
                              {lessonCount} Lessons
                            </span>
                            {skill.estimated_hours && (
                              <span className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                <Clock size={16} className="text-[#ec4899]" strokeWidth={2.5} />
                                {skill.estimated_hours} Hours
                              </span>
                            )}
                            <span className="flex items-center gap-2 bg-emerald-50/50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                              <CheckCircle2 size={16} className="text-emerald-500" strokeWidth={2.5} />
                              {completedLessons}/{lessonCount} Watched
                            </span>
                          </div>
                        </div>

                        {/* Action Section */}
                        <div className="flex items-center gap-5 w-full lg:w-auto pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                          {/* Progress Text */}
                          <div className="text-sm font-black px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50" style={{ color: accentColor }}>
                            {skillProgress}% done
                          </div>

                          <Link href={continueUrl} className="flex-1 lg:flex-none">
                            <button
                              type="button"
                              className="w-full lg:w-auto text-white px-8 py-3.5 text-sm font-bold rounded-[14px] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2"
                              style={{ backgroundColor: accentColor }}
                            >
                              <PlayCircle size={18} strokeWidth={2.5} />
                              {completedLessons > 0 ? 'Continue' : 'Start'}
                            </button>
                          </Link>

                          <button
                            onClick={() => toggleExpand(skill.id)}
                            className="p-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-[14px] transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
                          >
                            {isExpanded ? <ChevronUp size={22} strokeWidth={2.5} /> : <ChevronDown size={22} strokeWidth={2.5} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* ── COMPACT LESSONS LIST ── */}
                    {isExpanded && (
                      <div className="bg-slate-50/60 dark:bg-[#0a0a0f]/40 border-t border-slate-100 dark:border-slate-800 px-6 sm:px-10 pl-11 lg:pl-12 pt-8 pb-10">
                        {skillLessons.length === 0 ? (
                          <div className="text-center py-6 text-slate-500 font-bold">No lessons available yet.</div>
                        ) : (
                          // Separated list with gaps and individual cards
                          <div className="flex flex-col gap-4">
                            {skillLessons.map((lesson) => {
                              const isLessonDone = !!lesson.is_completed;
                              return (
                                <Link
                                  key={lesson.id}
                                  href={`/skills/${skill.id}/lessons/${lesson.id}`}
                                  className="block p-5 sm:p-6 flex items-center justify-between bg-white dark:bg-[#14141e] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all group"
                                >
                                  <div className="flex items-center gap-4 min-w-0">
                                    {/* Status Icon */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                      isLessonDone 
                                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
                                      : 'bg-slate-100 text-slate-400 dark:bg-slate-800 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors'
                                    }`}>
                                      {isLessonDone ? <CheckCircle2 size={16} strokeWidth={3} /> : <Play size={12} className="ml-0.5" strokeWidth={3} />}
                                    </div>
                                    
                                    {/* Lesson Title */}
                                    <span className={`font-bold truncate text-[15px] transition-colors ${
                                      isLessonDone ? 'text-slate-800 dark:text-slate-200' : 'text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                                    }`}>
                                      {lesson.sort_order ? `${lesson.sort_order}. ` : ''}{lesson.title}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-5 shrink-0 pl-4">
                                    {/* Duration Indicator */}
                                    <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 px-3 py-1 rounded-md">
                                      <Clock size={14} className="text-[#ec4899]" />
                                      {lesson.duration_minutes ? `${lesson.duration_minutes} min` : 'Video'}
                                    </span>
                                    
                                    {/* Status/Action Pill */}
                                    <div className={`text-xs font-black px-4 py-2 rounded-lg transition-all ${
                                      isLessonDone
                                      ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400'
                                      : 'text-indigo-700 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0'
                                    }`}>
                                      {isLessonDone ? 'COMPLETED' : 'START LESSON →'}
                                    </div>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
