'use client';

import { useState } from 'react';
import { Skill, Branch, StudentSkillAccess } from '@/types/database';
import { formatCurrency, getDifficultyColor } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  Search, Lock, CheckCircle2, MessageCircle,
  Clock, Zap, BookOpen, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface Props {
  allSkills: (Skill & { course: { name: string; slug: string; branch: Branch } })[];
  skillAccess: { skill_id: string; status: string }[];
  branches: Branch[];
}

export default function ExploreClient({ allSkills, skillAccess, branches }: Props) {
  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const getAccessStatus = (skillId: string) => {
    const access = skillAccess.find(sa => sa.skill_id === skillId);
    return access?.status || null;
  };

  const filteredSkills = allSkills.filter(skill => {
    const matchesSearch = !search || skill.name.toLowerCase().includes(search.toLowerCase()) ||
      skill.description?.toLowerCase().includes(search.toLowerCase());
    const matchesBranch = !selectedBranch || skill.course?.branch?.id === selectedBranch;
    return matchesSearch && matchesBranch;
  });

  // Group by branch
  const groupedByBranch: Record<string, typeof filteredSkills> = {};
  filteredSkills.forEach(skill => {
    const branchName = skill.course?.branch?.name || 'Other';
    if (!groupedByBranch[branchName]) groupedByBranch[branchName] = [];
    groupedByBranch[branchName].push(skill);
  });

  return (
    <div className="page-container space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Explore Skills
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Browse all available skills across different domains
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={16} />}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedBranch(null)}
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              !selectedBranch ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'border hover:bg-[var(--bg-tertiary)]'
            }`}
            style={selectedBranch ? { borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' } : undefined}
          >
            All
          </button>
          {branches.map(branch => (
            <button
              key={branch.id}
              onClick={() => setSelectedBranch(branch.id)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedBranch === branch.id ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'border hover:bg-[var(--bg-tertiary)]'
              }`}
              style={selectedBranch !== branch.id ? { borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' } : undefined}
            >
              {branch.icon} {branch.name}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Grid */}
      {Object.entries(groupedByBranch).map(([branchName, skills]) => (
        <div key={branchName}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            {branchName}
            <Badge>{skills.length} skills</Badge>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill, idx) => {
              const status = getAccessStatus(skill.id);
              const isActive = status === 'active';
              const isCompleted = status === 'completed';
              const isLocked = !status;

              return (
                <Card
                  key={skill.id}
                  hover={!isLocked}
                  className={`!p-5 relative animate-fade-in stagger-${(idx % 8) + 1}`}
                  style={{ opacity: 0, animationFillMode: 'forwards' } as React.CSSProperties}
                >
                  {/* Status indicator */}
                  <div className="absolute top-4 right-4">
                    {isCompleted && <CheckCircle2 size={18} className="text-emerald-400" />}
                    {isActive && <Zap size={18} className="text-blue-400" />}
                    {isLocked && <Lock size={18} style={{ color: 'var(--text-muted)' }} />}
                  </div>

                  {/* Course path */}
                  <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>
                    {skill.course?.name}
                  </p>

                  {/* Skill name */}
                  <h3 className="font-semibold mb-2 pr-8" style={{ color: isLocked ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                    {skill.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs mb-4 line-clamp-2" style={{ color: 'var(--text-tertiary)' }}>
                    {skill.short_description || skill.description || 'Master this skill to advance your career.'}
                  </p>

                  {/* Meta info */}
                  <div className="flex items-center gap-3 mb-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {skill.estimated_hours && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {skill.estimated_hours}h
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-md ${getDifficultyColor(skill.difficulty)}`}>
                      {skill.difficulty}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-between">
                    {isLocked ? (
                      <>
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {formatCurrency(skill.price)}
                        </span>
                        <Button variant="secondary" size="sm" icon={<MessageCircle size={14} />}>
                          Contact Mentor
                        </Button>
                      </>
                    ) : isActive ? (
                      <>
                        <Badge variant="info">Active</Badge>
                        <Link href={`/skills/${skill.id}`}>
                          <Button variant="ghost" size="sm">
                            Continue <ArrowRight size={14} />
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Badge variant="success"><CheckCircle2 size={12} /> Completed</Badge>
                        <Link href={`/skills/${skill.id}`}>
                          <Button variant="ghost" size="sm">
                            Review <ArrowRight size={14} />
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      {filteredSkills.length === 0 && (
        <div className="text-center py-16">
          <BookOpen size={40} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>No skills found</p>
          <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
