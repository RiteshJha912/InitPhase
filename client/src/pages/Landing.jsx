import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle, ListTodo, FlaskConical, Network, 
  AlertTriangle, ChevronDown, ChevronUp, Zap, Shield, Eye,
  FileText, BarChart3, Target, Heart, Github, Star,
  XCircle, RefreshCw, Plus
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
    @keyframes ringDraw {
      from { stroke-dashoffset: 251; }
      to { stroke-dashoffset: 0; }
    }
    @keyframes barGrow {
      from { width: 0%; }
    }
    @keyframes shimmerBorder {
      0% { border-color: rgba(255,255,255,0.06); }
      50% { border-color: rgba(255,255,255,0.14); }
      100% { border-color: rgba(255,255,255,0.06); }
    }
    @keyframes dotPulse {
      0%, 100% { opacity: 0.03; }
      50% { opacity: 0.07; }
    }
    @keyframes tickerSlide {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
    @keyframes glowPulse {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
    @keyframes countUp {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .hero-badge { animation: fadeInUp 0.6s ease-out 0.1s both; }
    .hero-title { animation: fadeInUp 0.6s ease-out 0.25s both; }
    .hero-desc { animation: fadeInUp 0.6s ease-out 0.4s both; }
    .hero-cta { animation: fadeInUp 0.6s ease-out 0.55s both; }
    .hero-terminal { animation: fadeInUp 0.8s ease-out 0.4s both; }
    .cta-glow-btn { animation: subtlePulse 3s ease-in-out infinite; }
    .dash-stat-card { animation: shimmerBorder 4s ease-in-out infinite; }
    .dash-stat-card:nth-child(2) { animation-delay: 0.5s; }
    .dash-stat-card:nth-child(3) { animation-delay: 1s; }
    .ring-progress { animation: ringDraw 1.8s ease-out 0.8s both; }
    .bar-anim { animation: barGrow 1.2s ease-out 0.6s both; }
    .ticker-track { animation: tickerSlide 20s linear infinite; }
    @media (max-width: 968px) {
      .landing-hero-grid {
        grid-template-columns: 1fr !important;
        gap: 32px !important;
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
        flex-direction: column !important;
        align-items: center !important;
        width: 100% !important;
      }
      .hero-cta button, .hero-cta a {
        width: 100% !important;
        justify-content: center !important;
      }
      .hero-glow {
        left: 50% !important;
        top: -100px !important;
        width: 400px !important;
        height: 400px !important;
      }
      .hero-glow-2 {
        display: none !important;
      }
    }
    @media (max-width: 640px) {
      .responsive-nav {
        padding: 12px 16px !important;
      }
      .hide-mobile {
        display: none !important;
      }
      .section-padding {
        padding: 48px 20px !important;
      }
      .hero-section {
        padding-top: 40px !important;
        padding-bottom: 40px !important;
      }
      .how-it-works-content {
        gap: 24px !important;
        padding-top: 10px !important;
      }
      .how-it-works-content::before {
        display: none !important;
      }
      .timeline-line {
        display: none !important;
      }
      .how-it-works-item {
        flex-direction: column !important;
        align-items: center !important;
        text-align: center !important;
        gap: 12px !important;
        padding: 20px 0 !important;
      }
      /* Centering content for mobile step details */
      .how-it-works-item > div {
        align-items: center !important;
        display: flex !important;
        flex-direction: column !important;
      }
      h2 {
        font-size: 1.8rem !important;
      }
      .landing-footer {
        flex-direction: column !important;
        text-align: center !important;
        gap: 24px !important;
      }
      .footer-links {
        flex-direction: column !important;
        width: 100% !important;
      }
    }
  `;

  /* SVG coverage ring helper */
  const coveragePercent = 100;
  const ringRadius = 40;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (coveragePercent / 100) * ringCircumference;

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
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <a href="https://github.com/RiteshJha912/InitPhase" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }} className="hide-mobile">
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
          <Link to="/login" style={{ textDecoration: 'none' }} className="hide-mobile">
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
      <section className="hero-section" style={{ 
        position: 'relative', overflow: 'hidden',
        padding: '24px 24px',
        minHeight: 'calc(100vh - 58px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* ── Crosshatch subtle background (dark mode, faded edges) ── */}
        <div style={{
          position: 'absolute', inset: 0, 
          backgroundImage: `
            repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(255,255,255,0.025) 2px, rgba(255,255,255,0.025) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 3px, transparent 3px, transparent 8px)
          `,
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)',
          pointerEvents: 'none'
        }} />

        {/* ── Primary radial glow ── */}
        <div className="hero-glow" style={{ 
          position: 'absolute', top: '-200px', left: '30%', transform: 'translateX(-50%)',
          width: '900px', height: '700px', 
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 65%)',
          pointerEvents: 'none'
        }} />

        {/* ── Secondary accent glow (right side, tinted) ── */}
        <div className="hero-glow-2" style={{ 
          position: 'absolute', top: '60px', right: '-120px',
          width: '600px', height: '500px', 
          background: 'radial-gradient(ellipse, rgba(168, 85, 247, 0.04) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />

        <div className="landing-hero-grid" style={{ maxWidth: '1060px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          
          {/* ══ LEFT: Text & CTA ══ */}
          <div>
            <div className="hero-badge" style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '5px 14px', backgroundColor: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9999px', 
              fontSize: '0.75rem', color: '#a1a1aa', marginBottom: '20px', fontWeight: '500'
            }}>
              <div style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981' }} />
              Open Source &amp; Free
            </div>

            <h1 className="hero-title" style={{ 
              fontSize: 'clamp(1.9rem, 3.8vw, 3.2rem)', fontWeight: '800', fontFamily: 'var(--font-heading)', 
              lineHeight: '1.08', letterSpacing: '-0.04em', color: '#fafafa', marginBottom: '18px'
            }}>
              Structure Your<br/>Software Projects.
            </h1>

            <p className="hero-desc" style={{ 
              fontSize: 'clamp(0.88rem, 1.3vw, 1rem)', color: '#a1a1aa', lineHeight: '1.65', 
              marginBottom: '28px', maxWidth: '400px'
            }}>
              Define requirements, write test cases, and generate a traceability matrix - the OOSE way. 
              Built for developers who want to ship software that actually works.
            </p>

            <div className="hero-cta" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button className="cta-glow-btn" style={{ 
                  padding: '11px 26px', backgroundColor: '#fafafa', color: '#09090b', 
                  border: 'none', borderRadius: '9px', display: 'flex', alignItems: 'center', gap: '7px',
                  fontSize: '0.88rem', fontWeight: '700', cursor: 'pointer', transition: 'transform 0.25s',
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  Start for Free <ArrowRight size={15} />
                </button>
              </Link>
              <a href="#how-it-works" style={{ textDecoration: 'none' }}>
                <button style={{ 
                  padding: '11px 24px', backgroundColor: 'transparent', color: '#a1a1aa', 
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: '9px', display: 'flex', alignItems: 'center', gap: '7px',
                  fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = '#fafafa'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#a1a1aa'; }}>
                  See How It Works
                </button>
              </a>
            </div>
          </div>

          {/* ══ RIGHT: Advanced Product Preview Dashboard ══ */}
          <div className="hero-terminal" style={{ minWidth: 0 }}>
            <div style={{ 
              backgroundColor: '#0d0d10', 
              border: '1px solid rgba(255,255,255,0.07)', 
              borderRadius: '14px', overflow: 'hidden', 
              boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03) inset',
              maxWidth: '100%',
            }}>
              {/* ── Window chrome ── */}
              <div style={{ 
                padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255,255,255,0.06)', 
                background: 'linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.01) 100%)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#ef4444', opacity: 0.7 }} />
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#f59e0b', opacity: 0.7 }} />
                  <div style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#10b981', opacity: 0.7 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#10b981', animation: 'glowPulse 2s ease-in-out infinite' }} />
                  <span style={{ fontSize: '0.58rem', color: '#52525b', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Live Preview</span>
                </div>
              </div>

              {/* ── Dashboard body ── */}
              <div style={{ padding: '12px' }}>
                {/* Project header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      width: '26px', height: '26px', borderRadius: '7px', 
                      background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(16,185,129,0.2))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      <Target size={12} color="#a1a1aa" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fafafa', fontFamily: 'var(--font-heading)' }}>E-Commerce Platform</div>
                      <div style={{ fontSize: '0.55rem', color: '#3f3f46' }}>Updated 2h ago - Sprint 4</div>
                    </div>
                  </div>
                  <div style={{ 
                    padding: '2px 8px', borderRadius: '9999px', fontSize: '0.52rem', fontWeight: '700',
                    backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)',
                    textTransform: 'uppercase', letterSpacing: '0.06em'
                  }}>On Track</div>
                </div>

                {/* ── Stat cards with shimmer ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '10px' }}>
                  {[
                    { label: 'Requirements', value: '12', sub: '+3 this sprint', color: '#e4e4e7' },
                    { label: 'Test Cases', value: '28', sub: '24 automated', color: '#a855f7' },
                    { label: 'Coverage', value: '100%', sub: 'All mapped', color: '#10b981' },
                  ].map((s, i) => (
                    <div className="dash-stat-card" key={i} style={{ 
                      padding: '7px 8px', 
                      backgroundColor: 'rgba(255,255,255,0.02)', 
                      border: '1px solid rgba(255,255,255,0.06)', 
                      borderRadius: '8px', 
                      textAlign: 'center',
                      transition: 'all 0.3s'
                    }}>
                      <div style={{ fontSize: '1rem', fontWeight: '800', color: s.color, fontFamily: 'var(--font-heading)', animation: 'countUp 0.8s ease-out both', animationDelay: `${0.3 + i * 0.15}s` }}>{s.value}</div>
                      <div style={{ fontSize: '0.52rem', color: '#52525b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '1px' }}>{s.label}</div>
                      <div style={{ fontSize: '0.48rem', color: '#3f3f46', marginTop: '2px' }}>{s.sub}</div>
                    </div>
                  ))}
                </div>

                {/* ── Two column layout: Coverage ring + Test results ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '6px', marginBottom: '8px' }}>
                  
                  {/* Coverage ring */}
                  <div style={{ 
                    padding: '10px 8px', backgroundColor: 'rgba(255,255,255,0.02)', 
                    border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: '4px'
                  }}>
                    <div style={{ position: 'relative', width: '56px', height: '56px' }}>
                      <svg width="56" height="56" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx="50" cy="50" r={ringRadius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7" />
                        <circle 
                          className="ring-progress"
                          cx="50" cy="50" r={ringRadius} fill="none" 
                          stroke="#10b981" strokeWidth="7" strokeLinecap="round"
                          strokeDasharray={ringCircumference}
                          strokeDashoffset={ringOffset}
                        />
                      </svg>
                      <div style={{ 
                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.78rem', fontWeight: '800', color: '#fafafa', fontFamily: 'var(--font-heading)'
                      }}>100%</div>
                    </div>
                    <div style={{ fontSize: '0.52rem', color: '#52525b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>RTM Coverage</div>
                  </div>

                  {/* Test execution breakdown */}
                  <div style={{ 
                    padding: '9px 10px', backgroundColor: 'rgba(255,255,255,0.02)', 
                    border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px',
                  }}>
                    <div style={{ fontSize: '0.54rem', fontWeight: '700', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '7px' }}>Test Execution</div>
                    {[
                      { label: 'Passed', count: 24, total: 28, color: '#10b981' },
                      { label: 'Failed', count: 1, total: 28, color: '#ef4444' },
                      { label: 'Pending', count: 3, total: 28, color: '#f59e0b' },
                    ].map((t, i) => (
                      <div key={i} style={{ marginBottom: i < 2 ? '6px' : 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                          <span style={{ fontSize: '0.58rem', color: '#71717a' }}>{t.label}</span>
                          <span style={{ fontSize: '0.55rem', color: t.color, fontWeight: '700' }}>{t.count}/{t.total}</span>
                        </div>
                        <div style={{ height: '3px', backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div className="bar-anim" style={{ 
                            height: '100%', backgroundColor: t.color, borderRadius: '9999px',
                            width: `${(t.count / t.total) * 100}%`,
                            animationDelay: `${0.6 + i * 0.2}s`
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Requirements Table (mini) ── */}
                <div style={{ 
                  marginBottom: '8px', backgroundColor: 'rgba(255,255,255,0.015)', 
                  border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', overflow: 'hidden'
                }}>
                  {/* Table header */}
                  <div style={{ 
                    display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '6px',
                    padding: '5px 10px', borderBottom: '1px solid rgba(255,255,255,0.04)',
                    backgroundColor: 'rgba(255,255,255,0.02)'
                  }}>
                    <span style={{ fontSize: '0.52rem', fontWeight: '700', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Requirement</span>
                    <span style={{ fontSize: '0.52rem', fontWeight: '700', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>Priority</span>
                    <span style={{ fontSize: '0.52rem', fontWeight: '700', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' }}>Tests</span>
                  </div>
                  {/* Table rows */}
                  {[
                    { name: 'User login with email/password', priority: 'Must-Have', pColor: '#ef4444', tests: 8 },
                    { name: 'Product search & filtering', priority: 'Must-Have', pColor: '#ef4444', tests: 6 },
                    { name: 'Shopping cart management', priority: 'Should-Have', pColor: '#f59e0b', tests: 9 },
                    { name: 'Order history page', priority: 'Nice-to-Have', pColor: '#10b981', tests: 5 },
                  ].map((r, i) => (
                    <div key={i} style={{ 
                      display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '6px', alignItems: 'center',
                      padding: '4px 10px', 
                      borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <CheckCircle size={9} color="#10b981" />
                        <span style={{ fontSize: '0.62rem', color: '#a1a1aa' }}>{r.name}</span>
                      </div>
                      <span style={{ 
                        fontSize: '0.5rem', fontWeight: '700', color: r.pColor, 
                        padding: '1px 6px', backgroundColor: `${r.pColor}12`, borderRadius: '9999px',
                        whiteSpace: 'nowrap'
                      }}>{r.priority}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', justifyContent: 'center' }}>
                        <FlaskConical size={8} color="#71717a" />
                        <span style={{ fontSize: '0.55rem', color: '#71717a', fontWeight: '600' }}>{r.tests}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Activity ticker ── */}
                <div style={{ 
                  marginBottom: '8px', overflow: 'hidden', borderRadius: '6px',
                  backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                  padding: '4px 0'
                }}>
                  <div className="ticker-track" style={{ display: 'flex', gap: '28px', whiteSpace: 'nowrap', width: 'max-content', alignItems: 'center' }}>
                    {[
                      { icon: CheckCircle, color: '#10b981', text: 'Test "Login redirect" passed' },
                      { icon: Plus, color: '#a855f7', text: 'Requirement "Wishlist" added' },
                      { icon: XCircle, color: '#ef4444', text: 'Test "Tax calc" failed' },
                      { icon: RefreshCw, color: '#f59e0b', text: 'Status changed to Pass' },
                      { icon: CheckCircle, color: '#10b981', text: 'Coverage reached 100%' },
                      { icon: CheckCircle, color: '#10b981', text: 'Test "Login redirect" passed' },
                      { icon: Plus, color: '#a855f7', text: 'Requirement "Wishlist" added' },
                      { icon: XCircle, color: '#ef4444', text: 'Test "Tax calc" failed' },
                      { icon: RefreshCw, color: '#f59e0b', text: 'Status changed to Pass' },
                      { icon: CheckCircle, color: '#10b981', text: 'Coverage reached 100%' },
                    ].map((item, i) => (
                      <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.6rem', color: '#3f3f46', fontWeight: '500' }}>
                        <item.icon size={10} color={item.color} />
                        {item.text}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ── Ship-ready footer ── */}
                <div style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '7px 10px', 
                  background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(16,185,129,0.03))', 
                  border: '1px solid rgba(16,185,129,0.15)', borderRadius: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={11} color="#10b981" />
                    <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: '600' }}>All requirements covered</span>
                  </div>
                  <span style={{ 
                    fontSize: '0.52rem', color: '#10b981', fontWeight: '700', 
                    padding: '2px 7px', backgroundColor: 'rgba(16,185,129,0.15)', borderRadius: '9999px',
                    letterSpacing: '0.04em', textTransform: 'uppercase'
                  }}>Ready to Ship</span>
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
      <section className="section-padding" style={{ padding: 'clamp(60px, 10vw, 100px) 24px' }}>
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
      <section id="how-it-works" className="section-padding" style={{ 
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
          <div className="how-it-works-content" style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
            {/* Vertical line - hidden on mobile via CSS class or handled via before */}
            <div className="timeline-line" style={{ 
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
                <div className="how-it-works-item" style={{ 
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
      <section className="section-padding" style={{ 
        padding: 'clamp(48px, 8vw, 100px) 24px',
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
      <section className="section-padding" style={{ 
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
      <footer className="landing-footer" style={{ 
        padding: '24px 32px', borderTop: '1px solid rgba(255,255,255,0.06)', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <InitPhaseMark size={20} />
            <span style={{ color: '#52525b', fontSize: '0.82rem' }}>&copy; 2026 InitPhase</span>
          </div>
        </div>
        
        <div className="footer-links" style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
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
            <Github size={14} /> Star on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
