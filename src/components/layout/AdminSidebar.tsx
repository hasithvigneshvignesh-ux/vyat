'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ADMIN_NAV_ITEMS } from '@/lib/constants';
import {
  LayoutDashboard, Users, GitBranch, FolderOpen, Zap, PlayCircle,
  HelpCircle, IndianRupee, Award, Map, BarChart3, Settings,
  LogOut, Menu, X, ChevronLeft, Moon, Sun, Shield,
} from 'lucide-react';
import { useTheme } from '@/providers/ThemeProvider';

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={18} />,
  Users: <Users size={18} />,
  GitBranch: <GitBranch size={18} />,
  FolderOpen: <FolderOpen size={18} />,
  Zap: <Zap size={18} />,
  PlayCircle: <PlayCircle size={18} />,
  HelpCircle: <HelpCircle size={18} />,
  IndianRupee: <IndianRupee size={18} />,
  Award: <Award size={18} />,
  Map: <Map size={18} />,
  BarChart3: <BarChart3 size={18} />,
  Settings: <Settings size={18} />,
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    if (href === '/admin/dashboard') return pathname === '/admin/dashboard';
    return pathname.startsWith(href);
  };

  /* ─── Shared style tokens ─── */
  const NAV_ITEM_BASE: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 12px',
    borderRadius: 8,
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
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 40, height: 40, borderRadius: 10,
              border: '1px solid var(--border-primary)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)', cursor: 'pointer',
              transition: 'background 150ms',
              pointerEvents: 'auto',
            }}
          >
            <Menu size={20} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, pointerEvents: 'auto' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'linear-gradient(135deg, #7c3aed, #c026d3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(124,58,237,0.3)',
            }}>
              <Shield size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Admin Panel
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
            color: 'var(--text-secondary)', cursor: 'pointer',
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
            justifyContent: 'space-between',
            height: 64,
            padding: '0 16px',
            borderBottom: '1px solid var(--border-primary)',
            flexShrink: 0,
          }}
        >
          {/* Logo + wordmark */}
          {!isCollapsed ? (
            <Link
              href="/admin/dashboard"
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                textDecoration: 'none', minWidth: 0, flex: 1,
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'linear-gradient(135deg, #7c3aed, #c026d3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(124,58,237,0.25)',
              }}>
                <Shield size={18} color="#fff" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, lineHeight: 1 }}>
                <span className="gradient-text" style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                  Vyat
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: '#a78bfa', lineHeight: '1.4',
                }}>
                  Admin Console
                </span>
              </div>
            </Link>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #7c3aed, #c026d3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(124,58,237,0.25)',
              }} title="Vyat Admin">
                <Shield size={18} color="#fff" />
              </div>
            </div>
          )}

          {/* Mobile: close | Desktop: collapse */}
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
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex"
            style={{
              alignItems: 'center', justifyContent: 'center',
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              border: 'none', backgroundColor: 'transparent',
              color: 'var(--text-tertiary)', cursor: 'pointer',
              transition: 'background 150ms',
            }}
          >
            <ChevronLeft
              size={18}
              style={{
                transition: 'transform 200ms',
                transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </button>
        </div>

        {/* ── 2. Navigation ── */}
        <nav
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '12px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            minHeight: 0,
          }}
        >
          {ADMIN_NAV_ITEMS.map((item) => {
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
                  backgroundColor: active ? 'rgba(124,58,237,0.12)' : 'transparent',
                  color: active ? '#8b5cf6' : 'var(--text-secondary)',
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
                  color: active ? '#8b5cf6' : 'var(--text-tertiary)',
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
                    backgroundColor: '#8b5cf6', flexShrink: 0,
                    boxShadow: '0 0 6px rgba(139,92,246,0.6)',
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── 3. Footer — pinned to bottom ── */}
        <div
          style={{
            flexShrink: 0,
            padding: '12px 10px',
            borderTop: '1px solid var(--border-primary)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
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
                gap: 6, padding: '8px 0', borderRadius: 8,
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
                gap: 6, padding: '8px 0', borderRadius: 8,
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

          {/* Admin profile row — avatar left, name + role stacked right */}
          {!isCollapsed && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 8,
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-primary)',
            }}>
              {/* Avatar */}
              <div style={{
                width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #7c3aed, #c026d3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(124,58,237,0.3)',
              }}>
                <Shield size={14} color="#fff" />
              </div>
              {/* Name + role */}
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{
                  fontSize: 13, fontWeight: 700, lineHeight: 1.3,
                  color: 'var(--text-primary)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  margin: 0,
                }}>
                  Administrator
                </p>
                <p style={{
                  fontSize: 11, fontWeight: 600, color: '#a78bfa', lineHeight: 1.3,
                  margin: 0, marginTop: 2,
                }}>
                  Super Admin
                </p>
              </div>
            </div>
          )}

          {/* Collapsed: avatar centered */}
          {isCollapsed && (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #c026d3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(124,58,237,0.3)',
              }} title="Administrator">
                <Shield size={14} color="#fff" />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
