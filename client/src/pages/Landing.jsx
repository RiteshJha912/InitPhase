import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle, ListTodo, FlaskConical, Network, 
  AlertTriangle, ChevronDown, ChevronUp, Zap, Shield, Eye,
  FileText, BarChart3, Target, Heart, Github, Star
} from 'lucide-react';

/* ═══════════ CUSTOM LOGO SVG ═══════════ */
function InitPhaseMark({ size = 28, dark = false }) {
  const bg = dark ? '#0f1115' : '#e4e4e7';
  const fg = dark ? '#e4e4e7' : '#0f1115';
  return (
    <div style={{ 
      width: `${size}px`, height: `${size}px`, backgroundColor: bg, borderRadius: `${size * 0.25}px`, 
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
        {/* Stylized ">_" terminal prompt — unique to InitPhase */}
        <path d="M4 6L12 12L4 18" stroke={fg} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14 18H20" stroke={fg} strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function InitPhaseLogo({ size = 28, fontSize = '1.2rem' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <InitPhaseMark size={size} />
      <span style={{ color: '#fafafa', fontSize, fontWeight: '800', fontFamily: 'var(--font-heading)' }}>InitPhase</span>
    </div>
  );
}

/* ═══════════ SCROLL ANIMATION HOOK ═══════════ */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}

function AnimatedSection({ children, delay = 0, style = {} }) {
  const [ref, isVisible] = useInView(0.1);
  return (
    <div ref={ref} style={{ 
      ...style,
      opacity: isVisible ? 1 : 0, 
      transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
      transition: `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}s, transform 0.7s cubic-bezier(0.4,0,0.2,1) ${delay}s`
    }}>
      {children}
    </div>
  );
}

/* ═══════════ MAIN COMPONENT ═══════════ */
export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'What is InitPhase and who is it for?',
      a: 'InitPhase is a structured project management tool designed for developers and students who want to follow Object-Oriented Software Engineering (OOSE) principles. If you\'re building software and want to properly document what it should do, test it, and track coverage - this is for you.'
    },
    {
      q: 'Do I need to know OOSE to use this?',
      a: 'Not at all. InitPhase is specifically designed for beginners. The app guides you through each step: first define requirements, then write test cases, and finally view your traceability matrix. Each module explains what it does in simple terms.'
    },
    {
      q: 'Is this free to use?',
      a: 'Yes, InitPhase is completely free. Create an account, start a project, and use all features without any restrictions or paywalls.'
    },
    {
      q: 'Can I use this for college assignments and portfolios?',
      a: 'Absolutely. InitPhase is perfect for academic projects where you need to demonstrate proper software engineering processes. It helps you create professional documentation that shows structured planning and testing.'
    },
    {
      q: 'What technologies does InitPhase use?',
      a: 'InitPhase is built with React on the frontend, Node.js/Express on the backend, and MongoDB as the database. It uses JWT authentication for secure access and is deployed on Vercel and Render.'
    }
  ];

  /* Inline keyframes for animations */
  const animationStyles = `
    @keyframes heroFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    @keyframes subtlePulse {
      0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.08); }
      50% { box-shadow: 0 0 30px rgba(255,255,255,0.14); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes gradientShift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    .hero-badge { animation: fadeInUp 0.6s ease-out 0.1s both; }
    .hero-title { animation: fadeInUp 0.6s ease-out 0.25s both; }
    .hero-desc { animation: fadeInUp 0.6s ease-out 0.4s both; }
    .hero-cta { animation: fadeInUp 0.6s ease-out 0.55s both; }
    .hero-terminal { animation: fadeInUp 0.8s ease-out 0.4s both; }
    .cta-glow-btn { animation: subtlePulse 3s ease-in-out infinite; }
    @media (max-width: 968px) {
      .landing-hero-grid {
        grid-template-columns: 1fr !important;
        gap: 40px !important;
        text-align: center;
      }
      .hero-title {
        margin-left: auto !important;
        margin-right: auto !important;
        max-width: 600px !important;
      }
      .hero-title br {
        display: none !important;
      }
      .hero-desc {
        margin-left: auto !important;
        margin-right: auto !important;
        max-width: 100% !important;
      }
      .hero-cta {
        justify-content: center !important;
      }
      .hero-glow {
        left: 50% !important;
        top: -150px !important;
        width: 600px !important;
        height: 600px !important;
      }
    }
  `;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#09090b', color: '#fafafa' }}>
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
      {/* ═══════════════ NAVBAR ═══════════════ */}
      <nav className="responsive-nav" style={{ 
        position: 'sticky', top: 0, zIndex: 100,
        padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backgroundColor: 'rgba(9, 9, 11, 0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)'
      }}>
        <InitPhaseLogo />
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <a href="https://github.com/RiteshJha912/InitPhase" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <button style={{ 
              padding: '7px 14px', backgroundColor: 'transparent', color: '#a1a1aa', 
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '0.8rem', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s' 
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#fafafa'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#a1a1aa'; }}>
              <Github size={14} /> <Star size={12} /> Star
            </button>
          </a>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button style={{ 
              padding: '7px 16px', backgroundColor: 'transparent', color: '#a1a1aa', 
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', 
              fontSize: '0.85rem', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s' 
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#fafafa'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#a1a1aa'; }}>
              Log In
            </button>
          </Link>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <button style={{ 
              padding: '7px 16px', backgroundColor: '#fafafa', color: '#09090b', 
              border: 'none', borderRadius: '8px', 
              fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' 
            }}
            onMouseOver={e => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseOut={e => { e.currentTarget.style.backgroundColor = '#fafafa'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section style={{ 
        position: 'relative', overflow: 'hidden',
        padding: 'clamp(60px, 10vw, 110px) 24px clamp(50px, 8vw, 90px)',
      }}>
        {/* Subtle radial glow */}
        <div className="hero-glow" style={{ 
          position: 'absolute', top: '-200px', left: '30%', transform: 'translateX(-50%)',
          width: '900px', height: '700px', 
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.035) 0%, transparent 65%)',
          pointerEvents: 'none'
        }} />

        <div className="landing-hero-grid" style={{ maxWidth: '1140px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          
          {/* ══ LEFT: Text & CTA ══ */}
          <div>
            <div className="hero-badge" style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 16px', backgroundColor: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9999px', 
              fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '28px', fontWeight: '500'
            }}>
              <div style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }} />
              Open Source &amp; Free
            </div>

            <h1 className="hero-title" style={{ 
              fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', fontWeight: '800', fontFamily: 'var(--font-heading)', 
              lineHeight: '1.08', letterSpacing: '-0.04em', color: '#fafafa', marginBottom: '24px'
            }}>
              Structure Your<br/>Software Projects.
            </h1>

            <p className="hero-desc" style={{ 
              fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', color: '#a1a1aa', lineHeight: '1.7', 
              marginBottom: '36px', maxWidth: '440px'
            }}>
              Define requirements, write test cases, and generate a traceability matrix : the OOSE way. 
              Built for developers who want to ship software that actually works.
            </p>

            <div className="hero-cta" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button className="cta-glow-btn" style={{ 
                  padding: '14px 30px', backgroundColor: '#fafafa', color: '#09090b', 
                  border: 'none', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px',
                  fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', transition: 'transform 0.25s',
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  Start for Free <ArrowRight size={16} />
                </button>
              </Link>
              <a href="#how-it-works" style={{ textDecoration: 'none' }}>
                <button style={{ 
                  padding: '14px 28px', backgroundColor: 'transparent', color: '#a1a1aa', 
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px',
                  fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = '#fafafa'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#a1a1aa'; }}>
                  See How It Works
                </button>
              </a>
            </div>
          </div>

          {/* ══ RIGHT: Product Preview Dashboard ══ */}
          <div className="hero-terminal">
            <div className="hero-terminal-inner" style={{ 
              backgroundColor: '#111113', border: '1px solid rgba(255,255,255,0.08)', 
              borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            }}>
              {/* Window header */}
              <div style={{ 
                padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444', opacity: 0.7 }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b', opacity: 0.7 }} />
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', opacity: 0.7 }} />
                </div>
                <span style={{ fontSize: '0.7rem', color: '#52525b', fontWeight: '600', letterSpacing: '0.05em' }}>INITPHASE DASHBOARD</span>
              </div>

              {/* Dashboard content */}
              <div style={{ padding: '20px' }}>
                {/* Project name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                  <div style={{ width: '28px', height: '28px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Target size={14} color="#a1a1aa" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fafafa', fontFamily: 'var(--font-heading)' }}>E-Commerce Platform</div>
                    <div style={{ fontSize: '0.7rem', color: '#52525b' }}>Last updated 2 hours ago</div>
                  </div>
                </div>

                {/* Stat pills row */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Requirements', value: '12', color: '#e4e4e7' },
                    { label: 'Test Cases', value: '28', color: '#a855f7' },
                    { label: 'Coverage', value: '100%', color: '#10b981' },
                  ].map((s, i) => (
                    <div key={i} style={{ 
                      flex: 1, minWidth: '80px', padding: '10px 12px', backgroundColor: 'rgba(255,255,255,0.03)', 
                      border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: '800', color: s.color, fontFamily: 'var(--font-heading)' }}>{s.value}</div>
                      <div style={{ fontSize: '0.6rem', color: '#52525b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '2px' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Mini requirements list */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Requirements</div>
                  {[
                    { name: 'User login with email/password', priority: 'Must-Have', pColor: '#ef4444' },
                    { name: 'Product search & filtering', priority: 'Must-Have', pColor: '#ef4444' },
                    { name: 'Shopping cart management', priority: 'Should-Have', pColor: '#f59e0b' },
                    { name: 'Order history page', priority: 'Nice-to-Have', pColor: '#10b981' },
                  ].map((r, i) => (
                    <div key={i} style={{ 
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                      padding: '7px 10px', borderRadius: '6px', marginBottom: '3px',
                      backgroundColor: i === 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
                      transition: 'background-color 0.2s'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={12} color="#10b981" />
                        <span style={{ fontSize: '0.78rem', color: '#a1a1aa' }}>{r.name}</span>
                      </div>
                      <span style={{ 
                        fontSize: '0.6rem', fontWeight: '700', color: r.pColor, 
                        padding: '2px 8px', backgroundColor: `${r.pColor}15`, borderRadius: '9999px',
                        whiteSpace: 'nowrap'
                      }}>{r.priority}</span>
                    </div>
                  ))}
                </div>

                {/* Test results bar */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: '700', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Test Results</div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '10px', flex: 1 }}>
                      {[
                        { label: 'Passed', count: 24, color: '#10b981' },
                        { label: 'Failed', count: 1, color: '#ef4444' },
                        { label: 'Pending', count: 3, color: '#f59e0b' },
                      ].map((t, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: t.color }} />
                          <span style={{ fontSize: '0.72rem', color: '#71717a' }}>{t.count} {t.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: '5px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '9999px', marginTop: '10px', overflow: 'hidden', display: 'flex' }}>
                    <div className="hero-progress-bar" style={{ width: '86%', backgroundColor: '#10b981', borderRadius: '9999px 0 0 9999px', transition: 'width 1.5s ease-out' }} />
                    <div style={{ width: '3.5%', backgroundColor: '#ef4444' }} />
                    <div style={{ width: '10.5%', backgroundColor: '#f59e0b', borderRadius: '0 9999px 9999px 0' }} />
                  </div>
                </div>

                {/* Coverage footer */}
                <div style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', backgroundColor: 'rgba(16, 185, 129, 0.06)', 
                  border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={14} color="#10b981" />
                    <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: '600' }}>All requirements covered</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#52525b', fontWeight: '500' }}>Ready to ship</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SOCIAL PROOF STRIP ═══════════════ */}
      <section style={{ 
        padding: '18px 24px',
        borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ 
          display: 'flex', justifyContent: 'center', gap: 'clamp(20px, 4vw, 48px)', flexWrap: 'wrap', 
          maxWidth: '800px', margin: '0 auto', alignItems: 'center'
        }}>
          {[
            { icon: CheckCircle, text: 'OOSE Compliant' },
            { icon: Zap, text: 'Free Forever' },
            { icon: Shield, text: 'Secure Auth' },
            { icon: Eye, text: 'Real-time Tracking' }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#71717a', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              <item.icon size={13} color="#52525b" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ PROBLEM SECTION ═══════════════ */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <AnimatedSection>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>
              The Problem
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', fontFamily: 'var(--font-heading)', fontWeight: '800', marginBottom: '24px', lineHeight: '1.2', letterSpacing: '-0.02em' }}>
              Most projects fail because nobody<br/>tracks what was actually built.
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#a1a1aa', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto 48px auto' }}>
              Developers jump straight into coding without documenting requirements. Tests are written randomly. 
              There's no way to know if the final product matches what was planned. Sound familiar?
            </p>
          </AnimatedSection>
          
          <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', textAlign: 'left' }}>
            {[
              { icon: AlertTriangle, title: 'No Written Requirements', desc: 'Features are discussed verbally and forgotten. There\'s no single source of truth.' },
              { icon: AlertTriangle, title: 'Random Testing', desc: 'Tests are written ad-hoc without linking them back to the actual requirements.' },
              { icon: AlertTriangle, title: 'Zero Traceability', desc: 'No one knows which features have been tested and which are shipping untested.' }
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div style={{ 
                  padding: '24px', backgroundColor: '#111113', border: '1px solid rgba(255,255,255,0.06)', 
                  borderRadius: '12px', transition: 'border-color 0.3s',
                  height: '100%', boxSizing: 'border-box'
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
                  <item.icon size={20} color="#ef4444" style={{ marginBottom: '12px' }} />
                  <h4 style={{ color: '#fafafa', fontSize: '1rem', fontWeight: '700', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>{item.title}</h4>
                  <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section id="how-it-works" style={{ 
        padding: 'clamp(60px, 10vw, 100px) 24px',
        borderTop: '1px solid rgba(255,255,255,0.04)'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <AnimatedSection>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>
                How It Works
              </div>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', fontFamily: 'var(--font-heading)', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2', letterSpacing: '-0.02em' }}>
                Three steps. One structured workflow.
              </h2>
              <p style={{ color: '#a1a1aa', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
                InitPhase guides you through the proper software engineering process - no prior knowledge required.
              </p>
            </div>
          </AnimatedSection>

          {/* Vertical timeline layout */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
            {/* Vertical line */}
            <div style={{ 
              position: 'absolute', left: '23px', top: '36px', bottom: '36px', width: '1px', 
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.04))'
            }} />

            {[
              {
                num: '01', icon: ListTodo, color: '#e4e4e7',
                title: 'Define Your Requirements',
                desc: 'Start by listing what your software needs to do. Each requirement gets a priority level - Must-Have, Should-Have, or Nice-to-Have.',
                detail: '"User must be able to log in" -> Must-Have'
              },
              {
                num: '02', icon: FlaskConical, color: '#a855f7',
                title: 'Write Test Cases',
                desc: 'For each requirement, create a test case. Describe the steps to test it and the expected result. Mark each test as Pass, Fail, or Pending.',
                detail: '"Enter wrong password -> Error shown" -> Pass'
              },
              {
                num: '03', icon: Network, color: '#10b981',
                title: 'View Your Traceability Matrix',
                desc: 'InitPhase auto-generates a matrix showing which requirements have tests and which don\'t. Your goal: 100% coverage before shipping.',
                detail: '12 requirements -> 28 tests -> 100% covered'
              }
            ].map((step, i) => (
              <AnimatedSection key={i} delay={i * 0.12}>
                <div style={{ 
                  display: 'flex', gap: '24px', padding: '28px 0', alignItems: 'flex-start'
                }}>
                  {/* Step circle on timeline */}
                  <div style={{ 
                    width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: '#111113', border: `2px solid ${step.color}40`,
                    position: 'relative', zIndex: 1
                  }}>
                    <step.icon size={20} color={step.color} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, paddingTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Step {step.num}</span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '700', fontFamily: 'var(--font-heading)', margin: '0 0 10px 0', color: '#fafafa' }}>{step.title}</h3>
                    <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: '1.7', margin: '0 0 14px 0' }}>{step.desc}</p>
                    <div style={{ 
                      display: 'inline-block', padding: '8px 14px', backgroundColor: 'rgba(255,255,255,0.04)', 
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
                      fontFamily: 'monospace', fontSize: '0.8rem', color: '#71717a'
                    }}>
                      {step.detail}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES SECTION ═══════════════ */}
      <section style={{ 
        padding: 'clamp(60px, 10vw, 100px) 24px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        backgroundColor: '#0c0c0e'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <AnimatedSection>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>
                Features
              </div>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)', fontFamily: 'var(--font-heading)', fontWeight: '800', marginBottom: '16px', lineHeight: '1.2', letterSpacing: '-0.02em' }}>
                Everything you need, nothing you don't.
              </h2>
            </div>
          </AnimatedSection>

          <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              { icon: FileText, title: 'Priority-Based Requirements', desc: 'Organize features into Must-Have, Should-Have, and Nice-to-Have categories to focus on what matters most.' },
              { icon: FlaskConical, title: 'Structured Test Cases', desc: 'Define test steps, expected results, and pass/fail status. Link every test directly to a requirement.' },
              { icon: BarChart3, title: 'Auto-Generated RTM', desc: 'Your traceability matrix is built automatically from your data. See gaps instantly without any manual work.' },
              { icon: Target, title: 'Coverage Tracking', desc: 'Know exactly what percentage of your requirements have been tested. Target: 100% before you ship.' },
              { icon: Eye, title: 'Visual Dashboard', desc: 'Charts and stats give you an instant project overview. Requirements distribution, test results - all at a glance.' },
              { icon: Shield, title: 'Secure & Private', desc: 'JWT authentication keeps your projects safe. Only you can see your data. No sharing, no leaks.' }
            ].map((f, i) => (
              <AnimatedSection key={i} delay={(i % 3) * 0.08}>
                <div style={{ 
                  padding: '28px', backgroundColor: '#111113', border: '1px solid rgba(255,255,255,0.06)', 
                  borderRadius: '14px', transition: 'all 0.3s', cursor: 'default', height: '100%', boxSizing: 'border-box'
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <f.icon size={22} color="#71717a" style={{ marginBottom: '16px' }} />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '8px', fontFamily: 'var(--font-heading)', color: '#e4e4e7' }}>{f.title}</h4>
                  <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>{f.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ SECTION ═══════════════ */}
      <section style={{ 
        padding: 'clamp(60px, 10vw, 100px) 24px',
        borderTop: '1px solid rgba(255,255,255,0.04)'
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <AnimatedSection>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' }}>
                FAQ
              </div>
              <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontFamily: 'var(--font-heading)', fontWeight: '800', lineHeight: '1.2', letterSpacing: '-0.02em' }}>
                Common questions, straight answers.
              </h2>
            </div>
          </AnimatedSection>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {faqs.map((faq, i) => (
              <AnimatedSection key={i} delay={i * 0.06}>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      backgroundColor: 'transparent', border: 'none', color: '#e4e4e7', fontSize: '1rem', fontWeight: '600',
                      cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)', transition: 'color 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.color = '#ffffff'}
                    onMouseOut={e => e.currentTarget.style.color = '#e4e4e7'}
                  >
                    <span style={{ paddingRight: '16px' }}>{faq.q}</span>
                    <div style={{ 
                      flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%', display: 'flex', 
                      alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)',
                      transition: 'transform 0.3s', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>
                      <ChevronDown size={16} color="#71717a" />
                    </div>
                  </button>
                  <div style={{ 
                    maxHeight: openFaq === i ? '200px' : '0', overflow: 'hidden',
                    transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1), padding 0.35s',
                    padding: openFaq === i ? '0 0 20px 0' : '0'
                  }}>
                    <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: '1.7', margin: 0 }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section style={{ 
        padding: 'clamp(60px, 10vw, 100px) 24px', textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ 
          position: 'absolute', bottom: '-100px', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '300px', 
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <AnimatedSection style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontFamily: 'var(--font-heading)', fontWeight: '800', 
            marginBottom: '16px', lineHeight: '1.15', letterSpacing: '-0.03em' 
          }}>
            Ready to build software<br/>the right way?
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '1.05rem', marginBottom: '36px', lineHeight: '1.6' }}>
            Create a free account and start structuring your project in under 2 minutes.
          </p>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <button className="cta-glow-btn" style={{ 
              padding: '16px 36px', backgroundColor: '#fafafa', color: '#09090b', 
              border: 'none', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '10px',
              fontSize: '1.05rem', fontWeight: '700', cursor: 'pointer', transition: 'transform 0.25s',
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              Get Started Free <ArrowRight size={18} />
            </button>
          </Link>
          <p style={{ marginTop: '16px', color: '#71717a', fontSize: '0.85rem' }}>
            No credit card required. No limits.
          </p>
        </AnimatedSection>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer style={{ 
        padding: '24px 32px', borderTop: '1px solid rgba(255,255,255,0.06)', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <InitPhaseMark size={20} />
            <span style={{ color: '#52525b', fontSize: '0.82rem' }}>&copy; 2026 InitPhase</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <span style={{ color: '#71717a', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
            Made with <Heart size={14} color="#ef4444" fill="#ef4444" /> by{' '}
            <a href="https://github.com/RiteshJha912" target="_blank" rel="noopener noreferrer" 
               style={{ color: '#a1a1aa', textDecoration: 'none', fontWeight: '600', transition: 'color 0.2s' }}
               onMouseOver={e => e.currentTarget.style.color = '#fafafa'}
               onMouseOut={e => e.currentTarget.style.color = '#a1a1aa'}>
              Ritesh Jha
            </a>
          </span>
          <a href="https://github.com/RiteshJha912/InitPhase" target="_blank" rel="noopener noreferrer"
             style={{ 
               color: '#71717a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px',
               fontSize: '0.85rem', fontWeight: '500', transition: 'all 0.2s',
               padding: '6px 12px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px'
             }}
             onMouseOver={e => { e.currentTarget.style.color = '#fafafa'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
             onMouseOut={e => { e.currentTarget.style.color = '#71717a'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
            <Github size={14} /> <Star size={12} /> Star on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
