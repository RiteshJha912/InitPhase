import { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Circle, FileText, FlaskConical, GitMerge, LayoutDashboard, ListTodo, LogOut, Menu, Network, SearchCode, Sparkles, Ticket, X } from 'lucide-react';
import Button from '../components/Button';
import LoadingState from '../components/LoadingState';

export default function ProjectWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu and scroll content to top on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    // Specifically target the main content area in this layout
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname]);
  
  // Data states
  const [requirements, setRequirements] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [rtmData, setRtmData] = useState([]);
  const [coveragePct, setCoveragePct] = useState(0);
  const [sequenceFlows, setSequenceFlows] = useState([]);
  const [issues, setIssues] = useState([]);
  const [brds, setBrds] = useState([]);

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
    fetchSequenceFlows(token);
    fetchIssues(token);
    fetchBrds(token);
  }, [id, navigate]);

  const fetchProject = async (token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects/${id}`, {
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/rtm/${id}`, {
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requirements/${id}`, {
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/testcases/${id}`, {
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

  const fetchSequenceFlows = async (token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/sequence/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSequenceFlows(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchIssues = async (token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/issues/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setIssues(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBrds = async (token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/brds/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBrds(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-base)' }}>
        <p style={{ color: 'var(--danger)', fontSize: '1.25rem', marginBottom: '16px' }}>{error}</p>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  if (!project) {
    return <LoadingState title="Connecting to Workspace Core" message="Warming up the project flow..." />;
  }

  const openIssues = issues.filter((issue) => issue.status === 'Open').length;
  const criticalIssues = issues.filter((issue) => issue.priority === 'Critical' && issue.status !== 'Resolved' && issue.status !== 'Closed').length;
  const lifecycleSteps = [
    { key: 'overview', label: 'Overview', complete: true },
    { key: 'idea-brd', label: 'BRD', complete: brds.length > 0 },
    { key: 'requirements', label: 'Requirements', complete: requirements.length > 0 },
    { key: 'sequence', label: 'Flows', complete: sequenceFlows.length > 0 },
    { key: 'testcases', label: 'Tests', complete: testCases.length > 0 },
    { key: 'issues', label: 'Issues', complete: openIssues === 0 && criticalIssues === 0 },
    { key: 'rtm', label: 'Coverage', complete: coveragePct === 100 && requirements.length > 0 },
    { key: 'documentation', label: 'Docs', complete: requirements.length > 0 && coveragePct === 100 },
  ];
  const completedSteps = lifecycleSteps.filter((step) => step.complete).length;
  const healthLabel = criticalIssues > 0
    ? `${criticalIssues} critical blocker${criticalIssues === 1 ? '' : 's'}`
    : coveragePct === 100 && requirements.length > 0
      ? 'Ready for docs'
      : `${coveragePct}% covered`;

  const Badge = ({ complete }) => (
    <span style={{ marginLeft: 'auto', color: complete ? 'var(--success)' : 'var(--text-tertiary)', display: 'inline-flex' }}>
      {complete ? <CheckCircle2 size={15} /> : <Circle size={13} />}
    </span>
  );

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 24px',
    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
    backgroundColor: isActive ? 'var(--bg-card-hover)' : 'transparent',
    textDecoration: 'none',
    fontWeight: isActive ? '600' : '500',
    borderLeft: isActive ? '4px solid var(--accent-color)' : '4px solid transparent',
    transition: 'all 0.2s ease-in-out',
    margin: '4px 16px 4px 0',
    borderRadius: '0 var(--radius-md) var(--radius-md) 0'
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg-base)' }}>
      <nav className="responsive-nav" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0 32px', 
        backgroundColor: 'var(--bg-surface)', 
        borderBottom: '1px solid var(--border-color)',
        color: 'var(--text-primary)', 
        height: '64px', 
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.025em', fontFamily: 'var(--font-heading)' }}>
            <Link to="/dashboard" style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '24px', backgroundColor: 'var(--accent-color)', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width={14} height={14} viewBox="0 0 24 24" fill="none"><path d="M4 6L11 12L4 18" stroke="#0f1115" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M13 18H20" stroke="#0f1115" strokeWidth="2.8" strokeLinecap="round" /></svg></div>
              <span className="hide-on-mobile">InitPhase</span>
            </Link>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="hide-on-mobile" style={{ fontWeight: '700', color: criticalIssues > 0 ? 'var(--danger)' : coveragePct === 100 && requirements.length > 0 ? 'var(--success)' : 'var(--warning)', fontSize: '0.95rem', padding: '6px 16px', backgroundColor: 'var(--bg-card)', borderRadius: '9999px', border: '1px solid var(--border-color)' }}>
            {healthLabel}
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <LogOut size={16} /> <span className="hide-on-mobile">Back to Projects</span>
          </Button>
        </div>
      </nav>

      <div className="workspace-layout" style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
        )}

        {/* Left vertical sidebar */}
        <aside className={`workspace-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`} style={{ 
          width: '280px', 
          backgroundColor: 'var(--bg-surface)', 
          borderRight: '1px solid var(--border-color)',
          display: 'flex', 
          flexDirection: 'column', 
          paddingTop: '32px',
          zIndex: 50
        }}>
          <div className="sidebar-header" style={{ padding: '0 24px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', lineHeight: 1.2 }}>{project.name}</h2>
            <p style={{ margin: 0, marginTop: '8px', fontSize: '0.85rem', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>ID: {project._id}</p>
          </div>
          
          <div className="sidebar-header" style={{ padding: '0 24px', marginBottom: '16px', marginTop: '16px', color: 'var(--text-tertiary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
            Workspace Modules
          </div>
          
          <NavLink to="overview" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`} style={navLinkStyle}><LayoutDashboard size={20} className="module-icon" /> Dashboard <Badge complete /></NavLink>
          <NavLink to="idea-brd" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`} style={navLinkStyle}><Sparkles size={20} className="module-icon" /> Idea to BRD <Badge complete={brds.length > 0} /></NavLink>
          <NavLink to="requirements" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`} style={navLinkStyle}><ListTodo size={20} className="module-icon" /> Requirements <Badge complete={requirements.length > 0} /></NavLink>
          <NavLink to="sequence" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`} style={navLinkStyle}><GitMerge size={20} className="module-icon" /> Sequence Flow <Badge complete={sequenceFlows.length > 0} /></NavLink>
          <NavLink to="testcases" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`} style={navLinkStyle}><FlaskConical size={20} className="module-icon" /> Test Execution <Badge complete={testCases.length > 0} /></NavLink>
          <NavLink to="issues" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`} style={navLinkStyle}><Ticket size={20} className="module-icon" /> Issues <Badge complete={openIssues === 0 && criticalIssues === 0} /></NavLink>
          <NavLink to="rtm" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`} style={navLinkStyle}><Network size={20} className="module-icon" /> Analytics Matrix <Badge complete={coveragePct === 100 && requirements.length > 0} /></NavLink>
          <NavLink to="change-impact" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`} style={navLinkStyle}><SearchCode size={20} className="module-icon" /> Change Impact</NavLink>
          <NavLink to="documentation" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`} style={navLinkStyle}><FileText size={20} className="module-icon" /> Documentation <Badge complete={requirements.length > 0 && coveragePct === 100} /></NavLink>
        </aside>

        {/* Main Content Area */}
        <main style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--bg-base)' }}>
          <div className="workspace-flow-strip" style={{ padding: '14px 24px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', display: 'flex', alignItems: 'center', gap: '16px', overflowX: 'auto' }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
              Flow {completedSteps}/{lifecycleSteps.length}
            </div>
            {lifecycleSteps.map((step, index) => (
              <button
                key={step.key}
                type="button"
                onClick={() => navigate(step.key)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: '999px',
                  border: `1px solid ${step.complete ? 'rgba(16, 185, 129, 0.45)' : 'var(--border-color)'}`,
                  backgroundColor: step.complete ? 'var(--success-bg)' : 'var(--bg-card)',
                  color: step.complete ? 'var(--success)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {step.complete ? <CheckCircle2 size={14} /> : <Circle size={12} />}
                {index + 1}. {step.label}
              </button>
            ))}
          </div>
          <Outlet context={{ 
            projectId: id, 
            project, 
            brds,
            fetchBrds,
            requirements, 
            fetchRequirements, 
            testCases, 
            fetchTestCases, 
            rtmData, 
            fetchRtm, 
            coveragePct,
            sequenceFlows,
            fetchSequenceFlows,
            issues,
            fetchIssues
          }} />
        </main>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .module-icon { opacity: 0.7; transition: opacity 0.2s; }
        .active .module-icon { opacity: 1; color: var(--accent-color); }
      `}} />
    </div>
  );
}
