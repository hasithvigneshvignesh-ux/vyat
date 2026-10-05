import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, icon, children, disabled, style, ...props }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2 font-medium rounded-xl
      transition-all duration-200 ease-out
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      active:scale-[0.97]
    `;

    const variants = {
      primary: `
        bg-gradient-to-r from-blue-600 to-blue-500 text-white
        hover:from-blue-500 hover:to-blue-400 hover:shadow-lg hover:shadow-blue-500/25
      `,
      secondary: `
        border border-[var(--border-primary)] text-[var(--text-primary)]
        bg-[var(--bg-elevated)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)]
      `,
      ghost: `
        text-[var(--text-secondary)] hover:text-[var(--text-primary)]
        hover:bg-[var(--bg-tertiary)]
      `,
      danger: `
        bg-gradient-to-r from-red-600 to-red-500 text-white
        hover:from-red-500 hover:to-red-400 hover:shadow-lg hover:shadow-red-500/25
      `,
      success: `
        bg-gradient-to-r from-emerald-600 to-emerald-500 text-white
        hover:from-emerald-500 hover:to-emerald-400 hover:shadow-lg hover:shadow-emerald-500/25
      `,
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs min-h-[36px]',
      md: 'px-4 py-2.5 text-sm min-h-[42px]',
      lg: 'px-6 py-3.5 text-base min-h-[48px]',
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        style={{ cursor: disabled || isLoading ? 'not-allowed' : 'pointer', ...style }}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : icon ? (
          icon
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
