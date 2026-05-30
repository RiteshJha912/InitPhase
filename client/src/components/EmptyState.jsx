import { CheckCircle, FileQuestion, FileSignature, FileText, FlaskConical, GitBranch, Layers, ListPlus, TicketPlus } from 'lucide-react';
import Button from './Button';

export default function EmptyState({ title, message, iconName, actionLabel, actionIcon: ActionIcon, onAction, secondaryActionLabel, onSecondaryAction }) {
  const getIcon = () => {
    switch (iconName) {
      case 'file': return <FileSignature size={48} strokeWidth={1} />;
      case 'file-text': return <FileText size={48} strokeWidth={1} />;
      case 'layers': return <Layers size={48} strokeWidth={1} />;
      case 'check': return <CheckCircle size={48} strokeWidth={1} />;
      case 'test': return <FlaskConical size={48} strokeWidth={1} />;
      case 'ticket': return <TicketPlus size={48} strokeWidth={1} />;
      case 'sequence': return <GitBranch size={48} strokeWidth={1} />;
      case 'requirement': return <ListPlus size={48} strokeWidth={1} />;
      default: return <FileQuestion size={48} strokeWidth={1} />;
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '56px 24px',
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
      <div style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
        {getIcon()}
      </div>
      {title && (
        <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 800 }}>
          {title}
        </h3>
      )}
      <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '500', maxWidth: '460px', lineHeight: 1.6 }}>
        {message}
      </p>
      {(actionLabel || secondaryActionLabel) && (
        <div style={{ marginTop: '22px', display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {actionLabel && onAction && (
            <Button variant="primary" onClick={onAction}>
              {ActionIcon && <ActionIcon size={18} />}
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="secondary" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
