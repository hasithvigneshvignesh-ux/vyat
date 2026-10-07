import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { BarChart3, TrendingUp, Users, Award, BookOpen, IndianRupee, PieChart, Activity } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { createClient } from '@/lib/supabase/server';

export default async function AdminReportsPage() {
  const supabase = await createClient();

  // Total Students
  const { count: totalStudents } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'student');

  // Completion Rate
  const { count: completedSkills } = await supabase
    .from('student_skill_access')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'completed');
  
  // We still need total enrollments (skill access count) for the completion rate calculation
  const { count: totalEnrollments } = await supabase
    .from('student_skill_access')
    .select('*', { count: 'exact', head: true });

  const completionRate = totalEnrollments ? ((completedSkills || 0) / totalEnrollments) * 100 : 0;

  // Certificates Earned
  const { count: certificatesEarned } = await supabase
    .from('certificates')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'unlocked');

  // Gross GMV
  const { data: payments } = await supabase.from('payments').select('amount');
  const grossGmv = payments?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0;

  // Branch Breakdown
  const { data: accessData } = await supabase
    .from('student_skill_access')
    .select(`
      id,
      skill:skills(
        course:courses(
          branch:branches(name)
        )
      )
    `);

  const branchCounts: Record<string, number> = {};
  if (accessData) {
    accessData.forEach(a => {
      const branchName = (a.skill as any)?.course?.branch?.name || 'Unknown';
      branchCounts[branchName] = (branchCounts[branchName] || 0) + 1;
    });
  }

  const colors = [
    'from-violet-500 to-fuchsia-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
  ];

  const totalBranchStudents = Object.values(branchCounts).reduce((a, b) => a + b, 0);
  const branchBreakdown = Object.entries(branchCounts).map(([name, count], index) => ({
    name,
    students: count,
    percentage: totalBranchStudents ? Math.round((count / totalBranchStudents) * 100) : 0,
    color: colors[index % colors.length]
  })).sort((a, b) => b.students - a.students);

  // Top Performing Skills
  const { data: skillsData } = await supabase
    .from('skills')
    .select(`
      id,
      name,
      course:courses(branch:branches(name)),
      student_skill_access(id, status)
    `);

  let popularSkills: any[] = [];
  if (skillsData) {
    popularSkills = skillsData.map((s: any) => {
      const enrollments = s.student_skill_access?.length || 0;
      const completed = s.student_skill_access?.filter((a: any) => a.status === 'completed').length || 0;
      return {
        name: s.name,
        branch: s.course?.branch?.name || 'Unknown',
        enrollments,
        completionRate: enrollments ? Math.round((completed / enrollments) * 100) + '%' : '0%'
      };
    }).sort((a, b) => b.enrollments - a.enrollments).slice(0, 5);
  }

  // Monthly Growth
  const monthlyGrowthData: Record<string, { revenue: number, students: number }> = {};
  
  if (payments) {
    // For real implementation, you would aggregate created_at dates
    // But since we removed mock data, we can just show an empty state or the actual aggregated data.
    // Let's do actual aggregated data for payments
    const { data: allPayments } = await supabase.from('payments').select('amount, created_at');
    allPayments?.forEach(p => {
      const date = new Date(p.created_at);
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!monthlyGrowthData[month]) monthlyGrowthData[month] = { revenue: 0, students: 0 };
      monthlyGrowthData[month].revenue += Number(p.amount) || 0;
    });

    const { data: allStudents } = await supabase.from('profiles').select('created_at').eq('role', 'student');
    allStudents?.forEach(s => {
      const date = new Date(s.created_at);
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!monthlyGrowthData[month]) monthlyGrowthData[month] = { revenue: 0, students: 0 };
      monthlyGrowthData[month].students += 1;
    });
  }

  const monthlyGrowth = Object.entries(monthlyGrowthData).map(([month, data]) => ({
    month,
    ...data
  })).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

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
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{totalStudents || 0}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Total Students</p>
            </div>
          </div>
        </Card>

        <Card className="!p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{completionRate.toFixed(1)}%</p>
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
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{certificatesEarned || 0}</p>
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
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(grossGmv)}</p>
              <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Gross GMV</p>
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
            {branchBreakdown.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No data available yet.</p>
            ) : branchBreakdown.map((b) => (
              <div key={b.name} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{b.name}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{b.students} enrollments ({b.percentage}%)</span>
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
            {monthlyGrowth.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No data available yet.</p>
            ) : monthlyGrowth.map((m) => (
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
              {popularSkills.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    No skills data available yet.
                  </td>
                </tr>
              ) : popularSkills.map((s) => (
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
