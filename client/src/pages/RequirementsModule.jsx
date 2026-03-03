import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import ModuleLayout from '../components/ModuleLayout';
import StatCard from '../components/StatCard';
import SectionCard from '../components/SectionCard';
import DataTable from '../components/DataTable';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { Layers, ListTodo, AlertCircle, CheckCircle, Plus, Trash2 } from 'lucide-react';

export default function RequirementsModule() {
  const { projectId, requirements, fetchRequirements, fetchRtm } = useOutletContext();
  const [reqTitle, setReqTitle] = useState('');
  const [reqPriority, setReqPriority] = useState('Should-Have');
  const [filterPriority, setFilterPriority] = useState('All');

  const handleAddRequirement = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requirements/${projectId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ title: reqTitle, priority: reqPriority })
      });
      if (res.ok) {
        setReqTitle('');
        setReqPriority('Should-Have');
        fetchRequirements(token);
        fetchRtm(token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRequirement = async (reqId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/requirements/${reqId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchRequirements(token);
        fetchRtm(token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalReqs = requirements.length;
  const mustHave = requirements.filter(r => r.priority === 'Must-Have').length;
  const shouldHave = requirements.filter(r => r.priority === 'Should-Have').length;
  const niceToHave = requirements.filter(r => r.priority === 'Nice-to-Have').length;

  const filteredRequirements = filterPriority === 'All' 
    ? requirements 
    : requirements.filter(r => r.priority === filterPriority);

  const columns = [
    { label: 'Requirement (What your system should do)', width: 'auto' },
    { label: 'Priority', width: '200px' },
    { label: 'Action', width: '150px' }
  ];

  return (
    <ModuleLayout
      title="Requirements"
      description="Define what your software needs to do before you start building. List every feature, rule, or behavior your system must support."
      connectionText={"• Requirements are the foundation of your project - they describe WHAT your system should do.\n• Each requirement can be prioritized: Must-Have (essential), Should-Have (important), or Nice-to-Have (bonus).\n• Once you add requirements here, you can create test cases for them in the Test Cases module.\n• The Traceability Matrix will then show you which requirements have been tested and which haven't.\n• Think of requirements as a checklist of promises your software must keep."}
      stats={
        <>
          <StatCard title="Total Needs" value={totalReqs} color="var(--accent-color)" icon={Layers} />
          <StatCard title="Must-Have" value={mustHave} color="var(--danger)" icon={AlertCircle} />
          <StatCard title="Should-Have" value={shouldHave} color="var(--warning)" icon={ListTodo} />
          <StatCard title="Nice-to-Have" value={niceToHave} color="var(--success)" icon={CheckCircle} />
        </>
      }
    >
      <SectionCard title="Add a New Requirement">
        <form onSubmit={handleAddRequirement} className="mobile-flex-col" style={{ display: 'flex', gap: '16px', alignItems: 'stretch', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            value={reqTitle} 
            onChange={(e) => setReqTitle(e.target.value)} 
            placeholder="e.g., User must be able to log in with email and password" 
            required 
            style={{ 
              flex: 1, 
              padding: '12px 16px', 
              backgroundColor: 'var(--bg-base)',
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              margin: 0,
              minWidth: 0,
              width: '100%'
            }}
          />
          <select 
            value={reqPriority} 
            onChange={(e) => setReqPriority(e.target.value)}
            style={{ 
              padding: '12px 16px', 
              backgroundColor: 'var(--bg-base)',
              border: '1px solid var(--border-color)', 
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '1rem',
              minWidth: 0,
              width: '100%'
            }}
          >
            <option value="Must-Have">Must-Have (Critical)</option>
            <option value="Should-Have">Should-Have (High)</option>
            <option value="Nice-to-Have">Nice-to-Have (Low)</option>
          </select>
          <Button type="submit" variant="primary">
            <Plus size={18} /> Add Requirement
          </Button>
        </form>
      </SectionCard>

      <SectionCard 
        title="Your Requirements"
        actions={
          <select 
            value={filterPriority} 
            onChange={(e) => setFilterPriority(e.target.value)}
            style={{ 
              padding: '8px 12px', 
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)', 
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="All">Show All</option>
            <option value="Must-Have">Must-Have Only</option>
            <option value="Should-Have">Should-Have Only</option>
            <option value="Nice-to-Have">Nice-to-Have Only</option>
          </select>
        }
      >

        {filteredRequirements.length === 0 ? (
          <EmptyState 
            message={requirements.length === 0 ? "No requirements added yet. Use the form above to add your first requirement." : "No requirements match the selected filter."} 
            iconName="layers" 
          />
        ) : (
          <DataTable 
            columns={columns}
            data={filteredRequirements}
            renderRow={(req) => (
              <tr key={req._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}
                  onMouseOver={e=>e.currentTarget.style.backgroundColor='var(--bg-card-hover)'}
                  onMouseOut={e=>e.currentTarget.style.backgroundColor='transparent'}>
                <td style={{ padding: '16px 24px', fontSize: '1rem', color: 'var(--text-primary)' }}>{req.title}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    backgroundColor: req.priority === 'Must-Have' ? 'var(--danger-bg)' : req.priority === 'Should-Have' ? 'var(--warning-bg)' : 'var(--success-bg)',
                    color: req.priority === 'Must-Have' ? 'var(--danger)' : req.priority === 'Should-Have' ? 'var(--warning)' : 'var(--success)',
                    border: `1px solid ${req.priority === 'Must-Have' ? 'rgba(239, 68, 68, 0.4)' : req.priority === 'Should-Have' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
                  }}>
                    {req.priority === 'Must-Have' && <AlertCircle size={14} />}
                    {req.priority === 'Should-Have' && <ListTodo size={14} />}
                    {req.priority === 'Nice-to-Have' && <CheckCircle size={14} />}
                    {req.priority}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteRequirement(req._id)}>
                    <Trash2 size={16} /> Delete
                  </Button>
                </td>
              </tr>
            )}
          />
        )}
      </SectionCard>
    </ModuleLayout>
  );
}
