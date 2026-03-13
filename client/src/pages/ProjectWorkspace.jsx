import { useState, useEffect } from 'react';
import { useParams, useNavigate, NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTodo, FlaskConical, Network, LogOut, LoaderCircle, Menu, X, GitMerge } from 'lucide-react';
import Button from '../components/Button';

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

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-base)' }}>
        <p style={{ color: 'var(--danger)', fontSize: '1.25rem', marginBottom: '16px' }}>{error}</p>
        <Button variant="secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)' }}>
        <LoaderCircle size={48} className="animate-spin" style={{ animation: 'spin 1.5s linear infinite' }} />
        <p style={{ marginTop: '16px', fontFamily: 'var(--font-heading)' }}>Connecting to Workspace Core...</p>
      </div>
    );
  }

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
          <div className="hide-on-mobile" style={{ fontWeight: '500', color: 'var(--text-secondary)', fontSize: '0.95rem', padding: '6px 16px', backgroundColor: 'var(--bg-card)', borderRadius: '9999px', border: '1px solid var(--border-color)' }}>
            Active
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
          
          <NavLink to="overview" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`} style={navLinkStyle}><LayoutDashboard size={20} className="module-icon" /> Dashboard</NavLink>
          <NavLink to="requirements" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`} style={navLinkStyle}><ListTodo size={20} className="module-icon" /> Requirements</NavLink>
          <NavLink to="sequence" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`} style={navLinkStyle}><GitMerge size={20} className="module-icon" /> Sequence Flow</NavLink>
          <NavLink to="testcases" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`} style={navLinkStyle}><FlaskConical size={20} className="module-icon" /> Test Execution</NavLink>
          <NavLink to="rtm" className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`} style={navLinkStyle}><Network size={20} className="module-icon" /> Analytics Matrix</NavLink>
        </aside>

        {/* Main Content Area */}
        <main style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--bg-base)' }}>
          <Outlet context={{ 
            projectId: id, 
            project, 
            requirements, 
            fetchRequirements, 
            testCases, 
            fetchTestCases, 
            rtmData, 
            fetchRtm, 
            coveragePct,
            sequenceFlows,
            fetchSequenceFlows 
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
