import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ marginBottom: '16px', textAlign: 'center' }}>Register</h2>
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '16px' }}>{error}</p>}
        <form onSubmit={handleRegister}>
          <div>
            <label style={{ fontWeight: 'bold' }}>Name: </label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Email: </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Password: </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" style={{ width: '100%', marginTop: '8px' }}>Register</button>
        </form>
        <p style={{ marginTop: '16px', textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: '#0066cc' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
