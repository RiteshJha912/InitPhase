export default function SectionCard({ title, children }) {
  return (
    <div style={{ 
      backgroundColor: '#fff', 
      border: '1px solid #e2e8f0', 
      borderRadius: '12px', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      overflow: 'hidden'
    }}>
      {title && (
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f7fafc' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#2d3748', fontWeight: '600' }}>{title}</h2>
        </div>
      )}
      <div style={{ padding: '24px' }}>
        {children}
      </div>
    </div>
  );
}
