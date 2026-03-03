import { useOutletContext } from 'react-router-dom';
import ModuleLayout from '../components/ModuleLayout';
import SectionCard from '../components/SectionCard';
import DataTable from '../components/DataTable';
import EmptyState from '../components/EmptyState';

export default function RtmModule() {
  const { rtmData, coveragePct } = useOutletContext();

  const isCompleteCoverage = coveragePct === 100;
  
  const untestables = rtmData.filter(r => r.totalTests === 0).length;
  const failingTests = rtmData.filter(r => r.failed > 0).length;

  const columns = [
    { label: 'Requirement', width: '35%' },
    { label: 'Priority', width: '150px' },
    { label: 'Total Tests', width: '120px' },
    { label: 'Passed', width: '100px' },
    { label: 'Failed', width: '100px' },
    { label: 'Covered', width: '100px' }
  ];

  return (
    <ModuleLayout
      title="Requirement Traceability Matrix"
      description="Analytical subsystem connecting user requirements to executing test cases. This matrix assures comprehensive requirements coverage and validates system readiness."
    >
      <div style={{ padding: '32px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.25rem', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Overall Coverage Percentage</h3>
        <div style={{ fontSize: '4.5rem', fontWeight: '800', lineHeight: 1, color: isCompleteCoverage ? '#38a169' : coveragePct === 0 ? '#e53e3e' : '#dd6b20', marginBottom: '24px' }}>
          {coveragePct}%
        </div>
        
        {/* Simple bar visualization */}
        <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', height: '16px', backgroundColor: '#edf2f7', borderRadius: '9999px', overflow: 'hidden', display: 'flex' }}>
          <div style={{ height: '100%', width: `${coveragePct}%`, backgroundColor: isCompleteCoverage ? '#38a169' : '#3182ce', transition: 'width 0.5s ease-in-out' }} />
        </div>
        <div style={{ marginTop: '16px', fontSize: '1rem', color: '#718096', fontWeight: '500' }}>
          Coverage Goal: 100%
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div style={{ padding: '24px', backgroundColor: '#fffaf0', border: '1px solid #feebc8', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#c05621', textTransform: 'uppercase', marginBottom: '8px' }}>Requirements without tests</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#dd6b20' }}>{untestables}</div>
        </div>
        
        <div style={{ padding: '24px', backgroundColor: '#fff5f5', border: '1px solid #fed7d7', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#c53030', textTransform: 'uppercase', marginBottom: '8px' }}>Requirements with failures</div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#e53e3e' }}>{failingTests}</div>
        </div>
      </div>

      <SectionCard title="Requirement Traceability Matrix Overview">
        {rtmData.length === 0 ? (
          <EmptyState 
            message="No RTM data to display. Create requirements and test cases to build the matrix." 
            icon="📊" 
          />
        ) : (
          <DataTable 
            columns={columns}
            data={rtmData}
            renderRow={(rtm) => {
              const hasFailingTests = rtm.failed > 0;
              const hasNoTests = rtm.totalTests === 0;
              
              const rowStyle = { borderBottom: '1px solid #edf2f7', transition: 'background-color 0.2s' };
              let highlightBg = 'transparent';
              if (hasFailingTests) highlightBg = '#fff5f5';
              else if (hasNoTests) highlightBg = '#fffff0';

              return (
                <tr key={rtm.requirementId} style={{ ...rowStyle, backgroundColor: highlightBg }}>
                  <td style={{ padding: '16px 24px', fontSize: '1rem', color: '#2d3748', fontWeight: '500' }}>{rtm.title}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#718096' }}>{rtm.priority}</span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '1rem', color: '#4a5568' }}>{rtm.totalTests}</td>
                  <td style={{ padding: '16px 24px', fontSize: '1rem', fontWeight: rtm.passed > 0 ? '600' : '400', color: rtm.passed > 0 ? '#38a169' : '#a0aec0' }}>{rtm.passed}</td>
                  <td style={{ padding: '16px 24px', fontSize: '1rem', fontWeight: rtm.failed > 0 ? '600' : '400', color: rtm.failed > 0 ? '#e53e3e' : '#a0aec0' }}>{rtm.failed}</td>
                  <td style={{ padding: '16px 24px', fontSize: '1.25rem' }}>
                    {rtm.coverage ? '✅' : '❌'}
                  </td>
                </tr>
              );
            }}
          />
        )}
      </SectionCard>

      <div style={{ padding: '32px 24px', marginTop: '24px', borderTop: '1px solid #e2e8f0', color: '#718096', fontSize: '1.1rem', lineHeight: '1.625', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ margin: 0 }}>
          <strong>Requirement Traceability Matrix Concept:</strong> The RTM validates that all authored requirements are thoroughly tested by corresponding localized test cases. A fully covered matrix implies that each individual requirement is structurally assessed by at least one executing operation, assuring structural integrity and functional capability before operational deployment.
        </p>
      </div>
    </ModuleLayout>
  );
}
