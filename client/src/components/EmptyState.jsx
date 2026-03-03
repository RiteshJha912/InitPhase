export default function EmptyState({ message, icon }) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '64px 24px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      border: '2px dashed #e2e8f0',
      color: '#a0aec0',
      textAlign: 'center'
    }}>
      {icon && <div style={{ fontSize: '4rem', marginBottom: '20px', opacity: 0.5 }}>{icon}</div>}
      <p style={{ margin: 0, fontSize: '1.25rem', color: '#718096', fontWeight: '500' }}>{message}</p>
    </div>
  );
}
