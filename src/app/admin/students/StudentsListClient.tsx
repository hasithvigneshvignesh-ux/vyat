'use client';

import { useState } from 'react';
import { Profile } from '@/types/database';
import { getInitials, formatDate, timeAgo } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import Link from 'next/link';
import { UserPlus, Search, Users, ArrowRight } from 'lucide-react';

interface Props {
  initialStudents: Profile[];
  totalCount: number;
}

export default function StudentsListClient({ initialStudents, totalCount }: Props) {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setSearch(query);
    if (!query.trim()) {
      setStudents(initialStudents);
      return;
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/admin/students?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (res.ok) {
        setStudents(data.students);
      }
    } catch {
      // Keep current data on error
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="page-container space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Students
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            {totalCount} total student{totalCount !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href="/admin/students/create">
          <Button icon={<UserPlus size={16} />}>
            Create Student
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          icon={<Search size={16} />}
        />
      </div>

      {/* Student list */}
      {students.length === 0 ? (
        <EmptyState
          icon={<Users size={28} style={{ color: 'var(--text-tertiary)' }} />}
          title={search ? 'No students found' : 'No students yet'}
          description={search ? 'Try adjusting your search query' : 'Create your first student to get started'}
          action={
            !search ? (
              <Link href="/admin/students/create">
                <Button icon={<UserPlus size={16} />}>Create Student</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className="border-b text-left"
                  style={{ borderColor: 'var(--border-primary)' }}
                >
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Student</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider hidden md:table-cell" style={{ color: 'var(--text-tertiary)' }}>University</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: 'var(--text-tertiary)' }}>Branch</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Status</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: 'var(--text-tertiary)' }}>Joined</th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}></th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b transition-colors hover:bg-[var(--bg-tertiary)]"
                    style={{ borderColor: 'var(--border-secondary)' }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-white">
                            {getInitials(student.full_name)}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                            {student.full_name}
                          </p>
                          <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>
                            {student.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {student.university || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {student.branch_name || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={student.is_active ? 'success' : 'error'}>
                        {student.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {timeAgo(student.created_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/students/${student.id}`}>
                        <Button variant="ghost" size="sm">
                          <ArrowRight size={14} />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
