import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { BarChart3, TrendingUp, Users, Award, BookOpen, IndianRupee, PieChart, Activity } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminReportsPage() {
  const branchBreakdown = [
    { name: 'CSE AI & ML', students: 54, percentage: 38, color: 'from-violet-500 to-fuchsia-500' },
    { name: 'CSE Core', students: 46, percentage: 32, color: 'from-blue-500 to-cyan-500' },
    { name: 'CSE Cyber Security', students: 25, percentage: 18, color: 'from-emerald-500 to-teal-500' },
    { name: 'CSE Data Science', students: 17, percentage: 12, color: 'from-amber-500 to-orange-500' },
  ];

  const popularSkills = [
    { name: 'Data Structures & Algorithms in C++', branch: 'CSE Core', enrollments: 84, completionRate: '78%' },
    { name: 'Machine Learning Fundamentals', branch: 'CSE AI & ML', enrollments: 76, completionRate: '65%' },
    { name: 'Deep Learning & Neural Networks', branch: 'CSE AI & ML', enrollments: 62, completionRate: '54%' },
    { name: 'Network Security & Ethical Hacking', branch: 'CSE Cyber Security', enrollments: 49, completionRate: '71%' },
    { name: 'Exploratory Data Analysis with Pandas', branch: 'CSE Data Science', enrollments: 41, completionRate: '82%' },
  ];

  const monthlyGrowth = [
    { month: 'May 2026', revenue: 14200, students: 18 },
    { month: 'Jun 2026', revenue: 22800, students: 29 },
    { month: 'Jul 2026', revenue: 35400, students: 44 },
    { month: 'Aug 2026', revenue: 49000, students: 61 },
    { month: 'Sep 2026', revenue: 68500, students: 86 },
  ];

  return (
    <div className="page-container space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Analytics &amp; Platform Reports
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Real-time metrics on student enrollment, skill completion velocity, and revenue distribution
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="!p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Users size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>142</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Total Enrollments</p>
            </div>
          </div>
        </Card>

        <Card className="!p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>74.2%</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Avg. Completion Rate</p>
            </div>
          </div>
        </Card>

        <Card className="!p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
              <Award size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>68</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Certificates Earned</p>
            </div>
          </div>
        </Card>

        <Card className="!p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
              <IndianRupee size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(68500)}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Monthly Gross GMV</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branch Distribution */}
        <Card>
          <h3 className="font-semibold text-base mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <PieChart size={18} className="text-violet-400" /> Students by Branch Specialization
          </h3>
          <div className="space-y-4">
            {branchBreakdown.map((b) => (
              <div key={b.name} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{b.name}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{b.students} students ({b.percentage}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${b.color}`}
                    style={{ width: `${b.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Monthly Revenue Growth */}
        <Card>
          <h3 className="font-semibold text-base mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Activity size={18} className="text-emerald-400" /> Enrollment &amp; Revenue Growth
          </h3>
          <div className="space-y-3">
            {monthlyGrowth.map((m) => (
              <div
                key={m.month}
                className="flex items-center justify-between p-3 rounded-xl transition-colors hover:bg-[var(--bg-tertiary)]"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{m.month}</p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>+{m.students} new students</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-400">{formatCurrency(m.revenue)}</p>
                  <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">+28%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Performing Skills */}
      <Card padding="none">
        <div className="p-5 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <h3 className="font-semibold text-base flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <BookOpen size={18} className="text-blue-400" /> Top Performing Skills &amp; Course Completion
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left" style={{ borderColor: 'var(--border-primary)' }}>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Skill Name</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Branch</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Active Learners</th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Completion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-secondary)' }}>
              {popularSkills.map((s) => (
                <tr key={s.name} className="transition-colors hover:bg-[var(--bg-tertiary)]">
                  <td className="px-5 py-4 font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{s.name}</td>
                  <td className="px-5 py-4"><Badge variant="purple">{s.branch}</Badge></td>
                  <td className="px-5 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{s.enrollments} enrolled</td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">{s.completionRate}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
