import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import ModuleLayout from '../components/ModuleLayout';
import StatCard from '../components/StatCard';
import SectionCard from '../components/SectionCard';
import DataTable from '../components/DataTable';
import EmptyState from '../components/EmptyState';

export default function RequirementsModule() {
  const { projectId, requirements, fetchRequirements, fetchRtm } = useOutletContext();
  const [reqTitle, setReqTitle] = useState('');
  const [reqPriority, setReqPriority] = useState('Should-Have');
  const [filterPriority, setFilterPriority] = useState('All');

  const handleAddRequirement = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/requirements/${projectId}`, {
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
      const res = await fetch(`http://localhost:5000/api/requirements/${reqId}`, {
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
    { label: 'User Story', width: 'auto' },
    { label: 'Priority', width: '200px' },
    { label: 'Action', width: '150px' }
  ];

  return (
    <ModuleLayout
      title="Requirements Management Module"
      description="Centralized repository for eliciting, analyzing, and documenting system requirements. Ensure all stakeholder needs are captured, prioritized, and tracked effectively throughout the project lifecycle."
      stats={
        <>
          <StatCard title="Total Requirements" value={totalReqs} color="#4299e1" />
          <StatCard title="Must-Have" value={mustHave} color="#f56565" />
          <StatCard title="Should-Have" value={shouldHave} color="#ed8936" />
          <StatCard title="Nice-to-Have" value={niceToHave} color="#48bb78" />
        </>
      }
    >
      <SectionCard title="Requirement Authoring Interface">
        <form onSubmit={handleAddRequirement} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <input 
            type="text" 
            value={reqTitle} 
            onChange={(e) => setReqTitle(e.target.value)} 
            placeholder="Enter User Story..." 
            required 
            style={{ 
              flex: 1, 
              padding: '12px 16px', 
              border: '1px solid #cbd5e0', 
              borderRadius: '6px',
              fontSize: '1rem',
              margin: 0
            }}
          />
          <select 
            value={reqPriority} 
            onChange={(e) => setReqPriority(e.target.value)}
            style={{ 
              padding: '12px 16px', 
              border: '1px solid #cbd5e0', 
              borderRadius: '6px',
              fontSize: '1rem',
              minWidth: '150px'
            }}
          >
            <option value="Must-Have">Must-Have</option>
            <option value="Should-Have">Should-Have</option>
            <option value="Nice-to-Have">Nice-to-Have</option>
          </select>
          <button type="submit" style={{ 
            padding: '12px 24px', 
            backgroundColor: '#2b6cb0', 
            color: 'white', 
            border: 'none', 
            borderRadius: '6px', 
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            margin: 0
          }}>
            Author Requirement
          </button>
        </form>
      </SectionCard>

      <SectionCard title="Requirement Repository">
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
          <select 
            value={filterPriority} 
            onChange={(e) => setFilterPriority(e.target.value)}
            style={{ 
              padding: '8px 12px', 
              border: '1px solid #cbd5e0', 
              borderRadius: '6px',
              fontSize: '0.9rem'
            }}
          >
            <option value="All">Filter by Priority: All</option>
            <option value="Must-Have">Must-Have</option>
            <option value="Should-Have">Should-Have</option>
            <option value="Nice-to-Have">Nice-to-Have</option>
          </select>
        </div>

        {filteredRequirements.length === 0 ? (
          <EmptyState 
            message={requirements.length === 0 ? "No requirements have been authored yet. Start by adding a user story above." : "No requirements match the selected filter."} 
            icon="📝" 
          />
        ) : (
          <DataTable 
            columns={columns}
            data={filteredRequirements}
            renderRow={(req) => (
              <tr key={req._id} style={{ borderBottom: '1px solid #edf2f7', transition: 'background-color 0.2s' }}>
                <td style={{ padding: '16px 24px', fontSize: '1rem', color: '#2d3748' }}>{req.title}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    backgroundColor: req.priority === 'Must-Have' ? '#fed7d7' : req.priority === 'Should-Have' ? '#feebc8' : '#c6f6d5',
                    color: req.priority === 'Must-Have' ? '#9b2c2c' : req.priority === 'Should-Have' ? '#9c4221' : '#22543d'
                  }}>
                    {req.priority}
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <button 
                    onClick={() => handleDeleteRequirement(req._id)}
                    style={{ 
                      backgroundColor: 'transparent', 
                      color: '#e53e3e',
                      border: '1px solid #e53e3e',
                      padding: '6px 12px', 
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )}
          />
        )}
      </SectionCard>
    </ModuleLayout>
  );
}
