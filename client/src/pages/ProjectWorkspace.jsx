import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function ProjectWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('requirements');
  const [error, setError] = useState('');
  
  // Requirements State
  const [requirements, setRequirements] = useState([]);
  const [reqTitle, setReqTitle] = useState('');
  const [reqPriority, setReqPriority] = useState('Should-Have');

  // Test Cases State
  const [testCases, setTestCases] = useState([]);
  const [testName, setTestName] = useState('');
  const [testSteps, setTestSteps] = useState('');
  const [testExpectedResult, setTestExpectedResult] = useState('');
  const [testStatus, setTestStatus] = useState('Pending');
  const [selectedReq, setSelectedReq] = useState('');

  // RTM State
  const [rtmData, setRtmData] = useState([]);
  const [coveragePct, setCoveragePct] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProject(token);
    fetchRequirements(token);
    fetchTestCases(token);
    fetchRtm(token);
  }, [id, navigate]);

  const fetchProject = async (token) => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProject(data);
      } else {
        setError('Failed to load project or unauthorized.');
      }
    } catch (err) {
      setError('Error connecting to server.');
    }
  };

  const fetchRtm = async (token) => {
    try {
      const res = await fetch(`http://localhost:5000/api/rtm/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRtmData(data.rtmData);
        setCoveragePct(data.overallCoveragePercentage);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRequirements = async (token) => {
    try {
      const res = await fetch(`http://localhost:5000/api/requirements/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRequirements(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTestCases = async (token) => {
    try {
      const res = await fetch(`http://localhost:5000/api/testcases/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTestCases(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRequirement = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/requirements/${id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ title: reqTitle, priority: reqPriority })
      });
      if (res.ok) {
        setReqTitle('');
        setReqPriority('Should-Have');
        fetchRequirements(token);
        fetchRtm(token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRequirement = async (reqId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/requirements/${reqId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchRequirements(token);
        fetchRtm(token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTestCase = async (e) => {
    e.preventDefault();
    if (!selectedReq) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/testcases/${id}/${selectedReq}`, {
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

  const tabs = [
    { label: 'Requirements', key: 'requirements' },
    { label: 'Test Cases', key: 'testcases' },
    { label: 'RTM', key: 'rtm' }
  ];

  if (error) {
    return (
      <div className="container" style={{ marginTop: '40px' }}>
        <p style={{ color: 'red' }}>{error}</p>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container" style={{ marginTop: '40px' }}>
        <p>Loading project...</p>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/dashboard">InitPhase</Link>
        </div>
        <div style={{ fontWeight: 'bold' }}>{project.name} Workspace</div>
        <div>
          <button onClick={() => navigate('/dashboard')} style={{ backgroundColor: '#6c757d' }}>
            Back
          </button>
        </div>
      </nav>

      <div className="container" style={{ marginTop: '20px' }}>
        <h1 style={{ fontSize: '2rem' }}>{project.name}</h1>
        <p style={{ color: '#666', marginBottom: '24px' }}>{project.description}</p>

        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #ccc', paddingBottom: '8px', marginBottom: '24px' }}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                backgroundColor: activeTab === tab.key ? '#333' : 'transparent',
                color: activeTab === tab.key ? '#fff' : '#333',
                border: activeTab === tab.key ? 'none' : '1px solid #ccc'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="card" style={{ maxWidth: '100%', margin: 0, padding: '24px', textAlign: 'left' }}>
          {activeTab === 'requirements' && (
            <div>
              <h2 style={{ marginBottom: '16px' }}>Requirements</h2>
              <form onSubmit={handleAddRequirement} style={{ display: 'flex', gap: '8px', marginBottom: '24px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={reqTitle} 
                  onChange={(e) => setReqTitle(e.target.value)} 
                  placeholder="User Story" 
                  required 
                  style={{ flex: 1, margin: 0 }}
                />
                <select 
                  value={reqPriority} 
                  onChange={(e) => setReqPriority(e.target.value)}
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                  <option value="Must-Have">Must-Have</option>
                  <option value="Should-Have">Should-Have</option>
                  <option value="Nice-to-Have">Nice-to-Have</option>
                </select>
                <button type="submit" style={{ margin: 0 }}>Add</button>
              </form>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ccc' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>User Story</th>
                    <th style={{ padding: '12px', textAlign: 'left', width: '150px' }}>Priority</th>
                    <th style={{ padding: '12px', textAlign: 'left', width: '100px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requirements.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
                        No requirements added yet.
                      </td>
                    </tr>
                  ) : (
                    requirements.map((req) => (
                      <tr key={req._id} style={{ borderBottom: '1px solid #ccc' }}>
                        <td style={{ padding: '12px' }}>{req.title}</td>
                        <td style={{ padding: '12px' }}>{req.priority}</td>
                        <td style={{ padding: '12px' }}>
                          <button 
                            onClick={() => handleDeleteRequirement(req._id)}
                            style={{ backgroundColor: '#dc3545', padding: '4px 8px', fontSize: '0.9rem' }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'testcases' && (
            <div>
              <h2 style={{ marginBottom: '16px' }}>Test Cases</h2>
              <form onSubmit={handleAddTestCase} style={{ display: 'grid', gap: '8px', marginBottom: '24px' }}>
                <select 
                  value={selectedReq} 
                  onChange={(e) => setSelectedReq(e.target.value)}
                  style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  required
                >
                  <option value="" disabled>Select Requirement...</option>
                  {requirements.map(req => (
                    <option key={req._id} value={req._id}>{req.title}</option>
                  ))}
                </select>
                <input 
                  type="text" 
                  value={testName} 
                  onChange={(e) => setTestName(e.target.value)} 
                  placeholder="Test Name" 
                  required 
                  style={{ margin: 0 }}
                />
                <input 
                  type="text" 
                  value={testSteps} 
                  onChange={(e) => setTestSteps(e.target.value)} 
                  placeholder="Steps (e.g., 1. Open App 2. Click...)" 
                  required 
                  style={{ margin: 0 }}
                />
                <input 
                  type="text" 
                  value={testExpectedResult} 
                  onChange={(e) => setTestExpectedResult(e.target.value)} 
                  placeholder="Expected Result" 
                  required 
                  style={{ margin: 0 }}
                />
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select 
                    value={testStatus} 
                    onChange={(e) => setTestStatus(e.target.value)}
                    style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px', flex: 1 }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                  </select>
                  <button type="submit" style={{ margin: 0, padding: '8px 16px' }}>Add Test Case</button>
                </div>
              </form>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ccc' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Requirement</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Test Name</th>
                    <th style={{ padding: '12px', textAlign: 'left', width: '150px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {testCases.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
                        No test cases added yet.
                      </td>
                    </tr>
                  ) : (
                    testCases.map((tc) => (
                      <tr key={tc._id} style={{ borderBottom: '1px solid #ccc' }}>
                        <td style={{ padding: '12px' }}>{tc.requirement ? tc.requirement.title : 'Deleted Requirement'}</td>
                        <td style={{ padding: '12px' }}>{tc.name}</td>
                        <td style={{ padding: '12px' }}>
                          <select
                            value={tc.status}
                            onChange={(e) => handleUpdateTestStatus(tc._id, e.target.value)}
                            style={{ 
                              padding: '4px', 
                              border: '1px solid #ccc', 
                              borderRadius: '4px',
                              backgroundColor: tc.status === 'Pass' ? '#d4edda' : tc.status === 'Fail' ? '#f8d7da' : '#fff3cd'
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Pass">Pass</option>
                            <option value="Fail">Fail</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'rtm' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ margin: 0 }}>Requirements Traceability Matrix (RTM)</h2>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                  Overall Coverage: <span style={{ color: coveragePct < 100 ? '#dc3545' : '#28a745' }}>{coveragePct}%</span>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ccc' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Requirement</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Priority</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Total Tests</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Passed</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Failed</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Covered</th>
                  </tr>
                </thead>
                <tbody>
                  {rtmData.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
                        No RTM data to display. Create some requirements first.
                      </td>
                    </tr>
                  ) : (
                    rtmData.map((rtm) => {
                      const hasFailingTests = rtm.failed > 0;
                      const hasNoTests = rtm.totalTests === 0;
                      
                      let rowStyle = { borderBottom: '1px solid #ccc' };
                      if (hasFailingTests) rowStyle.backgroundColor = '#f8d7da';
                      else if (hasNoTests) rowStyle.backgroundColor = '#fff3cd';

                      return (
                        <tr key={rtm.requirementId} style={rowStyle}>
                          <td style={{ padding: '12px' }}>{rtm.title}</td>
                          <td style={{ padding: '12px' }}>{rtm.priority}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>{rtm.totalTests}</td>
                          <td style={{ padding: '12px', textAlign: 'center', color: rtm.passed > 0 ? '#28a745' : 'inherit' }}>{rtm.passed}</td>
                          <td style={{ padding: '12px', textAlign: 'center', color: rtm.failed > 0 ? '#dc3545' : 'inherit' }}>{rtm.failed}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            {rtm.coverage ? '✅' : '❌'}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
