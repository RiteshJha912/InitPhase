import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Ticket, AlertCircle, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import ModuleLayout from '../components/ModuleLayout';
import SectionCard from '../components/SectionCard';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import Button from '../components/Button';

export default function IssuesModule() {
  const { projectId } = useOutletContext();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Open',
    type: 'Task',
    assignedTo: ''
  });

  const fetchIssues = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/issues/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setIssues(data);
      } else {
        setError('Failed to fetch issues');
      }
    } catch (err) {
      setError('Server Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchIssues();
    }
  }, [projectId]);

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/issues/${projectId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const newIssue = await res.json();
        setIssues([newIssue, ...issues]);
        setShowForm(false);
        setFormData({ title: '', description: '', priority: 'Medium', status: 'Open', type: 'Task', assignedTo: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (issueId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/issues/${issueId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchIssues();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteIssue = async (issueId) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/issues/${issueId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setIssues(issues.filter(i => i._id !== issueId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Stats
  const openCount = issues.filter(i => i.status === 'Open').length;
  const inProgressCount = issues.filter(i => i.status === 'In Progress').length;
  const resolvedCount = issues.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;

  const stats = [
    <StatCard key="open" title="Total Open Issues" value={openCount} color="var(--danger)" icon={AlertCircle} />,
    <StatCard key="progress" title="Tasks In Progress" value={inProgressCount} color="var(--info)" icon={Clock} />,
    <StatCard key="resolved" title="Resolved Issues" value={resolvedCount} color="var(--success)" icon={CheckCircle2} />
  ];

  const getPriorityStyle = (priority) => {
    switch(priority) {
      case 'Critical': return { color: 'var(--danger)', fontWeight: 'bold' };
      case 'High': return { color: 'var(--warning)', fontWeight: 'bold' };
      case 'Medium': return { color: 'var(--info)' };
      case 'Low': return { color: 'var(--text-tertiary)' };
      default: return {};
    }
  };

  const getStatusBadge = (status) => {
    let bg = 'var(--bg-card-hover)', color = 'var(--text-secondary)';
    if (status === 'Open') { bg = 'rgba(239, 68, 68, 0.1)'; color = 'var(--danger)'; }
    if (status === 'In Progress') { bg = 'rgba(56, 187, 248, 0.1)'; color = 'var(--info)'; }
    if (status === 'Resolved' || status === 'Closed') { bg = 'rgba(34, 197, 94, 0.1)'; color = 'var(--success)'; }

    return (
      <span style={{ padding: '4px 12px', borderRadius: '9999px', backgroundColor: bg, color, fontSize: '0.75rem', fontWeight: 'bold' }}>
        {status}
      </span>
    );
  };

  const IssueCard = ({ issue }) => (
    <div 
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('issueId', issue._id);
      }}
      style={{ 
        backgroundColor: 'var(--bg-card)', 
        border: '1px solid var(--border-color)', 
        borderRadius: 'var(--radius-sm)', 
        padding: '16px',
        marginBottom: '16px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        cursor: 'grab'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: '600' }}>{issue.title}</h4>
        <Button variant="ghost" size="sm" onClick={() => handleDeleteIssue(issue._id)} style={{ padding: '4px', color: 'var(--text-tertiary)' }}>
          <Trash2 size={14} />
        </Button>
      </div>
      {issue.description && <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{issue.description}</p>}
      
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', padding: '2px 8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>{issue.type}</span>
        <span style={{ fontSize: '0.75rem', padding: '2px 8px', color: getPriorityStyle(issue.priority).color, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '4px', fontWeight: 'bold' }}>{issue.priority}</span>
        {issue.assignedTo && <span style={{ fontSize: '0.75rem', padding: '2px 8px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-secondary)' }}>@ {issue.assignedTo}</span>}
      </div>
    </div>
  );

  return (
    <ModuleLayout 
      title="Internal Issue Tracker"
      description="A lightweight task and bug tracker integrated directly into InitPhase to manage project deliverables."
      connectionText="Issues are linked directly to your current project. Use this module to track tasks, bugs, and enhancements without leaving your workspace."
      stats={stats}
    >
      <SectionCard 
        title="Issue Registry"
        actions={
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Create Issue'}
          </Button>
        }
      >
        <>
          {showForm && (
            <form onSubmit={handleCreateIssue} style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', marginBottom: '32px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Issue Title *</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s' }} />
                </div>
                <div style={{ flex: '1 1 300px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
                  <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', outline: 'none', transition: 'border-color 0.2s' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
                    <option>Task</option>
                    <option>Bug</option>
                    <option>Enhancement</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Priority</label>
                  <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', outline: 'none', cursor: 'pointer' }}>
                    <option>Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned To</label>
                  <input type="text" placeholder="Name or Email" value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})} style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', outline: 'none' }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <Button type="submit">Submit Issue</Button>
              </div>
            </form>
          )}

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading issues...</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
              {/* Open Column */}
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const issueId = e.dataTransfer.getData('issueId');
                  if (issueId) handleUpdateStatus(issueId, 'Open');
                }}
                style={{ backgroundColor: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', minHeight: '300px', border: '1px solid rgba(239, 68, 68, 0.2)' }}
              >
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '2px solid var(--danger)', paddingBottom: '8px' }}>
                  <AlertCircle size={18} color="var(--danger)" /> Open ({openCount})
                </h3>
                {issues.filter(i => i.status === 'Open').length === 0 ? <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', textAlign: 'center', marginTop: '32px' }}>Drop here</p> : null}
                {issues.filter(i => i.status === 'Open').map(issue => <IssueCard key={issue._id} issue={issue} />)}
              </div>

              {/* In Progress Column */}
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const issueId = e.dataTransfer.getData('issueId');
                  if (issueId) handleUpdateStatus(issueId, 'In Progress');
                }}
                style={{ backgroundColor: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', minHeight: '300px', border: '1px solid rgba(56, 187, 248, 0.2)' }}
              >
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '2px solid var(--info)', paddingBottom: '8px' }}>
                  <Clock size={18} color="var(--info)" /> In Progress ({inProgressCount})
                </h3>
                {issues.filter(i => i.status === 'In Progress').length === 0 ? <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', textAlign: 'center', marginTop: '32px' }}>Drop here</p> : null}
                {issues.filter(i => i.status === 'In Progress').map(issue => <IssueCard key={issue._id} issue={issue} />)}
              </div>

              {/* Resolved Column */}
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const issueId = e.dataTransfer.getData('issueId');
                  if (issueId) handleUpdateStatus(issueId, 'Resolved');
                }}
                style={{ backgroundColor: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', minHeight: '300px', border: '1px solid rgba(34, 197, 94, 0.2)' }}
              >
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', marginBottom: '16px', borderBottom: '2px solid var(--success)', paddingBottom: '8px' }}>
                  <CheckCircle2 size={18} color="var(--success)" /> Resolved ({resolvedCount})
                </h3>
                {issues.filter(i => i.status === 'Resolved' || i.status === 'Closed').length === 0 ? <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', textAlign: 'center', marginTop: '32px' }}>Drop here</p> : null}
                {issues.filter(i => i.status === 'Resolved' || i.status === 'Closed').map(issue => <IssueCard key={issue._id} issue={issue} />)}
              </div>
            </div>
          )}
        </>
      </SectionCard>
    </ModuleLayout>
  );
}
