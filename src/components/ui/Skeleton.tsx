interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
}

export default function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  const variants = {
    text: 'rounded-md h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div
      className={`animate-shimmer ${variants[variant]} ${className}`}
      style={{
        width: width || (variant === 'circular' ? '40px' : '100%'),
        height: height || (variant === 'circular' ? '40px' : variant === 'rectangular' ? '120px' : undefined),
      }}
    />
  );
}

// Common skeleton patterns
export function CardSkeleton() {
  return (
    <div
      className="rounded-2xl border p-6 space-y-4"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-primary)',
      }}
    >
      <Skeleton variant="rectangular" height="140px" />
      <Skeleton width="60%" />
      <Skeleton width="80%" />
      <div className="flex gap-2">
        <Skeleton width="80px" height="24px" className="rounded-full" />
        <Skeleton width="60px" height="24px" className="rounded-full" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton variant="circular" width="36px" height="36px" />
      <div className="flex-1 space-y-2">
        <Skeleton width="40%" />
        <Skeleton width="25%" />
      </div>
      <Skeleton width="80px" height="28px" className="rounded-lg" />
    </div>
  );
}
