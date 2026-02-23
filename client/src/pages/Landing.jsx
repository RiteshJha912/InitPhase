import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/">InitPhase</Link>
        </div>
        <div>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      </nav>

      <div className="container" style={{ textAlign: 'center', marginTop: '60px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Welcome to InitPhase</h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>
          This is a simple landing page.
        </p>
      </div>
    </div>
  );
}
