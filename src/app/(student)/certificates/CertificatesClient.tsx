'use client';

import { Certificate } from '@/types/database';
import { formatDate } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { Award, Lock, Download, CheckCircle2, ExternalLink } from 'lucide-react';

interface Props {
  certificates: (Certificate & { skill: { name: string; course: { name: string; branch: { name: string } } } })[];
  userName: string;
}

export default function CertificatesClient({ certificates, userName }: Props) {
  const unlocked = certificates.filter(c => c.status === 'unlocked');
  const locked = certificates.filter(c => c.status === 'generated');

  if (certificates.length === 0) {
    return (
      <div className="page-container">
        <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Certificates</h1>
        <EmptyState
          icon={<Award size={32} style={{ color: 'var(--text-tertiary)' }} />}
          title="No Certificates Yet"
          description="Complete a skill to earn your first certificate. Keep learning!"
        />
      </div>
    );
  }

  return (
    <div className="page-container space-y-8 animate-fade-in">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Certificates</h1>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <CheckCircle2 size={18} className="text-emerald-400" /> Available for Download
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlocked.map(cert => (
              <Card key={cert.id} hover className="!p-0 overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-yellow-500/5 flex items-center justify-center relative">
                  <Award size={48} className="text-amber-400" />
                  <div className="absolute top-3 right-3">
                    <Badge variant="success"><CheckCircle2 size={10} /> Unlocked</Badge>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>
                    {cert.skill?.course?.branch?.name}
                  </p>
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {cert.skill?.name}
                  </h3>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                    Issued {formatDate(cert.issued_at)} · {cert.certificate_number}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" icon={<Download size={14} />} className="flex-1">
                      Download
                    </Button>
                    <Button size="sm" variant="secondary" icon={<ExternalLink size={14} />}>
                      Verify
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Lock size={18} style={{ color: 'var(--text-muted)' }} /> Locked
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locked.map(cert => (
              <Card key={cert.id} className="!p-5 opacity-60">
                <div className="flex items-center gap-3">
                  <Lock size={20} style={{ color: 'var(--text-muted)' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {cert.skill?.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Complete the skill to unlock
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
