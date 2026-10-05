'use client';

import { useState } from 'react';
import { Profile, StudentSkillAccess, Skill, Payment, Certificate, LessonProgress, PricingRule } from '@/types/database';
import { formatDate, formatCurrency, getInitials, getStatusColor, calculateProgress } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import ProgressBar from '@/components/ui/ProgressBar';
import { useToast } from '@/providers/ToastProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Mail, Phone, School, Hash, Calendar,
  Zap, CheckCircle2, Lock, Award, IndianRupee,
  KeyRound, ToggleLeft, ShieldAlert, Plus,
} from 'lucide-react';

interface Props {
  student: Profile;
  skillAccess: (StudentSkillAccess & { skill: Skill & { course: { name: string; branch: { name: string } } } })[];
  allSkills: (Skill & { course: { name: string; id: string; branch: { name: string; id: string } } })[];
  payments: Payment[];
  certificates: (Certificate & { skill: { name: string } })[];
  lessonProgress: LessonProgress[];
  lessonCounts: Record<string, number>;
  pricingRules: PricingRule[];
}

export default function StudentDetailClient({
  student,
  skillAccess,
  allSkills,
  payments,
  certificates,
  lessonProgress,
  lessonCounts,
  pricingRules,
}: Props) {
  const { addToast } = useToast();
  const router = useRouter();

  // Skill activation state
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isActivating, setIsActivating] = useState(false);

  // Password reset state
  const [showResetModal, setShowResetModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const accessedSkillIds = skillAccess.map(sa => sa.skill_id);
  const availableForActivation = allSkills.filter(s => !accessedSkillIds.includes(s.id));

  // Group available skills by branch → course
  const groupedSkills: Record<string, Record<string, typeof availableForActivation>> = {};
  availableForActivation.forEach(skill => {
    const branchName = skill.course?.branch?.name || 'Other';
    const courseName = skill.course?.name || 'General';
    if (!groupedSkills[branchName]) groupedSkills[branchName] = {};
    if (!groupedSkills[branchName][courseName]) groupedSkills[branchName][courseName] = [];
    groupedSkills[branchName][courseName].push(skill);
  });

  // Calculate price
  const calculatePrice = () => {
    if (selectedSkills.length === 0) return 0;
    const sortedRules = [...pricingRules].sort((a, b) => b.skill_count - a.skill_count);
    for (const rule of sortedRules) {
      if (selectedSkills.length >= rule.skill_count) {
        return rule.price;
      }
    }
    // Default: sum individual prices
    return selectedSkills.reduce((sum, id) => {
      const skill = allSkills.find(s => s.id === id);
      return sum + (skill?.price || 500);
    }, 0);
  };

  const toggleSkillSelection = (skillId: string) => {
    setSelectedSkills(prev =>
      prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]
    );
  };

  const handleActivateSkills = async () => {
    if (selectedSkills.length === 0) return;
    setIsActivating(true);

    try {
      const res = await fetch('/api/admin/activate-skill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student.id,
          skill_ids: selectedSkills,
          payment_amount: calculatePrice(),
          payment_method: paymentMethod,
          payment_status: paymentStatus,
          payment_reference: paymentRef,
          payment_notes: paymentNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || 'Failed to activate skills', 'error');
        return;
      }

      addToast(`${selectedSkills.length} skill(s) activated successfully!`, 'success');
      setShowActivateModal(false);
      setSelectedSkills([]);
      router.refresh();
    } catch {
      addToast('An error occurred', 'error');
    } finally {
      setIsActivating(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      addToast('Password must be at least 6 characters', 'error');
      return;
    }
    setIsResetting(true);

    try {
      const res = await fetch('/api/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student.id,
          new_password: newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || 'Failed to reset password', 'error');
        return;
      }

      addToast('Password reset successfully!', 'success');
      setShowResetModal(false);
      setNewPassword('');
    } catch {
      addToast('An error occurred', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  const getSkillProgress = (skillId: string) => {
    const total = lessonCounts[skillId] || 0;
    const completed = lessonProgress.filter(lp => lp.skill_id === skillId && lp.is_completed).length;
    return calculateProgress(completed, total);
  };

  const activeAccess = skillAccess.filter(sa => sa.status === 'active');
  const completedAccess = skillAccess.filter(sa => sa.status === 'completed');

  return (
    <div className="page-container space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/students">
          <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />}>Back</Button>
        </Link>
      </div>

      {/* Student Profile Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-violet-600/5 pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-white">
              {getInitials(student.full_name)}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              {student.full_name}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <span className="flex items-center gap-1.5"><Mail size={14} /> {student.email}</span>
              {student.phone && <span className="flex items-center gap-1.5"><Phone size={14} /> {student.phone}</span>}
              {student.university && <span className="flex items-center gap-1.5"><School size={14} /> {student.university}</span>}
              {student.branch_name && <span className="flex items-center gap-1.5 text-blue-400">{student.branch_name}</span>}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant={student.is_active ? 'success' : 'error'}>
                {student.is_active ? 'Active' : 'Inactive'}
              </Badge>
              {student.year && <Badge variant="info">Year {student.year}</Badge>}
              {student.student_id_number && <Badge>{student.student_id_number}</Badge>}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:flex-col">
            <Button size="sm" icon={<Plus size={14} />} onClick={() => setShowActivateModal(true)}>
              Activate Skills
            </Button>
            <Button variant="secondary" size="sm" icon={<KeyRound size={14} />} onClick={() => setShowResetModal(true)}>
              Reset Password
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Zap size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{activeAccess.length}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Active Skills</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{completedAccess.length}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Completed</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Award size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {certificates.filter(c => c.status === 'unlocked').length}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Certificates</p>
            </div>
          </div>
        </Card>
        <Card className="!p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <IndianRupee size={18} className="text-violet-400" />
            </div>
            <div>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {formatCurrency(payments.filter(p => p.payment_status === 'paid').reduce((s, p) => s + p.amount, 0))}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Total Paid</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Skill Access & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Skills */}
        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Zap size={16} className="text-blue-400" /> Active Skills
          </h3>
          {activeAccess.length === 0 ? (
            <p className="text-sm py-4 text-center" style={{ color: 'var(--text-tertiary)' }}>
              No active skills. Click &quot;Activate Skills&quot; to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {activeAccess.map(sa => {
                const progress = getSkillProgress(sa.skill_id);
                return (
                  <div key={sa.id} className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {sa.skill?.name}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {sa.skill?.course?.branch?.name} → {sa.skill?.course?.name}
                        </p>
                      </div>
                      <Badge variant="info">Active</Badge>
                    </div>
                    <ProgressBar value={progress} showLabel size="sm" />
                    <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                      Activated {formatDate(sa.activated_at)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Payments */}
        <Card>
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <IndianRupee size={16} className="text-amber-400" /> Payment History
          </h3>
          {payments.length === 0 ? (
            <p className="text-sm py-4 text-center" style={{ color: 'var(--text-tertiary)' }}>
              No payments recorded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {payments.map(payment => (
                <div key={payment.id} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {formatCurrency(payment.amount)}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {payment.payment_method.toUpperCase()} · {formatDate(payment.created_at)}
                    </p>
                  </div>
                  <Badge variant={payment.payment_status === 'paid' ? 'success' : payment.payment_status === 'pending' ? 'warning' : 'error'}>
                    {payment.payment_status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Skill Activation Modal */}
      <Modal
        isOpen={showActivateModal}
        onClose={() => { setShowActivateModal(false); setSelectedSkills([]); }}
        title="Activate Skills"
        size="lg"
      >
        <div className="space-y-6">
          {/* Student info */}
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <span className="text-sm font-bold text-white">{getInitials(student.full_name)}</span>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{student.full_name}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{student.email}</p>
            </div>
          </div>

          {/* Available Skills */}
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
              Select Skills to Activate
            </h4>
            {availableForActivation.length === 0 ? (
              <p className="text-sm py-4 text-center" style={{ color: 'var(--text-tertiary)' }}>
                All available skills are already activated for this student.
              </p>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-4">
                {Object.entries(groupedSkills).map(([branchName, courses]) => (
                  <div key={branchName}>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
                      {branchName}
                    </p>
                    {Object.entries(courses).map(([courseName, skills]) => (
                      <div key={courseName} className="ml-2 mb-2">
                        <p className="text-xs mb-1.5" style={{ color: 'var(--text-muted)' }}>{courseName}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-2">
                          {skills.map(skill => (
                            <button
                              key={skill.id}
                              onClick={() => toggleSkillSelection(skill.id)}
                              className={`
                                flex items-center gap-2 p-2.5 rounded-xl border text-left text-sm transition-all
                                ${selectedSkills.includes(skill.id)
                                  ? 'border-blue-500/50 bg-blue-500/10'
                                  : 'hover:bg-[var(--bg-card-hover)]'
                                }
                              `}
                              style={{
                                borderColor: selectedSkills.includes(skill.id) ? undefined : 'var(--border-secondary)',
                              }}
                            >
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${
                                selectedSkills.includes(skill.id) ? 'bg-blue-500 border-blue-500' : ''
                              }`} style={{ borderColor: selectedSkills.includes(skill.id) ? undefined : 'var(--border-primary)' }}>
                                {selectedSkills.includes(skill.id) && (
                                  <CheckCircle2 size={12} className="text-white" />
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{skill.name}</p>
                              </div>
                              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                                {formatCurrency(skill.price)}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment details */}
          {selectedSkills.length > 0 && (
            <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {selectedSkills.length} skill{selectedSkills.length > 1 ? 's' : ''} selected
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {pricingRules.length > 0 ? 'Price based on configured pricing rules' : 'Individual skill pricing'}
                  </p>
                </div>
                <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {formatCurrency(calculatePrice())}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Payment Method"
                  options={[
                    { value: 'upi', label: 'UPI' },
                    { value: 'cash', label: 'Cash' },
                  ]}
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <Select
                  label="Payment Status"
                  options={[
                    { value: 'paid', label: 'Paid' },
                    { value: 'pending', label: 'Pending' },
                  ]}
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                />
              </div>
              <Input
                label="Payment Reference (optional)"
                placeholder="UPI Transaction ID"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
              />
              <Input
                label="Notes (optional)"
                placeholder="Any notes about this payment"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
              />

              <Button
                className="w-full"
                size="lg"
                isLoading={isActivating}
                onClick={handleActivateSkills}
                icon={<Zap size={16} />}
              >
                Activate {selectedSkills.length} Skill{selectedSkills.length > 1 ? 's' : ''}
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Password Reset Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => { setShowResetModal(false); setNewPassword(''); }}
        title="Reset Student Password"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Set a new password for <strong>{student.full_name}</strong>
          </p>
          <Input
            label="New Password"
            type="text"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            hint="Minimum 6 characters. Share this with the student."
          />
          <Button
            className="w-full"
            isLoading={isResetting}
            onClick={handleResetPassword}
            icon={<KeyRound size={16} />}
          >
            Reset Password
          </Button>
        </div>
      </Modal>
    </div>
  );
}
