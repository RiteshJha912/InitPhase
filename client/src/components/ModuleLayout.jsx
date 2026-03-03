export default function ModuleLayout({ title, description, stats, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, minHeight: '100vh', padding: '0 0 40px 0' }}>
      <div style={{ padding: '32px 40px', backgroundColor: '#fff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
        <h1 style={{ margin: '0 0 12px 0', fontSize: '2.25rem', color: '#1a202c', fontWeight: 'bold' }}>{title}</h1>
        <p style={{ margin: 0, fontSize: '1.125rem', color: '#4a5568', maxWidth: '800px', lineHeight: '1.625' }}>{description}</p>
        
        {stats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '32px' }}>
            {stats}
          </div>
        )}
      </div>

      <div style={{ padding: '0 40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {children}
      </div>
    </div>
  );
}
