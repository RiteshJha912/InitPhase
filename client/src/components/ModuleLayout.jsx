import { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

export default function ModuleLayout({ title, description, connectionText, stats, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, minHeight: '100vh', padding: '0 0 40px 0', backgroundColor: 'var(--bg-base)', position: 'relative' }}>
      {/* Subtle Dashed Grid Background */}
      <div
        style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 0",
          maskImage: `
            repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px)
          `,
          WebkitMaskImage: `
            repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px)
          `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />

      {/* Heavy Enterprise Dark Header Component */}
      <div className="module-header-padding" style={{ 
        padding: '32px 40px', 
        backgroundColor: 'var(--bg-surface)', 
        borderBottom: '1px solid var(--border-color)', 
        boxShadow: 'var(--shadow-sm)',
        position: 'relative', zIndex: 1
      }}>
        <h1 style={{ margin: '0 0 12px 0', fontSize: '2.5rem', color: 'var(--text-primary)', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
          {title}
        </h1>
        <p style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '900px', lineHeight: '1.6' }}>
          {description}
        </p>

        {/* Collapsible Overview Panel */}
        {connectionText && (
          <div style={{ marginTop: '24px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                backgroundColor: isOpen ? 'var(--bg-card-hover)' : 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                outline: 'none'
              }}
              onMouseOver={e => !isOpen && (e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)')}
              onMouseOut={e => !isOpen && (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={18} color="var(--accent-color)" />
                How does this module work?
              </div>
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {isOpen && (
              <div className="animate-fade-in" style={{ padding: '24px', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {connectionText}
              </div>
            )}
          </div>
        )}
        
        {stats && (
          <div className="stat-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '24px', 
            marginTop: '32px' 
          }}>
            {stats}
          </div>
        )}
      </div>

      <div className="module-padding" style={{ padding: '0 40px', display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
