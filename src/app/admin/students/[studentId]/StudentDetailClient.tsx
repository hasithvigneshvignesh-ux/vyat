'use client';

import { useState } from 'react';
import { Profile, StudentSkillAccess, Skill, Payment, Certificate, LessonProgress, PricingRule } from '@/types/database';
import { formatDate, formatCurrency, getInitials, calculateProgress } from '@/lib/utils';
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
  ArrowLeft, Mail, Phone, School,
  Zap, CheckCircle2, Award, IndianRupee,
  KeyRound, ShieldAlert, Plus, Trash2, RotateCcw,
  ShieldCheck, Loader2
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
  payments: initialPayments,
  certificates,
  lessonProgress,
  lessonCounts,
  pricingRules,
}: Props) {
  const { addToast } = useToast();
  const router = useRouter();

  // Local state for immediate reactive UI
  const [localSkillAccess, setLocalSkillAccess] = useState(skillAccess);
  const [localPayments, setLocalPayments] = useState(initialPayments);

  // Skill activation state
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isCoveredByEnrollment, setIsCoveredByEnrollment] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isActivating, setIsActivating] = useState(false);

  // Skill deactivation / reactivation state
  const [actionSkillId, setActionSkillId] = useState<string | null>(null);

  // Payment deletion state
  const [deletingPaymentId, setDeletingPaymentId] = useState<string | null>(null);

  // Password reset state
  const [showResetModal, setShowResetModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Skills already active or completed cannot be selected again
  const activeOrCompletedSkillIds = localSkillAccess
    .filter(sa => sa.status === 'active' || sa.status === 'completed')
    .map(sa => sa.skill_id);

  const availableForActivation = allSkills.filter(s => !activeOrCompletedSkillIds.includes(s.id));

  // Group available skills by branch → course
  const groupedSkills: Record<string, Record<string, typeof availableForActivation>> = {};
  availableForActivation.forEach(skill => {
    const branchName = skill.course?.branch?.name || 'Other';
    const courseName = skill.course?.name || 'General';
    if (!groupedSkills[branchName]) groupedSkills[branchName] = {};
    if (!groupedSkills[branchName][courseName]) groupedSkills[branchName][courseName] = [];
    groupedSkills[branchName][courseName].push(skill);
  });

  // Calculate price (if not covered by enrollment)
  const calculatePrice = () => {
    if (selectedSkills.length === 0 || isCoveredByEnrollment) return 0;
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

  // Activate skills
  const handleActivateSkills = async () => {
    if (selectedSkills.length === 0) return;
    setIsActivating(true);

    try {
      const finalPrice = isCoveredByEnrollment ? 0 : calculatePrice();
      const res = await fetch('/api/admin/activate-skill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student.id,
          skill_ids: selectedSkills,
          payment_amount: finalPrice,
          payment_method: isCoveredByEnrollment ? null : paymentMethod,
          payment_status: isCoveredByEnrollment ? null : paymentStatus,
          payment_reference: isCoveredByEnrollment ? null : paymentRef,
          payment_notes: isCoveredByEnrollment
            ? 'Covered by initial enrollment payment'
            : (paymentNotes || 'Additional skill activation'),
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
      addToast('An error occurred during activation', 'error');
    } finally {
      setIsActivating(false);
    }
  };

  // Deactivate or Reactivate skill
  const handleToggleSkillStatus = async (skillId: string, action: 'deactivate' | 'reactivate') => {
    setActionSkillId(skillId);
    try {
      const res = await fetch('/api/admin/deactivate-skill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student.id,
          skill_id: skillId,
          action,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || `Failed to ${action} skill`, 'error');
        return;
      }

      const newStatus = action === 'reactivate' ? 'active' : 'revoked';
      setLocalSkillAccess(prev =>
        prev.map(sa =>
          sa.skill_id === skillId
            ? { ...sa, status: newStatus }
            : sa
        )
      );

      addToast(
        `Skill successfully ${action === 'reactivate' ? 'reactivated' : 'deactivated'}!`,
        'success'
      );
      router.refresh();
    } catch {
      addToast('Network error while updating skill status', 'error');
    } finally {
      setActionSkillId(null);
    }
  };

  // Delete payment record
  const handleDeletePayment = async (paymentId: string) => {
    if (!confirm('Are you sure you want to delete this payment record? This action cannot be undone.')) {
      return;
    }

    setDeletingPaymentId(paymentId);
    try {
      const res = await fetch(`/api/admin/payments/${paymentId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        addToast(data.error || 'Failed to delete payment', 'error');
        return;
      }

      setLocalPayments(prev => prev.filter(p => p.id !== paymentId));
      addToast('Payment record deleted successfully', 'success');
      router.refresh();
    } catch {
      addToast('Failed to delete payment', 'error');
    } finally {
      setDeletingPaymentId(null);
    }
  };

  // Reset password
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

  const activeAccess = localSkillAccess.filter(sa => sa.status === 'active');
  const completedAccess = localSkillAccess.filter(sa => sa.status === 'completed');
  const revokedAccess = localSkillAccess.filter(sa => sa.status === 'revoked');

  // Identify student's enrollment payment (created when admin created the student)
  const isExplicitEnrollmentNote = (notes?: string | null) => {
    const n = (notes || '').toLowerCase();
    return n.includes('paid for') || n.includes('initial') || n.includes('creation') || n.includes('enrollment');
  };

  const enrollmentPayment = localPayments.find(p => isExplicitEnrollmentNote(p.notes)) ||
    (localPayments.length > 0
      ? [...localPayments].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0]
      : null);

  const totalPaidEnrollment = (enrollmentPayment && (enrollmentPayment.payment_status === 'paid' || !enrollmentPayment.payment_status))
    ? Number(enrollmentPayment.amount) || 0
    : 0;

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
                {formatCurrency(totalPaidEnrollment)}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Total Paid (Enrollment)</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Skill Access & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Skills & Management */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Zap size={16} className="text-blue-400" /> Active Skills ({activeAccess.length})
            </h3>
            {revokedAccess.length > 0 && (
              <span className="text-xs text-red-400">
                {revokedAccess.length} deactivated
              </span>
            )}
          </div>

          {activeAccess.length === 0 ? (
            <p className="text-sm py-4 text-center" style={{ color: 'var(--text-tertiary)' }}>
              No active skills. Click &quot;Activate Skills&quot; to assign a skill.
            </p>
          ) : (
            <div className="space-y-4">
              {activeAccess.map(sa => {
                const progress = getSkillProgress(sa.skill_id);
                const isProcessing = actionSkillId === sa.skill_id;
                return (
                  <div key={sa.id} className="p-3.5 rounded-xl border border-[var(--border-secondary)]" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {sa.skill?.name}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {sa.skill?.course?.branch?.name} → {sa.skill?.course?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="info">Active</Badge>
                        <button
                          type="button"
                          onClick={() => handleToggleSkillStatus(sa.skill_id, 'deactivate')}
                          disabled={isProcessing}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30 transition-all flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                          title="Deactivate student's access to this skill"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              Updating...
                            </>
                          ) : (
                            <>Deactivate</>
                          )}
                        </button>
                      </div>
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

          {/* Deactivated / Revoked Skills Section */}
          {revokedAccess.length > 0 && (
            <div className="mt-6 pt-5 border-t" style={{ borderColor: 'var(--border-primary)' }}>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-red-400 flex items-center gap-1.5">
                <ShieldAlert size={14} /> Deactivated Skills ({revokedAccess.length})
              </h4>
              <div className="space-y-3">
                {revokedAccess.map(sa => {
                  const isProcessing = actionSkillId === sa.skill_id;
                  return (
                    <div
                      key={sa.id}
                      className="p-3 rounded-xl border border-red-500/20 bg-red-500/5 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium line-through text-red-300">
                          {sa.skill?.name}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                          {sa.skill?.course?.branch?.name} → {sa.skill?.course?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="error">Deactivated</Badge>
                        <button
                          type="button"
                          onClick={() => handleToggleSkillStatus(sa.skill_id, 'reactivate')}
                          disabled={isProcessing}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                          title="Reactivate student's access"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              Reactivating...
                            </>
                          ) : (
                            <>
                              <RotateCcw size={12} />
                              Reactivate
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </Card>

        {/* Payments History */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <IndianRupee size={16} className="text-amber-400" /> Payment History
            </h3>
            <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              Enrollment Total: <strong className="text-emerald-400">{formatCurrency(totalPaidEnrollment)}</strong>
            </span>
          </div>

          {localPayments.length === 0 ? (
            <p className="text-sm py-4 text-center" style={{ color: 'var(--text-tertiary)' }}>
              No payments recorded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {localPayments.map(payment => {
                const isEnrollment = payment.id === enrollmentPayment?.id;
                const isDeleting = deletingPaymentId === payment.id;
                return (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-[var(--border-secondary)]"
                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                  >
                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                          {formatCurrency(payment.amount)}
                        </p>
                        {isEnrollment ? (
                          <Badge variant="success">Enrollment Fee</Badge>
                        ) : (
                          <Badge variant="warning">Skill Add-on</Badge>
                        )}
                      </div>
                      <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-tertiary)' }}>
                        {payment.payment_method?.toUpperCase()} · {formatDate(payment.created_at)}
                        {payment.notes ? ` · ${payment.notes}` : ''}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={payment.payment_status === 'paid' ? 'success' : payment.payment_status === 'pending' ? 'warning' : 'error'}>
                        {payment.payment_status}
                      </Badge>

                      <button
                        type="button"
                        onClick={() => handleDeletePayment(payment.id)}
                        disabled={isDeleting}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                        title="Delete this payment record"
                      >
                        {isDeleting ? (
                          <Loader2 size={15} className="animate-spin text-red-400" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Skill Activation Modal */}
      <Modal
        isOpen={showActivateModal}
        onClose={() => { setShowActivateModal(false); setSelectedSkills([]); }}
        title="Activate Skills for Student"
        size="lg"
      >
        <div className="space-y-6">
          {/* Student info banner */}
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
              <span className="text-sm font-bold text-white">{getInitials(student.full_name)}</span>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{student.full_name}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{student.email}</p>
            </div>
          </div>

          {/* Available Skills to activate */}
          <div>
            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>
              Select Skills to Activate
            </h4>
            {availableForActivation.length === 0 ? (
              <p className="text-sm py-4 text-center" style={{ color: 'var(--text-tertiary)' }}>
                All available skills are already activated for this student.
              </p>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-4 pr-1">
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
                              type="button"
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
                              <div
                                className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${
                                  selectedSkills.includes(skill.id) ? 'bg-blue-500 border-blue-500' : ''
                                }`}
                                style={{ borderColor: selectedSkills.includes(skill.id) ? undefined : 'var(--border-primary)' }}
                              >
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

          {/* Activation & Fee Options */}
          {selectedSkills.length > 0 && (
            <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
              {/* Enrollment package toggle */}
              <div
                onClick={() => setIsCoveredByEnrollment(!isCoveredByEnrollment)}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isCoveredByEnrollment
                    ? 'border-emerald-500/50 bg-emerald-500/10'
                    : 'border-[var(--border-secondary)] bg-[var(--bg-tertiary)]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isCoveredByEnrollment}
                  onChange={(e) => setIsCoveredByEnrollment(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                />
                <div className="flex-1 text-xs">
                  <p className="font-semibold text-sm" style={{ color: isCoveredByEnrollment ? '#10b981' : 'var(--text-primary)' }}>
                    Covered by student enrollment fee (₹0 - no extra charge)
                  </p>
                  <p style={{ color: 'var(--text-tertiary)' }} className="mt-0.5">
                    Student already paid their course total during account creation. Do not record a duplicate skill payment.
                  </p>
                </div>
              </div>

              {/* Price summary */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20">
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {selectedSkills.length} skill{selectedSkills.length > 1 ? 's' : ''} selected
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {isCoveredByEnrollment
                      ? 'Already paid via student enrollment'
                      : (pricingRules.length > 0 ? 'Price based on configured pricing rules' : 'Individual skill pricing')}
                  </p>
                </div>
                <p className="text-xl font-bold" style={{ color: isCoveredByEnrollment ? '#10b981' : 'var(--text-primary)' }}>
                  {isCoveredByEnrollment ? '₹0' : formatCurrency(calculatePrice())}
                </p>
              </div>

              {/* Additional payment fields (only shown if NOT covered by enrollment) */}
              {!isCoveredByEnrollment && (
                <div className="space-y-3 pt-2">
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
                    placeholder="Any notes about this additional fee"
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                  />
                </div>
              )}

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
