export default function DataTable({ columns, data, renderRow, emptyMessage }) {
  return (
    <div style={{ overflowX: 'auto', margin: '-24px', borderRadius: '0 0 12px 12px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f7fafc', borderBottom: '2px solid #e2e8f0', borderTop: '1px solid #e2e8f0' }}>
            {columns.map((col, idx) => (
              <th key={idx} style={{ 
                padding: '16px 24px', 
                color: '#4a5568', 
                fontWeight: '600', 
                width: col.width || 'auto',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item, idx) => renderRow(item, idx))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ padding: '48px 24px', textAlign: 'center', color: '#a0aec0', fontSize: '1rem' }}>
                {emptyMessage || 'No data available.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
