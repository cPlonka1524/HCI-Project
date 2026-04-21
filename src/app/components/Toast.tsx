import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle, Info, AlertCircle, X } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'info' | 'error';

interface ToastAction { label: string; onClick: () => void; }

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  action?: ToastAction;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, action?: ToastAction) => void;
}

// ── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success', action?: ToastAction) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev.slice(-3), { id, message, type, action }]);
    timers.current[id] = setTimeout(() => dismiss(id), action ? 5000 : 3000);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container — bottom-right, above everything */}
      <div
        className="fixed bottom-6 right-6 z-[500] flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
        aria-atomic="false"
        role="status"
      >
        {toasts.map(toast => (
          <ToastCard key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// ── Toast Card ────────────────────────────────────────────────────────────────

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: string) => void }) {
  const iconMap = {
    success: <CheckCircle size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />,
    info:    <Info        size={16} className="text-blue-400 flex-shrink-0"  aria-hidden="true" />,
    error:   <AlertCircle size={16} className="text-red-400 flex-shrink-0"  aria-hidden="true" />,
  };

  const borderMap = {
    success: 'border-green-500/40',
    info:    'border-blue-500/40',
    error:   'border-red-500/40',
  };

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl
        animate-in slide-in-from-right-4 fade-in duration-200 ${borderMap[toast.type]}`}
      style={{ background: 'rgba(30,30,30,0.97)', minWidth: '220px', maxWidth: '340px' }}
      role="alert"
    >
      {iconMap[toast.type]}
      <span className="text-sm flex-1 text-white">{toast.message}</span>
      {toast.action && (
        <button
          onClick={() => { toast.action!.onClick(); onDismiss(toast.id); }}
          className="text-xs font-bold px-2 py-1 rounded transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white flex-shrink-0"
          style={{ color: '#46d369', background: 'rgba(70,211,105,0.15)' }}
        >
          {toast.action.label}
        </button>
      )}
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-0.5 rounded hover:opacity-70 transition-opacity focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
        aria-label="Dismiss notification"
      >
        <X size={14} className="text-white/60" aria-hidden="true" />
      </button>
    </div>
  );
}
