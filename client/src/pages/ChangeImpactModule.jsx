import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import ModuleLayout from '../components/ModuleLayout';
import SectionCard from '../components/SectionCard';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { BrainCircuit, DollarSign, FileCode, GitBranch, LoaderCircle, SearchCode, Trash2 } from 'lucide-react';

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

const defaultDraft = null;

const Message = ({ error, message }) => {
  if (!error && !message) return null;

  return (
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
  );
};

const Pill = ({ children, color = 'var(--accent-color)' }) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 10px',
    borderRadius: '999px',
    border: `1px solid color-mix(in srgb, ${color} 35%, var(--border-color))`,
    backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
    color,
    fontSize: '0.75rem',
    fontWeight: 800,
    whiteSpace: 'nowrap',
  }}>
    {children}
  </span>
);

const List = ({ items }) => {
  if (!items || items.length === 0) {
    return <p style={{ margin: 0, color: 'var(--text-tertiary)' }}>Not specified.</p>;
  }

  return (
    <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
      {items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
    </ul>
  );
};

const formatUsd = (value) => (
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
);

const CostAnalysis = ({ costAnalysis }) => {
  if (!costAnalysis) return null;

  const hours = costAnalysis.estimatedHours || {};
  const cost = costAnalysis.estimatedCostUsd || {};

  return (
    <div style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '18px', display: 'grid', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--success)' }}>
            <DollarSign size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Cost Analysis</h4>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-tertiary)', fontSize: '0.88rem' }}>PM estimate in USD using a blended delivery rate.</p>
          </div>
        </div>
        <Pill color="var(--success)">{formatUsd(cost.min)} - {formatUsd(cost.max)}</Pill>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        <div>
          <span style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>Estimated Hours</span>
          <strong style={{ color: 'var(--text-primary)', fontSize: '1.15rem' }}>{hours.min || 0} - {hours.max || 0} hrs</strong>
        </div>
        <div>
          <span style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>Hourly Rate</span>
          <strong style={{ color: 'var(--text-primary)', fontSize: '1.15rem' }}>{formatUsd(costAnalysis.assumedHourlyRateUsd || 75)}/hr</strong>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        <div>
          <h5 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Cost Drivers</h5>
          <List items={costAnalysis.costDrivers} />
        </div>
        <div>
          <h5 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)', fontSize: '0.95rem' }}>PM Notes</h5>
          <List items={costAnalysis.pmNotes} />
        </div>
      </div>
    </div>
  );
};

const ImpactPreview = ({ analysis }) => {
  if (!analysis) return null;

  const complexityColor = analysis.complexity === 'High'
    ? 'var(--danger)'
    : analysis.complexity === 'Low'
      ? 'var(--success)'
      : 'var(--warning)';

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)', fontSize: '1.25rem' }}>Change Request</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{analysis.changeRequest}</p>
        </div>
        <Pill color={complexityColor}>{analysis.complexity || 'Medium'} Complexity</Pill>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        <div>
          <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Affected Modules</h4>
          <List items={analysis.affectedModules} />
        </div>
        <div>
          <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Implementation Considerations</h4>
          <List items={analysis.implementationConsiderations} />
        </div>
        <div>
          <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Risks</h4>
          <List items={analysis.risks} />
        </div>
      </div>

      <CostAnalysis costAnalysis={analysis.costAnalysis} />

      <div>
        <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)' }}>Affected Files</h4>
        {analysis.affectedFiles?.length > 0 ? (
          <div style={{ display: 'grid', gap: '10px' }}>
            {analysis.affectedFiles.map((file, index) => (
              <div key={`${file.path}-${index}`} style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '6px', overflowWrap: 'anywhere' }}>{file.path}</strong>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{file.reason}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, color: 'var(--text-tertiary)' }}>No exact files identified from the limited repository snapshot.</p>
        )}
      </div>
    </div>
  );
};

export default function ChangeImpactModule() {
  const { projectId } = useOutletContext();
  const [workspace, setWorkspace] = useState(null);
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [changeRequest, setChangeRequest] = useState('');
  const [draft, setDraft] = useState(defaultDraft);
  const [loadingWorkspace, setLoadingWorkspace] = useState(false);
  const [analyzingRepo, setAnalyzingRepo] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchWorkspace = useCallback(async () => {
    setLoadingWorkspace(true);
    try {
      const res = await fetch(`${apiBase}/api/change-impact/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setWorkspace(data);
        setRepositoryUrl(data?.repositoryUrl || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingWorkspace(false);
    }
  }, [projectId, token]);

  useEffect(() => {
    fetchWorkspace();
  }, [fetchWorkspace]);

  const stats = useMemo(() => ({
    files: workspace?.summary?.notableFiles?.length || 0,
    analyses: workspace?.analyses?.length || 0,
    stack: workspace?.summary?.techStack?.length || 0,
    latestCost: workspace?.analyses?.length ? workspace.analyses[workspace.analyses.length - 1]?.costAnalysis?.estimatedCostUsd?.max || 0 : 0,
  }), [workspace]);

  const resetFeedback = () => {
    setError('');
    setMessage('');
  };

  const handleAnalyzeRepository = async (e) => {
    e.preventDefault();
    resetFeedback();
    setDraft(null);
    setAnalyzingRepo(true);

    try {
      const res = await fetch(`${apiBase}/api/change-impact/${projectId}/repository`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ repositoryUrl }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to analyze repository');
      }

      setWorkspace(data);
      setMessage('Repository summary saved to this project.');
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzingRepo(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    resetFeedback();
    setGenerating(true);

    try {
      const res = await fetch(`${apiBase}/api/change-impact/${projectId}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ changeRequest }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to generate impact analysis');
      }

      setDraft(data);
      setMessage('Impact analysis draft generated. Review it, then save it to this project.');
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!draft) return;
    resetFeedback();
    setSaving(true);

    try {
      const res = await fetch(`${apiBase}/api/change-impact/${projectId}/analyses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(draft),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save impact analysis');
      }

      setWorkspace(data);
      setDraft(null);
      setChangeRequest('');
      setMessage('Impact analysis saved to this project.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (analysisId) => {
    resetFeedback();

    try {
      const res = await fetch(`${apiBase}/api/change-impact/${projectId}/analyses/${analysisId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete impact analysis');
      }

      setMessage('Impact analysis deleted.');
      fetchWorkspace();
    } catch (err) {
      setError(err.message);
    }
  };

  const hasRepositorySummary = Boolean(workspace?.summary?.overview);

  return (
    <ModuleLayout
      title="Change Impact Analysis"
      description="Analyze a public GitHub repository at a high level, then estimate which application areas are likely affected by a proposed change."
      connectionText={"- Enter a public GitHub repository URL.\n- InitPhase fetches only important files such as README, package.json, routes, controllers, models, and major frontend pages.\n- Groq creates a stored repository summary, then uses it with your change request to generate a lightweight impact analysis."}
      stats={
        <>
          <StatCard title="Important Files" value={stats.files} color="var(--accent-color)" icon={FileCode} />
          <StatCard title="Saved Analyses" value={stats.analyses} color="var(--success)" icon={BrainCircuit} />
          <StatCard title="Latest Max Cost" value={formatUsd(stats.latestCost)} color="var(--success)" icon={DollarSign} />
          <StatCard title="Detected Stack Items" value={stats.stack} color="var(--warning)" icon={GitBranch} />
        </>
      }
    >
      <Message error={error} message={message} />

      <SectionCard title="Repository Context">
        <form onSubmit={handleAnalyzeRepository} style={{ display: 'grid', gap: '18px' }}>
          <div>
            <label style={labelStyle}>GitHub Repository URL</label>
            <input
              value={repositoryUrl}
              onChange={(e) => setRepositoryUrl(e.target.value)}
              placeholder="https://github.com/org/repo"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="primary" disabled={analyzingRepo}>
              {analyzingRepo ? <LoaderCircle size={18} style={{ animation: 'spin 1.5s linear infinite' }} /> : <SearchCode size={18} />}
              {analyzingRepo ? 'Analyzing Repository...' : 'Analyze Repository'}
            </Button>
          </div>
        </form>

        {loadingWorkspace && (
          <p style={{ margin: '18px 0 0 0', color: 'var(--text-tertiary)' }}>Loading saved repository context...</p>
        )}

        {hasRepositorySummary && (
          <div style={{ marginTop: '24px', display: 'grid', gap: '18px' }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>{workspace.repositoryName}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{workspace.summary.overview}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Tech Stack</h4>
                <List items={workspace.summary.techStack} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Major Areas</h4>
                <List items={workspace.summary.majorAreas} />
              </div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-primary)' }}>Fetched Files</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
                {workspace.summary.notableFiles?.map((file) => (
                  <div key={file.path} style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
                    <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '4px', overflowWrap: 'anywhere' }}>{file.path}</strong>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>{file.type || 'source'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Generate Impact Analysis">
        <form onSubmit={handleGenerate} style={{ display: 'grid', gap: '18px' }}>
          <div>
            <label style={labelStyle}>Change Request</label>
            <textarea
              value={changeRequest}
              onChange={(e) => setChangeRequest(e.target.value)}
              placeholder="Add Google Login"
              required
              rows={5}
              maxLength={4000}
              disabled={!hasRepositorySummary}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6, opacity: hasRepositorySummary ? 1 : 0.65 }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="primary" disabled={!hasRepositorySummary || generating}>
              {generating ? <LoaderCircle size={18} style={{ animation: 'spin 1.5s linear infinite' }} /> : <BrainCircuit size={18} />}
              {generating ? 'Generating Impact...' : 'Generate Impact Analysis'}
            </Button>
          </div>
        </form>
      </SectionCard>

      {draft && (
        <SectionCard
          title="Generated Draft"
          actions={
            <Button variant="primary" size="sm" onClick={handleSave} disabled={saving}>
              {saving ? <LoaderCircle size={16} style={{ animation: 'spin 1.5s linear infinite' }} /> : <BrainCircuit size={16} />}
              {saving ? 'Saving...' : 'Save Analysis'}
            </Button>
          }
        >
          <ImpactPreview analysis={draft} />
        </SectionCard>
      )}

      <SectionCard title="Saved Analyses">
        {!workspace?.analyses?.length ? (
          <EmptyState message="No impact analyses saved yet. Analyze a repository, enter a change request, and save the result here." iconName="file" />
        ) : (
          <div style={{ display: 'grid', gap: '18px' }}>
            {[...workspace.analyses].reverse().map((analysis) => (
              <div key={analysis._id} style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 6px 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{analysis.changeRequest}</h3>
                    <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                      {new Date(analysis.createdAt).toLocaleDateString()} - {analysis.affectedFiles?.length || 0} affected files
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <Pill color={analysis.complexity === 'High' ? 'var(--danger)' : analysis.complexity === 'Low' ? 'var(--success)' : 'var(--warning)'}>
                      {analysis.complexity}
                    </Pill>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(analysis._id)}>
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                <ImpactPreview analysis={analysis} />
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </ModuleLayout>
  );
}
