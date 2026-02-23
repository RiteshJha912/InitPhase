import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
    <div>
      <nav className="navbar">
        <div className="navbar-brand">InitPhase</div>
        <div>
          <button onClick={handleLogout} style={{ backgroundColor: '#dc3545' }}>Logout</button>
        </div>
      </nav>
      
      <div className="container" style={{ marginTop: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem' }}>Your Projects</h1>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Create Project'}
          </button>
        </div>

        {showForm && (
          <div className="card" style={{ margin: '0 0 24px 0', maxWidth: '100%' }}>
            <h3>Create New Project</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleCreateProject}>
              <div>
                <label style={{ fontWeight: 'bold' }}>Name:</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div>
                <label style={{ fontWeight: 'bold' }}>Description:</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <button type="submit">Create</button>
            </form>
          </div>
        )}

        <div style={{ display: 'grid', gap: '16px' }}>
          {projects.length === 0 && !showForm ? (
            <p>You have no projects yet. Create one!</p>
          ) : (
            projects.map(project => (
              <div key={project._id} className="card" style={{ margin: 0, maxWidth: '100%' }}>
                <h3>{project.name}</h3>
                <p style={{ color: '#666', marginBottom: '16px' }}>{project.description}</p>
                <Link to={`/projects/${project._id}`}>
                  <button>Open Workspace</button>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
