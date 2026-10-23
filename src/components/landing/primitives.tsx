'use client';

import React, {
  useEffect,
  useState,
  useRef,
  ReactNode,
  CSSProperties,
  MouseEvent as ReactMouseEvent,
} from 'react';

/* ──────────────────────────────────────────────────────────
   1. Device & Environment Hooks
   ────────────────────────────────────────────────────────── */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export function useHardwareTier(): 'low' | 'high' {
  const [tier, setTier] = useState<'low' | 'high'>('high');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isLowPower =
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
      ((navigator as any).connection &&
        ((navigator as any).connection.saveData ||
          (navigator as any).connection.effectiveType === '2g' ||
          (navigator as any).connection.effectiveType === '3g'));
    if (isLowPower) {
      setTier('low');
    }
  }, []);

  return tier;
}

/* ──────────────────────────────────────────────────────────
   2. Container Primitive with Safe-Area Insets
   ────────────────────────────────────────────────────────── */
interface ContainerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
}

export function Container({ children, className = '', style, id }: ContainerProps) {
  return (
    <div id={id} className={`landing-container ${className}`} style={style}>
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   3. Section Header Primitive
   ────────────────────────────────────────────────────────── */
interface SectionHeaderProps {
  pillText: string;
  pillIcon?: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({
  pillText,
  pillIcon,
  title,
  subtitle,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`landing-section-header max-w-3xl mx-auto ${className}`}>
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border mb-4 shadow-2xs backdrop-blur-md bg-sky-50 text-sky-800 border-sky-200/80 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/60">
        {pillIcon || <span className="text-sky-500">✦</span>}
        <span>{pillText}</span>
      </div>
      <h2 className="font-fluid-h2 font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="font-fluid-body text-slate-600 dark:text-slate-400 mx-auto font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   4. Gradient Text Primitive
   ────────────────────────────────────────────────────────── */
interface GradientTextProps {
  children: ReactNode;
  className?: string;
  from?: string;
  to?: string;
}

export function GradientText({
  children,
  className = '',
  from = '#0ea5e9',
  to = '#8b5cf6',
}: GradientTextProps) {
  return (
    <span
      className={`bg-clip-text text-transparent inline-block ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, ${from}, ${to})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {children}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────
   5. Reveal on Scroll Component (IntersectionObserver)
   ────────────────────────────────────────────────────────── */
interface RevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  direction?: 'up' | 'down' | 'none';
}

export function Reveal({
  children,
  className = '',
  delayMs = 0,
  direction = 'up',
}: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const translateY = direction === 'up' ? '20px' : direction === 'down' ? '-20px' : '0px';

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : `translateY(${translateY})`,
        filter: isVisible ? 'blur(0px)' : 'blur(4px)',
        transition: `opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms, transform 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms, filter 0.65s cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms`,
        willChange: isVisible ? 'auto' : 'transform, opacity, filter',
      }}
    >
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   6. Animated CountUp Number
   ────────────────────────────────────────────────────────── */
interface CountUpProps {
  end: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
}

export function CountUp({
  end,
  prefix = '',
  suffix = '',
  durationMs = 1200,
  className = '',
}: CountUpProps) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setCount(end);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, reducedMotion]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number | null = null;
    let animId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / durationMs, 1);
      // Ease out expo curve for snappy Linear-like count
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [hasStarted, end, durationMs]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

/* ──────────────────────────────────────────────────────────
   7. Spotlight Card Primitive (Mouse-follow radial highlight)
   ────────────────────────────────────────────────────────── */
interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  accentColor?: string; // e.g. '#0ea5e9'
  onClick?: () => void;
}

export function SpotlightCard({
  children,
  className = '',
  style,
  accentColor = '#0ea5e9',
  onClick,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mx', `${x}px`);
    cardRef.current.style.setProperty('--my', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`spotlight-card ${className}`}
      style={
        {
          ...style,
          '--spotlight-accent': accentColor,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   8. 3D Tilt Card Primitive (Desktop only, max 6deg)
   ────────────────────────────────────────────────────────── */
interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTiltDeg?: number;
}

export function TiltCard({
  children,
  className = '',
  maxTiltDeg = 6,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isFinePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!isFinePointer || reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = -(y / (rect.height / 2)) * maxTiltDeg;
    const rotateY = (x / (rect.width / 2)) * maxTiltDeg;

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   9. Scroll Progress Bar (Fixed below safe area)
   ────────────────────────────────────────────────────────── */
export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight <= 0) return;
      const currentProgress = (window.scrollY / scrollHeight) * 100;
      setProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[100] pointer-events-none"
      style={{
        top: 'env(safe-area-inset-top, 0px)',
      }}
    >
      <div
        className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   10. Ambient Cursor Follower (Desktop Fine Pointer Only)
   ────────────────────────────────────────────────────────── */
export function CursorFollower() {
  const isFinePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reducedMotion = useReducedMotion();
  const hardwareTier = useHardwareTier();
  const [position, setPosition] = useState({ x: -200, y: -200 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (!isFinePointer || reducedMotion || hardwareTier === 'low') return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setOpacity(1);
    };

    const handleMouseLeave = () => setOpacity(0);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isFinePointer, reducedMotion, hardwareTier]);

  if (!isFinePointer || reducedMotion || hardwareTier === 'low') return null;

  return (
    <div
      className="pointer-events-none fixed z-30 transition-opacity duration-300 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-40 dark:opacity-25"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '380px',
        height: '380px',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 70%)',
        opacity,
      }}
    />
  );
}
