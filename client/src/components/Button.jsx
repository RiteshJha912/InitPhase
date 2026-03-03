import { Slot } from 'react'; // if using radix UI, else standard div
// fallback simple styled button

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: 'var(--radius-sm)',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    border: 'none',
    fontFamily: 'var(--font-body)',
  };
  
  const sizes = {
    sm: { padding: '6px 14px', fontSize: '0.875rem' },
    md: { padding: '10px 18px', fontSize: '0.95rem' },
    lg: { padding: '12px 24px', fontSize: '1.05rem' },
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--accent-color)',
      color: '#fff',
      boxShadow: 'var(--shadow-sm)',
    },
    secondary: {
      backgroundColor: 'var(--bg-card-hover)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-strong)',
    },
    danger: {
      backgroundColor: 'var(--danger-bg)',
      color: 'var(--danger)',
      border: '1px solid var(--danger)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-secondary)',
    }
  };

  const style = { ...baseStyle, ...sizes[size], ...variants[variant] };

  return (
    <button 
      style={style} 
      className={className}
      onMouseOver={(e) => {
        if(variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--accent-hover)';
        if(variant === 'secondary') e.currentTarget.style.backgroundColor = 'var(--border-strong)';
        if(variant === 'danger') e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
        if(variant === 'ghost') e.currentTarget.style.color = 'var(--text-primary)';
      }}
      onMouseOut={(e) => {
        if(variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--accent-color)';
        if(variant === 'secondary') e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)';
        if(variant === 'danger') e.currentTarget.style.backgroundColor = 'var(--danger-bg)';
        if(variant === 'ghost') e.currentTarget.style.color = 'var(--text-secondary)';
      }}
      {...props}
    >
      {children}
    </button>
  );
}
