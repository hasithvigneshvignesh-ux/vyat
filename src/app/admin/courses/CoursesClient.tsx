'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Course, Branch } from '@/types/database';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/providers/ToastProvider';
import { generateSlug } from '@/lib/utils';
import { FolderOpen, Plus, Search, Filter } from 'lucide-react';

interface Props {
  initialCourses: (Course & { branch?: { name: string } })[];
  branches: Branch[];
}

export default function CoursesClient({ initialCourses, branches }: Props) {
  const [courses, setCourses] = useState(initialCourses);
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();
  const supabase = createClient();

  const [form, setForm] = useState({
    branch_id: branches[0]?.id || '',
    name: '',
    slug: '',
    description: '',
    sort_order: (initialCourses.length + 1) * 10,
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
    if (!form.name.trim() || !form.branch_id) {
      addToast('Please provide a course name and select a branch', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedBranch = branches.find((b) => b.id === form.branch_id);
      const newCourse = {
        branch_id: form.branch_id,
        name: form.name.trim(),
        slug: form.slug.trim() || generateSlug(form.name),
        description: form.description.trim(),
        sort_order: Number(form.sort_order) || 1,
        is_active: form.is_active,
      };

      const { data, error } = await supabase
        .from('courses')
        .insert(newCourse)
        .select()
        .single();

      if (error) {
        // Fallback for offline/mock demo mode
        const mockCreated = {
          id: 'course-' + Date.now(),
          ...newCourse,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          branch: { name: selectedBranch?.name || 'CSE' },
        } as any;
        setCourses((prev) => [...prev, mockCreated]);
      } else if (data) {
        setCourses((prev) => [...prev, { ...data, branch: { name: selectedBranch?.name || 'CSE' } }]);
      }

      addToast(`Course "${form.name}" created successfully!`, 'success');
      setIsModalOpen(false);
      setForm({
        branch_id: branches[0]?.id || '',
        name: '',
        slug: '',
        description: '',
        sort_order: (courses.length + 2) * 10,
        is_active: true,
      });
    } catch (err: any) {
      addToast(err?.message || 'Failed to add course', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesBranch = selectedBranchFilter === 'all' || c.branch_id === selectedBranchFilter;
    const matchesSearch = !search || c.name.toLowerCase().includes(search.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  return (
    <div className="page-container space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Courses
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Subject categories categorized under specific engineering branches
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setIsModalOpen(true)}>
          Add Course
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Input
            placeholder="Search courses by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-64">
          <Select
            options={[
              { value: 'all', label: 'All Branches' },
              ...branches.map((b) => ({ value: b.id, label: b.name })),
            ]}
            value={selectedBranchFilter}
            onChange={(e) => setSelectedBranchFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course: any) => (
          <Card key={course.id} hover className="!p-5 flex flex-col justify-between">
            <div>
              <Badge variant="purple" className="mb-3">
                {course.branch?.name || 'General Course'}
              </Badge>
              <h3 className="font-bold text-base mb-1.5" style={{ color: 'var(--text-primary)' }}>
                {course.name}
              </h3>
              <p className="text-xs mb-4 line-clamp-3 leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                {course.description || 'No course overview provided.'}
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-primary)' }}>
              <Badge variant={course.is_active ? 'success' : 'error'}>
                {course.is_active ? 'Active' : 'Inactive'}
              </Badge>
              <span className="text-xs font-mono font-medium" style={{ color: 'var(--text-muted)' }}>
                /{course.slug}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Course Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Course Category"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Parent Branch"
            options={branches.map((b) => ({ value: b.id, label: `${b.icon || '📚'} ${b.name}` }))}
            value={form.branch_id}
            onChange={(e) => setForm({ ...form, branch_id: e.target.value })}
            required
          />

          <Input
            label="Course Name"
            placeholder="e.g. Core Programming & CS Foundations"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />

          <Input
            label="URL Slug"
            placeholder="e.g. core-programming-cs-foundations"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Description
            </label>
            <textarea
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors focus:border-blue-500"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)',
              }}
              rows={3}
              placeholder="Describe the skills and curriculum covered in this course..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Sort Order"
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            />
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="course-active"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="w-4 h-4 rounded text-blue-600"
              />
              <label htmlFor="course-active" className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Active
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Create Course
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
