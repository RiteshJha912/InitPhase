import { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

export default function ModuleLayout({ title, description, connectionText, stats, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, minHeight: '100vh', padding: '0 0 40px 0', backgroundColor: 'var(--bg-base)' }}>
      {/* Heavy Enterprise Dark Header Component */}
      <div style={{ 
        padding: '32px 40px', 
        backgroundColor: 'var(--bg-surface)', 
        borderBottom: '1px solid var(--border-color)', 
        boxShadow: 'var(--shadow-sm)'
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
                Module Architectural Overview
              </div>
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {isOpen && (
              <div className="animate-fade-in" style={{ padding: '24px', borderTop: '1px solid var(--border-color)', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {connectionText}
              </div>
            )}
          </div>
        )}
        
        {stats && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '24px', 
            marginTop: '32px' 
          }}>
            {stats}
          </div>
        )}
      </div>

      <div style={{ padding: '0 40px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {children}
      </div>
    </div>
  );
}
