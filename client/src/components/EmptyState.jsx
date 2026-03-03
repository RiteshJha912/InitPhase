import { FileQuestion, Layers, FileSignature, CheckCircle } from 'lucide-react';

export default function EmptyState({ message, iconName }) {
  const getIcon = () => {
    switch (iconName) {
      case 'file': return <FileSignature size={48} strokeWidth={1} />;
      case 'layers': return <Layers size={48} strokeWidth={1} />;
      case 'check': return <CheckCircle size={48} strokeWidth={1} />;
      default: return <FileQuestion size={48} strokeWidth={1} />;
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '64px 24px',
      backgroundColor: 'var(--bg-surface)',
      borderRadius: 'var(--radius-md)',
      border: '2px dashed var(--border-strong)',
      color: 'var(--text-tertiary)',
      textAlign: 'center',
      transition: 'background-color 0.2s',
      cursor: 'default'
    }}
    onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--bg-card)'}
    onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}>
      {iconName && (
        <div style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
          {getIcon()}
        </div>
      )}
      <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-secondary)', fontWeight: '500', maxWidth: '400px' }}>
        {message}
      </p>
    </div>
  );
}
