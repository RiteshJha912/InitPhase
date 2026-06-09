import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import ModuleLayout from '../components/ModuleLayout';
import SectionCard from '../components/SectionCard';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import FlowCallout from '../components/FlowCallout';
import LoadingState from '../components/LoadingState';
import { useToast } from '../components/useToast';
import { ArrowRight, BrainCircuit, CheckCircle, FileText, Layers, LoaderCircle, Sparkles, Trash2, Wand2 } from 'lucide-react';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  backgroundColor: 'var(--bg-base)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text-primary)',
  fontSize: '0.95rem',
  outline: 'none',
  fontFamily: 'var(--font-body)',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  color: 'var(--text-secondary)',
  fontSize: '0.85rem',
  fontWeight: 700,
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const defaultForm = {
  title: '',
  sourceIdea: '',
  targetUsers: '',
  businessGoals: '',
  constraints: '',
};

const SectionList = ({ items }) => {
  if (!items || items.length === 0) return <p style={{ color: 'var(--text-tertiary)', margin: 0 }}>Not specified.</p>;

  return (
    <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
      {items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
    </ul>
  );
};

const BrdPreview = ({ brd }) => {
  if (!brd) return null;

  const sections = brd.sections || {};

  return (
    <div style={{ display: 'grid', gap: '18px' }}>
      <div style={{ display: 'grid', gap: '8px' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.35rem' }}>{brd.title}</h3>
        <p style={{ margin: 0, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>{brd.sourceIdea}</p>
      </div>

      {[
        ['Executive Summary', sections.executiveSummary],
        ['Problem Statement', sections.problemStatement],
      ].map(([title, value]) => (
        <div key={title}>
          <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>{title}</h4>
          <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{value || 'Not specified.'}</p>
        </div>
      ))}

      <div className="responsive-auto-grid" style={{ gap: '18px' }}>
        <div>
          <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Business Objectives</h4>
          <SectionList items={sections.businessObjectives} />
        </div>
        <div>
          <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Stakeholders</h4>
          <SectionList items={sections.stakeholders} />
        </div>
        <div>
          <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Scope</h4>
          <SectionList items={sections.scope} />
        </div>
        <div>
          <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Out of Scope</h4>
          <SectionList items={sections.outOfScope} />
        </div>
      </div>

      <div>
        <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)' }}>Functional Requirements</h4>
        {sections.functionalRequirements?.length > 0 ? (
          <div style={{ display: 'grid', gap: '12px' }}>
            {sections.functionalRequirements.map((item, index) => (
              <div key={`${item.title}-${index}`} style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{item.title}</strong>
                  <span style={{ color: 'var(--accent-color)', fontSize: '0.75rem', fontWeight: 800, whiteSpace: 'nowrap' }}>{item.priority}</span>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-tertiary)', margin: 0 }}>No functional requirements generated.</p>
        )}
      </div>

      <div className="responsive-auto-grid" style={{ gap: '18px' }}>
        <div>
          <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Non-Functional Requirements</h4>
          <SectionList items={sections.nonFunctionalRequirements} />
        </div>
        <div>
          <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Risks</h4>
          <SectionList items={sections.risks} />
        </div>
        <div>
          <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Success Metrics</h4>
          <SectionList items={sections.successMetrics} />
        </div>
        <div>
          <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Open Questions</h4>
          <SectionList items={sections.openQuestions} />
        </div>
      </div>
    </div>
  );
};

export default function IdeaBrdModule() {
  const { projectId, fetchBrds: fetchWorkspaceBrds, fetchRequirements, fetchRtm } = useOutletContext();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState(defaultForm);
  const [brds, setBrds] = useState([]);
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchBrds = useCallback(async () => {
    try {
      const res = await fetch(`${apiBase}/api/brds/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setBrds(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [projectId, token]);

  useEffect(() => {
    fetchBrds();
  }, [fetchBrds]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/api/brds/${projectId}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to generate BRD');
      }

      setDraft(data);
      setMessage('BRD draft generated. Review it, then save it to this project.');
      toast.success('BRD draft generated. Review it, then save it to this project.');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(`${apiBase}/api/brds/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(draft),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save BRD');
      }

      setDraft(null);
      setForm(defaultForm);
      setMessage('BRD saved to this project.');
      fetchBrds();
      fetchWorkspaceBrds?.(token);
      toast.success('BRD saved. Convert it when you are ready to seed requirements.');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setError('');
    setMessage('');

    try {
      const res = await fetch(`${apiBase}/api/brds/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete BRD');
      }

      setMessage('BRD deleted.');
      fetchBrds();
      fetchWorkspaceBrds?.(token);
      toast.info('BRD deleted.');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleConvert = async (id) => {
    setError('');
    setMessage('');

    try {
      const res = await fetch(`${apiBase}/api/brds/${id}/convert-requirements`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to convert requirements');
      }

      setMessage(`${data.requirements.length} requirements created from the BRD.`);
      fetchBrds();
      fetchWorkspaceBrds?.(token);
      fetchRequirements(token);
      fetchRtm(token);
      toast.success(`${data.requirements.length} requirements created from the BRD.`);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const stats = useMemo(() => {
    const functionalCount = brds.reduce((total, brd) => total + (brd.sections?.functionalRequirements?.length || 0), 0);
    const convertedCount = brds.filter((brd) => brd.status === 'Converted').length;

    return { functionalCount, convertedCount };
  }, [brds]);

  return (
    <ModuleLayout
      title="Idea to BRD"
      description="Turn an early product idea into a structured Business Requirement Document that can feed requirements, traceability, and project documentation."
      connectionText={"- Enter a rough product idea and optional business context.\n- InitPhase sends the request to Groq from the backend so your API key is never exposed in the browser.\n- Save generated BRDs to the project, then convert functional requirements into the existing Requirements module when ready."}
      flowStep="2 of 8"
      dependsOn="Project idea"
      feedsInto="Requirements and Documentation"
      statusBadge={brds.length > 0 ? `${brds.length} saved` : null}
      stats={
        <>
          <StatCard title="Saved BRDs" value={brds.length} color="var(--accent-color)" icon={FileText} />
          <StatCard title="Generated Requirements" value={stats.functionalCount} color="var(--warning)" icon={Layers} />
          <StatCard title="Converted BRDs" value={stats.convertedCount} color="var(--success)" icon={CheckCircle} />
        </>
      }
    >
      {stats.convertedCount > 0 && (
        <FlowCallout
          tone="success"
          title="BRD requirements are in the workspace"
          message="Review the converted requirements, tune their priority, and continue into testing."
          actionLabel="Review Requirements"
          onAction={() => navigate('../requirements')}
        />
      )}

      {(message || error) && (
        <div style={{
          padding: '14px 16px',
          borderRadius: 'var(--radius-sm)',
          border: `1px solid ${error ? 'var(--danger)' : 'var(--success)'}`,
          backgroundColor: error ? 'var(--danger-bg)' : 'var(--success-bg)',
          color: error ? 'var(--danger)' : 'var(--success)',
          fontWeight: 600,
        }}>
          {error || message}
        </div>
      )}

      <SectionCard title="Generate BRD Draft">
        <form onSubmit={handleGenerate} style={{ display: 'grid', gap: '18px' }}>
          <div>
            <label style={labelStyle}>Idea Title</label>
            <input
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="AI-powered campus helpdesk"
              required
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Raw Idea</label>
            <textarea
              value={form.sourceIdea}
              onChange={(e) => updateField('sourceIdea', e.target.value)}
              placeholder="Describe the product idea, workflow, problem, and expected outcome..."
              required
              rows={6}
              maxLength={12000}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>

          <div className="responsive-auto-grid" style={{ gap: '18px' }}>
            <div>
              <label style={labelStyle}>Target Users</label>
              <textarea value={form.targetUsers} onChange={(e) => updateField('targetUsers', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div>
              <label style={labelStyle}>Business Goals</label>
              <textarea value={form.businessGoals} onChange={(e) => updateField('businessGoals', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div>
              <label style={labelStyle}>Constraints</label>
              <textarea value={form.constraints} onChange={(e) => updateField('constraints', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <LoaderCircle size={18} style={{ animation: 'spin 1.5s linear infinite' }} /> : <Wand2 size={18} />}
              {loading ? 'Structuring your BRD...' : 'Generate BRD'}
            </Button>
          </div>
        </form>
      </SectionCard>

      {draft && (
        <SectionCard
          title="Generated Draft"
          actions={
            <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? <LoaderCircle size={16} style={{ animation: 'spin 1.5s linear infinite' }} /> : <Sparkles size={16} />}
              {saving ? 'Saving...' : 'Save BRD'}
            </Button>
          }
        >
          {loading && <LoadingState compact title="Structuring your BRD draft" message="Reading the idea, shaping sections, and checking risks..." />}
          <BrdPreview brd={draft} />
        </SectionCard>
      )}

      <SectionCard title="Saved BRDs">
        {brds.length === 0 ? (
          <EmptyState
            title="Start from the idea"
            message="No BRDs saved yet. Generate and save your first BRD above, then convert its functional requirements into the project."
            iconName="file-text"
          />
        ) : (
          <div style={{ display: 'grid', gap: '18px' }}>
            {brds.map((brd) => (
              <div key={brd._id} style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 6px 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{brd.title}</h3>
                    <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                      {new Date(brd.createdAt).toLocaleDateString()} - {brd.sections?.functionalRequirements?.length || 0} functional requirements - {brd.status}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <Button variant="secondary" size="sm" onClick={() => handleConvert(brd._id)} disabled={brd.status === 'Converted'}>
                      <BrainCircuit size={16} /> Convert
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(brd._id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {brd.sections?.executiveSummary || brd.sourceIdea}
                </p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </ModuleLayout>
  );
}
