import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import ModuleLayout from '../components/ModuleLayout';
import StatCard from '../components/StatCard';
import SectionCard from '../components/SectionCard';
import DataTable from '../components/DataTable';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { FlaskConical, CheckCircle2, XCircle, Clock, Save, ShieldCheck } from 'lucide-react';

export default function TestCasesModule() {
  const { projectId, requirements, testCases, fetchTestCases, fetchRtm } = useOutletContext();
  
  const [testName, setTestName] = useState('');
  const [testSteps, setTestSteps] = useState('');
  const [testExpectedResult, setTestExpectedResult] = useState('');
  const [testStatus, setTestStatus] = useState('Pending');
  const [selectedReq, setSelectedReq] = useState('');

  const handleAddTestCase = async (e) => {
    e.preventDefault();
    if (!selectedReq) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/testcases/${projectId}/${selectedReq}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          name: testName, 
          steps: testSteps, 
          expectedResult: testExpectedResult,
          status: testStatus
        })
      });
      if (res.ok) {
        setTestName('');
        setTestSteps('');
        setTestExpectedResult('');
        setTestStatus('Pending');
        fetchTestCases(token);
        fetchRtm(token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTestStatus = async (testId, newStatus) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/testcases/${testId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchTestCases(token);
        fetchRtm(token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalTests = testCases.length;
  const passedTests = testCases.filter(t => t.status === 'Pass').length;
  const failedTests = testCases.filter(t => t.status === 'Fail').length;
  const pendingTests = testCases.filter(t => t.status === 'Pending').length;

  const coveredReqsCount = new Set(testCases.map(t => t.requirement ? t.requirement._id : null).filter(Boolean)).size;
  const totalReqs = requirements.length;
  const coverageRatio = totalReqs > 0 ? Math.round((coveredReqsCount / totalReqs) * 100) : 0;

  const columns = [
    { label: 'Parent Requirement', width: '30%' },
    { label: 'Validation Protocol Name', width: 'auto' },
    { label: 'Execution State', width: '200px' }
  ];

  return (
    <ModuleLayout
      title="Test Instance Execution"
      description="Quality Assurance subsystem mapping authored compliance validations dynamically against initial structural requirements to calculate global system health."
      connectionText="Test Execution links logically with the Requirements Console and computes downstream to the Traceability Matrix. Without structural integration occurring here, Downstream RTM capabilities will manifest zero analytical capability."
      stats={
        <>
          <StatCard title="Total Instance Calls" value={totalTests} color="var(--accent-color)" icon={FlaskConical} />
          <StatCard title="Passed Assertions" value={passedTests} color="var(--success)" icon={CheckCircle2} />
          <StatCard title="Failed Exceptions" value={failedTests} color="var(--danger)" icon={XCircle} />
          <StatCard title="Pending Checks" value={pendingTests} color="var(--text-tertiary)" icon={Clock} />
        </>
      }
    >
      <div style={{ 
        padding: '24px 32px', 
        backgroundColor: 'var(--bg-surface)', 
        borderRadius: 'var(--radius-md)', 
        border: '1px solid var(--border-color)', 
        color: 'var(--text-primary)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', backgroundColor: 'var(--bg-card)', borderRadius: '50%' }}>
            <ShieldCheck size={32} color={coverageRatio === 100 ? 'var(--success)' : coverageRatio === 0 ? 'var(--danger)' : 'var(--warning)'} />
          </div>
          <div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>Parent Structural Coverage Integrity</h3>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>Metric: Active Requirements with Bound Validators</p>
          </div>
        </div>
        <div style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
          <span style={{ color: coverageRatio === 100 ? 'var(--success)' : coverageRatio === 0 ? 'var(--danger)' : 'var(--warning)' }}>{coverageRatio}%</span>
          <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)', fontWeight: '600', marginLeft: '8px' }}>({coveredReqsCount} / {totalReqs})</span>
        </div>
      </div>

      <SectionCard title="Validation Instance Constructor">
        <form onSubmit={handleAddTestCase} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Parent Requirement</label>
            <select 
              value={selectedReq} 
              onChange={(e) => setSelectedReq(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '1rem' }}
              required
            >
              <option value="" disabled>Awaiting valid structure link...</option>
              {requirements.map(req => (
                <option key={req._id} value={req._id}>[{req.priority}] {req.title}</option>
              ))}
            </select>
          </div>
          
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Test Instance Nomenclature</label>
            <input 
              type="text" 
              value={testName} 
              onChange={(e) => setTestName(e.target.value)} 
              placeholder="e.g., Verify invalid token authorization bounce" 
              required 
              style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '1rem', margin: 0 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sequential Test Environment Operations</label>
            <textarea 
              value={testSteps} 
              onChange={(e) => setTestSteps(e.target.value)} 
              placeholder="Draft simulated execution map line-by-line..." 
              required 
              style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', minHeight: '100px', resize: 'vertical', fontSize: '0.95rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Anticipated Console State Results</label>
            <textarea 
              value={testExpectedResult} 
              onChange={(e) => setTestExpectedResult(e.target.value)} 
              placeholder="State explicitly the acceptable structural outcome bounding condition." 
              required 
              style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', minHeight: '100px', resize: 'vertical', fontSize: '0.95rem' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px', marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Initial Return Code:</label>
              <select 
                value={testStatus} 
                onChange={(e) => setTestStatus(e.target.value)}
                style={{ padding: '10px 16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', fontWeight: '600' }}
              >
                <option value="Pending">Process: Pending</option>
                <option value="Pass">Process: Pass</option>
                <option value="Fail">Process: Fail</option>
              </select>
            </div>
            
            <Button type="submit" variant="primary">
              <Save size={18} /> Inject to Queue
            </Button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Global Execution Analytics Map">
        {testCases.length === 0 ? (
          <EmptyState 
            message="No functional instances initialized. Bind an operation against a requirement using the constructor interface." 
            iconName="check" 
          />
        ) : (
          <DataTable 
            columns={columns}
            data={testCases}
            renderRow={(tc) => (
              <tr key={tc._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}
                  onMouseOver={e=>e.currentTarget.style.backgroundColor='var(--bg-card-hover)'}
                  onMouseOut={e=>e.currentTarget.style.backgroundColor='transparent'}>
                <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  {tc.requirement ? <span style={{ fontWeight: '600' }}>{tc.requirement.title}</span> : <span style={{ color: 'var(--danger)', fontStyle: 'italic', padding: '4px 8px', backgroundColor: 'var(--danger-bg)', borderRadius: '4px' }}>Requirement Pointer Dereferenced</span>}
                </td>
                <td style={{ padding: '16px 24px', fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                  {tc.name}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <select
                    value={tc.status}
                    onChange={(e) => handleUpdateTestStatus(tc._id, e.target.value)}
                    style={{ 
                      padding: '8px 16px', 
                      border: `1px solid ${tc.status === 'Pass' ? 'rgba(16, 185, 129, 0.4)' : tc.status === 'Fail' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(161, 161, 170, 0.4)'}`, 
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      backgroundColor: tc.status === 'Pass' ? 'var(--success-bg)' : tc.status === 'Fail' ? 'var(--danger-bg)' : 'var(--bg-surface)',
                      color: tc.status === 'Pass' ? 'var(--success)' : tc.status === 'Fail' ? 'var(--danger)' : 'var(--text-secondary)',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    <option value="Pending">Queued :: Pending</option>
                    <option value="Pass">Verified :: Pass</option>
                    <option value="Fail">Exception :: Fail</option>
                  </select>
                </td>
              </tr>
            )}
          />
        )}
      </SectionCard>
    </ModuleLayout>
  );
}
