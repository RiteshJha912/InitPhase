import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import SectionCard from '../components/SectionCard';
import EmptyState from '../components/EmptyState';

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
      const res = await fetch('http://localhost:5000/api/projects', {
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
      const res = await fetch('http://localhost:5000/api/projects', {
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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f0f4f8' }}>
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
          InitPhase Enterprise
        </div>
        <div>
          <button 
            onClick={handleLogout} 
            style={{ 
              backgroundColor: '#e53e3e', 
              color: '#fff', 
              border: 'none', 
              padding: '8px 24px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#c53030'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#e53e3e'}
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
          <div>
            <h1 style={{ margin: '0 0 12px 0', fontSize: '2.5rem', color: '#1a202c', fontWeight: '800', letterSpacing: '-0.025em' }}>Global Project Directory</h1>
            <p style={{ margin: 0, fontSize: '1.25rem', color: '#4a5568', maxWidth: '800px', lineHeight: '1.625' }}>
              Select a project workspace to begin authoring requirements, tracing compliance matrices, and executing validation tests.
            </p>
          </div>
          <button 
            onClick={() => { setShowForm(!showForm); setError(''); setName(''); setDescription(''); }}
            style={{ 
              backgroundColor: showForm ? '#e2e8f0' : '#2b6cb0', 
              color: showForm ? '#4a5568' : '#fff', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.2s',
              boxShadow: showForm ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.1)'
            }}
          >
            {showForm ? 'Cancel Creation' : '+ Initialize Project'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <StatCard title="Active Projects" value={projects.length} color="#3182ce" />
          <StatCard title="Global Status" value="Operational" color="#38a169" />
          <StatCard title="Access Level" value="Enterprise" color="#805ad5" />
        </div>

        {showForm && (
          <div style={{ marginBottom: '40px' }}>
            <SectionCard title="Initialize New Workspace">
              {error && (
                <div style={{ padding: '12px', backgroundColor: '#fed7d7', color: '#9b2c2c', borderRadius: '6px', marginBottom: '16px', fontWeight: '500' }}>
                  {error}
                </div>
              )}
              <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568' }}>Project Nomenclature</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                    placeholder="e.g., Nexus Payment Gateway Module"
                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568' }}>Executive Summary (Description)</label>
                  <input 
                    type="text" 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    placeholder="A brief academic overview of the project's structural goals."
                    style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e0', borderRadius: '6px', fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button type="submit" style={{ 
                    backgroundColor: '#38a169', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '12px 32px', 
                    borderRadius: '6px', 
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                  }}>
                    Deploy Workspace
                  </button>
                </div>
              </form>
            </SectionCard>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          {projects.length === 0 && !showForm ? (
            <div style={{ gridColumn: '1 / -1' }}>
              <EmptyState 
                message="No projects have been initialized yet. Click '+ Initialize Project' to build your first enterprise workspace." 
                icon="🏢" 
              />
            </div>
          ) : (
            projects.map(project => (
              <div key={project._id} style={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '12px', 
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'default'
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'; }}
              >
                <div>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '1.5rem', color: '#2d3748', fontWeight: '700' }}>{project.name}</h3>
                  <p style={{ margin: '0 0 24px 0', color: '#718096', lineHeight: '1.5', fontSize: '1rem' }}>
                    {project.description || 'No descriptive summary provided for this module.'}
                  </p>
                </div>
                <Link to={`/projects/${project._id}`} style={{ textDecoration: 'none' }}>
                  <button style={{ 
                    width: '100%', 
                    padding: '12px', 
                    backgroundColor: '#ebf8fa', 
                    color: '#00838f', 
                    border: '1px solid #b2ebf2', 
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={e => { e.currentTarget.style.backgroundColor = '#e0f7fa'; }}
                  onMouseOut={e => { e.currentTarget.style.backgroundColor = '#ebf8fa'; }}
                  >
                    Enter Workspace &rarr;
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
