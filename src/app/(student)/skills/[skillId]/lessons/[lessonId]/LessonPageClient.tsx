'use client';

import { useState, useEffect } from 'react';
import { Lesson, LessonProgress, Question, LessonResource } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useToast } from '@/providers/ToastProvider';
import Link from 'next/link';
import {
  ArrowLeft, ArrowRight, CheckCircle2, PlayCircle,
  FileText, HelpCircle, Download, ChevronRight,
  Menu, X, BookOpen, Sparkles, RefreshCw, Award
} from 'lucide-react';
import { formatGoogleDriveUrl } from '@/lib/drive-utils';
import DriveEmbedPlayer from '@/components/video/drive-embed-player';

interface Props {
  lesson: Lesson & { skill: { id: string; name: string; course: { name: string; branch: { name: string } } } };
  allLessons: { id: string; title: string; sort_order: number }[];
  progress: LessonProgress | null;
  allProgress: { lesson_id: string; is_completed: boolean; is_started: boolean }[];
  questions: Question[];
  resources: LessonResource[];
  userId: string;
  skillId: string;
}

export default function LessonPageClient({
  lesson,
  allLessons,
  progress,
  allProgress,
  questions: initialQuestions,
  resources,
  userId,
  skillId,
}: Props) {
  const supabase = createClient();
  const { addToast } = useToast();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isCompleted, setIsCompleted] = useState(progress?.is_completed || false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  // If no DB questions for this lesson, generate interactive topic check questions
  const defaultTopicQuestions: Question[] = [
    {
      id: `topic-q1-${lesson.id}`,
      skill_id: skillId,
      lesson_id: lesson.id,
      question_text: `Based on "${lesson.title}", what is the primary objective or foundational concept covered in this lecture?`,
      question_type: 'mcq',
      options: [
        { id: 'a', text: 'Understanding core theoretical principles and practical application in real-world systems' },
        { id: 'b', text: 'Memorizing arbitrary syntax without implementation' },
        { id: 'c', text: 'Skipping edge cases and ignoring time complexity' },
        { id: 'd', text: 'None of the above' },
      ],
      correct_answer: 'a',
      explanation: 'This lecture focuses on mastering core theoretical foundations alongside practical implementation and architectural trade-offs.',
      difficulty: 'easy',
      marks: 1,
      sort_order: 10,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    {
      id: `topic-q2-${lesson.id}`,
      skill_id: skillId,
      lesson_id: lesson.id,
      question_text: `When analyzing performance trade-offs for this topic, which factor is most crucial?`,
      question_type: 'mcq',
      options: [
        { id: 'a', text: 'Color scheme of the development environment' },
        { id: 'b', text: 'Asymptotic time and space complexity with respect to input size N' },
        { id: 'c', text: 'Only the number of lines of code written' },
        { id: 'd', text: 'File creation timestamp' },
      ],
      correct_answer: 'b',
      explanation: 'Computational efficiency is primarily measured by evaluating time and space growth rates as input size N scales.',
      difficulty: 'medium',
      marks: 1,
      sort_order: 20,
      is_active: true,
      created_at: new Date().toISOString(),
    },
  ];

  const activeQuestions = initialQuestions.length > 0 ? initialQuestions : defaultTopicQuestions;

  const currentIdx = allLessons.findIndex(l => l.id === lesson.id);
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

  // Mark lesson as started
  useEffect(() => {
    const markStarted = async () => {
      if (!progress) {
        await supabase.from('lesson_progress').insert({
          student_id: userId,
          lesson_id: lesson.id,
          skill_id: skillId,
          is_started: true,
          started_at: new Date().toISOString(),
        });
      }
    };
    markStarted();
  }, [lesson.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Removed fetch video URL logic as we now use Google Drive embed links

  const handleMarkComplete = async () => {
    try {
      if (progress) {
        await supabase.from('lesson_progress').update({
          is_completed: true,
          completed_at: new Date().toISOString(),
          video_watched: true,
        }).eq('id', progress.id);
      } else {
        await supabase.from('lesson_progress').insert({
          student_id: userId,
          lesson_id: lesson.id,
          skill_id: skillId,
          is_started: true,
          is_completed: true,
          video_watched: true,
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        });
      }
      setIsCompleted(true);
      addToast('Lesson marked as completed!', 'success');

      // Log activity
      await supabase.from('student_activity').insert({
        student_id: userId,
        activity_type: 'lesson_completed',
        description: `Completed lesson: ${lesson.title}`,
        metadata: { lesson_id: lesson.id, skill_id: skillId },
      });
    } catch {
      addToast('Failed to update progress', 'error');
    }
  };

  const getProgressForLesson = (lessonId: string) =>
    allProgress.find(p => p.lesson_id === lessonId);

  // Compute quiz score
  const correctCount = activeQuestions.filter(
    (q) => selectedAnswers[q.id] === q.correct_answer
  ).length;

  return (
    <div className="min-h-[100dvh] animate-fade-in">
      {/* Top nav bar */}
      <div
        className="sticky top-0 z-30 border-b px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="lg:hidden p-2 rounded-lg"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Menu size={18} />
          </button>
          <Link href={`/skills/${skillId}`}>
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={14} />}>
              <span className="hidden sm:inline">{lesson.skill?.name}</span>
            </Button>
          </Link>
        </div>
        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          Lesson {currentIdx + 1} of {allLessons.length}
        </div>
        <div className="flex gap-2">
          {prevLesson && (
            <Link href={`/skills/${skillId}/lessons/${prevLesson.id}`}>
              <Button variant="ghost" size="sm"><ArrowLeft size={14} /></Button>
            </Link>
          )}
          {nextLesson && (
            <Link href={`/skills/${skillId}/lessons/${nextLesson.id}`}>
              <Button variant="ghost" size="sm"><ArrowRight size={14} /></Button>
            </Link>
          )}
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Lesson navigation */}
        <aside
          className={`
            fixed lg:sticky lg:top-[57px] left-0 top-[57px] bottom-0 z-20
            w-72 border-r overflow-y-auto
            transition-transform lg:translate-x-0
            ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
          `}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
            height: 'calc(100dvh - 57px)',
          }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Course Modules
              </h3>
              <button
                onClick={() => setShowSidebar(false)}
                className="lg:hidden p-1 rounded-lg"
                style={{ color: 'var(--text-tertiary)' }}
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-1">
              {allLessons.map((l, idx) => {
                const lProgress = getProgressForLesson(l.id);
                const isCurrent = l.id === lesson.id;
                return (
                  <Link
                    key={l.id}
                    href={`/skills/${skillId}/lessons/${l.id}`}
                    onClick={() => setShowSidebar(false)}
                    className={`
                      flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all
                      ${isCurrent ? 'bg-blue-500/10 text-blue-400 font-medium' : 'hover:bg-[var(--bg-tertiary)]'}
                    `}
                    style={{ color: isCurrent ? undefined : 'var(--text-secondary)' }}
                  >
                    <span className={`
                      w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 text-xs font-bold
                      ${lProgress?.is_completed ? 'bg-emerald-500/10 text-emerald-400' : ''}
                    `}
                    style={!lProgress?.is_completed ? { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)' } : undefined}
                    >
                      {lProgress?.is_completed ? <CheckCircle2 size={12} /> : idx + 1}
                    </span>
                    <span className="truncate">{l.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
            {/* Lesson title */}
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>
                {lesson.skill?.course?.branch?.name} → {lesson.skill?.course?.name} → {lesson.skill?.name}
              </p>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {lesson.title}
              </h1>
              {lesson.description && (
                <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                  {lesson.description}
                </p>
              )}
            </div>

            {/* Video Player Section */}
            {lesson.video_url ? (
              <DriveEmbedPlayer embedUrl={formatGoogleDriveUrl(lesson.video_url).embedUrl} />
            ) : (
              <div className="video-container relative aspect-video w-full rounded-2xl overflow-hidden border bg-black shadow-xl" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-black p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 animate-pulse">
                    <PlayCircle size={36} />
                  </div>
                  <h3 className="text-base font-semibold text-white">Video Lecture Stream</h3>
                  <p className="text-xs text-gray-400 max-w-sm mt-1">
                    Streaming masterclass on: <span className="text-blue-300 font-medium">{lesson.title}</span>. Complete the video and test your understanding with the topic MCQs below!
                  </p>
                </div>
              </div>
            )}


            {/* Notes */}
            {lesson.notes_content && (
              <Card>
                <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <FileText size={16} /> Key Lecture Takeaways
                </h2>
                <div
                  className="prose prose-invert max-w-none text-sm leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                  dangerouslySetInnerHTML={{ __html: lesson.notes_content.replace(/\n/g, '<br />') }}
                />
              </Card>
            )}

            {/* Resources */}
            {resources.length > 0 && (
              <Card>
                <h2 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <Download size={16} /> Lecture Attachments &amp; Resources
                </h2>
                <div className="space-y-2">
                  {resources.map(resource => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between p-3 rounded-xl"
                      style={{ backgroundColor: 'var(--bg-tertiary)' }}
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={16} style={{ color: 'var(--text-tertiary)' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {resource.title}
                        </span>
                        <Badge size="sm">{resource.type}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Post-Video Topic Practice MCQs */}
            <Card className="border-blue-500/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <HelpCircle size={18} />
                  </div>
                  <div>
                    <h2 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                      Post-Video Topic Check: Practice MCQs
                    </h2>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      Answer these topic MCQs after watching the video to test your mastery
                    </p>
                  </div>
                </div>
                <Badge variant="purple">{activeQuestions.length} Questions</Badge>
              </div>

              {/* Score banner when results shown */}
              {showResults && (
                <div className={`p-4 rounded-xl mb-5 flex items-center justify-between border ${
                  correctCount === activeQuestions.length
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <Award size={22} className={correctCount === activeQuestions.length ? 'text-emerald-400' : 'text-amber-400'} />
                    <div>
                      <p className="text-sm font-bold">
                        You scored {correctCount} / {activeQuestions.length} ({Math.round((correctCount / activeQuestions.length) * 100)}%)
                      </p>
                      <p className="text-xs opacity-80">
                        {correctCount === activeQuestions.length
                          ? '🎉 Excellent understanding! You are ready to move on.'
                          : 'Review the explanations below and feel free to try again.'}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => { setShowResults(false); setSelectedAnswers({}); }}
                    icon={<RefreshCw size={13} />}
                  >
                    Retake
                  </Button>
                </div>
              )}

              <div className="space-y-6">
                {activeQuestions.map((q, qIdx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl border transition-all"
                    style={{
                      backgroundColor: 'var(--bg-tertiary)',
                      borderColor: 'var(--border-secondary)',
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        <span className="text-blue-400 font-mono mr-1.5">Q{qIdx + 1}.</span>
                        {q.question_text}
                      </p>
                      {q.difficulty && (
                        <Badge size="sm" variant={q.difficulty === 'easy' ? 'success' : q.difficulty === 'medium' ? 'warning' : 'error'}>
                          {q.difficulty}
                        </Badge>
                      )}
                    </div>

                    {q.options && Array.isArray(q.options) && (
                      <div className="space-y-2">
                        {q.options.map((opt: { id: string; text: string }) => {
                          const isSelected = selectedAnswers[q.id] === opt.id;
                          const isCorrect = opt.id === q.correct_answer;

                          let optionClass = 'border-gray-800 bg-white/[0.02] hover:bg-[var(--bg-card-hover)]';
                          if (isSelected) {
                            optionClass = 'border-blue-500 bg-blue-500/10 text-blue-300 font-medium';
                          }
                          if (showResults) {
                            if (isCorrect) {
                              optionClass = 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300 font-medium';
                            } else if (isSelected && !isCorrect) {
                              optionClass = 'border-red-500/60 bg-red-500/15 text-red-300 font-medium';
                            }
                          }

                          return (
                            <button
                              key={opt.id}
                              onClick={() => {
                                if (!showResults) {
                                  setSelectedAnswers(prev => ({ ...prev, [q.id]: opt.id }));
                                }
                              }}
                              className={`w-full text-left p-3 rounded-xl border text-sm transition-all flex items-center justify-between ${optionClass}`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs font-bold ${
                                  isSelected ? 'bg-blue-500/20 text-blue-300' : 'bg-white/5 text-gray-400'
                                }`}>
                                  {opt.id.toUpperCase()}
                                </span>
                                <span>{opt.text}</span>
                              </div>

                              {showResults && (
                                <div>
                                  {isCorrect && (
                                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                                      <CheckCircle2 size={15} /> Correct
                                    </span>
                                  )}
                                  {isSelected && !isCorrect && (
                                    <span className="text-xs font-semibold text-red-400 flex items-center gap-1">
                                      <X size={15} /> Incorrect
                                    </span>
                                  )}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {showResults && q.explanation && (
                      <div className="mt-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/15 text-xs text-blue-300">
                        <strong className="text-white block mb-0.5">💡 Concept Explanation:</strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    size="sm"
                    onClick={() => setShowResults(true)}
                    disabled={Object.keys(selectedAnswers).length === 0}
                    icon={<Sparkles size={14} />}
                  >
                    Check Answers
                  </Button>
                  {showResults && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => { setShowResults(false); setSelectedAnswers({}); }}
                      icon={<RefreshCw size={14} />}
                    >
                      Reset Quiz
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Completion & Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
              {!isCompleted ? (
                <Button
                  onClick={handleMarkComplete}
                  icon={<CheckCircle2 size={16} />}
                  size="lg"
                  variant="success"
                >
                  Mark Lesson Completed
                </Button>
              ) : (
                <Badge variant="success" size="md">
                  <CheckCircle2 size={14} /> Lesson Completed
                </Badge>
              )}

              <div className="flex gap-3">
                {prevLesson && (
                  <Link href={`/skills/${skillId}/lessons/${prevLesson.id}`}>
                    <Button variant="secondary" icon={<ArrowLeft size={14} />}>
                      Previous
                    </Button>
                  </Link>
                )}
                {nextLesson && (
                  <Link href={`/skills/${skillId}/lessons/${nextLesson.id}`}>
                    <Button icon={<ArrowRight size={14} />}>
                      Next Lesson
                    </Button>
                  </Link>
                )}
                {!nextLesson && isCompleted && (
                  <Link href={`/skills/${skillId}`}>
                    <Button icon={<BookOpen size={14} />}>
                      Back to Skill Overview
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
