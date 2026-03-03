import { useOutletContext } from 'react-router-dom';
import ModuleLayout from '../components/ModuleLayout';
import SectionCard from '../components/SectionCard';
import DataTable from '../components/DataTable';
import EmptyState from '../components/EmptyState';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export default function RtmModule() {
  const { rtmData, coveragePct } = useOutletContext();

  const isCompleteCoverage = coveragePct === 100;
  
  const untestables = rtmData.filter(r => r.totalTests === 0).length;
  const failingTests = rtmData.filter(r => r.failed > 0).length;

  const columns = [
    { label: 'Requirement Payload Source', width: '35%' },
    { label: 'Escalation Tier', width: '150px' },
    { label: 'Execution Instances', width: '120px' },
    { label: 'Validated Routes', width: '100px' },
    { label: 'Route Exceptions', width: '100px' },
    { label: 'Structural Integrity', width: '100px' }
  ];

  return (
    <ModuleLayout
      title="Requirement Traceability Matrix"
      description="Analytical subsystem algorithmically linking requirements to executables. This structural validation plane evaluates systemic readiness prior to deployment."
      connectionText="The Traceability Matrix aggregates upstream Requirement arrays alongside Test Execution boolean returns. A mathematically unified, covered matrix confirms that the underlying software architecture exactly matches the defined systemic bounds."
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '32px' }}>
        
        {/* Core Coverage Metric */}
        <div style={{ padding: '32px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700' }}>Overall Array Coverage</h3>
          
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', lineHeight: 1, color: isCompleteCoverage ? 'var(--success)' : coveragePct === 0 ? 'var(--danger)' : 'var(--warning)', textShadow: `0 0 20px ${isCompleteCoverage ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}` }}>
              {coveragePct}<span style={{ fontSize: '2.5rem' }}>%</span>
            </div>
          </div>
          
          <div style={{ width: '100%', maxWidth: '300px', height: '10px', backgroundColor: 'var(--bg-card)', borderRadius: '9999px', overflow: 'hidden', display: 'flex', border: '1px solid var(--border-color)' }}>
            <div style={{ height: '100%', width: `${coveragePct}%`, backgroundColor: isCompleteCoverage ? 'var(--success)' : 'var(--warning)', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }} />
          </div>
          <div style={{ marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-tertiary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Operational Baseline Goal: 100%
          </div>
        </div>

        {/* Supplementary Analytical Readouts */}
        <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '24px' }}>
          
          <div style={{ padding: '24px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ padding: '16px', backgroundColor: 'var(--warning-bg)', borderRadius: '50%' }}>
              <AlertTriangle size={32} color="var(--warning)" />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Exposed Structural Nodes</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--warning)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{untestables} <span style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>Requirements unbound</span></div>
            </div>
          </div>
          
          <div style={{ padding: '24px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ padding: '16px', backgroundColor: 'var(--danger-bg)', borderRadius: '50%' }}>
              <XCircle size={32} color="var(--danger)" />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Active Exception Flags</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--danger)', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{failingTests} <span style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>Requirements failing</span></div>
            </div>
          </div>

        </div>
      </div>

      <SectionCard title="Traceability Logic Aggregator">
        {rtmData.length === 0 ? (
          <EmptyState 
            message="No matrices generated. Process requires upstream Requirement Arrays coupled with active Test Operations parameters." 
            iconName="layers" 
          />
        ) : (
          <DataTable 
            columns={columns}
            data={rtmData}
            renderRow={(rtm) => {
              const hasFailingTests = rtm.failed > 0;
              const hasNoTests = rtm.totalTests === 0;
              
              const rowStyle = { borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' };
              let highlightBg = 'transparent';
              if (hasFailingTests) highlightBg = 'var(--danger-bg)';
              else if (hasNoTests) highlightBg = 'var(--warning-bg)';

              return (
                <tr key={rtm.requirementId} style={{ ...rowStyle, backgroundColor: highlightBg }} 
                    onMouseOver={e=>e.currentTarget.style.backgroundColor=hasFailingTests?'rgba(239, 68, 68, 0.15)':hasNoTests?'rgba(245, 158, 11, 0.15)':'var(--bg-card-hover)'}
                    onMouseOut={e=>e.currentTarget.style.backgroundColor=highlightBg}>
                  <td style={{ padding: '16px 24px', fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '500' }}>{rtm.title}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{rtm.priority}</span>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '1rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-heading)', fontWeight: '600' }}>{rtm.totalTests}</td>
                  <td style={{ padding: '16px 24px', fontSize: '1rem', fontWeight: '700', fontFamily: 'var(--font-heading)', color: rtm.passed > 0 ? 'var(--success)' : 'var(--text-tertiary)' }}>{rtm.passed}</td>
                  <td style={{ padding: '16px 24px', fontSize: '1rem', fontWeight: '700', fontFamily: 'var(--font-heading)', color: rtm.failed > 0 ? 'var(--danger)' : 'var(--text-tertiary)' }}>{rtm.failed}</td>
                  <td style={{ padding: '16px 24px', fontSize: '1.25rem' }}>
                    {rtm.coverage ? <CheckCircle2 color="var(--success)" size={24} /> : <XCircle color="var(--danger)" size={24} />}
                  </td>
                </tr>
              );
            }}
          />
        )}
      </SectionCard>
    </ModuleLayout>
  );
}
