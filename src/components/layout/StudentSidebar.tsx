'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { STUDENT_NAV_ITEMS } from '@/lib/constants';
import {
  LayoutDashboard, BookOpen, Compass, Map, Code, Award, User,
  LogOut, Menu, X, ChevronLeft, ChevronRight, Moon, Sun, BookOpenCheck,
} from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';
import React from 'react';

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={18} />,
  BookOpen: <BookOpen size={18} />,
  Compass: <Compass size={18} />,
  Map: <Map size={18} />,
  Code: <Code size={18} />,
  Award: <Award size={18} />,
  User: <User size={18} />,
};

interface StudentSidebarProps {
  userName?: string;
  /** Controlled: whether the sidebar is fully collapsed (0 width). */
  isCollapsed?: boolean;
  /** Controlled: callback to toggle collapsed state from outside. */
  onToggleCollapse?: () => void;
}

export default function StudentSidebar({
  userName = 'Student',
  isCollapsed = false,
  onToggleCollapse,
}: StudentSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/demo', { method: 'DELETE' });
      document.cookie = 'demo_role=; path=/; max-age=0';
      document.cookie = 'demo_user=; path=/; max-age=0';
      await supabase.auth.signOut();
    } catch {}
    router.push('/login');
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  /* ─── Shared style tokens ─── */
  const NAV_ITEM_BASE: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '11px 14px',
    borderRadius: 10,
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    transition: 'background 150ms, color 150ms',
    cursor: 'pointer',
    width: '100%',
  };

  return (
    <>
      {/* ── Mobile Top Navbar (strictly hidden on desktop via CSS, pointer-events transparent) ── */}
      <header
        className="mobile-topbar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          zIndex: 50,
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-primary)',
          backdropFilter: 'blur(12px)',
          pointerEvents: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, pointerEvents: 'auto' }}>
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Navigation Menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 10,
              border: '1px solid var(--border-primary)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'background 150ms',
              pointerEvents: 'auto',
            }}
          >
            <Menu size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, pointerEvents: 'auto' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
            }}>
              <BookOpenCheck size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Vyat
            </span>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 40, height: 40, borderRadius: 10,
            border: '1px solid var(--border-primary)',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      {/* ── Mobile overlay (rendered only when open) ── */}
      {isOpen && (
        <div
          className="sidebar-overlay visible"
          onClick={() => setIsOpen(false)}
          style={{ pointerEvents: 'auto' }}
        />
      )}

      {/* ─────────────────────────────────────────
          SIDEBAR — strict flex column, 100vh
      ───────────────────────────────────────── */}
      <aside
        className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100dvh',
          backgroundColor: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-primary)',
          overflow: 'hidden',
        }}
      >
        {/* ── 1. Header ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            height: 64,
            padding: isCollapsed ? '0' : '0 16px',
            borderBottom: '1px solid var(--border-primary)',
            flexShrink: 0,
          }}
        >
          {/* Logo + wordmark */}
          {!isCollapsed ? (
            <Link
              href="/dashboard"
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                textDecoration: 'none', minWidth: 0, flex: 1,
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
              }}>
                <BookOpenCheck size={18} color="#fff" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, lineHeight: 1 }}>
                <span className="gradient-text" style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                  Vyat
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: '#60a5fa', lineHeight: '1.4',
                }}>
                  Student Portal
                </span>
              </div>
            </Link>
          ) : (
            <button
              onClick={onToggleCollapse}
              title="Expand sidebar"
              aria-label="Expand sidebar"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                border: '1px solid var(--border-primary)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-secondary)', cursor: 'pointer',
                transition: 'background 150ms, border-color 150ms',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            >
              <ChevronRight size={16} strokeWidth={2.25} />
            </button>
          )}

          {/* Mobile: close | Desktop: collapse */}
          {!isCollapsed && (
            <>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="lg:hidden"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  border: 'none', backgroundColor: 'transparent',
                  color: 'var(--text-tertiary)', cursor: 'pointer',
                  transition: 'background 150ms',
                }}
              >
                <X size={18} />
              </button>
              <button
                onClick={onToggleCollapse}
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
                className="hidden lg:flex"
                style={{
                  alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  border: '1px solid var(--border-primary)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-secondary)', cursor: 'pointer',
                  transition: 'background 150ms, border-color 150ms',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
              >
                <ChevronLeft size={16} strokeWidth={2.25} />
              </button>
            </>
          )}
        </div>

        {/* ── 2. Navigation ── */}
        <nav
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            minHeight: 0,
          }}
        >
          {STUDENT_NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                title={isCollapsed ? item.label : undefined}
                style={{
                  ...NAV_ITEM_BASE,
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  backgroundColor: active
                    ? (theme === 'dark' ? 'rgba(79, 124, 255, 0.15)' : '#EEF2FF')
                    : 'transparent',
                  color: active
                    ? '#4F7CFF'
                    : 'var(--text-secondary)',
                  fontWeight: active ? 600 : 500,
                }}
              >
                {/* Fixed-width icon container — labels form a straight vertical line */}
                <span style={{
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: active ? '#4F7CFF' : 'var(--text-tertiary)',
                }}>
                  {iconMap[item.icon]}
                </span>

                {!isCollapsed && (
                  <span style={{ flex: 1, fontSize: 14, fontWeight: active ? 600 : 500, lineHeight: 1 }}>
                    {item.label}
                  </span>
                )}

                {/* Active dot indicator */}
                {active && !isCollapsed && (
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    backgroundColor: '#4F7CFF', flexShrink: 0,
                    boxShadow: '0 0 6px rgba(79,124,255,0.6)',
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── 3. Footer — margin-top:auto pins it to the bottom ── */}
        <div
          style={{
            flexShrink: 0,
            padding: '16px 12px',
            borderTop: '1px solid var(--border-primary)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            backgroundColor: 'var(--bg-secondary)',
          }}
        >
          {/* Theme & Sign-Out: side-by-side when expanded, stacked when collapsed */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isCollapsed ? '1fr' : '1fr 1fr',
            gap: 8,
          }}>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, padding: '9px 0', borderRadius: 10,
                border: '1px solid var(--border-primary)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                transition: 'background 150ms, border-color 150ms',
              }}
            >
              {theme === 'dark'
                ? <Sun size={15} style={{ color: '#fbbf24' }} />
                : <Moon size={15} style={{ color: '#818cf8' }} />
              }
              {!isCollapsed && (
                <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
              )}
            </button>

            {/* Sign Out */}
            <button
              onClick={handleLogout}
              title="Sign Out"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, padding: '9px 0', borderRadius: 10,
                border: '1px solid var(--border-primary)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                transition: 'background 150ms, border-color 150ms, color 150ms',
              }}
            >
              <LogOut size={15} />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </div>

          {/* User profile row — avatar left, name + role stacked right */}
          {!isCollapsed && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 14px',
              borderRadius: 12,
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
            }}>
              {/* Avatar */}
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #4F7CFF, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(79,124,255,0.25)',
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
              {/* Name + role */}
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{
                  fontSize: 13, fontWeight: 700, lineHeight: 1.3,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  margin: 0,
                }}>
                  {userName}
                </p>
                <p style={{
                  fontSize: 11, fontWeight: 600, color: '#4F7CFF', lineHeight: 1.3,
                  margin: 0, marginTop: 2,
                }}>
                  Student Account
                </p>
              </div>
            </div>
          )}

          {/* Collapsed: just the avatar centered */}
          {isCollapsed && (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #7c3aed)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(59,130,246,0.3)',
              }} title={userName}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
