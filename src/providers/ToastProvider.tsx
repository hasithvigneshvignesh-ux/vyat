'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 4000) => {
      const id = Math.random().toString(36).substring(2, 9);
      const toast: Toast = { id, message, type, duration };
      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast flex items-center gap-3 ${
              toast.type === 'success'
                ? 'border-l-4 border-l-emerald-500'
                : toast.type === 'error'
                ? 'border-l-4 border-l-red-500'
                : toast.type === 'warning'
                ? 'border-l-4 border-l-amber-500'
                : 'border-l-4 border-l-blue-500'
            }`}
          >
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-auto text-xs opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: 'var(--text-secondary)' }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    return {
      toasts: [],
      addToast: () => {},
      removeToast: () => {},
    };
  }
  return context;
}
