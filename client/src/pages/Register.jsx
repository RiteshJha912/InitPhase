import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Could not connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '14px 16px', backgroundColor: 'var(--bg-base)',
    border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)', fontSize: '1rem', boxSizing: 'border-box',
    transition: 'border-color 0.2s', outline: 'none'
  };

  const labelStyle = {
    display: 'block', marginBottom: '8px', fontWeight: '600',
    color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-base)' }}>
      {/* Nav */}
      <nav className="responsive-nav" style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)' }}>
        <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', transition: 'color 0.2s' }}
          onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
          <ArrowLeft size={16} /> Back to home
        </Link>
      </nav>
      
      {/* Form */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
        <div className="animate-fade-in" style={{ 
          width: '100%', maxWidth: '420px', backgroundColor: 'var(--bg-card)', padding: 'clamp(28px, 5vw, 44px)',
          borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' 
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--accent-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width={17} height={17} viewBox="0 0 24 24" fill="none"><path d="M4 6L11 12L4 18" stroke="#0f1115" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M13 18H20" stroke="#0f1115" strokeWidth="2.8" strokeLinecap="round" /></svg>
              </div>
              <span style={{ color: 'var(--text-primary)', fontSize: '1.3rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>InitPhase</span>
            </div>
          </div>

          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.8rem', marginBottom: '8px', textAlign: 'center', fontWeight: '800' }}>
            Create your account
          </h2>
          <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', marginBottom: '32px', fontSize: '0.95rem' }}>
            Start managing your projects in minutes.
          </p>
          
          {error && (
            <div style={{ padding: '12px 16px', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', marginBottom: '24px', fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="John Doe"
                required 
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
              />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="you@example.com"
                required 
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
              />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Create a strong password"
                required 
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
              />
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              style={{ 
                width: '100%', padding: '14px', marginTop: '4px', backgroundColor: loading ? 'var(--border-strong)' : 'var(--accent-color)', 
                color: '#0f1115', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '1rem', fontWeight: '600', 
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', gap: '8px'
              }}
              onMouseOver={e => !loading && (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
              onMouseOut={e => !loading && (e.currentTarget.style.backgroundColor = 'var(--accent-color)')}
            >
              <UserPlus size={18} /> {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ marginTop: '28px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-color)', fontWeight: '600', textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
