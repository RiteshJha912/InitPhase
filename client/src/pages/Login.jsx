import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ marginBottom: '16px', textAlign: 'center' }}>Login</h2>
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '16px' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div>
            <label style={{ fontWeight: 'bold' }}>Email: </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Password: </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" style={{ width: '100%', marginTop: '8px' }}>Login</button>
        </form>
        <p style={{ marginTop: '16px', textAlign: 'center' }}>
          Need an account? <Link to="/register" style={{ color: '#0066cc' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
