interface ProgressBarProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  color?: 'brand' | 'success' | 'warning' | 'error';
  className?: string;
}

export default function ProgressBar({
  value,
  size = 'md',
  showLabel = false,
  color = 'brand',
  className = '',
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colors = {
    brand: 'from-blue-500 to-violet-500',
    success: 'from-emerald-500 to-emerald-400',
    warning: 'from-amber-500 to-amber-400',
    error: 'from-red-500 to-red-400',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`progress-bar flex-1 ${sizes[size]}`}>
        <div
          className={`progress-bar-fill bg-gradient-to-r ${colors[color]}`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span
          className="text-xs font-semibold tabular-nums min-w-[3ch]"
          style={{ color: 'var(--text-secondary)' }}
        >
          {clampedValue}%
        </span>
      )}
    </div>
  );
}
