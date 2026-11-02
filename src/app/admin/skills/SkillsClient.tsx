'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Skill, Course } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/providers/ToastProvider';
import { formatCurrency, generateSlug, getDifficultyColor } from '@/lib/utils';
import { Zap, Plus, Search, Filter, Edit2, CheckCircle2, Clock, Trash2 } from 'lucide-react';

interface Props {
  initialSkills: (Skill & { course?: { name: string; branch?: { name: string } } })[];
  courses: Course[];
}

export default function SkillsClient({ initialSkills, courses }: Props) {
  const [skills, setSkills] = useState(initialSkills);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any | null>(null);
  const { addToast } = useToast();
  const supabase = createClient();

  const [form, setForm] = useState({
    course_id: courses[0]?.id || '',
    name: '',
    slug: '',
    short_description: '',
    description: '',
    difficulty: 'beginner',
    price: 499,
    duration_hours: 30,
    sort_order: (initialSkills.length + 1) * 10,
    total_planned_lessons: 30 as number | '',
    is_curriculum_complete: false,
    is_active: true,
  });

  const [editForm, setEditForm] = useState({
    id: '',
    course_id: '',
    name: '',
    slug: '',
    short_description: '',
    description: '',
    difficulty: 'beginner',
    price: 499,
    duration_hours: 30,
    sort_order: 10,
    total_planned_lessons: '' as number | '',
    is_curriculum_complete: false,
    is_active: true,
  });

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.course_id) {
      addToast('Please provide a skill title and select a course', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedCourse = courses.find((c) => c.id === form.course_id);
      const newSkill = {
        course_id: form.course_id,
        name: form.name.trim(),
        slug: form.slug.trim() || generateSlug(form.name),
        short_description: form.short_description.trim(),
        description: form.description.trim(),
        difficulty: form.difficulty,
        price: Number(form.price) || 0,
        estimated_hours: Number(form.duration_hours) || 20,
        sort_order: Number(form.sort_order) || 1,
        total_planned_lessons: form.total_planned_lessons !== '' ? Number(form.total_planned_lessons) : null,
        is_curriculum_complete: Boolean(form.is_curriculum_complete),
        is_active: form.is_active,
      };

      const { data, error } = await supabase
        .from('skills')
        .insert(newSkill)
        .select()
        .single();

      if (error) {
        throw error;
      } else if (data) {
        setSkills((prev) => [...prev, { ...data, course: { name: selectedCourse?.name || 'Computer Science' } }]);
      }

      addToast(`Skill "${form.name}" added successfully!`, 'success');
      setIsModalOpen(false);
      setForm({
        course_id: courses[0]?.id || '',
        name: '',
        slug: '',
        short_description: '',
        description: '',
        difficulty: 'beginner',
        price: 499,
        duration_hours: 30,
        sort_order: (skills.length + 2) * 10,
        total_planned_lessons: 30,
        is_curriculum_complete: false,
        is_active: true,
      });
    } catch (err: any) {
      addToast(err?.message || 'Failed to add skill', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (skill: any) => {
    setEditingSkill(skill);
    setEditForm({
      id: skill.id,
      course_id: skill.course_id,
      name: skill.name || '',
      slug: skill.slug || '',
      short_description: skill.short_description || '',
      description: skill.description || '',
      difficulty: skill.difficulty || 'beginner',
      price: skill.price || 0,
      duration_hours: skill.estimated_hours || skill.duration_hours || 30,
      sort_order: skill.sort_order || 10,
      total_planned_lessons: skill.total_planned_lessons ?? '',
      is_curriculum_complete: Boolean(skill.is_curriculum_complete),
      is_active: skill.is_active ?? true,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      addToast('Please provide a skill title', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedFields = {
        course_id: editForm.course_id,
        name: editForm.name.trim(),
        slug: editForm.slug.trim(),
        short_description: editForm.short_description.trim(),
        description: editForm.description.trim(),
        difficulty: editForm.difficulty,
        price: Number(editForm.price) || 0,
        estimated_hours: Number(editForm.duration_hours) || 20,
        sort_order: Number(editForm.sort_order) || 1,
        total_planned_lessons: editForm.total_planned_lessons !== '' ? Number(editForm.total_planned_lessons) : null,
        is_curriculum_complete: Boolean(editForm.is_curriculum_complete),
        is_active: editForm.is_active,
      };

      const { data, error } = await supabase
        .from('skills')
        .update(updatedFields)
        .eq('id', editForm.id)
        .select()
        .single();

      if (error) throw error;

      setSkills((prev: any[]) =>
        prev.map((s) => (s.id === editForm.id ? { ...s, ...updatedFields } : s))
      );

      addToast(`Skill "${editForm.name}" updated successfully!`, 'success');
      setIsEditModalOpen(false);
    } catch (err: any) {
      addToast(err?.message || 'Failed to update skill', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCurriculumStatus = async (skillId: string, currentStatus: boolean, skillName: string) => {
    const newStatus = !currentStatus;
    try {
      const { error } = await supabase
        .from('skills')
        .update({ is_curriculum_complete: newStatus })
        .eq('id', skillId);

      if (error) throw error;

      setSkills((prev) =>
        prev.map((s) => (s.id === skillId ? { ...s, is_curriculum_complete: newStatus } : s))
      );

      if (newStatus) {
        addToast(`"${skillName}" finalized! Certificates now unlock upon lesson completion.`, 'success');
      } else {
        addToast(`"${skillName}" set to Ongoing (Daily Release). Certificates locked.`, 'info');
      }
    } catch (err: any) {
      addToast(err?.message || 'Failed to update curriculum status', 'error');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the skill "${name}"? This cannot be undone.`)) return;
    
    try {
      const res = await fetch(`/api/admin/skills/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const { error } = await supabase.from('skills').delete().eq('id', id);
        if (error) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || error.message || 'Failed to delete skill');
        }
      }
      
      setSkills(prev => prev.filter(s => s.id !== id));
      addToast(`Skill deleted successfully`, 'success');
    } catch (err: any) {
      addToast(err?.message || 'Failed to delete skill', 'error');
    }
  };

  const filteredSkills = skills.filter((s) => {
    const matchesCourse = selectedCourseFilter === 'all' || s.course_id === selectedCourseFilter;
    const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  return (
    <div className="page-container space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Skills &amp; Modules
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            {skills.length} total standalone skills available across all courses
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
          Add Skill
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Input
            placeholder="Search skills by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-72">
          <Select
            options={[
              { value: 'all', label: 'All Courses' },
              ...courses.map((c) => ({ value: c.id, label: c.name })),
            ]}
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left" style={{ borderColor: 'var(--border-primary)' }}>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Skill</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: 'var(--text-tertiary)' }}>Course Domain</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Curriculum Mode</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: 'var(--text-tertiary)' }}>Difficulty</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Price</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Status</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-right" style={{ color: 'var(--text-tertiary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-secondary)' }}>
              {filteredSkills.map((skill: any) => {
                const isComplete = Boolean(skill.is_curriculum_complete);
                const plannedCount = skill.total_planned_lessons;

                return (
                  <tr key={skill.id} className="transition-colors hover:bg-[var(--bg-tertiary)]">
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{skill.name}</p>
                      <p className="text-xs line-clamp-1" style={{ color: 'var(--text-tertiary)' }}>
                        {skill.short_description || skill.description}
                      </p>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {skill.course?.name || 'Computer Science'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1.5 items-start">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isComplete 
                              ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800' 
                              : 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                          }`}>
                            {isComplete ? <><CheckCircle2 size={12} /> Curriculum Complete</> : <><Clock size={12} /> Daily Release (Ongoing)</>}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{plannedCount ? `${plannedCount} Planned Lessons` : 'Dynamic count'}</span>
                          <span>·</span>
                          <button
                            onClick={() => toggleCurriculumStatus(skill.id, isComplete, skill.name)}
                            className="font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                          >
                            {isComplete ? 'Set as Ongoing' : 'Mark as Finalized'}
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase ${getDifficultyColor(skill.difficulty)}`}>
                        {skill.difficulty}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      {formatCurrency(skill.price)}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={skill.is_active ? 'success' : 'error'}>
                        {skill.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => openEditModal(skill)}
                          className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1"
                          title="Edit Skill & Curriculum Settings"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(skill.id, skill.name)}
                          className="text-red-500 hover:text-red-600 transition-colors p-1"
                          title="Delete Skill"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Skill Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Skill Module"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Parent Course"
            options={courses.map((c) => ({ value: c.id, label: c.name }))}
            value={form.course_id}
            onChange={(e) => setForm({ ...form, course_id: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Skill Name"
              placeholder="e.g. Dynamic Programming & Advanced Algorithms"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
            <Input
              label="URL Slug"
              placeholder="e.g. dp-advanced-algorithms"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              required
            />
          </div>

          <Input
            label="Short Summary"
            placeholder="One-liner explaining the skill outcomes..."
            value={form.short_description}
            onChange={(e) => setForm({ ...form, short_description: e.target.value })}
            required
          />

          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Difficulty"
              options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
              ]}
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            />
            <Input
              label="Price (INR)"
              type="number"
              placeholder="499"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            />
            <Input
              label="Estimated Hours"
              type="number"
              placeholder="30"
              value={form.duration_hours}
              onChange={(e) => setForm({ ...form, duration_hours: Number(e.target.value) })}
            />
          </div>

          {/* Drip-Release / Daily Upload Settings */}
          <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-900/50 space-y-3" style={{ borderColor: 'var(--border-primary)' }}>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Curriculum &amp; Certificate Settings
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Target Planned Lessons (e.g. 30)"
                type="number"
                placeholder="30"
                value={form.total_planned_lessons}
                onChange={(e) => setForm({ ...form, total_planned_lessons: e.target.value === '' ? '' : Number(e.target.value) })}
                hint="Prevents premature 100% progress when uploading daily videos"
              />

              <div className="flex flex-col justify-center gap-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Curriculum Status
                </label>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="skill-curriculum-complete"
                    checked={form.is_curriculum_complete}
                    onChange={(e) => setForm({ ...form, is_curriculum_complete: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <label htmlFor="skill-curriculum-complete" className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    All lessons uploaded (Enable certificates now)
                  </label>
                </div>
                <p className="text-[11px] text-slate-500">
                  Leave unchecked if you upload 1 video/day. Certificates will remain locked.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Full Curriculum Overview
            </label>
            <textarea
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-blue-500"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)',
              }}
              rows={3}
              placeholder="Detailed syllabus topics, prerequisites, and learning path..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="skill-active"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600"
            />
            <label htmlFor="skill-active" className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Skill is Active and available in Student catalog
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create Skill
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Skill Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Skill: ${editingSkill?.name || ''}`}
        size="lg"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Select
            label="Parent Course"
            options={courses.map((c) => ({ value: c.id, label: c.name }))}
            value={editForm.course_id}
            onChange={(e) => setEditForm({ ...editForm, course_id: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Skill Name"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              required
            />
            <Input
              label="URL Slug"
              value={editForm.slug}
              onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
              required
            />
          </div>

          <Input
            label="Short Summary"
            value={editForm.short_description}
            onChange={(e) => setEditForm({ ...editForm, short_description: e.target.value })}
            required
          />

          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Difficulty"
              options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
              ]}
              value={editForm.difficulty}
              onChange={(e) => setEditForm({ ...editForm, difficulty: e.target.value })}
            />
            <Input
              label="Price (INR)"
              type="number"
              value={editForm.price}
              onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
            />
            <Input
              label="Estimated Hours"
              type="number"
              value={editForm.duration_hours}
              onChange={(e) => setEditForm({ ...editForm, duration_hours: Number(e.target.value) })}
            />
          </div>

          {/* Drip-Release / Daily Upload Settings */}
          <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-900/50 space-y-3" style={{ borderColor: 'var(--border-primary)' }}>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Curriculum &amp; Certificate Settings
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Target Planned Lessons"
                type="number"
                placeholder="e.g. 30"
                value={editForm.total_planned_lessons}
                onChange={(e) => setEditForm({ ...editForm, total_planned_lessons: e.target.value === '' ? '' : Number(e.target.value) })}
                hint="Set target lessons (e.g. 30) to calculate progress accurately during daily uploads"
              />

              <div className="flex flex-col justify-center gap-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Curriculum Status
                </label>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="edit-skill-curriculum-complete"
                    checked={editForm.is_curriculum_complete}
                    onChange={(e) => setEditForm({ ...editForm, is_curriculum_complete: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <label htmlFor="edit-skill-curriculum-complete" className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    All lessons uploaded (Enable certificates)
                  </label>
                </div>
                <p className="text-[11px] text-slate-500">
                  Unchecked = Ongoing (1 video/day). Students cannot download certificates prematurely.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Full Curriculum Overview
            </label>
            <textarea
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-blue-500"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)',
              }}
              rows={3}
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="edit-skill-active"
              checked={editForm.is_active}
              onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
              className="w-4 h-4 rounded text-blue-600"
            />
            <label htmlFor="edit-skill-active" className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Skill is Active and available in Student catalog
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
            <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
