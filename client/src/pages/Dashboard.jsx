import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import SectionCard from '../components/SectionCard';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { Target, Server, Shield, Box, PlusCircle } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProjects(token);
  }, [navigate]);

  const fetchProjects = async (token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, description })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        navigate(`/projects/${data._id}`);
      } else {
        setError(data.message || 'Error creating project');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-base)' }}>
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
        <div style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.025em', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', backgroundColor: 'var(--accent-color)', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width={14} height={14} viewBox="0 0 24 24" fill="none"><path d="M4 6L11 12L4 18" stroke="#0f1115" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M13 18H20" stroke="#0f1115" strokeWidth="2.8" strokeLinecap="round" /></svg></div>
          <span className="hide-on-mobile">InitPhase</span>
        </div>
        <div>
          <Button variant="danger" size="sm" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </nav>

      <div className="animate-fade-in module-padding" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div className="dashboard-header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div>
            <h1 style={{ margin: '0 0 12px 0', fontSize: '2.5rem', color: 'var(--text-primary)', fontWeight: '800', letterSpacing: '-0.025em', fontFamily: 'var(--font-heading)' }}>Your Projects</h1>
            <p style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: '1.6' }}>
              Select a project to manage its requirements, test cases, and traceability matrix.
            </p>
          </div>
          <Button 
            variant={showForm ? 'secondary' : 'primary'}
            onClick={() => { setShowForm(!showForm); setError(''); setName(''); setDescription(''); }}
          >
            {showForm ? 'Cancel' : <><PlusCircle size={18} /> New Project</>}
          </Button>
        </div>

        <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <StatCard title="Total Projects" value={projects.length} color="var(--accent-color)" icon={Target} />
          <StatCard title="Status" value="Online" color="var(--success)" icon={Server} />
          <StatCard title="Plan" value="Free" color="#a855f7" icon={Shield} />
        </div>

        {showForm && (
          <div style={{ marginBottom: '40px' }}>
            <SectionCard title="Create a New Project">
              {error && (
                <div style={{ padding: '12px', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontWeight: '500', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
                  {error}
                </div>
              )}
              <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                    placeholder="e.g., E-Commerce Platform"
                    style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description (optional)</label>
                  <input 
                    type="text" 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    placeholder="A short description of what this project is about."
                    style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <Button type="submit" variant="primary">
                    <Server size={18} /> Create Project
                  </Button>
                </div>
              </form>
            </SectionCard>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          {projects.length === 0 && !showForm ? (
            <div style={{ gridColumn: '1 / -1' }}>
              <EmptyState 
                message="No projects yet. Click 'New Project' above to create your first one." 
                iconName="layers" 
              />
            </div>
          ) : (
            projects.map(project => (
              <div key={project._id} style={{ 
                backgroundColor: 'var(--bg-card)', 
                border: '1px solid var(--border-color)', 
                borderRadius: 'var(--radius-md)', 
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-md)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default'
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.borderColor = 'var(--accent-color)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ padding: '8px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', color: 'var(--accent-color)' }}>
                      <Box size={24} />
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: '700', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{project.name}</h3>
                  </div>
                  <p style={{ margin: '0 0 24px 0', color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '1rem', paddingLeft: '44px' }}>
                    {project.description || 'No description provided.'}
                  </p>
                </div>
                <Link to={`/projects/${project._id}`} style={{ textDecoration: 'none' }}>
                  <button style={{ 
                    width: '100%', 
                    padding: '12px', 
                    backgroundColor: 'var(--bg-surface)', 
                    color: 'var(--accent-color)', 
                    border: '1px solid var(--border-color)', 
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'var(--font-heading)'
                  }}
                  onMouseOver={e => { e.currentTarget.style.backgroundColor = 'var(--accent-muted)'; e.currentTarget.style.borderColor = 'var(--accent-hover)'; }}
                  onMouseOut={e => { e.currentTarget.style.backgroundColor = 'var(--bg-surface)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                  >
                    Open Project &rarr;
                  </button>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
