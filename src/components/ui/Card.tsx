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
    sm: 'p-4 sm:p-5',
    md: 'p-6 sm:p-7',
    lg: 'p-7 sm:p-8',
  };

  return (
    <div
      onClick={onClick}
      className={`
        rounded-[14px] border
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${gradient ? 'gradient-border' : ''}
        ${paddings[padding]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        backgroundColor: 'var(--card-bg, var(--bg-card))',
        borderColor: gradient ? 'transparent' : 'var(--card-border, var(--border-primary))',
        boxShadow: 'var(--card-shadow)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
