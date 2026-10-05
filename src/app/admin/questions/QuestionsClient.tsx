'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Question, Skill, Lesson } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/providers/ToastProvider';
import {
  HelpCircle, Plus, Search, Video, CheckCircle2,
  Trash2, BookOpen, Sparkles, Filter, Check, X
} from 'lucide-react';

interface Props {
  initialQuestions: (Question & { skill?: { name: string }; lesson?: { title: string } })[];
  skills: Skill[];
  lessons: Lesson[];
}

export default function QuestionsClient({
  initialQuestions,
  skills,
  lessons,
}: Props) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('all');
  const [selectedLessonFilter, setSelectedLessonFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();
  const supabase = createClient();

  const [form, setForm] = useState({
    skill_id: skills[0]?.id || '',
    lesson_id: lessons[0]?.id || '',
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'a',
    difficulty: 'medium',
    marks: 1,
    explanation: '',
  });

  const availableLessonsForSelectedSkill = lessons.filter(
    (l) => !form.skill_id || l.skill_id === form.skill_id
  );

  const handleOpenModal = (preselectedLessonId?: string) => {
    const defaultSkillId = preselectedLessonId
      ? lessons.find((l) => l.id === preselectedLessonId)?.skill_id || skills[0]?.id || ''
      : skills[0]?.id || '';

    setForm({
      skill_id: defaultSkillId,
      lesson_id: preselectedLessonId || lessons.find((l) => l.skill_id === defaultSkillId)?.id || '',
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'a',
      difficulty: 'medium',
      marks: 1,
      explanation: '',
    });
    setIsModalOpen(true);
  };

  const handleSkillChange = (newSkillId: string) => {
    const matchingLesson = lessons.find((l) => l.skill_id === newSkillId);
    setForm((prev) => ({
      ...prev,
      skill_id: newSkillId,
      lesson_id: matchingLesson?.id || '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question_text.trim() || !form.option_a.trim() || !form.option_b.trim()) {
      addToast('Please enter the question text and at least options A and B', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const optionsArray = [
        { id: 'a', text: form.option_a.trim() },
        { id: 'b', text: form.option_b.trim() },
        ...(form.option_c.trim() ? [{ id: 'c', text: form.option_c.trim() }] : []),
        ...(form.option_d.trim() ? [{ id: 'd', text: form.option_d.trim() }] : []),
      ];

      const selectedSkill = skills.find((s) => s.id === form.skill_id);
      const selectedLesson = lessons.find((l) => l.id === form.lesson_id);

      const newQuestionData = {
        skill_id: form.skill_id,
        lesson_id: form.lesson_id || null,
        question_text: form.question_text.trim(),
        question_type: 'mcq' as const,
        options: optionsArray,
        correct_answer: form.correct_answer,
        explanation: form.explanation.trim() || null,
        difficulty: form.difficulty as 'easy' | 'medium' | 'hard',
        marks: Number(form.marks) || 1,
        sort_order: (questions.length + 1) * 10,
        is_active: true,
      };

      const { data, error } = await supabase
        .from('questions')
        .insert(newQuestionData)
        .select()
        .single();

      const createdObj = {
        id: data?.id || 'q-' + Date.now(),
        ...newQuestionData,
        created_at: new Date().toISOString(),
        skill: { name: selectedSkill?.name || 'Skill' },
        lesson: selectedLesson ? { title: selectedLesson.title } : undefined,
      } as any;

      setQuestions((prev) => [createdObj, ...prev]);
      addToast('Topic MCQ question added successfully!', 'success');
      setIsModalOpen(false);
    } catch (err: any) {
      addToast(err?.message || 'Failed to add question', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (qId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      await supabase.from('questions').delete().eq('id', qId);
      setQuestions((prev) => prev.filter((q) => q.id !== qId));
      addToast('Question deleted', 'info');
    } catch {
      addToast('Failed to delete question', 'error');
    }
  };

  const filteredQuestions = questions.filter((q) => {
    const matchesSkill = selectedSkillFilter === 'all' || q.skill_id === selectedSkillFilter;
    const matchesLesson = selectedLessonFilter === 'all' || q.lesson_id === selectedLessonFilter;
    const matchesSearch =
      !search ||
      q.question_text.toLowerCase().includes(search.toLowerCase()) ||
      (q.lesson?.title && q.lesson.title.toLowerCase().includes(search.toLowerCase()));
    return matchesSkill && matchesLesson && matchesSearch;
  });

  return (
    <div className="page-container space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Video Topic MCQs &amp; Question Bank
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Create and manage topic-based practice MCQs attached to video lectures
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => handleOpenModal()}>
          Add MCQ Question
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Input
            placeholder="Search questions or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <Select
            options={[
              { value: 'all', label: 'All Skill Programs' },
              ...skills.map((s) => ({ value: s.id, label: s.name })),
            ]}
            value={selectedSkillFilter}
            onChange={(e) => {
              setSelectedSkillFilter(e.target.value);
              setSelectedLessonFilter('all');
            }}
          />
        </div>
        <div>
          <Select
            options={[
              { value: 'all', label: 'All Video Lessons' },
              ...lessons
                .filter((l) => selectedSkillFilter === 'all' || l.skill_id === selectedSkillFilter)
                .map((l) => ({ value: l.id, label: l.title })),
            ]}
            value={selectedLessonFilter}
            onChange={(e) => setSelectedLessonFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <Card className="text-center !py-12">
            <HelpCircle size={40} className="mx-auto mb-3 text-muted" />
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              No Questions Found
            </h3>
            <p className="text-sm mt-1 mb-4" style={{ color: 'var(--text-tertiary)' }}>
              Add multiple choice questions for your video lectures to test student comprehension.
            </p>
            <Button icon={<Plus size={16} />} onClick={() => handleOpenModal()}>
              Create First MCQ
            </Button>
          </Card>
        ) : (
          filteredQuestions.map((q, idx) => (
            <Card key={q.id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="purple">Q{idx + 1}</Badge>
                    {q.lesson?.title && (
                      <Badge variant="info">
                        <Video size={12} /> {q.lesson.title}
                      </Badge>
                    )}
                    {q.skill?.name && (
                      <Badge variant="purple">{q.skill.name}</Badge>
                    )}
                    <Badge
                      variant={
                        q.difficulty === 'easy'
                          ? 'success'
                          : q.difficulty === 'medium'
                          ? 'warning'
                          : 'error'
                      }
                    >
                      {q.difficulty}
                    </Badge>
                    <span className="text-xs font-mono" style={{ color: 'var(--text-tertiary)' }}>
                      {q.marks} {q.marks === 1 ? 'mark' : 'marks'}
                    </span>
                  </div>

                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {q.question_text}
                  </p>

                  {/* Options display */}
                  {q.options && Array.isArray(q.options) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt: any) => {
                        const isCorrect = opt.id === q.correct_answer;
                        return (
                          <div
                            key={opt.id}
                            className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                              isCorrect
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-medium'
                                : 'border-gray-800 bg-white/[0.02] text-gray-300'
                            }`}
                          >
                            <span>
                              <strong className="uppercase mr-1.5 opacity-70">
                                {opt.id}.
                              </strong>
                              {opt.text}
                            </span>
                            {isCorrect && (
                              <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {q.explanation && (
                    <div className="p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/10 text-xs text-blue-300">
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 sm:self-start">
                  <button
                    onClick={() => handleDelete(q.id)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete MCQ"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add MCQ Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Topic MCQ (Post-Video Practice)"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Skill Program *"
              options={skills.map((s) => ({ value: s.id, label: s.name }))}
              value={form.skill_id}
              onChange={(e) => handleSkillChange(e.target.value)}
              required
            />
            <Select
              label="Video Lesson / Lecture *"
              options={[
                { value: '', label: '-- General Skill MCQ --' },
                ...availableLessonsForSelectedSkill.map((l) => ({
                  value: l.id,
                  label: l.title,
                })),
              ]}
              value={form.lesson_id}
              onChange={(e) => setForm({ ...form, lesson_id: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Question Text *
            </label>
            <textarea
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-blue-500"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)',
              }}
              rows={3}
              placeholder="e.g. What is the average time complexity of searching an element in a balanced Binary Search Tree (BST)?"
              value={form.question_text}
              onChange={(e) => setForm({ ...form, question_text: e.target.value })}
              required
            />
          </div>

          {/* 4 Choices */}
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>
              Multiple Choice Options *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Option A *"
                placeholder="O(log n)"
                value={form.option_a}
                onChange={(e) => setForm({ ...form, option_a: e.target.value })}
                required
              />
              <Input
                label="Option B *"
                placeholder="O(n)"
                value={form.option_b}
                onChange={(e) => setForm({ ...form, option_b: e.target.value })}
                required
              />
              <Input
                label="Option C"
                placeholder="O(1)"
                value={form.option_c}
                onChange={(e) => setForm({ ...form, option_c: e.target.value })}
              />
              <Input
                label="Option D"
                placeholder="O(n log n)"
                value={form.option_d}
                onChange={(e) => setForm({ ...form, option_d: e.target.value })}
              />
            </div>
          </div>

          {/* Correct answer & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Correct Option Key *"
              options={[
                { value: 'a', label: 'Option A is Correct' },
                { value: 'b', label: 'Option B is Correct' },
                { value: 'c', label: 'Option C is Correct' },
                { value: 'd', label: 'Option D is Correct' },
              ]}
              value={form.correct_answer}
              onChange={(e) => setForm({ ...form, correct_answer: e.target.value })}
              required
            />
            <Select
              label="Difficulty"
              options={[
                { value: 'easy', label: 'Easy' },
                { value: 'medium', label: 'Medium' },
                { value: 'hard', label: 'Hard' },
              ]}
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            />
            <Input
              label="Marks / Points"
              type="number"
              value={form.marks}
              onChange={(e) => setForm({ ...form, marks: Number(e.target.value) })}
            />
          </div>

          <Input
            label="Explanation (Shown after answering)"
            placeholder="In a balanced BST, tree height is log(n), so search takes O(log n) time."
            value={form.explanation}
            onChange={(e) => setForm({ ...form, explanation: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} icon={<Plus size={16} />}>
              Save MCQ Question
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
