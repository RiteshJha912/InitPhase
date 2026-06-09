import { ArrowRight, CheckCircle2, Info } from 'lucide-react';
import Button from './Button';

export default function FlowCallout({
  tone = 'info',
  title,
  message,
  actionLabel,
  onAction,
  icon: Icon,
}) {
  const toneColor = tone === 'success'
    ? 'var(--success)'
    : tone === 'warning'
      ? 'var(--warning)'
      : tone === 'danger'
        ? 'var(--danger)'
        : 'var(--accent-color)';

  const ToneIcon = Icon || (tone === 'success' ? CheckCircle2 : Info);

  return (
    <div className="mobile-flex-col" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '18px',
      padding: '18px 20px',
      backgroundColor: 'var(--bg-surface)',
      border: `1px solid ${toneColor}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-sm)',
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, width: '100%' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: tone === 'success' ? 'var(--success-bg)' : tone === 'warning' ? 'var(--warning-bg)' : tone === 'danger' ? 'var(--danger-bg)' : 'var(--accent-muted)',
          color: toneColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <ToneIcon size={20} />
        </div>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)', fontSize: '1rem' }}>{title}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{message}</p>
        </div>
      </div>
      {actionLabel && onAction && (
        <Button variant={tone === 'danger' ? 'danger' : 'secondary'} onClick={onAction}>
          {actionLabel} <ArrowRight size={16} />
        </Button>
      )}
    </div>
  );
}
