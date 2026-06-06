import { useCallback, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { ToastContext } from './useToast';

const toastStyles = {
  success: { icon: CheckCircle2, color: 'var(--success)', bg: 'var(--success-bg)' },
  error: { icon: AlertCircle, color: 'var(--danger)', bg: 'var(--danger-bg)' },
  info: { icon: Info, color: 'var(--accent-color)', bg: 'var(--accent-muted)' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => removeToast(id), 3600);
  }, [removeToast]);

  const value = useMemo(() => ({
    showToast,
    success: (message) => showToast(message, 'success'),
    error: (message) => showToast(message, 'error'),
    info: (message) => showToast(message, 'info'),
  }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div style={{
        position: 'fixed',
        right: '20px',
        bottom: '20px',
        zIndex: 1000,
        display: 'grid',
        gap: '12px',
        width: 'min(380px, calc(100vw - 32px))',
      }}>
        {toasts.map((toast) => {
          const style = toastStyles[toast.type] || toastStyles.info;
          const Icon = style.icon;

          return (
            <div key={toast.id} className="animate-fade-in" style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '14px 16px',
              backgroundColor: 'var(--bg-surface)',
              border: `1px solid ${style.color}`,
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              color: 'var(--text-primary)',
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: style.bg,
                color: style.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={18} />
              </div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.45, flex: 1, fontWeight: 600 }}>
                {toast.message}
              </p>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => removeToast(toast.id)}
                style={{ background: 'transparent', border: 0, color: 'var(--text-tertiary)', cursor: 'pointer', padding: 0 }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
