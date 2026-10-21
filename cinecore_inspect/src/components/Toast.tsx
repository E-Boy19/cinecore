import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const styles = {
    success: {
      border: 'border-emerald-500/40',
      shadow: 'shadow-[0_0_25px_rgba(16,185,129,0.2)]',
      bg: 'bg-slate-950/95',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      accent: 'text-emerald-400'
    },
    warning: {
      border: 'border-amber-500/40',
      shadow: 'shadow-[0_0_25px_rgba(245,158,11,0.2)]',
      bg: 'bg-slate-950/95',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
      accent: 'text-amber-400'
    },
    error: {
      border: 'border-rose-500/40',
      shadow: 'shadow-[0_0_25px_rgba(244,63,94,0.2)]',
      bg: 'bg-slate-950/95',
      icon: <AlertCircle className="w-4 h-4 text-rose-400" />,
      accent: 'text-rose-400'
    },
    info: {
      border: 'border-cyan-500/40',
      shadow: 'shadow-[0_0_25px_rgba(6,182,212,0.2)]',
      bg: 'bg-slate-950/95',
      icon: <Info className="w-4 h-4 text-cyan-400" />,
      accent: 'text-cyan-400'
    }
  }[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`pointer-events-auto p-3.5 rounded-xl border ${styles.border} ${styles.bg} ${styles.shadow} backdrop-blur-xl flex items-start gap-3 tech-bracket-top-left`}
    >
      <div className="shrink-0 mt-0.5">{styles.icon}</div>

      <div className="flex-1 min-w-0">
        <h4 className={`text-xs font-mono font-semibold ${styles.accent}`}>
          {toast.title}
        </h4>
        {toast.message && (
          <p className="mt-0.5 text-[11px] text-slate-300 leading-tight">
            {toast.message}
          </p>
        )}
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded text-slate-500 hover:text-slate-200 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};
