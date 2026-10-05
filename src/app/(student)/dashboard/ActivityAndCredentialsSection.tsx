'use client';

import React, { memo } from 'react';
import Link from 'next/link';
import { Certificate, StudentActivity } from '@/types/database';
import { timeAgo } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Clock, PlayCircle, Award, ChevronRight, MessageCircle, ExternalLink } from 'lucide-react';

interface Props {
  recentActivity: StudentActivity[];
  certificates: (Certificate & { skill: { name: string } })[];
}

export const ActivityAndCredentialsSection = memo(function ActivityAndCredentialsSection({
  recentActivity,
  certificates,
}: Props) {
  return (
    <div
      className="gpu-layer"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 32,
        contain: 'content',
      }}
    >
      {/* ── Left Card: Recent Learning Activity ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 28,
          borderRadius: 12,
          border: '1px solid var(--border-primary)',
          backgroundColor: 'var(--bg-card)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            paddingBottom: 16,
            marginBottom: 20,
            borderBottom: '1px solid var(--border-primary)',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              flexShrink: 0,
              backgroundColor: 'rgba(59,130,246,0.10)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#3b82f6',
            }}
          >
            <Clock size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Recent Learning Activity
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0, marginTop: 2 }}>
              Real-time track of your lecture completions and assessments
            </p>
          </div>
        </div>

        {/* Empty state or items */}
        {recentActivity.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '32px 16px',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                flexShrink: 0,
                backgroundColor: 'rgba(59,130,246,0.10)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6',
              }}
            >
              <PlayCircle size={24} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                No learning activity recorded yet
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0, marginTop: 6, maxWidth: 260 }}>
                Start watching your enrolled lectures and completing practice MCQs to view your timeline here.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentActivity.slice(0, 5).map((act) => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border-secondary)',
                  backgroundColor: 'var(--bg-card)',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      flexShrink: 0,
                      backgroundColor: 'rgba(59,130,246,0.10)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#3b82f6',
                    }}
                  >
                    <PlayCircle size={17} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {act.description}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: 0, marginTop: 2 }}>
                      {timeAgo(act.created_at)}
                    </p>
                  </div>
                </div>
                <Badge size="sm" variant="success">Completed</Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Right Card: Verified Credentials & Certificates ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 28,
          borderRadius: 12,
          border: '1px solid var(--border-primary)',
          backgroundColor: 'var(--bg-card)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 16,
            marginBottom: 20,
            borderBottom: '1px solid var(--border-primary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                flexShrink: 0,
                backgroundColor: 'rgba(245,158,11,0.10)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b',
              }}
            >
              <Award size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Verified Credentials &amp; Certificates
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0, marginTop: 2 }}>
                Authentic industry certifications unlocked upon mastering skills
              </p>
            </div>
          </div>
          <Link
            href="/certificates"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              fontWeight: 700,
              color: '#3b82f6',
              textDecoration: 'none',
              flexShrink: 0,
              marginLeft: 12,
            }}
          >
            View All <ChevronRight size={13} />
          </Link>
        </div>

        {/* Content */}
        {certificates.length === 0 ? (
          <div
            style={{
              marginTop: 4,
              padding: '28px 24px',
              borderRadius: 12,
              border: '1.5px dashed var(--border-primary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                flexShrink: 0,
                backgroundColor: 'rgba(245,158,11,0.10)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(245,158,11,0.75)',
              }}
            >
              <Award size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Complete Skills to Earn Certificates
              </h4>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', margin: 0, marginTop: 6, maxWidth: 280 }}>
                Once you finish all lectures and pass topic quizzes for a skill, your cryptographically verifiable certificate is issued automatically.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {certificates.map((cert) => (
              <div
                key={cert.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 10,
                  border: '1px solid var(--border-secondary)',
                  backgroundColor: 'var(--bg-card)',
                  gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      flexShrink: 0,
                      backgroundColor: 'rgba(245,158,11,0.10)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#f59e0b',
                    }}
                  >
                    <Award size={17} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        margin: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {cert.skill?.name}
                    </p>
                    <p style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 600, color: '#8b5cf6', margin: 0, marginTop: 2 }}>
                      {cert.certificate_number || 'CF-VERIFIED-CERT'}
                    </p>
                  </div>
                </div>
                <Link href="/certificates">
                  <Button size="sm" variant="secondary" icon={<ExternalLink size={13} />}>
                    Verify
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Mentor Banner */}
        <div
          style={{
            marginTop: 20,
            padding: '14px 16px',
            borderRadius: 8,
            border: '1px solid rgba(59,130,246,0.20)',
            backgroundColor: 'rgba(59,130,246,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                flexShrink: 0,
                backgroundColor: 'rgba(59,130,246,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6',
              }}
            >
              <MessageCircle size={17} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Need 1-on-1 Mentor Guidance?
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-tertiary)', margin: 0, marginTop: 2 }}>
                Connect with expert faculty
              </p>
            </div>
          </div>
          <div style={{ flexShrink: 0 }}>
            <Button size="sm" variant="secondary" icon={<MessageCircle size={14} />}>
              Connect
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ActivityAndCredentialsSection;
