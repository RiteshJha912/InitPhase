export default function StatCard({ title, value, color = '#4a5568', bgColor = '#fff' }) {
  return (
    <div style={{ 
      padding: '24px', 
      backgroundColor: bgColor, 
      border: '1px solid #e2e8f0', 
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      borderLeft: `5px solid ${color}`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {title}
      </div>
      <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1a202c', lineHeight: 1 }}>
        {value}
      </div>
    </div>
  );
}
