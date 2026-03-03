import { useOutletContext, useNavigate } from 'react-router-dom';

export default function ProjectOverview() {
  const { project, requirements, testCases, coveragePct } = useOutletContext();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#1a202c', marginBottom: '8px', fontWeight: '800', letterSpacing: '-0.025em' }}>
        {project?.name} Overview
      </h1>
      <p style={{ fontSize: '1.25rem', color: '#718096', marginBottom: '40px', lineHeight: '1.625', maxWidth: '800px' }}>
        Welcome to the enterprise project workspace. Here you can systematically analyze, plan, and trace requirements across the software development lifecycle.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '64px' }}>
        <div style={{ padding: '32px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', textAlign: 'center' }}>
          <div style={{ fontSize: '1rem', fontWeight: '600', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Total Requirements</div>
          <div style={{ fontSize: '4rem', fontWeight: '800', color: '#2b6cb0', lineHeight: 1 }}>{requirements.length}</div>
        </div>
        
        <div style={{ padding: '32px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', textAlign: 'center' }}>
          <div style={{ fontSize: '1rem', fontWeight: '600', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Total Test Cases</div>
          <div style={{ fontSize: '4rem', fontWeight: '800', color: '#805ad5', lineHeight: 1 }}>{testCases.length}</div>
        </div>

        <div style={{ padding: '32px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', textAlign: 'center' }}>
          <div style={{ fontSize: '1rem', fontWeight: '600', color: '#a0aec0', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>Test Coverage %</div>
          <div style={{ fontSize: '4rem', fontWeight: '800', color: coveragePct === 100 ? '#38a169' : coveragePct === 0 ? '#e53e3e' : '#dd6b20', lineHeight: 1 }}>{coveragePct}%</div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', color: '#2d3748', marginBottom: '24px', fontWeight: '700' }}>Module Navigation Context</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        <button 
          onClick={() => navigate('requirements')}
          style={{ padding: '24px', backgroundColor: '#ebf8fa', border: '1px solid #b2ebf2', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', outline: 'none' }}
        >
          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#00838f', marginBottom: '8px' }}>Requirements</div>
          <div style={{ fontSize: '1rem', color: '#006064' }}>Author and define project needs.</div>
        </button>
        
        <button 
          onClick={() => navigate('testcases')}
          style={{ padding: '24px', backgroundColor: '#f3e8ff', border: '1px solid #e9d8fd', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', outline: 'none' }}
        >
          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#6b46c1', marginBottom: '8px' }}>Test Cases</div>
          <div style={{ fontSize: '1rem', color: '#553c9a' }}>Draft and execute compliance procedures.</div>
        </button>

        <button 
          onClick={() => navigate('rtm')}
          style={{ padding: '24px', backgroundColor: '#e6fffa', border: '1px solid #b2f5ea', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s', outline: 'none' }}
        >
          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#2c7a7b', marginBottom: '8px' }}>RTM Analysis</div>
          <div style={{ fontSize: '1rem', color: '#234e52' }}>Analyze structural requirements traceability.</div>
        </button>
      </div>
    </div>
  );
}
