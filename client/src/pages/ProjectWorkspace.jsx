import { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink, Outlet, Link } from 'react-router-dom';

export default function ProjectWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  
  // Data states
  const [requirements, setRequirements] = useState([]);
  const [testCases, setTestCases] = useState([]);
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

  if (error) {
    return (
      <div className="container" style={{ marginTop: '40px' }}>
        <p style={{ color: '#e53e3e', fontSize: '1.25rem' }}>{error}</p>
        <Link to="/dashboard" style={{ color: '#3182ce', textDecoration: 'underline' }}>Back to Dashboard</Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f7fafc', fontSize: '1.5rem', color: '#718096' }}>
        loading enterprise workspace...
      </div>
    );
  }

  const navLinkStyle = ({ isActive }) => ({
    display: 'block',
    padding: '12px 24px',
    color: isActive ? '#fff' : '#a0aec0',
    backgroundColor: isActive ? '#2d3748' : 'transparent',
    textDecoration: 'none',
    fontWeight: isActive ? '600' : '400',
    borderLeft: isActive ? '4px solid #63b3ed' : '4px solid transparent',
    transition: 'all 0.2s ease-in-out',
    marginBottom: '8px',
    borderRadius: '0 8px 8px 0',
    marginRight: '16px'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', backgroundColor: '#f0f4f8' }}>
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0 32px', 
        backgroundColor: '#1a202c', 
        color: '#fff', 
        height: '64px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        zIndex: 10
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.025em' }}>
          <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>InitPhase</Link>
        </div>
        <div style={{ fontWeight: '600', color: '#cbd5e0', fontSize: '1.1rem' }}>
          {project.name} Workspace
        </div>
        <div>
          <button 
            onClick={() => navigate('/dashboard')} 
            style={{ 
              backgroundColor: '#4a5568', 
              color: '#fff', 
              border: 'none', 
              padding: '8px 24px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#2d3748'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#4a5568'}
          >
            Exit Workspace
          </button>
        </div>
      </nav>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left vertical sidebar */}
        <aside style={{ 
          width: '280px', 
          backgroundColor: '#1a202c', 
          display: 'flex', 
          flexDirection: 'column', 
          paddingTop: '32px',
          boxShadow: '4px 0 6px -1px rgba(0, 0, 0, 0.1)',
          zIndex: 5
        }}>
          <div style={{ padding: '0 24px', marginBottom: '32px', color: '#718096', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
            Modules
          </div>
          
          <NavLink to="overview" style={navLinkStyle}>Overview</NavLink>
          <NavLink to="requirements" style={navLinkStyle}>Requirements Module</NavLink>
          <NavLink to="testcases" style={navLinkStyle}>Test Case Module</NavLink>
          <NavLink to="rtm" style={navLinkStyle}>RTM Module</NavLink>
        </aside>

        {/* Main Content Area */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet context={{ 
            projectId: id, 
            project, 
            requirements, 
            fetchRequirements, 
            testCases, 
            fetchTestCases, 
            rtmData, 
            fetchRtm, 
            coveragePct 
          }} />
        </main>
      </div>
    </div>
  );
}
