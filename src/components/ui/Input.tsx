import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, hint, icon, id, style, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
        {label && (
          <label
            htmlFor={inputId}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-secondary, #cbd5e1)',
              lineHeight: 1.4,
            }}
          >
            {label}
          </label>
        )}
        <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
          {icon && (
            <div
              style={{
                position: 'absolute',
                left: '14px',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
                color: 'var(--text-tertiary, #64748b)',
                zIndex: 2,
              }}
            >
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full rounded-xl border text-sm
              transition-all duration-200
              placeholder:text-[var(--text-muted)]
              focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-red-500/50 focus:ring-red-500/40 focus:border-red-500' : ''}
              ${className}
            `}
            style={{
              backgroundColor: 'var(--bg-tertiary, #0f172a)',
              borderColor: error ? '#ef4444' : 'var(--border-primary, #334155)',
              color: 'var(--text-primary, #f8fafc)',
              paddingTop: '12px',
              paddingBottom: '12px',
              paddingRight: '16px',
              paddingLeft: icon ? '44px' : '16px',
              minHeight: '46px',
              boxSizing: 'border-box',
              ...style,
            }}
            {...props}
          />
        </div>
        {error && (
          <p style={{ fontSize: '12px', color: '#f87171', margin: '2px 0 0 0' }}>{error}</p>
        )}
        {hint && !error && (
          <p style={{ fontSize: '12px', color: 'var(--text-tertiary, #64748b)', margin: '2px 0 0 0' }}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
