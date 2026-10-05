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
    <div className="page-container space-y-6 animate-fade-in">
      {/* Back button */}
      <Link href="/skills">
        <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />}>
          Back to My Skills
        </Button>
      </Link>

      {/* Skill header */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-violet-600/5 pointer-events-none" />
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>
                {skill.course?.branch?.name} → {skill.course?.name}
              </p>
              <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {skill.name}
              </h1>
              <p className="text-sm mb-4 max-w-xl" style={{ color: 'var(--text-secondary)' }}>
                {skill.description || 'Master this skill through structured lessons and hands-on practice.'}
              </p>
              <div className="flex flex-wrap gap-2">
                {access && (
                  <Badge variant={isCompleted ? 'success' : 'info'}>
                    {isCompleted ? <><CheckCircle2 size={12} /> Completed</> : 'Active'}
                  </Badge>
                )}
                {skill.difficulty && (
                  <Badge variant={skill.difficulty === 'beginner' ? 'success' : skill.difficulty === 'intermediate' ? 'warning' : 'error'}>
                    {skill.difficulty}
                  </Badge>
                )}
                {skill.estimated_hours && (
                  <Badge><Clock size={12} /> {skill.estimated_hours}h estimated</Badge>
                )}
                <Badge><BookOpen size={12} /> {lessons.length} lessons</Badge>
                <Badge><HelpCircle size={12} /> {questions.length} questions</Badge>
              </div>
            </div>

            {/* Certificate status */}
            {certificate && (
              <div className="text-right">
                {certificate.status === 'unlocked' ? (
                  <div className="inline-flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                    <Award size={24} className="text-amber-400" />
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Certificate Available</p>
                    <Button size="sm" variant="success" icon={<Award size={14} />}>
                      Download
                    </Button>
                  </div>
                ) : (
                  <div className="inline-flex flex-col items-center gap-2 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <Lock size={24} style={{ color: 'var(--text-muted)' }} />
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Complete to unlock</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Progress */}
          {hasAccess && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {completedLessons}/{lessons.length} lessons · {progress}%
                </span>
              </div>
              <ProgressBar value={progress} size="lg" color={isCompleted ? 'success' : 'brand'} />
            </div>
          )}
        </div>
      </Card>

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
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Lessons
            </h2>
            {nextLesson && (
              <Link href={`/skills/${skill.id}/lessons/${nextLesson.id}`}>
                <Button size="sm" icon={<PlayCircle size={14} />}>
                  {completedLessons > 0 ? 'Continue' : 'Start Learning'}
                </Button>
              </Link>
            )}
          </div>

          <div className="space-y-2">
            {lessons.map((lesson, idx) => {
              const completed = isLessonCompleted(lesson.id);
              const started = isLessonStarted(lesson.id);

              return (
                <Link key={lesson.id} href={`/skills/${skill.id}/lessons/${lesson.id}`}>
                  <div
                    className={`
                      flex items-center gap-4 p-4 rounded-xl border transition-all
                      hover:bg-[var(--bg-card-hover)]
                      ${completed ? 'border-emerald-500/20' : started ? 'border-blue-500/20' : ''}
                    `}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      borderColor: completed ? undefined : started ? undefined : 'var(--border-secondary)',
                    }}
                  >
                    {/* Lesson number */}
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold
                      ${completed
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : started
                        ? 'bg-blue-500/10 text-blue-400'
                        : ''
                      }
                    `}
                    style={!completed && !started ? {
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-muted)',
                    } : undefined}
                    >
                      {completed ? <CheckCircle2 size={18} /> : idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {lesson.title}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                        {lesson.duration_minutes && (
                          <span className="flex items-center gap-1">
                            <Clock size={10} /> {lesson.duration_minutes} min
                          </span>
                        )}
                        {lesson.video_path && (
                          <span className="flex items-center gap-1">
                            <PlayCircle size={10} /> Video
                          </span>
                        )}
                        {lesson.notes_content && (
                          <span className="flex items-center gap-1">
                            <FileText size={10} /> Notes
                          </span>
                        )}
                      </div>
                    </div>

                    <ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
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
