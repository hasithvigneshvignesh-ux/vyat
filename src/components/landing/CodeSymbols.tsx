'use client';

import React, { useRef, useEffect, useState } from 'react';
import { SECTION_CODE_SYMBOLS, CodeSymbolItem, SectionThemeId } from './codeSymbols';

export interface CodeSymbolsProps {
  variant?: 'hero' | 'section' | 'footer';
  density?: 'low' | 'medium';
  sectionId?: string;
  className?: string;
}

export function CodeSymbols({
  variant = 'section',
  density = 'medium',
  sectionId = 'general',
  className = '',
}: CodeSymbolsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Pause animation when the section is not visible in the viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsPaused(!entry.isIntersecting);
      },
      { rootMargin: '100px 0px 100px 0px', threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Resolve symbol list for the section
  const themeKey = (sectionId in SECTION_CODE_SYMBOLS ? sectionId : 'general') as SectionThemeId;
  let symbols = SECTION_CODE_SYMBOLS[themeKey] || SECTION_CODE_SYMBOLS.general;

  // Filter for 'low' density if requested (keep ~60% of symbols)
  if (density === 'low') {
    symbols = symbols.filter((_, idx) => idx % 2 === 0);
  }

  return (
    <div
      ref={containerRef}
      className={`code-symbols-layer absolute inset-0 pointer-events-none select-none overflow-clip ${
        isPaused ? 'is-paused' : ''
      } ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'clip',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: -1,
      }}
      aria-hidden="true"
    >
      {symbols.map((item, index) => {
        // Responsive visibility classes
        const visibilityClass =
          item.visibility === 'desktop-only'
            ? 'hidden lg:block'
            : item.visibility === 'tablet-up'
            ? 'hidden md:block'
            : 'block';

        // Color palettes (blue, purple, gold, red) tuned for subtle contrast in light/dark
        const colorClass =
          item.colorType === 'blue'
            ? 'text-[#2563EB]/14 dark:text-[#60A5FA]/20'
            : item.colorType === 'purple'
            ? 'text-[#7C5CD6]/15 dark:text-[#A78BFA]/22'
            : item.colorType === 'gold'
            ? 'text-[#D9A81E]/16 dark:text-[#FBBF24]/20'
            : 'text-[#E06A6A]/15 dark:text-[#F87171]/20';

        // Soft glow for larger symbols in dark mode
        const glowClass = item.glow ? 'code-symbol-glow' : '';

        // Depth blur for largest 2-3 symbols
        const blurClass = item.blur ? 'blur-[1.2px]' : '';

        return (
          <span
            key={`${sectionId}-${index}-${item.symbol}`}
            className={`code-symbol-floating absolute font-mono leading-none tracking-normal ${item.altDrift ? 'alt-drift' : ''} ${visibilityClass} ${colorClass} ${glowClass} ${blurClass}`}
            style={
              {
                top: `${item.top}%`,
                left: `${item.left}%`,
                fontSize: `${item.size}px`,
                fontWeight: item.weight,
                '--symbol-rot': `${item.rotation}deg`,
                '--symbol-dur': item.animDuration,
                '--symbol-delay': item.animDelay,
                transform: `rotate(${item.rotation}deg)`,
              } as React.CSSProperties
            }
          >
            {item.symbol}
          </span>
        );
      })}
    </div>
  );
}

export default CodeSymbols;
