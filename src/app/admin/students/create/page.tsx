'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { useToast } from '@/providers/ToastProvider';
import {
  UserPlus, ArrowLeft, Mail, Phone, School,
  Hash, GitBranch, Calendar, Lock, User, Award,
  Sparkles, UploadCloud, CheckCircle2, FileCheck, Loader2, X, Link2
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function CreateStudentPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState<{ id: string; name: string }[]>([]);
  const supabase = createClient();

  // Certificate upload states
  const [certUploadMode, setCertUploadMode] = useState<'upload' | 'url'>('upload');
  const [isUploadingCert, setIsUploadingCert] = useState(false);
  const [uploadedCertName, setUploadedCertName] = useState<string | null>(null);
  const [uploadedCertSize, setUploadedCertSize] = useState<string | null>(null);
  const certFileInputRef = useRef<HTMLInputElement>(null);

  const generateCertId = () => {
    const year = new Date().getFullYear();
    const rand = Math.floor(10000 + Math.random() * 90000);
    return `CF-${year}-NEW-${rand}`;
  };

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    university: '',
    student_id_number: '',
    branch_name: '',
    year: '',
    password: '',
    // Certificate Awarding
    award_certificate: false,
    certificate_skill_id: '',
    certificate_number: generateCertId(),
    certificate_file_path: '',
    certificate_issue_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    async function loadSkills() {
      const { data } = await supabase.from('skills').select('id, name').order('name');
      if (data && data.length > 0) {
        setSkills(data);
        setForm((prev) => ({ ...prev, certificate_skill_id: data[0].id }));
      } else {
        const defaultSkills = [
          { id: 'a1000000-0000-0000-0000-000000000001', name: 'Data Structures & Algorithms in C++' },
          { id: 'a2000000-0000-0000-0000-000000000003', name: 'Machine Learning Fundamentals' },
          { id: 'a4000000-0000-0000-0000-000000000001', name: 'Network Security & Penetration Testing' },
          { id: 'a3000000-0000-0000-0000-000000000001', name: 'Exploratory Data Analysis with Pandas' },
        ];
        setSkills(defaultSkills);
        setForm((prev) => ({ ...prev, certificate_skill_id: defaultSkills[0].id }));
      }
    }
    loadSkills();
  }, []);

  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCertFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCert(true);
    setUploadedCertName(file.name);
    setUploadedCertSize((file.size / (1024 * 1024)).toFixed(2) + ' MB');

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
        addToast(data.error || 'Failed to upload certificate', 'error');
        return;
      }

      setForm((prev) => ({
        ...prev,
        certificate_file_path: data.url || data.localUrl,
      }));

      addToast(`Certificate file "${file.name}" uploaded successfully!`, 'success');
    } catch (err: any) {
      addToast(err?.message || 'Error uploading certificate from local files', 'error');
    } finally {
      setIsUploadingCert(false);
    }
  };

  const handleRemoveCertFile = () => {
    setUploadedCertName(null);
    setUploadedCertSize(null);
    setForm((prev) => ({ ...prev, certificate_file_path: '' }));
    if (certFileInputRef.current) certFileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          year: form.year ? parseInt(form.year) : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        addToast(data.error || 'Failed to create student', 'error');
        return;
      }

      addToast(`Student account created for ${form.full_name}${form.award_certificate ? ' with certificate awarded!' : ''}`, 'success');
      router.push(`/admin/students/${data.student.id}`);
    } catch {
      addToast('An error occurred while creating the student', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const branchOptions = [
    { value: 'CSE Core', label: 'CSE Core' },
    { value: 'CSE AI & ML', label: 'CSE AI & Machine Learning' },
    { value: 'CSE Data Science', label: 'CSE Data Science' },
    { value: 'CSE Cyber Security', label: 'CSE Cyber Security' },
    { value: 'Other', label: 'Other' },
  ];

  const yearOptions = [
    { value: '1', label: '1st Year' },
    { value: '2', label: '2nd Year' },
    { value: '3', label: '3rd Year' },
    { value: '4', label: '4th Year' },
  ];

  return (
    <div className="page-container max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/students">
          <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />}>
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Create Student
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            Create a new student account and issue initial certificates or credentials
          </p>
        </div>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <User size={16} /> Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Full Name *"
                  placeholder="Rahul Kumar"
                  value={form.full_name}
                  onChange={(e) => updateField('full_name', e.target.value)}
                  required
                />
              </div>
              <Input
                label="Email Address *"
                type="email"
                placeholder="rahul@example.com"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                required
                icon={<Mail size={16} />}
              />
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+91 9876543210"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                icon={<Phone size={16} />}
              />
            </div>
          </div>

          {/* Academic Information */}
          <div
            className="pt-5 border-t"
            style={{ borderColor: 'var(--border-primary)' }}
          >
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <School size={16} /> Academic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="University / College"
                placeholder="IIT Delhi"
                value={form.university}
                onChange={(e) => updateField('university', e.target.value)}
                icon={<School size={16} />}
              />
              <Input
                label="Student ID / Roll Number"
                placeholder="2024CS101"
                value={form.student_id_number}
                onChange={(e) => updateField('student_id_number', e.target.value)}
                icon={<Hash size={16} />}
              />
              <Select
                label="Branch"
                options={branchOptions}
                value={form.branch_name}
                onChange={(e) => updateField('branch_name', e.target.value)}
                placeholder="Select branch"
              />
              <Select
                label="Year"
                options={yearOptions}
                value={form.year}
                onChange={(e) => updateField('year', e.target.value)}
                placeholder="Select year"
              />
            </div>
          </div>

          {/* Credentials */}
          <div
            className="pt-5 border-t"
            style={{ borderColor: 'var(--border-primary)' }}
          >
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <Lock size={16} /> Login Credentials
            </h3>
            <Input
              label="Password *"
              type="text"
              placeholder="Create a temporary password"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              required
              hint="Minimum 6 characters. You will share this with the student."
            />
          </div>

          {/* Upload / Award Certificate Section */}
          <div
            className="pt-5 border-t"
            style={{ borderColor: 'var(--border-primary)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <Award size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Award &amp; Upload Certificate
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Optionally issue or upload a completed skill certificate right now
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.award_certificate}
                  onChange={(e) => updateField('award_certificate', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {form.award_certificate && (
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-4 mt-3 animate-fade-in">
                <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
                  <CheckCircle2 size={14} /> Certificate will be generated &amp; unlocked for this student upon creation
                </div>

                <Select
                  label="Mastered Skill Program *"
                  options={skills.map((s) => ({ value: s.id, label: s.name }))}
                  value={form.certificate_skill_id}
                  onChange={(e) => updateField('certificate_skill_id', e.target.value)}
                  required={form.award_certificate}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        Certificate Number *
                      </label>
                      <button
                        type="button"
                        onClick={() => updateField('certificate_number', generateCertId())}
                        className="text-[11px] text-blue-400 hover:underline flex items-center gap-0.5"
                      >
                        <Sparkles size={11} /> Auto-Gen
                      </button>
                    </div>
                    <Input
                      value={form.certificate_number}
                      onChange={(e) => updateField('certificate_number', e.target.value)}
                      placeholder="CF-2026-CSE-12345"
                      required={form.award_certificate}
                    />
                  </div>

                  <Input
                    label="Issue Date"
                    type="date"
                    value={form.certificate_issue_date}
                    onChange={(e) => updateField('certificate_issue_date', e.target.value)}
                    required={form.award_certificate}
                  />
                </div>

                {/* Direct Certificate File Upload */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                      Certificate Document (PDF / Image)
                    </label>
                    <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/10 text-xs">
                      <button
                        type="button"
                        onClick={() => setCertUploadMode('upload')}
                        className={`px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 ${
                          certUploadMode === 'upload'
                            ? 'bg-amber-600 text-white font-medium shadow-sm'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <UploadCloud size={12} /> Direct Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => setCertUploadMode('url')}
                        className={`px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 ${
                          certUploadMode === 'url'
                            ? 'bg-amber-600 text-white font-medium shadow-sm'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Link2 size={12} /> URL
                      </button>
                    </div>
                  </div>

                  {certUploadMode === 'upload' ? (
                    <div>
                      <input
                        type="file"
                        ref={certFileInputRef}
                        onChange={handleCertFileUpload}
                        accept="application/pdf,image/png,image/jpeg,image/webp,.pdf,.png,.jpg,.jpeg"
                        className="hidden"
                        id="student-cert-upload"
                      />

                      {!uploadedCertName && !form.certificate_file_path ? (
                        <label
                          htmlFor="student-cert-upload"
                          className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all hover:border-amber-500/50 hover:bg-amber-500/10"
                          style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-secondary)' }}
                        >
                          {isUploadingCert ? (
                            <div className="flex flex-col items-center gap-1.5">
                              <Loader2 size={20} className="animate-spin text-amber-400" />
                              <p className="text-xs font-medium text-amber-300">Uploading certificate...</p>
                            </div>
                          ) : (
                            <>
                              <UploadCloud size={20} className="text-amber-400 mb-1" />
                              <p className="text-xs font-semibold text-white">Click to upload certificate directly from files</p>
                              <p className="text-[11px] text-gray-400">PDF, PNG, JPG supported</p>
                            </>
                          )}
                        </label>
                      ) : (
                        <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileCheck size={16} className="text-emerald-400" />
                            <div>
                              <p className="text-xs font-semibold text-emerald-200 truncate max-w-xs">
                                {uploadedCertName || 'Certificate Attached'}
                              </p>
                              <p className="text-[10px] text-emerald-400/80">
                                {uploadedCertSize && `${uploadedCertSize} · `}Uploaded from local storage
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveCertFile}
                            className="p-1 rounded text-gray-400 hover:text-red-400"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Input
                      placeholder="https://.../certificate.pdf or document URL"
                      value={form.certificate_file_path}
                      onChange={(e) => updateField('certificate_file_path', e.target.value)}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div
            className="pt-5 border-t flex justify-end gap-3"
            style={{ borderColor: 'var(--border-primary)' }}
          >
            <Link href="/admin/students">
              <Button variant="secondary" type="button">Cancel</Button>
            </Link>
            <Button
              type="submit"
              isLoading={isLoading || isUploadingCert}
              icon={<UserPlus size={16} />}
            >
              Create Student
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
