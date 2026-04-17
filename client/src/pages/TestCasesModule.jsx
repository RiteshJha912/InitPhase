import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import ModuleLayout from '../components/ModuleLayout';
import StatCard from '../components/StatCard';
import SectionCard from '../components/SectionCard';
import DataTable from '../components/DataTable';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { FlaskConical, CheckCircle2, XCircle, Clock, Save, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

const TestCaseRow = ({ tc, handleUpdateTestStatus }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <tr 
        style={{ borderBottom: isExpanded ? 'none' : '1px solid var(--border-color)', transition: 'background-color 0.2s', cursor: 'pointer' }}
        onMouseOver={e=>e.currentTarget.style.backgroundColor='var(--bg-card-hover)'}
        onMouseOut={e=>e.currentTarget.style.backgroundColor='transparent'}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {tc.requirement ? <span style={{ fontWeight: '600' }}>{tc.requirement.title}</span> : <span style={{ color: 'var(--danger)', fontStyle: 'italic', padding: '4px 8px', backgroundColor: 'var(--danger-bg)', borderRadius: '4px' }}>Requirement Pointer Dereferenced</span>}
        </td>
        <td style={{ padding: '16px 24px', fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isExpanded ? <ChevronUp size={18} color="var(--accent-color)" /> : <ChevronDown size={18} color="var(--text-tertiary)" />}
          {tc.name}
        </td>
        <td style={{ padding: '16px 24px' }} onClick={e => e.stopPropagation()}>
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
            <option value="Pending">Pending</option>
            <option value="Pass">Pass</option>
            <option value="Fail">Fail</option>
          </select>
        </td>
      </tr>
      {isExpanded && (
        <tr style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-base)' }}>
          <td colSpan={3} style={{ padding: '0' }}>
            <div className="animate-fade-in" style={{ padding: '20px 24px 24px 48px', display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <h5 style={{ margin: '0 0 12px 0', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Steps to Perform</h5>
                <div style={{ padding: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                  {tc.steps || 'No steps provided.'}
                </div>
              </div>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <h5 style={{ margin: '0 0 12px 0', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expected Result</h5>
                <div style={{ padding: '16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>
                  {tc.expectedResult || 'No expected result provided.'}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

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
    { label: 'Linked Requirement', width: '30%' },
    { label: 'Test Case Name', width: 'auto' },
    { label: 'Status', width: '200px' }
  ];

  return (
    <ModuleLayout
      title="Test Cases"
      description="Write test cases to verify that each requirement actually works as expected. Link every test to a requirement so nothing gets missed."
      connectionText={"• Test cases prove that your software does what it's supposed to do.\n• Each test case is linked to a specific requirement from the Requirements module.\n• You describe the steps to perform and the expected result - like a recipe to verify functionality.\n• Mark tests as Pass, Fail, or Pending as you execute them.\n• The Traceability Matrix uses this data to show your overall project coverage.\n• A requirement without any test case means that feature has not been verified yet."}
      stats={
        <>
          <StatCard title="Total Tests" value={totalTests} color="var(--accent-color)" icon={FlaskConical} />
          <StatCard title="Passed" value={passedTests} color="var(--success)" icon={CheckCircle2} />
          <StatCard title="Failed" value={failedTests} color="var(--danger)" icon={XCircle} />
          <StatCard title="Pending" value={pendingTests} color="var(--text-tertiary)" icon={Clock} />
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
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>Requirement Coverage</h3>
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)' }}>How many requirements have at least one test case</p>
          </div>
        </div>
        <div style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
          <span style={{ color: coverageRatio === 100 ? 'var(--success)' : coverageRatio === 0 ? 'var(--danger)' : 'var(--warning)' }}>{coverageRatio}%</span>
          <span style={{ fontSize: '1rem', color: 'var(--text-tertiary)', fontWeight: '600', marginLeft: '8px' }}>({coveredReqsCount} / {totalReqs})</span>
        </div>
      </div>

      <SectionCard title="Create a Test Case">
        <form onSubmit={handleAddTestCase} className="stat-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select a Requirement to Test</label>
            <select 
              value={selectedReq} 
              onChange={(e) => setSelectedReq(e.target.value)}
              style={{ width: '100%', maxWidth: '100%', padding: '12px 16px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '1rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
              required
            >
              <option value="" disabled>Choose a requirement...</option>
              {requirements.map(req => (
                <option key={req._id} value={req._id}>
                  [{req.priority}] {req.title.length > 65 ? req.title.substring(0, 65) + '...' : req.title}
                </option>
              ))}
            </select>
          </div>
          
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Test Case Name</label>
            <input 
              type="text" 
              value={testName} 
              onChange={(e) => setTestName(e.target.value)} 
              placeholder="e.g., Check login with wrong password shows error" 
              required 
              style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '1rem', margin: 0 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Steps to Perform</label>
            <textarea 
              value={testSteps} 
              onChange={(e) => setTestSteps(e.target.value)} 
              placeholder="1. Go to login page\n2. Enter wrong password\n3. Click submit" 
              required 
              style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', minHeight: '100px', resize: 'vertical', fontSize: '0.95rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expected Result</label>
            <textarea 
              value={testExpectedResult} 
              onChange={(e) => setTestExpectedResult(e.target.value)} 
              placeholder="What should happen? e.g., Error message 'Invalid credentials' is displayed" 
              required 
              style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', minHeight: '100px', resize: 'vertical', fontSize: '0.95rem' }}
            />
          </div>

          <div className="mobile-flex-col" style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px', marginTop: '12px' }}>
            <div className="mobile-flex-col" style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
              <label style={{ fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Status:</label>
              <select 
                value={testStatus} 
                onChange={(e) => setTestStatus(e.target.value)}
                style={{ padding: '10px 16px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: 'var(--radius-sm)', fontWeight: '600' }}
              >
                <option value="Pending">Pending</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
              </select>
            </div>
            
            <div style={{ width: '100%' }}>
              <Button type="submit" variant="primary" style={{ width: '100%', justifyContent: 'center' }}>
                <Save size={18} /> Add Test Case
              </Button>
            </div>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="All Test Cases">
        {testCases.length === 0 ? (
          <EmptyState 
            message="No test cases created yet. Use the form above to create your first test case." 
            iconName="check" 
          />
        ) : (
          <DataTable 
            columns={columns}
            data={testCases}
            renderRow={(tc) => <TestCaseRow key={tc._id} tc={tc} handleUpdateTestStatus={handleUpdateTestStatus} />}
          />
        )}
      </SectionCard>
    </ModuleLayout>
  );
}
