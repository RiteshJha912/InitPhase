import { LoaderCircle } from 'lucide-react';

export default function LoadingState({ title = 'Loading workspace', message, compact = false }) {
  return (
    <div style={{
      minHeight: compact ? '180px' : '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: compact ? '32px' : '48px',
      backgroundColor: 'var(--bg-base)',
      color: 'var(--text-secondary)',
    }}>
      <div style={{ display: 'grid', justifyItems: 'center', gap: '14px', textAlign: 'center' }}>
        <div style={{
          width: compact ? '44px' : '56px',
          height: compact ? '44px' : '56px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-md)',
        }}>
          <LoaderCircle size={compact ? 24 : 30} style={{ animation: 'spin 1.4s linear infinite', color: 'var(--accent-color)' }} />
        </div>
        <div>
          <h3 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)', fontSize: compact ? '1rem' : '1.15rem' }}>{title}</h3>
          <p style={{ margin: 0, color: 'var(--text-tertiary)' }}>{message || 'Aligning project signals...'}</p>
        </div>
      </div>
    </div>
  );
}
