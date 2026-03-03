import { useOutletContext, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import StatCard from '../components/StatCard';
import SectionCard from '../components/SectionCard';
import Button from '../components/Button';
import { ListTodo, FlaskConical, Network } from 'lucide-react';

const COLORS = {
  'Must-Have': '#ef4444', 
  'Should-Have': '#f59e0b', 
  'Nice-to-Have': '#10b981',
  'Pass': '#10b981',
  'Fail': '#ef4444',
  'Pending': '#69717a'
};

export default function ProjectOverview() {
  const { project, requirements, testCases, coveragePct } = useOutletContext();
  const navigate = useNavigate();

  // Data mapping for charts
  const reqData = [
    { name: 'Must-Have', value: requirements.filter(r => r.priority === 'Must-Have').length },
    { name: 'Should-Have', value: requirements.filter(r => r.priority === 'Should-Have').length },
    { name: 'Nice-to-Have', value: requirements.filter(r => r.priority === 'Nice-to-Have').length },
  ].filter(d => d.value > 0);

  const tcData = [
    { name: 'Pass', value: testCases.filter(t => t.status === 'Pass').length },
    { name: 'Fail', value: testCases.filter(t => t.status === 'Fail').length },
    { name: 'Pending', value: testCases.filter(t => t.status === 'Pending').length },
  ].filter(d => d.value > 0);

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }} className="animate-fade-in module-container">
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
          Project Dashboard
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '800px' }}>
          A quick snapshot of your project's progress. Track your requirements, test cases, and overall coverage for <strong>{project?.name}</strong>.
        </p>
      </div>

      <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <StatCard title="Total Requirements" value={requirements.length} icon={ListTodo} color="var(--accent-color)" />
        <StatCard title="Total Test Cases" value={testCases.length} icon={FlaskConical} color="#a855f7" />
        <StatCard title="Requirement Coverage" value={`${coveragePct}%`} icon={Network} color={coveragePct === 100 ? '#10b981' : coveragePct === 0 ? '#ef4444' : '#f59e0b'} />
      </div>

      <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <SectionCard title="Requirements Distribution">
          <div style={{ width: '100%', height: '250px' }}>
            {reqData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={reqData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                    {reqData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name]} stroke="var(--bg-card)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }} 
                    itemStyle={{ color: 'var(--text-primary)' }} 
                    labelStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center', color: 'var(--text-tertiary)' }}>No distribution data</div>
            )}
          </div>
        </SectionCard>
        
        <SectionCard title="Test Results Overview">
          <div style={{ width: '100%', height: '250px' }}>
            {tcData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tcData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{fill: 'var(--text-secondary)'}} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
                    contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }} 
                    itemStyle={{ color: 'var(--text-primary)' }} 
                    labelStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {tcData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center', color: 'var(--text-tertiary)' }}>No execution data</div>
            )}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Quick Action Routes">
        <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          <div style={{ padding: '24px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ListTodo size={20} color="var(--accent-color)" /> Requirements
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.95rem' }}>Define what your system needs to do.</p>
            <Button variant="secondary" onClick={() => navigate('../requirements')}>Open Module</Button>
          </div>
          
          <div style={{ padding: '24px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FlaskConical size={20} color="#a855f7" /> Test Cases
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.95rem' }}>Write and run tests against your requirements.</p>
            <Button variant="secondary" onClick={() => navigate('../testcases')}>Open Module</Button>
          </div>

          <div style={{ padding: '24px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Network size={20} color="#10b981" /> Traceability Matrix
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.95rem' }}>See which requirements have tests and which don't.</p>
            <Button variant="secondary" onClick={() => navigate('../rtm')}>Open Module</Button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
