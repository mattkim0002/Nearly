// src/components/Toast.tsx
// Toast notification system

import { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: 'bg-emerald-500 border-emerald-600',
    error: 'bg-red-500 border-red-600',
    info: 'bg-sky-500 border-sky-600'
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideInRight">
      <div className={`${styles[type]} text-white px-6 py-4 rounded-xl shadow-2xl border-2 flex items-center gap-3 min-w-[300px]`}>
        <span className="text-2xl">{icons[type]}</span>
        <p className="flex-1 font-semibold">{message}</p>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white text-xl"
        >
          ×
        </button>
      </div>
    </div>
  );
}

// Toast Manager Hook
export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
  };

  const ToastComponent = toast ? (
    <Toast
      message={toast.message}
      type={toast.type}
      onClose={() => setToast(null)}
    />
  ) : null;

  return { showToast, ToastComponent };
}
