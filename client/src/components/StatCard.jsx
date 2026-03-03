export default function StatCard({ title, value, color = 'var(--accent-color)', icon: Icon }) {
  return (
    <div style={{ 
      position: 'relative',
      padding: '24px 28px', 
      backgroundColor: 'var(--bg-card)', 
      border: '1px solid var(--border-color)', 
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      transition: 'all 0.25s ease',
      backgroundImage: `linear-gradient(to bottom right, color-mix(in srgb, ${color} 3%, transparent), transparent 40%)`
    }}
    onMouseOver={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        e.currentTarget.style.borderColor = `color-mix(in srgb, ${color} 50%, var(--border-color))`;
    }}
    onMouseOut={e => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.borderColor = 'var(--border-color)';
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: '1.4' }}>
          {title}
        </div>
        {Icon && (
          <div style={{ 
            flexShrink: 0,
            padding: '10px', 
            backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`, 
            borderRadius: '10px', 
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`
          }}>
            <Icon size={22} strokeWidth={2.5} />
          </div>
        )}
      </div>
      <div>
        <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
          {value}
        </div>
      </div>
    </div>
  );
}
