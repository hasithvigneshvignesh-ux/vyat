import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Mail, Phone, School, Hash, Calendar, GitBranch, User } from 'lucide-react';
import { formatDate, getInitials } from '@/lib/utils';

export const metadata: Metadata = { title: 'Profile — Vyat' };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/login');

  return (
    <div className="page-container max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Profile</h1>

      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-violet-600/5 pointer-events-none" />
        <div className="relative flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-white">
              {getInitials(profile.full_name)}
            </span>
          </div>
          <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            {profile.full_name}
          </h2>
          <Badge variant="info" size="md">Student</Badge>

          <div className="w-full mt-8 space-y-4">
            {[
              { icon: <Mail size={16} />, label: 'Email', value: profile.email },
              { icon: <Phone size={16} />, label: 'Phone', value: profile.phone || '—' },
              { icon: <School size={16} />, label: 'University', value: profile.university || '—' },
              { icon: <Hash size={16} />, label: 'Student ID', value: profile.student_id_number || '—' },
              { icon: <GitBranch size={16} />, label: 'Branch', value: profile.branch_name || '—' },
              { icon: <Calendar size={16} />, label: 'Year', value: profile.year ? `Year ${profile.year}` : '—' },
              { icon: <Calendar size={16} />, label: 'Joined', value: formatDate(profile.created_at) },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-3 border-b last:border-0"
                style={{ borderColor: 'var(--border-secondary)' }}
              >
                <span className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  {item.icon} {item.label}
                </span>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
