import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import ModuleLayout from '../components/ModuleLayout';
import SectionCard from '../components/SectionCard';
import Button from '../components/Button';
import { FileText, Download, LoaderCircle } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const renderPDFVisualDiagram = (steps) => {
  const parsedSteps = [];
  const participantsSet = new Set();
  
  steps.forEach((step, index) => {
    const arrowMatch = step.match(/(-->|->)/);
    let sender = '', receiver = '', message = '', isDashed = false;
    
    if (arrowMatch) {
      isDashed = arrowMatch[0] === '-->';
      const parts = step.split(arrowMatch[0]);
      if (parts.length === 2) {
        sender = parts[0].trim();
        const rightParts = parts[1].split(':');
        if (rightParts.length >= 2) {
          receiver = rightParts[0].trim();
          message = rightParts.slice(1).join(':').trim();
        } else {
          receiver = parts[1].trim();
        }
      }
    }
    
    if (sender && receiver) {
      participantsSet.add(sender);
      participantsSet.add(receiver);
      parsedSteps.push({ id: index, sender, receiver, message, isDashed });
    } else {
      parsedSteps.push({ id: index, raw: step });
    }
  });

  const actors = Array.from(participantsSet);
  
  if (actors.length === 0) {
    return (
      <div style={{ padding: '15px', backgroundColor: '#fafafa', borderRadius: '4px', color: '#444', fontFamily: 'monospace', fontSize: '11px' }}>
        {steps.map((s, i) => <div key={i}>{s}</div>)}
      </div>
    );
  }

  const actorWidth = 100;
  const colSpacing = 160; 
  const diagramWidth = actors.length === 1 ? actorWidth : (actors.length - 1) * colSpacing + actorWidth;
  
  // PDF container width is 800px with 40px internal paddings -> 720px safe area. Use 700px max layout target.
  const maxW = 700;
  const scale = diagramWidth > maxW ? maxW / diagramWidth : 1;
  const diagramHeight = 70 + parsedSteps.reduce((sum, step) => sum + (step.raw ? 35 : 40), 0);

  return (
    <div style={{ 
      width: '100%',
      overflowX: 'hidden', 
      padding: '20px 0', 
      backgroundColor: '#ffffff', 
      fontFamily: 'sans-serif'
    }}>
      <div style={{ position: 'relative', width: '100%', height: diagramHeight * scale }}>
        <div style={{
          position: 'absolute',
          width: diagramWidth,
          height: diagramHeight,
          left: '50%',
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: 'top center'
        }}>
        
        {/* Actors Header */}
        <div style={{ display: 'flex', position: 'relative', height: '30px', marginBottom: '15px' }}>
          {actors.map((actor, idx) => (
            <div key={`actor-${idx}`} style={{
              position: 'absolute',
              left: `${idx * colSpacing}px`,
              width: `${actorWidth}px`,
              textAlign: 'center',
              backgroundColor: '#f8f9fa',
              border: '1px solid #d1d5db',
              color: '#111827',
              padding: '6px',
              borderRadius: '4px',
              fontWeight: '600',
              fontSize: '11px',
              zIndex: 10
            }}>
              {actor}
            </div>
          ))}
        </div>

        {/* Lifelines */}
        {actors.map((actor, idx) => (
          <div key={`line-${idx}`} style={{
            position: 'absolute',
            left: `${idx * colSpacing + actorWidth / 2}px`,
            top: '30px',
            bottom: '-15px',
            width: '1px',
            backgroundColor: '#d1d5db',
            zIndex: 1
          }} />
        ))}

        {/* Steps */}
        <div style={{ position: 'relative', paddingTop: '10px', paddingBottom: '15px' }}>
          {parsedSteps.map((step, idx) => {
            if (step.raw) {
              return (
                 <div key={`step-${idx}`} style={{ height: '35px', color: '#6b7280', textAlign: 'center', lineHeight: '35px', fontSize: '10px', fontStyle: 'italic' }}>
                   {step.raw}
                 </div>
              );
            }

            const senderIdx = actors.indexOf(step.sender);
            const receiverIdx = actors.indexOf(step.receiver);
            const isSelf = senderIdx === receiverIdx;
            
            const leftIdx = Math.min(senderIdx, receiverIdx);
            const rightIdx = Math.max(senderIdx, receiverIdx);
            const leftPos = leftIdx * colSpacing + actorWidth / 2;
            const rightPos = rightIdx * colSpacing + actorWidth / 2;
            const width = rightPos - leftPos;
            const isRightDirection = receiverIdx > senderIdx;

            const lineColor = step.isDashed ? '#9ca3af' : '#4f46e5';

            return (
              <div key={`step-${idx}`} style={{ position: 'relative', height: '40px', zIndex: 5 }}>
                {!isSelf ? (
                  <>
                    <div style={{
                      position: 'absolute',
                      left: `${leftPos}px`,
                      top: '15px',
                      width: `${width}px`,
                      borderBottom: step.isDashed ? `1px dashed ${lineColor}` : `1px solid ${lineColor}`
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-3.5px',
                        [isRightDirection ? 'right' : 'left']: '-1px',
                        width: '0',
                        height: '0',
                        borderTop: '3.5px solid transparent',
                        borderBottom: '3.5px solid transparent',
                        [isRightDirection ? 'borderLeft' : 'borderRight']: `5px solid ${lineColor}`
                      }} />
                    </div>
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      color: '#4b5563',
                      fontSize: '10px',
                      fontWeight: '500',
                      backgroundColor: '#ffffff',
                      padding: '0 4px',
                      left: `${leftPos + width / 2}px`,
                      transform: 'translateX(-50%)',
                      whiteSpace: 'nowrap'
                    }}>
                       {step.message || '—'}
                    </div>
                  </>
                ) : (
                  <div style={{ position: 'absolute', left: `${leftPos}px`, top: '5px' }}>
                    <div style={{
                       width: '20px', height: '15px',
                       border: `1px ${step.isDashed ? 'dashed' : 'solid'} ${lineColor}`,
                       borderLeft: 'none',
                       borderBottom: 'none',
                       marginLeft: '1px',
                       position: 'relative',
                       borderTopRightRadius: '3px',
                       borderBottomRightRadius: '3px'
                    }}>
                       <div style={{ 
                         position: 'absolute', top: '14px', right: '0px', width: '20px', height: '1px', 
                         borderBottom: `1px ${step.isDashed ? 'dashed' : 'solid'} ${lineColor}`
                       }} />
                       <div style={{
                          position: 'absolute',
                          bottom: '-18px',
                          left: '-2px',
                          width: '0', height: '0',
                          borderTop: '3.5px solid transparent', borderBottom: '3.5px solid transparent', borderRight: `5px solid ${lineColor}`
                       }} />
                    </div>
                    <div style={{
                      position: 'absolute',
                      left: '28px',
                      top: '2px',
                      whiteSpace: 'nowrap',
                      color: '#4b5563',
                      fontSize: '10px'
                    }}>
                      {step.message}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
  );
};

export default function DocumentationModule() {
  const { projectId } = useOutletContext();
  const [docData, setDocData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDocumentation();
  }, [projectId]);

  const fetchDocumentation = async () => {
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/projects/${projectId}/documentation`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDocData(data);
      } else {
        setError('Failed to load documentation');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateMarkdown = () => {
    if (!docData) return '';

    let md = `# Project Documentation\n\n`;
    
    // Project Info
    md += `## Project Overview\n`;
    md += `**Name:** ${docData.project.name}\n\n`;
    md += `**Description:** ${docData.project.description}\n\n`;

    // Requirements
    md += `## Requirements\n`;
    if (docData.rtmData && docData.rtmData.length > 0) {
      docData.rtmData.forEach(req => {
        md += `- **[${req.priority}]** ${req.title}\n`;
      });
    } else {
      md += `*No requirements defined yet.*\n`;
    }
    md += `\n`;

    // Test Cases
    md += `## Test Cases\n`;
    if (docData.rtmData && docData.rtmData.length > 0) {
      docData.rtmData.forEach(req => {
        md += `### Requirement: ${req.title}\n`;
        if (req.testCases && req.testCases.length > 0) {
          req.testCases.forEach(tc => {
            md += `- **Test Case:** ${tc.name}\n  - **Status:** ${tc.status}\n  - **Expected:** ${tc.expectedResult}\n  - **Steps:** ${tc.executionSteps}\n`;
          });
        } else {
          md += `*No test cases associated.*\n`;
        }
        md += `\n`;
      });
    } else {
      md += `*No test cases defined yet.*\n\n`;
    }

    // RTM
    md += `## Requirement Traceability Matrix\n`;
    md += `**Overall Coverage:** ${docData.overallCoveragePercentage}%\n\n`;
    md += `| Requirement | Priority | Total Tests | Passed | Failed | Coverage |\n`;
    md += `|-------------|----------|-------------|--------|--------|----------|\n`;
    if (docData.rtmData && docData.rtmData.length > 0) {
      docData.rtmData.forEach(req => {
        md += `| ${req.title.replace(/\|/g, '-')} | ${req.priority} | ${req.totalTests} | ${req.passed} | ${req.failed} | ${req.coverage ? 'Yes' : 'No'} |\n`;
      });
    } else {
      md += `| No data | - | - | - | - | - |\n`;
    }
    md += `\n`;

    // Sequence Diagrams
    md += `## Sequence Diagrams\n`;
    if (docData.sequenceFlows && docData.sequenceFlows.length > 0) {
      docData.sequenceFlows.forEach(seq => {
        md += `### ${seq.title}\n`;
        if (seq.description) md += `${seq.description}\n\n`;
        md += '```text\n';
        seq.steps.forEach(step => {
          md += `${step}\n`;
        });
        md += '```\n\n';
      });
    } else {
      md += `*No sequence flows defined yet.*\n`;
    }

    return md;
  };

  const handleExportMarkdown = () => {
    const mdContent = generateMarkdown();
    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docData?.project?.name?.replace(/\s+/g, '_') || 'Project'}_Documentation.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const element = document.getElementById('pdf-report-container');
    const opt = {
      margin:       15,
      filename:     `${docData?.project?.name?.replace(/\s+/g, '_') || 'Project'}_Documentation.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  if (loading) {
    return (
      <ModuleLayout title="Documentation" description="Generating structured project documentation..." stats={null}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
          <LoaderCircle size={48} className="animate-spin" style={{ animation: 'spin 1.5s linear infinite', color: 'var(--accent-color)' }} />
        </div>
      </ModuleLayout>
    );
  }

  if (error) {
    return (
      <ModuleLayout title="Documentation" description="Generating structured project documentation..." stats={null}>
        <div style={{ padding: '24px', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-md)' }}>
          {error}
        </div>
      </ModuleLayout>
    );
  }

  const markdownPreview = generateMarkdown();

  return (
    <ModuleLayout
      title="Documentation Generator"
      description="Automatically aggregate Project details, Requirements, Test Cases, Traceability, and Sequence Flows into a single structured document."
      connectionText={"• Combine discrete data from all your project modules.\n• Get a unified Markdown report perfect for READMEs or handing off to external teams.\n• Use the browser's standard print (Ctrl/Cmd + P) to export directly as a PDF."}
      stats={null}
    >
      <SectionCard 
        title="Generated Document Preview"
        actions={
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button variant="secondary" size="sm" onClick={handleExportPDF}>
              <Download size={16} /> Download PDF Report
            </Button>
            <Button variant="primary" size="sm" onClick={handleExportMarkdown}>
              <FileText size={16} /> Export Markdown
            </Button>
          </div>
        }
      >
        <div 
          className="print-container"
          style={{ 
            backgroundColor: '#1E1E1E', 
            color: '#D4D4D4', 
            padding: '32px', 
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            lineHeight: '1.8',
            maxHeight: '600px',
            overflowY: 'auto',
            border: '1px solid #333'
          }}
        >
          <pre style={{ 
            fontFamily: 'monospace', 
            whiteSpace: 'pre-wrap', 
            margin: 0,
            fontSize: '0.9rem'
          }}>
            {markdownPreview}
          </pre>
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body * {
              visibility: hidden;
            }
            .print-container, .print-container * {
              visibility: visible;
              color: black !important;
              background-color: white !important;
              border: none !important;
            }
            .print-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              max-height: none !important;
              overflow: visible !important;
              padding: 0 !important;
              white-space: pre-wrap !important;
            }
          }
        `}} />

        {/* Hidden PDF Container */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: '800px' }}>
          <div id="pdf-report-container" style={{ padding: '40px', fontFamily: 'Arial, sans-serif', color: '#111', backgroundColor: '#fff' }}>
            {/* Header section with Logo & Name */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', borderBottom: '3px solid #0f1115', paddingBottom: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ width: '28px', height: '28px', backgroundColor: '#0f1115', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 6L11 12L4 18" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M13 18H20" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" /></svg>
                  </div>
                  <h1 style={{ color: '#0f1115', fontSize: '28px', margin: '0', letterSpacing: '-0.5px', fontWeight: '800' }}>InitPhase</h1>
                </div>
                <h2 style={{ color: '#666', fontSize: '14px', margin: '0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Project Technical Report</h2>
              </div>
              <div style={{ textAlign: 'right', color: '#888', fontSize: '12px', marginTop: '10px' }}>
                <strong style={{ color: '#444' }}>Generated:</strong><br/>
                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#111', fontSize: '16px', borderBottom: '1px solid #eaeaea', paddingBottom: '6px', marginBottom: '12px', fontWeight: '700' }}>1. Project Overview</h3>
              <p style={{ margin: '4px 0', fontSize: '14px' }}><strong style={{ color: '#555' }}>System Architect:</strong> {docData?.project?.name}</p>
              <p style={{ margin: '4px 0', fontSize: '14px' }}><strong style={{ color: '#555' }}>Unique Identifier:</strong> {docData?.project?.id}</p>
              <p style={{ margin: '12px 0 0 0', lineHeight: '1.5', color: '#333', fontSize: '14px' }}><strong style={{ color: '#555' }}>Business Case:</strong> {docData?.project?.description}</p>
            </div>

            <div style={{ marginBottom: '30px', pageBreakInside: 'avoid' }}>
              <h3 style={{ color: '#111', fontSize: '16px', borderBottom: '1px solid #eaeaea', paddingBottom: '6px', marginBottom: '12px', fontWeight: '700' }}>2. Requirement Matrix & Coverage</h3>
              <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
                <strong style={{ color: '#555' }}>Architectural Coverage Score: </strong> 
                <span style={{ color: docData?.overallCoveragePercentage > 70 ? '#10b981' : '#ef4444', fontWeight: '700' }}>
                  {docData?.overallCoveragePercentage}%
                </span>
              </p>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eaeaea' }}>
                    <th style={{ padding: '8px', textAlign: 'left', color: '#555', fontWeight: '600' }}>Requirement Specification</th>
                    <th style={{ padding: '8px', textAlign: 'left', width: '100px', color: '#555', fontWeight: '600' }}>Priority</th>
                    <th style={{ padding: '8px', textAlign: 'center', width: '70px', color: '#555', fontWeight: '600' }}>Tests</th>
                    <th style={{ padding: '8px', textAlign: 'center', width: '70px', color: '#555', fontWeight: '600' }}>Pass</th>
                    <th style={{ padding: '8px', textAlign: 'center', width: '70px', color: '#555', fontWeight: '600' }}>Fail</th>
                  </tr>
                </thead>
                <tbody>
                  {docData?.rtmData && docData.rtmData.length > 0 ? (
                    docData.rtmData.map(req => (
                      <tr key={req.requirementId} style={{ borderBottom: '1px solid #f4f4f5' }}>
                        <td style={{ padding: '12px 8px', color: '#222', lineHeight: '1.4' }}>{req.title}</td>
                        <td style={{ padding: '12px 8px' }}>
                          <span style={{ color: '#666', fontSize: '12px', fontWeight: '500' }}>
                            {req.priority}
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', color: '#555' }}>{req.totalTests}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', color: req.passed > 0 ? '#10b981' : '#aaa', fontWeight: req.passed > 0 ? '600' : '400' }}>{req.passed}</td>
                        <td style={{ padding: '12px 8px', textAlign: 'center', color: req.failed > 0 ? '#ef4444' : '#aaa', fontWeight: req.failed > 0 ? '600' : '400' }}>{req.failed}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5" style={{ padding: '12px 8px', textAlign: 'center', color: '#888' }}>No requirements data aggregated.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#111', fontSize: '16px', borderBottom: '1px solid #eaeaea', paddingBottom: '6px', marginBottom: '12px', fontWeight: '700' }}>3. Logical Sequence Flows</h3>
              {docData?.sequenceFlows && docData.sequenceFlows.length > 0 ? (
                docData.sequenceFlows.map(seq => (
                  <div key={seq._id} style={{ marginBottom: '20px', pageBreakInside: 'avoid' }}>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#222', fontWeight: '600' }}>Flow: {seq.title}</h4>
                    <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666' }}>{seq.description}</p>
                    <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '8px', border: '1px solid #eaeaea', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                      {renderPDFVisualDiagram(seq.steps)}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: '#888', fontSize: '13px' }}>No logical event sequences isolated in this project.</p>
              )}
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#111', fontSize: '16px', borderBottom: '1px solid #eaeaea', paddingBottom: '6px', marginBottom: '12px', fontWeight: '700' }}>4. Quality Assurance Executions</h3>
              {docData?.rtmData && docData.rtmData.length > 0 ? (
                docData.rtmData.map(req => (
                  <div key={'tc-' + req.requirementId} style={{ marginBottom: '16px', pageBreakInside: 'avoid' }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#333', fontWeight: '600' }}>Relating to: {req.title}</h4>
                    {req.testCases && req.testCases.length > 0 ? (
                      <ul style={{ margin: '0 0 0 15px', padding: 0, listStyleType: 'circle', color: '#555' }}>
                        {req.testCases.map(tc => (
                          <li key={tc._id} style={{ marginBottom: '8px', fontSize: '13px' }}>
                            <span style={{ 
                                fontWeight: '600', 
                                color: tc.status === 'Pass' ? '#10b981' : tc.status === 'Fail' ? '#ef4444' : '#f59e0b' 
                              }}>
                              [{tc.status.toUpperCase()}]
                            </span> <span style={{ color: '#222' }}>{tc.name}</span>
                            <div style={{ color: '#777', marginTop: '2px', fontSize: '12px', fontStyle: 'italic' }}>
                              Expected: {tc.expectedResult}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ fontSize: '13px', color: '#aaa', margin: 0 }}>No validated test logs mapping isolated directly to this parameter.</p>
                    )}
                  </div>
                ))
              ) : (
                <p style={{ color: '#888', fontSize: '13px' }}>System contains zero trace log diagnostics.</p>
              )}
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '40px', padding: '15px 0', borderTop: '1px solid #eaeaea', fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '1px' }}>
              This document was automatically generated by © InitPhase | 2026
            </div>
          </div>
        </div>
      </SectionCard>
    </ModuleLayout>
  );
}
