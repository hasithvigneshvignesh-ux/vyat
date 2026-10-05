'use client';

import { useState, useRef } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { formatDate } from '@/lib/utils';
import {
  Award, CheckCircle, CheckCircle2, ExternalLink, ShieldCheck, Search,
  Plus, Copy, Trash2, FileText, Check, Sparkles, UploadCloud,
  FileCheck, Loader2, X, Link2
} from 'lucide-react';
import { useToast } from '@/providers/ToastProvider';
import { createClient } from '@/lib/supabase/client';

interface Props {
  initialCertificates: any[];
  students: any[];
  skills: any[];
}

export default function CertificatesClient({
  initialCertificates,
  students,
  skills,
}: Props) {
  const [certificates, setCertificates] = useState(initialCertificates);
  const [search, setSearch] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // File upload state
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addToast } = useToast();
  const supabase = createClient();

  const generateRandomCertId = () => {
    const year = new Date().getFullYear();
    const rand = Math.floor(10000 + Math.random() * 90000);
    return `CF-${year}-SKILL-${rand}`;
  };

  const [form, setForm] = useState({
    student_id: students[0]?.id || '',
    skill_id: skills[0]?.id || '',
    certificate_number: generateRandomCertId(),
    issue_date: new Date().toISOString().split('T')[0],
    file_path: '',
    status: 'unlocked',
  });

  const handleOpenModal = () => {
    setForm({
      student_id: students[0]?.id || '',
      skill_id: skills[0]?.id || '',
      certificate_number: generateRandomCertId(),
      issue_date: new Date().toISOString().split('T')[0],
      file_path: '',
      status: 'unlocked',
    });
    setUploadedFileName(null);
    setUploadedFileSize(null);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedFileName(file.name);
    setUploadedFileSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'certificates');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || 'Failed to upload certificate file', 'error');
        return;
      }

      setForm((prev) => ({
        ...prev,
        file_path: data.url || data.localUrl,
      }));

      addToast(`Certificate document "${file.name}" uploaded successfully!`, 'success');
    } catch (err: any) {
      addToast(err?.message || 'Error uploading certificate from local files', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveUploadedFile = () => {
    setUploadedFileName(null);
    setUploadedFileSize(null);
    setForm((prev) => ({ ...prev, file_path: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopyLink = (certNumber: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://vyat.com';
    const verifyUrl = `${origin}/verify/${certNumber}`;
    navigator.clipboard.writeText(verifyUrl);
    setCopiedId(certNumber);
    addToast('Verification link copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.student_id || !form.skill_id || !form.certificate_number) {
      addToast('Please select a student, a skill, and specify a certificate number', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedStudent = students.find((s) => s.id === form.student_id);
      const selectedSkill = skills.find((s) => s.id === form.skill_id);

      const newCertData = {
        student_id: form.student_id,
        skill_id: form.skill_id,
        certificate_number: form.certificate_number.trim(),
        status: form.status,
        file_path: form.file_path.trim() || null,
        issued_at: new Date(form.issue_date).toISOString(),
      };

      const { data, error } = await supabase
        .from('certificates')
        .insert(newCertData)
        .select()
        .single();

      const createdObj = {
        id: data?.id || 'cert-' + Date.now(),
        certificate_number: form.certificate_number.trim(),
        student_id: form.student_id,
        skill_id: form.skill_id,
        issue_date: new Date(form.issue_date).toISOString(),
        created_at: new Date().toISOString(),
        status: form.status,
        file_path: form.file_path.trim() || null,
        student: {
          full_name: selectedStudent?.full_name || 'Student',
          email: selectedStudent?.email || '',
          branch_name: selectedStudent?.branch_name || 'CSE',
        },
        skill: {
          name: selectedSkill?.name || 'Skill Program',
          slug: selectedSkill?.slug || 'skill',
        },
      };

      setCertificates((prev) => [createdObj, ...prev]);
      addToast(`Certificate ${form.certificate_number} issued successfully!`, 'success');
      setIsModalOpen(false);
    } catch (err: any) {
      addToast(err?.message || 'Failed to issue certificate', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (certId: string, certNumber: string) => {
    if (!confirm(`Are you sure you want to revoke/delete certificate ${certNumber}?`)) return;

    try {
      await supabase.from('certificates').delete().eq('id', certId);
      setCertificates((prev) => prev.filter((c) => c.id !== certId));
      addToast(`Certificate ${certNumber} deleted`, 'info');
    } catch {
      addToast('Failed to delete certificate', 'error');
    }
  };

  const filteredCertificates = certificates.filter((c: any) => {
    const matchesSkill = selectedSkillFilter === 'all' || c.skill_id === selectedSkillFilter;
    const studentName = c.student?.full_name || '';
    const certNum = c.certificate_number || '';
    const matchesSearch =
      !search ||
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      certNum.toLowerCase().includes(search.toLowerCase());
    return matchesSkill && matchesSearch;
  });

  return (
    <div className="page-container space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Certificates Issued
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Cryptographically verifiable credentials issued upon passing skill assessments
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={handleOpenModal}>
          Issue Certificate
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="!p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Award size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {certificates.length}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Total Certificates Issued</p>
            </div>
          </div>
        </Card>

        <Card className="!p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                100%
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Verified &amp; Authentic</p>
            </div>
          </div>
        </Card>

        <Card className="!p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <CheckCircle size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Official Seal
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Active Design Theme</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Input
            placeholder="Search by student name or certificate ID (e.g. CF-2026)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {skills.length > 0 && (
          <div className="w-full sm:w-80">
            <Select
              options={[
                { value: 'all', label: 'All Skills' },
                ...skills.map((s) => ({ value: s.id, label: s.name })),
              ]}
              value={selectedSkillFilter}
              onChange={(e) => setSelectedSkillFilter(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Certificate Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left" style={{ borderColor: 'var(--border-primary)' }}>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Certificate ID</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Student Name</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Mastered Skill</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: 'var(--text-tertiary)' }}>Issue Date</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Status</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-right" style={{ color: 'var(--text-tertiary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-secondary)' }}>
              {filteredCertificates.map((c: any) => (
                <tr key={c.id} className="transition-colors hover:bg-[var(--bg-tertiary)]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-violet-400 bg-violet-500/10 px-2.5 py-1 rounded-md">
                        {c.certificate_number}
                      </span>
                      <button
                        onClick={() => handleCopyLink(c.certificate_number)}
                        title="Copy Verification URL"
                        className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {copiedId === c.certificate_number ? (
                          <Check size={13} className="text-emerald-400" />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{c.student?.full_name || 'Enrolled Student'}</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{c.student?.branch_name || c.student?.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{c.skill?.name || 'Skill Certification'}</p>
                  </td>
                  <td className="px-5 py-4 text-xs whitespace-nowrap hidden sm:table-cell" style={{ color: 'var(--text-muted)' }}>
                    {formatDate(c.issue_date || c.issued_at || c.created_at)}
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant="success">Verified</Badge>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleCopyLink(c.certificate_number)}
                        className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors text-xs font-medium flex items-center gap-1"
                      >
                        <ExternalLink size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id, c.certificate_number)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-xs font-medium"
                        title="Delete / Revoke Certificate"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Issue Certificate Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Issue / Award Student Certificate"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Select Student *"
            options={students.map((s) => ({
              value: s.id,
              label: `${s.full_name} (${s.email} - ${s.branch_name || 'Student'})`,
            }))}
            value={form.student_id}
            onChange={(e) => setForm({ ...form, student_id: e.target.value })}
            required
          />

          <Select
            label="Mastered Skill Program *"
            options={skills.map((s) => ({ value: s.id, label: s.name }))}
            value={form.skill_id}
            onChange={(e) => setForm({ ...form, skill_id: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Certificate ID Number *
                </label>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, certificate_number: generateRandomCertId() })}
                  className="text-[11px] text-blue-400 hover:underline flex items-center gap-0.5"
                >
                  <Sparkles size={11} /> Auto-Generate
                </button>
              </div>
              <Input
                value={form.certificate_number}
                onChange={(e) => setForm({ ...form, certificate_number: e.target.value })}
                placeholder="CF-2026-CSE-12345"
                required
              />
            </div>

            <Input
              label="Issue Date"
              type="date"
              value={form.issue_date}
              onChange={(e) => setForm({ ...form, issue_date: e.target.value })}
              required
            />
          </div>

          {/* Certificate File Attachment: Local Upload vs URL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Certificate Document (Optional)
              </label>
              <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => setUploadMode('upload')}
                  className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                    uploadMode === 'upload'
                      ? 'bg-amber-600 text-white font-medium shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <UploadCloud size={13} /> Direct Upload
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                    uploadMode === 'url'
                      ? 'bg-amber-600 text-white font-medium shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Link2 size={13} /> URL
                </button>
              </div>
            </div>

            {uploadMode === 'upload' ? (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="application/pdf,image/png,image/jpeg,image/webp,.pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  id="cert-file-upload"
                />

                {!uploadedFileName && !form.file_path ? (
                  <label
                    htmlFor="cert-file-upload"
                    className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 cursor-pointer transition-all hover:border-amber-500/50 hover:bg-amber-500/5"
                    style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-secondary)' }}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 size={24} className="animate-spin text-amber-400" />
                        <p className="text-xs font-medium text-amber-300">Uploading certificate from local files...</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-1.5">
                          <UploadCloud size={20} />
                        </div>
                        <p className="text-xs font-semibold text-white">Click to upload certificate PDF or Image</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">PDF, PNG, JPG directly from computer</p>
                      </>
                    )}
                  </label>
                ) : (
                  <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                        <FileCheck size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-emerald-200 truncate max-w-xs">
                          {uploadedFileName || 'Certificate Attached'}
                        </p>
                        <p className="text-[11px] text-emerald-400/80 flex items-center gap-1">
                          {uploadedFileSize && <span>{uploadedFileSize} · </span>}
                          <CheckCircle2 size={11} /> Ready
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveUploadedFile}
                      className="p-1 rounded text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Remove file"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Input
                placeholder="https://.../certificate.pdf or document URL"
                value={form.file_path}
                onChange={(e) => setForm({ ...form, file_path: e.target.value })}
              />
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting || isUploading} icon={<Award size={16} />}>
              Issue Certificate
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
