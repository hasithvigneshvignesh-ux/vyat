import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  style?: CSSProperties;
  onClick?: () => void;
}

export default function Card({
  children,
  className = '',
  hover = false,
  gradient = false,
  padding = 'md',
  style,
  onClick,
}: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl border
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${gradient ? 'gradient-border' : ''}
        ${paddings[padding]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: gradient ? 'transparent' : 'var(--border-primary)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
