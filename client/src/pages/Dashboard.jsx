import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
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
        <h1 style={{ fontSize: '2rem' }}>Welcome to InitPhase Dashboard</h1>
        <p style={{ color: '#666', marginTop: '16px' }}>You are successfully logged in and authenticated!</p>
      </div>
    </div>
  );
}
