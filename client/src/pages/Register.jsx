import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowLeft, Eye, EyeOff, ChevronRight } from 'lucide-react';
import registerBg from '../assets/register-bg-2.jpg';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
    outline: 'none',
  };

  const labelStyle = {
    display: 'none', // We'll use placeholders as labels for a cleaner look like the image
  };

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100vw',
      backgroundColor: '#000', 
      color: 'white',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: 'var(--font-body)'
    }}>
      {/* Left side: Image backdrop */}
      <div id="left-panel" style={{ 
        flex: 1.2, 
        position: 'relative', 
        overflow: 'hidden',
        padding: '40px'
      }}>
        <div className="bg-fade-in" style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url(${registerBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '24px',
          margin: '12px',
          opacity: 0.8
        }} />
        
        {/* Logo/Brand Overlay */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', backgroundColor: '#fff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none"><path d="M4 6L11 12L4 18" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><path d="M13 18H20" stroke="#000" strokeWidth="3" strokeLinecap="round" /></svg>
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: '700', letterSpacing: '-0.02em', color: '#fff' }}>InitPhase</span>
        </div>
      </div>

      {/* Right side: Form */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        position: 'relative'
      }}>
        {/* Back Button */}
        <Link to="/" style={{ 
          position: 'absolute', top: '40px', left: '40px',
          display: 'flex', alignItems: 'center', gap: '8px', 
          color: 'rgba(255, 255, 255, 0.5)', textDecoration: 'none', fontSize: '0.9rem',
          transition: 'color 0.2s'
        }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}>
          <ArrowLeft size={18} /> Back
        </Link>

        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '8px' }}>Sign up for free!</p>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '600', letterSpacing: '-0.03em', fontFamily: 'var(--font-heading)' }}>Join InitPhase</h1>
          </div>

          {error && (
            <div style={{ 
              padding: '12px 16px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', 
              borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center', 
              border: '1px solid rgba(239, 68, 68, 0.2)' 
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Full Name"
                required 
                style={inputStyle}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Email Address"
                required 
                style={inputStyle}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Password"
                required 
                style={inputStyle}
                onFocus={e => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ 
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.3)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              style={{ 
                width: '100%', padding: '14px', marginTop: '12px', backgroundColor: loading ? '#333' : '#fff', 
                color: '#000', border: 'none', borderRadius: '14px', fontSize: '1rem', fontWeight: '600', 
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', gap: '8px'
              }}
              onMouseOver={e => !loading && (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 10px 20px rgba(255, 255, 255, 0.1)')}
              onMouseOut={e => !loading && (e.currentTarget.style.transform = 'none', e.currentTarget.style.boxShadow = 'none')}
            >
              {loading ? 'Creating account...' : 'Start Building'} <ChevronRight size={18} />
            </button>
          </form>

          <p style={{ marginTop: '32px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#fff', fontWeight: '600', textDecoration: 'none' }}>
              Log in
            </Link>
          </p>


        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 1024px) {
          #left-panel { display: none !important; }
        }
        input::placeholder { color: rgba(255, 255, 255, 0.3); }
        .bg-fade-in {
          animation: bgFade 0.8s ease-out forwards;
        }
        @keyframes bgFade {
          from { opacity: 0; filter: blur(10px); }
          to { opacity: 0.8; filter: blur(0); }
        }
      `}} />
    </div>
  );
}
