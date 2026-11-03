import { createClient } from '@/lib/supabase/server';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';
import { IndianRupee, CheckCircle2, Clock } from 'lucide-react';
import { SAMPLE_PAYMENTS } from '@/lib/mockData';

export default async function AdminPaymentsPage() {
  const supabase = await createClient();
  const { data: dbPayments } = await supabase
    .from('payments')
    .select('*, student:profiles!payments_student_id_fkey(full_name, email)')
    .order('created_at', { ascending: false });

  const payments = (dbPayments && dbPayments.length > 0) ? dbPayments : SAMPLE_PAYMENTS;

  // Group payments by student to pick each student's enrollment creation total
  const studentPaymentsMap = new Map<string, any[]>();
  payments.forEach((p: any) => {
    if (!p.student_id) return;
    if (!studentPaymentsMap.has(p.student_id)) {
      studentPaymentsMap.set(p.student_id, []);
    }
    studentPaymentsMap.get(p.student_id)!.push(p);
  });

  const enrollmentPayments: any[] = [];
  studentPaymentsMap.forEach((pList) => {
    const explicitEnrollment = pList.find(p => {
      const notes = (p.notes || '').toLowerCase();
      return notes.includes('paid for') ||
             notes.includes('initial') ||
             notes.includes('creation') ||
             notes.includes('enrollment');
    });

    if (explicitEnrollment) {
      if (explicitEnrollment.payment_status === 'paid' || !explicitEnrollment.payment_status) {
        enrollmentPayments.push(explicitEnrollment);
      }
    } else if (pList.length > 0) {
      const nonAddons = pList.filter(p => {
        const notes = (p.notes || '').toLowerCase();
        return !notes.includes('skill') && !notes.includes('activation fee');
      });
      const chosen = nonAddons[0] || pList[0];
      if (chosen && (chosen.payment_status === 'paid' || !chosen.payment_status)) {
        enrollmentPayments.push(chosen);
      }
    }
  });

  const totalRevenue = enrollmentPayments.length > 0
    ? enrollmentPayments.reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0)
    : payments.filter((p: any) => p.payment_status === 'paid').reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

  const completedCount = payments.filter((p: any) => p.payment_status === 'paid').length;
  const pendingCount = payments.filter((p: any) => p.payment_status === 'pending').length;

  return (
    <div className="page-container space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Payments &amp; Revenue
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Real-time transaction history, course fee receipts, and billing
          </p>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="!p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <IndianRupee size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {formatCurrency(totalRevenue)}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Total Revenue Collected (Enrollments)</p>
            </div>
          </div>
        </Card>

        <Card className="!p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {completedCount}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Successful Transactions</p>
            </div>
          </div>
        </Card>

        <Card className="!p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {pendingCount}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Pending Settlements</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left" style={{ borderColor: 'var(--border-primary)' }}>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Student</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Type / Notes</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Amount</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Method</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Txn Reference</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Status</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Date</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-secondary)' }}>
              {payments.map((p: any) => {
                const isEnrollment = enrollmentPayments.some(ep => ep.id === p.id);
                return (
                  <tr key={p.id} className="transition-colors hover:bg-[var(--bg-tertiary)]">
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{p.student?.full_name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{p.student?.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        {isEnrollment ? (
                          <Badge variant="success">Enrollment Fee</Badge>
                        ) : (
                          <Badge variant="warning">Skill Add-on</Badge>
                        )}
                        {p.notes && <span className="text-xs text-[var(--text-muted)] truncate max-w-[200px]">{p.notes}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant="info">{p.payment_method?.toUpperCase() || 'UPI'}</Badge>
                    </td>
                    <td className="px-5 py-4 text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                      {p.transaction_reference || p.payment_reference || 'N/A'}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={p.payment_status === 'paid' ? 'success' : p.payment_status === 'pending' ? 'warning' : 'error'}>
                        {p.payment_status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                      {formatDate(p.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
