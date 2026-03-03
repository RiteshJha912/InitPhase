export default function SectionCard({ title, children, actions }) {
  return (
    <div style={{ 
      backgroundColor: 'var(--bg-card)', 
      border: '1px solid var(--border-color)', 
      borderRadius: 'var(--radius-md)', 
      boxShadow: 'var(--shadow-lg)',
      overflow: 'hidden',
      marginBottom: '24px'
    }}>
      {title && (
        <div className="section-card-header" style={{ 
          padding: '20px 24px', 
          borderBottom: '1px solid var(--border-color)', 
          backgroundColor: 'var(--bg-surface)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
            {title}
          </h2>
          {actions && <div style={{ width: '100%' }}>{actions}</div>}
        </div>
      )}
      <div style={{ padding: '24px' }}>
        {children}
      </div>
    </div>
  );
}
