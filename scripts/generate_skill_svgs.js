const fs = require('fs');
const path = require('path');

// Read branches and skills from src/data/branches.ts
// We will parse or require directly using ts-node or transpiled execution
const branchesFile = fs.readFileSync(path.join(__dirname, '../src/data/branches.ts'), 'utf-8');

// Quick extraction of skills array from branches.ts
const branchColors = {
  'cse-core': { primary: '#3B82F6', secondary: '#1D4ED8', glow: 'rgba(59,130,246,0.3)', bg: '#080E1A', text: '#93C5FD' },
  'machine-learning': { primary: '#7C5CD6', secondary: '#5B21B6', glow: 'rgba(124,92,214,0.3)', bg: '#0F0B1E', text: '#C4B5FD' },
  'data-science': { primary: '#D9A81E', secondary: '#B45309', glow: 'rgba(217,168,30,0.3)', bg: '#181205', text: '#FDE68A' },
  'cyber-security': { primary: '#E06A6A', secondary: '#991B1B', glow: 'rgba(224,106,106,0.3)', bg: '#180B0B', text: '#FCA5A5' },
};

function getGraphicForSkill(slug, color) {
  if (slug.includes('python')) {
    return `
      <path d="M250 180 C250 155, 275 145, 300 145 C325 145, 350 155, 350 180 L350 210 L280 210 C260 210, 245 225, 245 245 L245 270 L220 270 C195 270, 185 245, 185 220 L185 190 C185 165, 205 145, 230 145 L260 145" fill="none" stroke="${color.primary}" stroke-width="12" stroke-linecap="round"/>
      <path d="M350 310 C350 335, 325 345, 300 345 C275 345, 250 335, 250 310 L250 280 L320 280 C340 280, 355 265, 355 245 L355 220 L380 220 C405 220, 415 245, 415 270 L415 300 C415 325, 395 345, 370 345 L340 345" fill="none" stroke="${color.text}" stroke-width="12" stroke-linecap="round"/>
      <circle cx="280" cy="175" r="7" fill="${color.primary}" />
      <circle cx="320" cy="315" r="7" fill="${color.text}" />
    `;
  }
  if (slug.includes('dsa') || slug.includes('algorithm') || slug.includes('trees') || slug.includes('problem-solving')) {
    return `
      <line x1="300" y1="160" x2="220" y2="230" stroke="${color.primary}" stroke-width="3" stroke-dasharray="4 2"/>
      <line x1="300" y1="160" x2="380" y2="230" stroke="${color.primary}" stroke-width="3" stroke-dasharray="4 2"/>
      <line x1="220" y1="230" x2="180" y2="300" stroke="${color.primary}" stroke-width="2"/>
      <line x1="220" y1="230" x2="260" y2="300" stroke="${color.primary}" stroke-width="2"/>
      <line x1="380" y1="230" x2="340" y2="300" stroke="${color.primary}" stroke-width="2"/>
      <line x1="380" y1="230" x2="420" y2="300" stroke="${color.primary}" stroke-width="2"/>
      <circle cx="300" cy="160" r="22" fill="#1E293B" stroke="${color.primary}" stroke-width="4"/>
      <text x="300" y="165" fill="${color.text}" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">root</text>
      <circle cx="220" cy="230" r="18" fill="#1E293B" stroke="${color.primary}" stroke-width="3"/>
      <circle cx="380" cy="230" r="18" fill="#1E293B" stroke="${color.primary}" stroke-width="3"/>
      <circle cx="180" cy="300" r="15" fill="#1E293B" stroke="${color.text}" stroke-width="2"/>
      <circle cx="260" cy="300" r="15" fill="#1E293B" stroke="${color.text}" stroke-width="2"/>
      <circle cx="340" cy="300" r="15" fill="#1E293B" stroke="${color.text}" stroke-width="2"/>
      <circle cx="420" cy="300" r="15" fill="#1E293B" stroke="${color.text}" stroke-width="2"/>
    `;
  }
  if (slug.includes('dbms') || slug.includes('sql') || slug.includes('database') || slug.includes('etl') || slug.includes('data-engineering') || slug.includes('data-handling')) {
    return `
      <ellipse cx="300" cy="170" rx="90" ry="26" fill="#1E293B" stroke="${color.primary}" stroke-width="3"/>
      <path d="M210 170 v40 c0 14 40 26 90 26 s90 -12 90 -26 v-40" fill="#1E293B" stroke="${color.primary}" stroke-width="3"/>
      <path d="M210 210 v40 c0 14 40 26 90 26 s90 -12 90 -26 v-40" fill="#1E293B" stroke="${color.primary}" stroke-width="3"/>
      <path d="M210 250 v40 c0 14 40 26 90 26 s90 -12 90 -26 v-40" fill="#1E293B" stroke="${color.primary}" stroke-width="3"/>
      <line x1="240" y1="170" x2="360" y2="170" stroke="${color.text}" stroke-width="2" stroke-linecap="round"/>
      <line x1="240" y1="210" x2="320" y2="210" stroke="${color.text}" stroke-width="2" stroke-linecap="round"/>
      <line x1="240" y1="250" x2="340" y2="250" stroke="${color.text}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="360" cy="285" r="7" fill="${color.primary}"/>
    `;
  }
  if (slug.includes('neural') || slug.includes('deep-learning') || slug.includes('machine-learning') || slug.includes('ml-') || slug.includes('model') || slug.includes('ensembles')) {
    return `
      <circle cx="200" cy="180" r="14" fill="#1E293B" stroke="${color.primary}" stroke-width="3"/>
      <circle cx="200" cy="230" r="14" fill="#1E293B" stroke="${color.primary}" stroke-width="3"/>
      <circle cx="200" cy="280" r="14" fill="#1E293B" stroke="${color.primary}" stroke-width="3"/>
      <circle cx="200" cy="330" r="14" fill="#1E293B" stroke="${color.primary}" stroke-width="3"/>
      <circle cx="300" cy="160" r="16" fill="#1E293B" stroke="${color.text}" stroke-width="3"/>
      <circle cx="300" cy="215" r="16" fill="#1E293B" stroke="${color.text}" stroke-width="3"/>
      <circle cx="300" cy="270" r="16" fill="#1E293B" stroke="${color.text}" stroke-width="3"/>
      <circle cx="300" cy="325" r="16" fill="#1E293B" stroke="${color.text}" stroke-width="3"/>
      <circle cx="400" cy="200" r="15" fill="#1E293B" stroke="${color.primary}" stroke-width="3"/>
      <circle cx="400" cy="260" r="15" fill="#1E293B" stroke="${color.primary}" stroke-width="3"/>
      <circle cx="400" cy="320" r="15" fill="#1E293B" stroke="${color.primary}" stroke-width="3"/>
      <line x1="214" y1="180" x2="284" y2="160" stroke="${color.primary}" stroke-width="1.5" opacity="0.7"/>
      <line x1="214" y1="180" x2="284" y2="215" stroke="${color.primary}" stroke-width="1.5" opacity="0.7"/>
      <line x1="214" y1="230" x2="284" y2="215" stroke="${color.primary}" stroke-width="1.5" opacity="0.7"/>
      <line x1="214" y1="280" x2="284" y2="270" stroke="${color.primary}" stroke-width="1.5" opacity="0.7"/>
      <line x1="214" y1="330" x2="284" y2="325" stroke="${color.primary}" stroke-width="1.5" opacity="0.7"/>
      <line x1="316" y1="215" x2="385" y2="200" stroke="${color.text}" stroke-width="1.5" opacity="0.8"/>
      <line x1="316" y1="270" x2="385" y2="260" stroke="${color.text}" stroke-width="1.5" opacity="0.8"/>
      <line x1="316" y1="325" x2="385" y2="320" stroke="${color.text}" stroke-width="1.5" opacity="0.8"/>
    `;
  }
  if (slug.includes('security') || slug.includes('cryptography') || slug.includes('penetration') || slug.includes('forensics') || slug.includes('hacking') || slug.includes('tools')) {
    return `
      <path d="M300 150 L380 185 V260 C380 310 300 345 300 345 C300 345 220 310 220 260 V185 Z" fill="#1E293B" stroke="${color.primary}" stroke-width="4"/>
      <rect x="275" y="225" width="50" height="40" rx="6" fill="${color.primary}"/>
      <path d="M285 225 V210 C285 200 315 200 315 210 V225" fill="none" stroke="${color.text}" stroke-width="4" stroke-linecap="round"/>
      <circle cx="300" cy="242" r="4" fill="#0B1120"/>
      <line x1="300" y1="246" x2="300" y2="255" stroke="#0B1120" stroke-width="3"/>
    `;
  }
  if (slug.includes('network') || slug.includes('protocols')) {
    return `
      <rect x="250" y="160" width="100" height="55" rx="8" fill="#1E293B" stroke="${color.primary}" stroke-width="3"/>
      <circle cx="275" cy="188" r="6" fill="${color.primary}"/>
      <circle cx="300" cy="188" r="6" fill="${color.text}"/>
      <circle cx="325" cy="188" r="6" fill="#10B981"/>
      <line x1="300" y1="215" x2="300" y2="270" stroke="${color.primary}" stroke-width="3"/>
      <line x1="200" y1="270" x2="400" y2="270" stroke="${color.primary}" stroke-width="3"/>
      <line x1="200" y1="270" x2="200" y2="310" stroke="${color.primary}" stroke-width="3"/>
      <line x1="300" y1="270" x2="300" y2="310" stroke="${color.primary}" stroke-width="3"/>
      <line x1="400" y1="270" x2="400" y2="310" stroke="${color.primary}" stroke-width="3"/>
      <rect x="165" y="310" width="70" height="40" rx="6" fill="#1E293B" stroke="${color.text}" stroke-width="2"/>
      <rect x="265" y="310" width="70" height="40" rx="6" fill="#1E293B" stroke="${color.text}" stroke-width="2"/>
      <rect x="365" y="310" width="70" height="40" rx="6" fill="#1E293B" stroke="${color.text}" stroke-width="2"/>
    `;
  }
  if (slug.includes('visualization') || slug.includes('eda') || slug.includes('statistics') || slug.includes('time-series') || slug.includes('analytics') || slug.includes('math')) {
    return `
      <line x1="190" y1="320" x2="410" y2="320" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <line x1="190" y1="160" x2="190" y2="320" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
      <rect x="215" y="240" width="28" height="80" rx="4" fill="${color.primary}" opacity="0.85"/>
      <rect x="255" y="200" width="28" height="120" rx="4" fill="${color.primary}" opacity="0.9"/>
      <rect x="295" y="170" width="28" height="150" rx="4" fill="${color.text}"/>
      <rect x="335" y="210" width="28" height="110" rx="4" fill="${color.primary}" opacity="0.85"/>
      <rect x="375" y="180" width="28" height="140" rx="4" fill="${color.primary}" opacity="0.95"/>
      <path d="M215 250 Q270 170 310 160 T400 175" fill="none" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
      <circle cx="310" cy="160" r="5" fill="#F59E0B"/>
    `;
  }
  if (slug.includes('operating-systems') || slug.includes('architecture') || slug.includes('linux')) {
    return `
      <rect x="180" y="160" width="240" height="150" rx="8" fill="#1E293B" stroke="${color.primary}" stroke-width="3"/>
      <rect x="180" y="160" width="240" height="30" rx="8" fill="rgba(255,255,255,0.08)"/>
      <circle cx="200" cy="175" r="4" fill="#EF4444"/>
      <circle cx="215" cy="175" r="4" fill="#F59E0B"/>
      <circle cx="230" cy="175" r="4" fill="#10B981"/>
      <text x="250" y="180" fill="#94A3B8" font-family="monospace" font-size="12">kernel-v6.8 // bash</text>
      <text x="200" y="220" fill="${color.text}" font-family="monospace" font-size="13">$ sudo systemctl status core</text>
      <text x="200" y="245" fill="#10B981" font-family="monospace" font-size="13">● Active: running (pid 1420)</text>
      <text x="200" y="270" fill="#94A3B8" font-family="monospace" font-size="13">  Memory: 48.2MB / 4.0GB</text>
      <rect x="200" y="285" width="200" height="6" rx="3" fill="rgba(255,255,255,0.1)"/>
      <rect x="200" y="285" width="80" height="6" rx="3" fill="${color.primary}"/>
    `;
  }
  // Generic Code / Systems / Projects
  return `
    <rect x="190" y="160" width="220" height="150" rx="10" fill="#1E293B" stroke="${color.primary}" stroke-width="3"/>
    <rect x="190" y="160" width="220" height="28" rx="10" fill="rgba(255,255,255,0.06)"/>
    <circle cx="208" cy="174" r="4" fill="#EF4444"/>
    <circle cx="222" cy="174" r="4" fill="#F59E0B"/>
    <circle cx="236" cy="174" r="4" fill="#10B981"/>
    <line x1="210" y1="210" x2="280" y2="210" stroke="${color.text}" stroke-width="3" stroke-linecap="round"/>
    <line x1="210" y1="235" x2="340" y2="235" stroke="${color.primary}" stroke-width="3" stroke-linecap="round"/>
    <line x1="230" y1="260" x2="310" y2="260" stroke="rgba(255,255,255,0.4)" stroke-width="3" stroke-linecap="round"/>
    <line x1="210" y1="285" x2="260" y2="285" stroke="${color.text}" stroke-width="3" stroke-linecap="round"/>
  `;
}

// Extract all skills from typescript file using regular expression match
const skillBlocks = branchesFile.match(/slug:\s*'([^']+)',\s*branchSlug:\s*'([^']+)',\s*name:\s*'([^']+)',\s*level:\s*'([^']+)',[\s\S]*?lessons:\s*(\d+),\s*minutesPerLesson:\s*(\d+)/g);

if (!skillBlocks) {
  console.error('Could not find skill blocks in branches.ts');
  process.exit(1);
}

let count = 0;
skillBlocks.forEach(block => {
  const slug = block.match(/slug:\s*'([^']+)'/)[1];
  const branchSlug = block.match(/branchSlug:\s*'([^']+)'/)[1];
  const name = block.match(/name:\s*'([^']+)'/)[1];
  const level = block.match(/level:\s*'([^']+)'/)[1];
  const lessons = block.match(/lessons:\s*(\d+)/)[1];
  const minutes = block.match(/minutesPerLesson:\s*(\d+)/)[1];

  const color = branchColors[branchSlug] || branchColors['cse-core'];
  const dir = path.join(__dirname, '../public/skills', branchSlug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="600" height="450" fill="none">
  <defs>
    <linearGradient id="bg_${slug}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color.bg}" />
      <stop offset="100%" stop-color="#0B1120" />
    </linearGradient>
    <radialGradient id="glow_${slug}" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="${color.primary}" stop-opacity="0.25" />
      <stop offset="100%" stop-color="${color.primary}" stop-opacity="0" />
    </radialGradient>
    <pattern id="grid_${slug}" width="30" height="30" patternUnits="userSpaceOnUse">
      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    </pattern>
    <filter id="dropShadow_${slug}" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="rgba(0,0,0,0.6)"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="600" height="450" rx="20" fill="url(#bg_${slug})" />
  <rect width="600" height="450" fill="url(#grid_${slug})" />
  <circle cx="300" cy="225" r="180" fill="url(#glow_${slug})" />

  <!-- Outer frame border with subtle brand glow -->
  <rect x="1.5" y="1.5" width="597" height="447" rx="18.5" stroke="${color.primary}" stroke-opacity="0.3" stroke-width="2" fill="none"/>

  <!-- Graphic Subject -->
  <g filter="url(#dropShadow_${slug})">
    ${getGraphicForSkill(slug, color)}
  </g>

  <!-- Level & Lessons Badge -->
  <rect x="30" y="30" width="130" height="32" rx="16" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <circle cx="46" cy="46" r="4" fill="${color.primary}" />
  <text x="58" y="51" fill="#E2E8F0" font-family="sans-serif" font-size="12" font-weight="600" letter-spacing="0.5">${level.toUpperCase()}</text>

  <!-- Branch Pill -->
  <rect x="420" y="30" width="150" height="32" rx="16" fill="rgba(255,255,255,0.06)" stroke="${color.primary}" stroke-opacity="0.4" stroke-width="1"/>
  <text x="495" y="51" fill="${color.text}" font-family="sans-serif" font-size="11" font-weight="600" text-anchor="middle">${branchSlug.replace('-', ' ').toUpperCase()}</text>

  <!-- Bottom Brand Watermark -->
  <text x="30" y="415" fill="rgba(255,255,255,0.4)" font-family="monospace" font-size="12">VYAT // ${slug}</text>
  <text x="570" y="415" fill="rgba(255,255,255,0.5)" font-family="sans-serif" font-size="12" font-weight="500" text-anchor="end">${lessons} Lessons • ${minutes}m / lesson</text>
</svg>`;

  fs.writeFileSync(path.join(dir, `${slug}.svg`), svgContent.trim());
  count++;
});

console.log(`Successfully generated ${count} skill SVGs!`);
