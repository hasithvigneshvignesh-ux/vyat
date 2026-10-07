'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { BookOpen, Mail, Lock, Eye, EyeOff, ShieldCheck, GraduationCap, Sparkles, ArrowRight, Check, Laptop, Smartphone, Tablet } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<'admin' | 'student' | null>(null);
  const [copiedRole, setCopiedRole] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Standard login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const trimmedEmail = email.trim().toLowerCase();

    // Fast-path demo account fallback
    if (
      trimmedEmail === 'admin@vyat.com' ||
      trimmedEmail === 'student@vyat.com' ||
      trimmedEmail === 'admin@codefundas.com' ||
      trimmedEmail === 'student@codefundas.com' ||
      trimmedEmail === 'admin' ||
      trimmedEmail === 'student'
    ) {
      const role = trimmedEmail.includes('admin') ? 'admin' : 'student';
      await handleInstantDemo(role);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (authError) {
        setError(authError.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, is_active')
          .eq('id', data.user.id)
          .single();

        if (profile && !profile.is_active) {
          await supabase.auth.signOut();
          setError('Your account has been deactivated. Please contact the administrator.');
          setIsLoading(false);
          return;
        }

        const targetUrl = profile?.role === 'admin' ? '/admin/dashboard' : '/dashboard';
        window.location.href = targetUrl;
      }
    } catch {
      setError('Could not connect to authentication server. Please use the Instant Demo buttons above.');
    } finally {
      setIsLoading(false);
    }
  };

  // Instant 1-click demo login via server-redirect endpoint
  const handleInstantDemo = (role: 'admin' | 'student') => {
    setDemoLoading(role);
    setError('');
    // Direct server-side redirect sets cookies & navigates with 100% reliability
    window.location.href = `/api/auth/demo?role=${role}`;
  };

  const autofillCredentials = (userEmail: string, userPass: string, role: 'admin' | 'student') => {
    setEmail(userEmail);
    setPassword(userPass);
    setCopiedRole(role);
    setTimeout(() => setCopiedRole(null), 2500);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        backgroundColor: '#090d16',
        color: '#f1f5f9',
        position: 'relative',
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Background glowing gradients */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.22) 0%, rgba(139, 92, 246, 0.12) 50%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Main Container - Fully responsive from 320px to 4K */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '480px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <BookOpen size={30} color="#ffffff" />
          </div>

          <div style={{ marginTop: '4px' }}>
            <h1
              style={{
                fontSize: 'clamp(26px, 4vw, 34px)',
                fontWeight: '800',
                letterSpacing: '-0.02em',
                margin: 0,
                color: '#ffffff',
                lineHeight: 1.2,
              }}
            >
              Vyat
            </h1>
            <p
              style={{
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                color: '#94a3b8',
                margin: '6px 0 0 0',
                fontWeight: '500',
              }}
            >
              Master Computer Science &bull; One Skill at a Time
            </p>
          </div>
        </div>

        {/* Regular Account Sign In Card */}
        <div
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(16px)',
            borderRadius: '20px',
            border: '1px solid rgba(51, 65, 85, 0.8)',
            boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.6)',
            padding: 'clamp(20px, 5vw, 30px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '19px', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
              {isAdminMode ? 'Admin Sign In' : 'Student Sign In'}
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0' }}>
              {isAdminMode ? 'Access your administrator dashboard' : 'Sign in with your email and password'}
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '13px',
                color: '#fca5a5',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>&bull;</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <label htmlFor="login-email" style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1' }}>
                Email Address
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none',
                    color: '#64748b',
                  }}
                >
                  <Mail size={17} />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isAdminMode ? "accounts@vyatai.com" : "student@vyatai.com"}
                  required
                  autoComplete="email"
                  style={{
                    width: '100%',
                    padding: '13px 14px 13px 44px',
                    backgroundColor: 'rgba(2, 6, 23, 0.7)',
                    border: '1px solid rgba(51, 65, 85, 0.9)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    color: '#f8fafc',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <label htmlFor="login-password" style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1' }}>
                Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none',
                    color: '#64748b',
                  }}
                >
                  <Lock size={17} />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    padding: '13px 44px 13px 44px',
                    backgroundColor: 'rgba(2, 6, 23, 0.7)',
                    border: '1px solid rgba(51, 65, 85, 0.9)',
                    borderRadius: '12px',
                    fontSize: '14px',
                    color: '#f8fafc',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    padding: '4px',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                marginTop: '4px',
                padding: '13px 20px',
                borderRadius: '12px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                border: 'none',
                boxShadow: '0 6px 20px -3px rgba(37, 99, 235, 0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              {isLoading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Responsive Compatibility Indicators & Footer */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#64748b', fontSize: '11px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Smartphone size={13} /> Mobile
            </span>
            <span>&bull;</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Tablet size={13} /> Tablet
            </span>
            <span>&bull;</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Laptop size={13} /> Laptop &amp; PC
            </span>
          </div>

          <p style={{ fontSize: '11px', color: '#475569', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            &copy; {new Date().getFullYear()} Vyat. Learn and Grow. 
            <span>|</span>
            <button 
              onClick={() => setIsAdminMode(!isAdminMode)}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '11px',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline'
              }}
            >
              {isAdminMode ? 'Student Login' : 'Admin Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
