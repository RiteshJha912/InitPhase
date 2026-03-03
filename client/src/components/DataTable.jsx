export default function DataTable({ columns, data, renderRow, emptyMessage }) {
  return (
    <div className="table-responsive-wrapper" style={{ overflowX: 'auto', margin: '-24px', borderRadius: '0 0 var(--radius-md) var(--radius-md)' }}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse', 
        textAlign: 'left', 
        minWidth: '600px',
        color: 'var(--text-primary)'
      }}>
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '2px solid var(--border-color)', borderTop: '1px solid var(--border-color)' }}>
            {columns.map((col, idx) => (
              <th key={idx} style={{ 
                padding: '16px 24px', 
                color: 'var(--text-secondary)', 
                fontWeight: '600', 
                width: col.width || 'auto',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody style={{ backgroundColor: 'var(--bg-card)' }}>
          {data && data.length > 0 ? (
            data.map((item, idx) => renderRow(item, idx))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '1rem' }}>
                {emptyMessage || 'No data available.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
