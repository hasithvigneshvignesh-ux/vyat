export interface CodeSymbolItem {
  symbol: string;
  top: number;       // Percentage (0 - 100)
  left: number;      // Percentage (0 - 100)
  size: number;      // Font size in px (20 - 64)
  rotation: number;  // Rotation in deg (-18 to +18)
  weight: 500 | 600;
  colorType: 'blue' | 'purple' | 'gold' | 'red';
  glow?: boolean;    // Soft dark-mode glow
  blur?: boolean;    // Depth blur (1.2px) on 2-3 largest symbols per section
  visibility: 'all' | 'tablet-up' | 'desktop-only';
  animDuration: string; // e.g. '13s'
  animDelay: string;    // e.g. '-2.5s'
  altDrift?: boolean;   // true = float-2, false = float-1
}

export type SectionThemeId =
  | 'hero'
  | 'pillars'
  | 'why'
  | 'timeline'
  | 'credentials'
  | 'faq'
  | 'final-cta'
  | 'footer'
  | 'general';

export const SECTION_CODE_SYMBOLS: Record<SectionThemeId, CodeSymbolItem[]> = {
  hero: [
    // Left Gutter (Desktop & Tablet)
    { symbol: '{ }', top: 18, left: 3.5, size: 48, rotation: -8, weight: 600, colorType: 'blue', glow: true, blur: true, visibility: 'tablet-up', animDuration: '13s', animDelay: '-2.1s' },
    { symbol: '=>', top: 42, left: 4.5, size: 30, rotation: 12, weight: 500, colorType: 'purple', visibility: 'desktop-only', animDuration: '11s', animDelay: '-5.4s', altDrift: true },
    { symbol: '0 1', top: 66, left: 3, size: 24, rotation: -6, weight: 500, colorType: 'blue', visibility: 'tablet-up', animDuration: '14s', animDelay: '-1.2s' },
    { symbol: ';', top: 88, left: 5, size: 36, rotation: 14, weight: 600, colorType: 'purple', visibility: 'desktop-only', animDuration: '10s', animDelay: '-7.6s', altDrift: true },
    // Right Gutter (Desktop & Tablet)
    { symbol: '</>', top: 20, left: 91.5, size: 44, rotation: 10, weight: 600, colorType: 'purple', glow: true, blur: true, visibility: 'tablet-up', animDuration: '15s', animDelay: '-3.7s' },
    { symbol: 'O(n)', top: 44, left: 93, size: 28, rotation: -12, weight: 500, colorType: 'blue', visibility: 'desktop-only', animDuration: '12s', animDelay: '-6.2s', altDrift: true },
    { symbol: 'git', top: 68, left: 92, size: 26, rotation: 8, weight: 500, colorType: 'gold', visibility: 'tablet-up', animDuration: '11s', animDelay: '-4.1s' },
    { symbol: 'main()', top: 88, left: 89.5, size: 32, rotation: -10, weight: 600, colorType: 'blue', visibility: 'desktop-only', animDuration: '13s', animDelay: '-8.3s', altDrift: true },
    // Top & Bottom Outer Margins (Mobile safe: in extreme edge padding, away from cards/text)
    { symbol: ';', top: 2, left: 8, size: 24, rotation: 6, weight: 500, colorType: 'red', visibility: 'all', animDuration: '12s', animDelay: '-0.8s' },
    { symbol: '0 1', top: 2, left: 88, size: 22, rotation: -8, weight: 500, colorType: 'blue', visibility: 'all', animDuration: '14s', animDelay: '-4.8s' },
    { symbol: '{ }', top: 97, left: 6, size: 30, rotation: -7, weight: 500, colorType: 'purple', visibility: 'all', animDuration: '16s', animDelay: '-9.0s' },
    { symbol: '</>', top: 97, left: 88, size: 28, rotation: 10, weight: 500, colorType: 'blue', visibility: 'all', animDuration: '13s', animDelay: '-3.2s' },
  ],

  pillars: [
    // Left Gutter (Desktop & Tablet)
    { symbol: 'main()', top: 16, left: 3, size: 38, rotation: -12, weight: 600, colorType: 'blue', glow: true, blur: true, visibility: 'tablet-up', animDuration: '14s', animDelay: '-1.5s' },
    { symbol: 'O(n)', top: 42, left: 4.5, size: 32, rotation: 8, weight: 500, colorType: 'purple', visibility: 'desktop-only', animDuration: '12s', animDelay: '-4.8s', altDrift: true },
    { symbol: '#include', top: 68, left: 2.5, size: 26, rotation: -5, weight: 500, colorType: 'blue', visibility: 'tablet-up', animDuration: '15s', animDelay: '-7.2s' },
    { symbol: 'SELECT *', top: 88, left: 3.5, size: 30, rotation: 11, weight: 600, colorType: 'gold', visibility: 'desktop-only', animDuration: '11s', animDelay: '-3.1s', altDrift: true },
    // Right Gutter (Desktop & Tablet)
    { symbol: 'git', top: 18, left: 92, size: 34, rotation: 14, weight: 600, colorType: 'purple', glow: true, visibility: 'tablet-up', animDuration: '13s', animDelay: '-2.9s' },
    { symbol: '=>', top: 44, left: 93, size: 36, rotation: -10, weight: 500, colorType: 'blue', visibility: 'desktop-only', animDuration: '16s', animDelay: '-6.4s', altDrift: true },
    { symbol: '{ }', top: 70, left: 91.5, size: 42, rotation: 9, weight: 600, colorType: 'purple', blur: true, visibility: 'tablet-up', animDuration: '10s', animDelay: '-8.0s' },
    { symbol: '101', top: 88, left: 93, size: 28, rotation: -8, weight: 500, colorType: 'red', visibility: 'desktop-only', animDuration: '14s', animDelay: '-5.0s', altDrift: true },
    // Outer Top/Bottom Margins (Mobile safe)
    { symbol: '//', top: 1.5, left: 6, size: 26, rotation: 15, weight: 500, colorType: 'blue', visibility: 'all', animDuration: '12s', animDelay: '-4.2s' },
    { symbol: 'O(n)', top: 1.5, left: 88, size: 24, rotation: -6, weight: 500, colorType: 'purple', visibility: 'all', animDuration: '13s', animDelay: '-1.1s' },
    { symbol: 'main()', top: 98, left: 7, size: 26, rotation: -10, weight: 500, colorType: 'blue', visibility: 'all', animDuration: '15s', animDelay: '-6.3s' },
    { symbol: 'SELECT *', top: 98, left: 86, size: 24, rotation: 8, weight: 500, colorType: 'gold', visibility: 'all', animDuration: '11s', animDelay: '-2.7s' },
  ],

  why: [
    // Left Gutter (Desktop & Tablet)
    { symbol: '//', top: 22, left: 3.5, size: 40, rotation: 14, weight: 600, colorType: 'purple', glow: true, visibility: 'tablet-up', animDuration: '12s', animDelay: '-3.3s' },
    { symbol: '++', top: 52, left: 3, size: 34, rotation: -9, weight: 500, colorType: 'blue', visibility: 'desktop-only', animDuration: '14s', animDelay: '-6.1s', altDrift: true },
    { symbol: '0 1', top: 80, left: 4.5, size: 26, rotation: 7, weight: 500, colorType: 'blue', visibility: 'tablet-up', animDuration: '11s', animDelay: '-1.8s' },
    // Right Gutter (Desktop & Tablet)
    { symbol: '=>', top: 24, left: 92, size: 36, rotation: -11, weight: 600, colorType: 'blue', visibility: 'tablet-up', animDuration: '15s', animDelay: '-4.4s' },
    { symbol: 'O(log n)', top: 54, left: 91, size: 30, rotation: 13, weight: 500, colorType: 'purple', glow: true, blur: true, visibility: 'desktop-only', animDuration: '13s', animDelay: '-7.7s', altDrift: true },
    { symbol: '</>', top: 82, left: 93, size: 38, rotation: -7, weight: 600, colorType: 'gold', blur: true, visibility: 'tablet-up', animDuration: '10s', animDelay: '-2.5s' },
    // Outer Top/Bottom Margins (Mobile safe)
    { symbol: '[ ]', top: 2, left: 8, size: 26, rotation: -14, weight: 500, colorType: 'blue', visibility: 'all', animDuration: '13s', animDelay: '-5.2s' },
    { symbol: '++', top: 2, left: 88, size: 24, rotation: 8, weight: 500, colorType: 'purple', visibility: 'all', animDuration: '14s', animDelay: '-8.5s' },
    { symbol: ';', top: 97, left: 8, size: 28, rotation: 10, weight: 500, colorType: 'red', visibility: 'all', animDuration: '12s', animDelay: '-0.9s' },
    { symbol: '0 1', top: 97, left: 88, size: 24, rotation: -6, weight: 500, colorType: 'blue', visibility: 'all', animDuration: '11s', animDelay: '-3.1s' },
  ],

  timeline: [
    // Left Gutter (Desktop & Tablet)
    { symbol: '->', top: 20, left: 3, size: 38, rotation: 10, weight: 600, colorType: 'blue', glow: true, visibility: 'tablet-up', animDuration: '13s', animDelay: '-2.0s' },
    { symbol: '101', top: 50, left: 4, size: 28, rotation: -12, weight: 500, colorType: 'purple', visibility: 'desktop-only', animDuration: '11s', animDelay: '-6.8s', altDrift: true },
    { symbol: '::', top: 80, left: 3, size: 40, rotation: 5, weight: 600, colorType: 'blue', blur: true, visibility: 'tablet-up', animDuration: '15s', animDelay: '-1.4s' },
    // Right Gutter (Desktop & Tablet)
    { symbol: '[ ]', top: 22, left: 93, size: 36, rotation: -14, weight: 600, colorType: 'purple', visibility: 'tablet-up', animDuration: '12s', animDelay: '-4.9s' },
    { symbol: '->', top: 52, left: 92, size: 32, rotation: 12, weight: 500, colorType: 'gold', visibility: 'desktop-only', animDuration: '14s', animDelay: '-7.3s', altDrift: true },
    { symbol: '{ }', top: 82, left: 91, size: 42, rotation: -8, weight: 600, colorType: 'blue', glow: true, blur: true, visibility: 'tablet-up', animDuration: '16s', animDelay: '-3.1s' },
    // Outer Margins (Mobile safe)
    { symbol: '101', top: 2, left: 7, size: 24, rotation: 8, weight: 500, colorType: 'red', visibility: 'all', animDuration: '10s', animDelay: '-5.5s' },
    { symbol: '->', top: 2, left: 89, size: 26, rotation: 11, weight: 500, colorType: 'blue', visibility: 'all', animDuration: '12s', animDelay: '-0.7s' },
    { symbol: 'git', top: 97, left: 7, size: 26, rotation: -10, weight: 500, colorType: 'purple', visibility: 'all', animDuration: '13s', animDelay: '-8.2s' },
    { symbol: '[ ]', top: 97, left: 88, size: 28, rotation: 6, weight: 500, colorType: 'blue', visibility: 'all', animDuration: '14s', animDelay: '-4.0s' },
  ],

  credentials: [
    // Left Gutter (Desktop & Tablet)
    { symbol: 'NULL', top: 20, left: 3.5, size: 36, rotation: -11, weight: 600, colorType: 'purple', glow: true, visibility: 'tablet-up', animDuration: '14s', animDelay: '-3.6s' },
    { symbol: '!=', top: 48, left: 3, size: 38, rotation: 13, weight: 600, colorType: 'blue', visibility: 'desktop-only', animDuration: '11s', animDelay: '-7.0s', altDrift: true },
    { symbol: '0 1', top: 76, left: 4.5, size: 28, rotation: -7, weight: 500, colorType: 'gold', visibility: 'tablet-up', animDuration: '15s', animDelay: '-1.9s' },
    // Right Gutter (Desktop & Tablet)
    { symbol: '&&', top: 22, left: 91.5, size: 40, rotation: 9, weight: 600, colorType: 'blue', glow: true, blur: true, visibility: 'tablet-up', animDuration: '12s', animDelay: '-4.5s' },
    { symbol: '{ }', top: 50, left: 93, size: 44, rotation: -13, weight: 600, colorType: 'purple', blur: true, visibility: 'desktop-only', animDuration: '16s', animDelay: '-8.1s', altDrift: true },
    { symbol: 'NULL', top: 78, left: 92, size: 30, rotation: 8, weight: 500, colorType: 'red', visibility: 'tablet-up', animDuration: '10s', animDelay: '-2.8s' },
    // Outer Margins (Mobile safe)
    { symbol: '/* */', top: 2, left: 7, size: 24, rotation: 12, weight: 500, colorType: 'blue', visibility: 'all', animDuration: '13s', animDelay: '-5.3s' },
    { symbol: '=>', top: 2, left: 88, size: 26, rotation: 10, weight: 500, colorType: 'blue', visibility: 'all', animDuration: '12s', animDelay: '-0.4s' },
    { symbol: '!=', top: 97, left: 7, size: 28, rotation: -12, weight: 500, colorType: 'purple', visibility: 'all', animDuration: '15s', animDelay: '-9.1s' },
    { symbol: '&&', top: 97, left: 88, size: 28, rotation: 7, weight: 500, colorType: 'gold', visibility: 'all', animDuration: '14s', animDelay: '-3.7s' },
  ],

  faq: [
    // Left Gutter (Desktop & Tablet)
    { symbol: '?', top: 22, left: 4, size: 46, rotation: 14, weight: 600, colorType: 'blue', glow: true, blur: true, visibility: 'tablet-up', animDuration: '13s', animDelay: '-2.4s' },
    { symbol: '( )', top: 52, left: 3, size: 40, rotation: -10, weight: 600, colorType: 'purple', visibility: 'desktop-only', animDuration: '15s', animDelay: '-6.7s', altDrift: true },
    { symbol: '//', top: 80, left: 4, size: 32, rotation: 8, weight: 500, colorType: 'blue', visibility: 'tablet-up', animDuration: '11s', animDelay: '-1.3s' },
    // Right Gutter (Desktop & Tablet)
    { symbol: '/* */', top: 24, left: 91, size: 30, rotation: -13, weight: 500, colorType: 'purple', visibility: 'tablet-up', animDuration: '14s', animDelay: '-5.1s' },
    { symbol: '?', top: 54, left: 93, size: 42, rotation: 11, weight: 600, colorType: 'gold', glow: true, visibility: 'desktop-only', animDuration: '12s', animDelay: '-8.4s', altDrift: true },
    { symbol: '{ }', top: 82, left: 91.5, size: 38, rotation: -7, weight: 600, colorType: 'blue', blur: true, visibility: 'tablet-up', animDuration: '16s', animDelay: '-3.5s' },
    // Outer Margins (Mobile safe)
    { symbol: '?', top: 2, left: 8, size: 26, rotation: 10, weight: 500, colorType: 'blue', visibility: 'all', animDuration: '12s', animDelay: '-3.9s' },
    { symbol: '101', top: 2, left: 88, size: 24, rotation: 6, weight: 500, colorType: 'blue', visibility: 'all', animDuration: '12s', animDelay: '-0.2s' },
    { symbol: '=>', top: 97, left: 7, size: 26, rotation: 12, weight: 500, colorType: 'red', visibility: 'all', animDuration: '10s', animDelay: '-4.8s' },
    { symbol: ';', top: 97, left: 89, size: 28, rotation: -11, weight: 500, colorType: 'purple', visibility: 'all', animDuration: '13s', animDelay: '-7.6s' },
  ],

  'final-cta': [
    // Left Gutter (Desktop & Tablet)
    { symbol: 'λ', top: 24, left: 3.5, size: 42, rotation: -12, weight: 600, colorType: 'purple', glow: true, blur: true, visibility: 'tablet-up', animDuration: '14s', animDelay: '-3.2s' },
    { symbol: '</>', top: 55, left: 3, size: 38, rotation: 10, weight: 500, colorType: 'blue', visibility: 'desktop-only', animDuration: '12s', animDelay: '-6.5s', altDrift: true },
    { symbol: '=>', top: 80, left: 4.5, size: 32, rotation: -6, weight: 500, colorType: 'gold', visibility: 'tablet-up', animDuration: '15s', animDelay: '-1.7s' },
    // Right Gutter (Desktop & Tablet)
    { symbol: '{ }', top: 26, left: 91.5, size: 46, rotation: 12, weight: 600, colorType: 'blue', glow: true, blur: true, visibility: 'tablet-up', animDuration: '13s', animDelay: '-4.2s' },
    { symbol: 'λ', top: 58, left: 93, size: 36, rotation: -10, weight: 500, colorType: 'purple', visibility: 'desktop-only', animDuration: '16s', animDelay: '-7.9s', altDrift: true },
    { symbol: '0 1', top: 82, left: 92, size: 28, rotation: 8, weight: 500, colorType: 'red', visibility: 'tablet-up', animDuration: '11s', animDelay: '-2.1s' },
    // Outer Margins (Mobile safe)
    { symbol: '++', top: 2, left: 8, size: 24, rotation: 14, weight: 500, colorType: 'blue', visibility: 'all', animDuration: '12s', animDelay: '-5.0s' },
    { symbol: ';', top: 2, left: 88, size: 24, rotation: 7, weight: 500, colorType: 'blue', visibility: 'all', animDuration: '10s', animDelay: '-0.5s' },
    { symbol: 'λ', top: 97, left: 7, size: 26, rotation: -9, weight: 500, colorType: 'purple', visibility: 'all', animDuration: '15s', animDelay: '-8.3s' },
    { symbol: '</>', top: 97, left: 88, size: 26, rotation: 10, weight: 500, colorType: 'gold', visibility: 'all', animDuration: '13s', animDelay: '-2.4s' },
  ],

  footer: [
    // Left Gutter (Desktop & Tablet)
    { symbol: '//', top: 26, left: 3, size: 34, rotation: 11, weight: 600, colorType: 'blue', glow: true, visibility: 'tablet-up', animDuration: '13s', animDelay: '-2.8s' },
    { symbol: ';', top: 68, left: 4, size: 38, rotation: -8, weight: 600, colorType: 'purple', visibility: 'desktop-only', animDuration: '15s', animDelay: '-6.3s', altDrift: true },
    { symbol: '0 1', top: 88, left: 3, size: 24, rotation: 6, weight: 500, colorType: 'gold', visibility: 'tablet-up', animDuration: '12s', animDelay: '-1.5s' },
    // Right Gutter (Desktop & Tablet)
    { symbol: '}', top: 28, left: 92.5, size: 40, rotation: -12, weight: 600, colorType: 'purple', glow: true, blur: true, visibility: 'tablet-up', animDuration: '14s', animDelay: '-4.6s' },
    { symbol: 'git', top: 70, left: 91.5, size: 28, rotation: 9, weight: 500, colorType: 'blue', visibility: 'desktop-only', animDuration: '11s', animDelay: '-7.5s', altDrift: true },
    { symbol: '</>', top: 88, left: 93, size: 32, rotation: -7, weight: 500, colorType: 'red', visibility: 'tablet-up', animDuration: '16s', animDelay: '-3.3s' },
    // Outer Margins (Mobile safe)
    { symbol: ';', top: 3, left: 8, size: 24, rotation: 8, weight: 500, colorType: 'blue', visibility: 'all', animDuration: '11s', animDelay: '-4.0s' },
    { symbol: '=>', top: 3, left: 88, size: 24, rotation: 12, weight: 500, colorType: 'blue', visibility: 'all', animDuration: '12s', animDelay: '-5.8s' },
    { symbol: '}', top: 96, left: 8, size: 26, rotation: -10, weight: 500, colorType: 'purple', visibility: 'all', animDuration: '14s', animDelay: '-6.9s' },
    { symbol: '0 1', top: 96, left: 89, size: 22, rotation: 6, weight: 500, colorType: 'gold', visibility: 'all', animDuration: '13s', animDelay: '-1.9s' },
  ],

  general: [
    { symbol: '{ }', top: 20, left: 4, size: 42, rotation: -10, weight: 600, colorType: 'blue', glow: true, blur: true, visibility: 'tablet-up', animDuration: '14s', animDelay: '-2.0s' },
    { symbol: '</>', top: 75, left: 5, size: 36, rotation: 8, weight: 500, colorType: 'purple', visibility: 'tablet-up', animDuration: '12s', animDelay: '-5.0s' },
    { symbol: '=>', top: 22, left: 92, size: 34, rotation: 12, weight: 500, colorType: 'purple', visibility: 'tablet-up', animDuration: '13s', animDelay: '-3.5s' },
    { symbol: ';', top: 78, left: 91, size: 38, rotation: -6, weight: 600, colorType: 'blue', visibility: 'tablet-up', animDuration: '15s', animDelay: '-7.0s' },
    { symbol: '{ }', top: 3, left: 8, size: 24, rotation: -6, weight: 500, colorType: 'blue', visibility: 'all', animDuration: '12s', animDelay: '-1.0s' },
    { symbol: '</>', top: 97, left: 88, size: 24, rotation: 8, weight: 500, colorType: 'purple', visibility: 'all', animDuration: '13s', animDelay: '-4.0s' },
  ],
};
