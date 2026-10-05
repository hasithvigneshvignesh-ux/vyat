// Simple cn utility that concatenates class names
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}

// Format date for display
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format date with time
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Format currency in INR safely
export function formatCurrency(amount: number | string | null | undefined): string {
  const num = typeof amount === 'number' ? (isNaN(amount) ? 0 : amount) : (Number(amount) || 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

// Calculate percentage
export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Slug generation
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Time ago utility
export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// Status color mapping
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    expired: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    revoked: 'bg-red-500/10 text-red-500 border-red-500/20',
    paid: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
    generated: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    unlocked: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    locked: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };
  return colors[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';
}

// Difficulty color mapping
export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    beginner: 'bg-green-500/10 text-green-500',
    intermediate: 'bg-yellow-500/10 text-yellow-500',
    advanced: 'bg-red-500/10 text-red-500',
    easy: 'bg-green-500/10 text-green-500',
    medium: 'bg-yellow-500/10 text-yellow-500',
    hard: 'bg-red-500/10 text-red-500',
  };
  return colors[difficulty] || 'bg-slate-500/10 text-slate-400';
}
