'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Profile, Payment } from '@/types/database';
import { formatDate, formatCurrency, timeAgo, getInitials } from '@/lib/utils';
import Link from 'next/link';
import {
  Users, Zap, CheckCircle2, Award, AlertTriangle,
  TrendingUp, ArrowRight, Plus, UserPlus, IndianRupee,
  Clock,
} from 'lucide-react';

interface AdminStats {
  totalStudents: number;
  activeStudents: number;
  totalActiveSkills: number;
  completedSkills: number;
  certificatesIssued: number;
  expiringAccess: number;
}

interface Props {
  stats: AdminStats;
  recentStudents: Profile[];
  recentCompletions: {
    id: string;
    completion_date: string;
    student: { full_name: string; email: string };
    skill: { name: string };
  }[];
  recentPayments: (Payment & { student: { full_name: string } })[];
}

export default function AdminDashboardClient({
  stats,
  recentStudents,
  recentCompletions,
  recentPayments,
}: Props) {
  const statCards = [
    {
      label: 'Total Students',
      value: stats.totalStudents,
      icon: <Users size={22} />,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      trend: null,
    },
    {
      label: 'Active Students',
      value: stats.activeStudents,
      icon: <TrendingUp size={22} />,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      trend: null,
    },
    {
      label: 'Active Skills',
      value: stats.totalActiveSkills,
      icon: <Zap size={22} />,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      trend: null,
    },
    {
      label: 'Completed Skills',
      value: stats.completedSkills,
      icon: <CheckCircle2 size={22} />,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      trend: null,
    },
    {
      label: 'Certificates Issued',
      value: stats.certificatesIssued,
      icon: <Award size={22} />,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      trend: null,
    },
    {
      label: 'Expiring Soon',
      value: stats.expiringAccess,
      icon: <AlertTriangle size={22} />,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      trend: null,
    },
  ];

  return (
    <div className="page-container space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Overview of your platform&apos;s activity, student engagement, and performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/students/create" className="w-full sm:w-auto">
            <Button icon={<UserPlus size={16} />} className="w-full sm:w-auto justify-center">
              Create Student
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid - Fluid responsive for Mobile (2 cols), Tablet (3 cols), Laptop/Desktop (6 cols) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {statCards.map((stat, idx) => (
          <Card
            key={stat.label}
            className={`!p-4 sm:!p-5 animate-fade-in stagger-${idx + 1} flex flex-col justify-between`}
            style={{ opacity: 0, animationFillMode: 'forwards' } as React.CSSProperties}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                <span className={stat.color}>{stat.icon}</span>
              </div>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm font-medium mt-1 truncate" style={{ color: 'var(--text-tertiary)' }}>
                {stat.label}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Content Grid - 1 col on Mobile, 2 on Tablet/Small Laptop, 3 on Large PC */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
        {/* Recent Students */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Users size={17} className="text-blue-400" /> Recent Students
            </h3>
            <Link href="/admin/students">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          {recentStudents.length === 0 ? (
            <p className="text-sm py-8 text-center" style={{ color: 'var(--text-tertiary)' }}>
              No students enrolled yet
            </p>
          ) : (
            <div className="space-y-2.5 flex-1">
              {recentStudents.map((student) => (
                <Link
                  key={student.id}
                  href={`/admin/students/${student.id}`}
                  className="flex items-center gap-3 p-2.5 rounded-xl transition-all hover:bg-[var(--bg-tertiary)] group"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-xs font-bold text-white">
                      {getInitials(student.full_name)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate group-hover:text-blue-400 transition-colors" style={{ color: 'var(--text-primary)' }}>
                      {student.full_name}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>
                      {student.email}
                    </p>
                  </div>
                  <span className="text-xs whitespace-nowrap flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                    {timeAgo(student.created_at)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Completions */}
        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <CheckCircle2 size={17} className="text-emerald-400" /> Recent Completions
            </h3>
          </div>
          {recentCompletions.length === 0 ? (
            <p className="text-sm py-8 text-center" style={{ color: 'var(--text-tertiary)' }}>
              No course completions yet
            </p>
          ) : (
            <div className="space-y-2.5 flex-1">
              {recentCompletions.map((completion) => (
                <div
                  key={completion.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl transition-colors hover:bg-[var(--bg-tertiary)]"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <CheckCircle2 size={16} className="text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {completion.student?.full_name}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>
                      Completed {completion.skill?.name}
                    </p>
                  </div>
                  <span className="text-xs whitespace-nowrap flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                    {completion.completion_date ? timeAgo(completion.completion_date) : '—'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Payments */}
        <Card className="flex flex-col md:col-span-2 xl:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <IndianRupee size={17} className="text-amber-400" /> Recent Payments
            </h3>
            <Link href="/admin/payments">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          {recentPayments.length === 0 ? (
            <p className="text-sm py-8 text-center" style={{ color: 'var(--text-tertiary)' }}>
              No payments recorded yet
            </p>
          ) : (
            <div className="space-y-2.5 flex-1">
              {recentPayments.map((payment) => {
                const amountVal = payment.amount ?? (payment as any).amount_paid ?? 0;
                const status = payment.payment_status || 'paid';
                return (
                  <div
                    key={payment.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl transition-colors hover:bg-[var(--bg-tertiary)]"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <IndianRupee size={15} className="text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {payment.student?.full_name || 'Student'}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {formatCurrency(amountVal)} · {(payment.payment_method || 'UPI').toUpperCase()}
                      </p>
                    </div>
                    <Badge variant={status === 'paid' ? 'success' : status === 'pending' ? 'warning' : 'error'}>
                      {status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
