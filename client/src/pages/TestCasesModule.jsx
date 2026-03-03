import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import ModuleLayout from '../components/ModuleLayout';
import StatCard from '../components/StatCard';
import SectionCard from '../components/SectionCard';
import DataTable from '../components/DataTable';
import EmptyState from '../components/EmptyState';

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
      const res = await fetch(`http://localhost:5000/api/testcases/${projectId}/${selectedReq}`, {
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
      const res = await fetch(`http://localhost:5000/api/testcases/${testId}/status`, {
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

  // Requirement coverage simple calc
  const coveredReqsCount = new Set(testCases.map(t => t.requirement ? t.requirement._id : null).filter(Boolean)).size;
  const totalReqs = requirements.length;
  const coverageRatio = totalReqs > 0 ? Math.round((coveredReqsCount / totalReqs) * 100) : 0;

  const columns = [
    { label: 'Requirement', width: '30%' },
    { label: 'Test Case Name', width: 'auto' },
    { label: 'Status', width: '200px' }
  ];

  return (
    <ModuleLayout
      title="Test Case Management Module"
      description="Quality Assurance subsystem for authoring, tracing, and executing test cases globally. Validate requirements against expected outcomes to ensure functional compliance."
      stats={
        <>
          <StatCard title="Total Test Cases" value={totalTests} color="#4299e1" />
          <StatCard title="Passed" value={passedTests} color="#48bb78" />
          <StatCard title="Failed" value={failedTests} color="#f56565" />
          <StatCard title="Pending" value={pendingTests} color="#ecc94b" />
        </>
      }
    >
      <div style={{ padding: '16px 24px', backgroundColor: '#ebf8fa', borderRadius: '8px', border: '1px solid #b2ebf2', color: '#006064', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>Requirement Coverage Indicator</h3>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>How many requirements have test cases mapped to them.</p>
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {coveredReqsCount} / {totalReqs} ({coverageRatio}%)
        </div>
      </div>

      <SectionCard title="Test Case Creation Console">
        <form onSubmit={handleAddTestCase} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#4a5568' }}>Select Requirement</label>
            <select 
              value={selectedReq} 
              onChange={(e) => setSelectedReq(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e0', borderRadius: '6px' }}
              required
            >
              <option value="" disabled>Select Requirement to validate...</option>
              {requirements.map(req => (
                <option key={req._id} value={req._id}>[{req.priority}] {req.title}</option>
              ))}
            </select>
          </div>
          
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#4a5568' }}>Test Case Name</label>
            <input 
              type="text" 
              value={testName} 
              onChange={(e) => setTestName(e.target.value)} 
              placeholder="e.g., Verify valid login credentials" 
              required 
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e0', borderRadius: '6px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#4a5568' }}>Execution Steps</label>
            <textarea 
              value={testSteps} 
              onChange={(e) => setTestSteps(e.target.value)} 
              placeholder="1. Open App 2. Click... 3. Enter..." 
              required 
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e0', borderRadius: '6px', minHeight: '80px', resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#4a5568' }}>Expected Result</label>
            <textarea 
              value={testExpectedResult} 
              onChange={(e) => setTestExpectedResult(e.target.value)} 
              placeholder="User is logged in successfully and redirected to dashboard." 
              required 
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e0', borderRadius: '6px', minHeight: '80px', resize: 'vertical' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontWeight: '500', color: '#4a5568' }}>Initial Status:</label>
              <select 
                value={testStatus} 
                onChange={(e) => setTestStatus(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #cbd5e0', borderRadius: '6px' }}
              >
                <option value="Pending">Pending</option>
                <option value="Pass">Pass</option>
                <option value="Fail">Fail</option>
              </select>
            </div>
            
            <button type="submit" style={{ 
              padding: '10px 24px', 
              backgroundColor: '#319795', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Commit Test Case
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Test Execution Dashboard">
        {testCases.length === 0 ? (
          <EmptyState 
            message="No test cases committed yet. Start by creating a test case against an existing requirement." 
            icon="🧪" 
          />
        ) : (
          <DataTable 
            columns={columns}
            data={testCases}
            renderRow={(tc) => (
              <tr key={tc._id} style={{ borderBottom: '1px solid #edf2f7', transition: 'background-color 0.2s' }}>
                <td style={{ padding: '16px 24px', color: '#4a5568', fontSize: '0.95rem' }}>
                  {tc.requirement ? tc.requirement.title : <span style={{ color: '#a0aec0', fontStyle: 'italic' }}>Deleted Requirement</span>}
                </td>
                <td style={{ padding: '16px 24px', fontSize: '1rem', color: '#2d3748', fontWeight: '500' }}>
                  {tc.name}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <select
                    value={tc.status}
                    onChange={(e) => handleUpdateTestStatus(tc._id, e.target.value)}
                    style={{ 
                      padding: '6px 16px', 
                      border: '1px solid #cbd5e0', 
                      borderRadius: '9999px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      backgroundColor: tc.status === 'Pass' ? '#c6f6d5' : tc.status === 'Fail' ? '#fed7d7' : '#fefcbf',
                      color: tc.status === 'Pass' ? '#22543d' : tc.status === 'Fail' ? '#9b2c2c' : '#b7791f',
                      outline: 'none'
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
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
