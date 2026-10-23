import React from 'react';
import Link from 'next/link';

export type LogoSize = 'navbar' | 'mobile' | 'footer' | 'certificate' | 'lg' | number;

export interface LogoProps {
  /** Size preset or pixel width */
  size?: LogoSize;
  /** Whether to render the 'Vyat' wordmark and sublabel */
  withWordmark?: boolean;
  /** Sublabel text under 'Vyat' (defaults to 'COURSES FOR CSE') */
  sublabel?: string;
  /** Link destination. Pass null or '' to render without link (e.g. inside certificate) */
  href?: string | null;
  /** Additional wrapper CSS class */
  className?: string;
  /** Custom id attribute for testing / analytics */
  id?: string;
}

export function getLogoDimensions(size: LogoSize = 'navbar'): { width: number; height: number } {
  if (typeof size === 'number') {
    return {
      width: size,
      height: Math.max(1, Math.round(size * (150 / 190))),
    };
  }

  switch (size) {
    case 'certificate':
      return { width: 28, height: 22 };
    case 'mobile':
      return { width: 34, height: 27 };
    case 'footer':
      return { width: 44, height: 35 };
    case 'lg':
      return { width: 56, height: 44 };
    case 'navbar':
    default:
      return { width: 40, height: 32 };
  }
}

/**
 * Reusable Vyat Brand Logo Mark
 * Features:
 * - Purple upward chevron
 * - Red horizontal bar cylinder with subtle highlight gradient
 * - Gold downward chevron
 * - Preserves natural ~1.27:1 landscape aspect ratio
 * - Direct on surface: no blue background box or borders
 * - Subtle dark mode violet drop-shadow for contrast
 */
export function LogoMark({
  width,
  height,
  className = '',
}: {
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 190 150"
      width={width}
      height={height}
      fill="none"
      role="img"
      aria-label="Vyat"
      className={`shrink-0 transition-transform duration-200 group-hover:scale-105 dark:drop-shadow-[0_0_12px_rgba(124,92,214,0.35)] ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        aspectRatio: '190 / 150',
      }}
    >
      <defs>
        <linearGradient
          id="vyatRedBarInline"
          x1="0"
          y1="75.5"
          x2="0"
          y2="82"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#db6464" />
          <stop offset="40%" stopColor="#c85252" />
          <stop offset="100%" stopColor="#ad3636" />
        </linearGradient>
      </defs>

      {/* Purple Upward Chevron */}
      <path
        d="M 57 78 L 95 5.5 L 133 78"
        stroke="#6947BF"
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="miter"
        strokeMiterlimit="4"
      />

      {/* Gold Downward Chevron */}
      <path
        d="M 57 78.5 L 95 143.5 L 133 78.5"
        stroke="#E2B838"
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="miter"
        strokeMiterlimit="4"
      />

      {/* Red Horizontal Cylinder Bar */}
      <rect
        x="4"
        y="75.5"
        width="182"
        height="6.5"
        rx="3.25"
        fill="url(#vyatRedBarInline)"
      />
    </svg>
  );
}

export default function Logo({
  size = 'navbar',
  withWordmark = true,
  sublabel = 'COURSES FOR CSE',
  href = '/',
  className = '',
  id,
}: LogoProps) {
  const { width, height } = getLogoDimensions(size);

  const content = (
    <div
      className={`flex items-center shrink-0 min-w-0 select-none ${
        withWordmark ? 'gap-[10px]' : ''
      } ${className}`}
      id={id}
    >
      <LogoMark width={width} height={height} />

      {withWordmark && (
        <div className="flex flex-col min-w-0 leading-none">
          <span className="font-extrabold text-base sm:text-lg tracking-tight leading-none text-slate-900 dark:text-white">
            Vyat
          </span>
          {sublabel && (
            <span className="text-[9px] uppercase font-semibold tracking-wider text-sky-600 dark:text-sky-400 mt-0.5 whitespace-nowrap">
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group inline-flex items-center shrink-0 no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg"
        aria-label="Vyat home"
        title="Vyat"
      >
        {content}
      </Link>
    );
  }

  return content;
}
