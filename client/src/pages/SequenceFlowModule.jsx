import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import ModuleLayout from '../components/ModuleLayout';
import SectionCard from '../components/SectionCard';
import Button from '../components/Button';
import { GitMerge, Plus, Trash2 } from 'lucide-react';

const renderVisualDiagram = (steps) => {
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
      <div style={{ padding: '20px', backgroundColor: '#1E1E1E', borderRadius: 'var(--radius-md)', color: '#D4D4D4', fontFamily: 'monospace' }}>
        {steps.map((s, i) => <div key={i}>{s}</div>)}
      </div>
    );
  }

  const actorWidth = 140;
  const colSpacing = 280;
  const containerWidth = actors.length === 1 ? '100%' : `${(actors.length - 1) * colSpacing + actorWidth}px`;

  return (
    <div style={{ 
      overflowX: 'auto', 
      padding: '40px 20px', 
      backgroundColor: '#1E1E1E', 
      borderRadius: 'var(--radius-md)',
      border: '1px solid #333',
      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
    }}>
      <div style={{ position: 'relative', width: containerWidth, margin: '0 auto', minWidth: 'max-content' }}>
        
        {/* Actors Header */}
        <div style={{ display: 'flex', position: 'relative', height: '40px', marginBottom: '20px' }}>
          {actors.map((actor, idx) => (
            <div key={`actor-${idx}`} style={{
              position: 'absolute',
              left: `${idx * colSpacing}px`,
              width: `${actorWidth}px`,
              textAlign: 'center',
              backgroundColor: 'var(--bg-card)',
              border: '2px solid var(--accent-color)',
              color: 'var(--text-primary)',
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '600',
              zIndex: 10,
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
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
            top: '40px',
            bottom: '-20px',
            width: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            zIndex: 1
          }} />
        ))}

        {/* Steps */}
        <div style={{ position: 'relative', paddingTop: '20px', paddingBottom: '20px' }}>
          {parsedSteps.map((step, idx) => {
            if (step.raw) {
              return (
                 <div key={`step-${idx}`} style={{ height: '40px', color: 'var(--text-secondary)', textAlign: 'center', lineHeight: '40px', fontSize: '0.9rem' }}>
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

            const lineColor = step.isDashed ? '#D4D4D4' : '#569CD6';

            return (
              <div key={`step-${idx}`} style={{ position: 'relative', height: '60px', zIndex: 5 }}>
                {!isSelf ? (
                  <>
                    <div style={{
                      position: 'absolute',
                      left: `${leftPos}px`,
                      top: '25px',
                      width: `${width}px`,
                      borderBottom: step.isDashed ? `2px dashed ${lineColor}` : `2px solid ${lineColor}`,
                      opacity: 0.8
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '-5px',
                        [isRightDirection ? 'right' : 'left']: '-1px',
                        width: '0',
                        height: '0',
                        borderTop: '5px solid transparent',
                        borderBottom: '5px solid transparent',
                        [isRightDirection ? 'borderLeft' : 'borderRight']: `7px solid ${lineColor}`
                      }} />
                    </div>
                    <div style={{
                      position: 'absolute',
                      left: `${leftPos}px`,
                      top: '0px',
                      width: `${width}px`,
                      textAlign: 'center',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                    }}>
                       {step.message || '—'}
                    </div>
                  </>
                ) : (
                  <div style={{ position: 'absolute', left: `${leftPos}px`, top: '10px' }}>
                    <div style={{
                       width: '30px', height: '25px',
                       border: `2px ${step.isDashed ? 'dashed' : 'solid'} ${lineColor}`,
                       borderLeft: 'none',
                       borderBottom: 'none',
                       marginLeft: '1px',
                       position: 'relative',
                       borderTopRightRadius: '4px',
                       borderBottomRightRadius: '4px',
                       opacity: 0.8
                    }}>
                       <div style={{ 
                         position: 'absolute', top: '23px', right: '0px', width: '30px', height: '2px', 
                         borderBottom: `2px ${step.isDashed ? 'dashed' : 'solid'} ${lineColor}`
                       }} />
                       <div style={{
                          position: 'absolute',
                          bottom: '-25px',
                          left: '-2px',
                          width: '0', height: '0',
                          borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: `7px solid ${lineColor}`
                       }} />
                    </div>
                    <div style={{
                      position: 'absolute',
                      left: '40px',
                      top: '5px',
                      whiteSpace: 'nowrap',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      textShadow: '0 2px 4px rgba(0,0,0,0.8)'
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
  );
};

export default function SequenceFlowModule() {
  const { projectId, sequenceFlows = [], fetchSequenceFlows } = useOutletContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rawSteps, setRawSteps] = useState('');

  const generateUml = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    return lines.map(line => {
      let umlLine = line;
      const lowerLine = line.toLowerCase();
      
      // If it looks like a response, use dashed arrow
      if (lowerLine.includes('success') || lowerLine.includes('result') || lowerLine.includes('response') || lowerLine.includes('fail')) {
        umlLine = umlLine.replace('->', '-->');
      }
      
      // Replace specific words to match the example
      umlLine = umlLine.replace(/:\s*Success/i, ': Response');
      umlLine = umlLine.replace(/:\s*Login Successful/i, ': Result');
      
      return umlLine;
    });
  };

  const handleGenerateAndSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const stepsArray = generateUml(rawSteps);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/sequence/${projectId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          title, 
          description,
          steps: stepsArray 
        })
      });
      if (res.ok) {
        setTitle('');
        setDescription('');
        setRawSteps('');
        fetchSequenceFlows(token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (seqId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/sequence/${seqId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchSequenceFlows(token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ModuleLayout
      title="Sequence Flow Builder"
      description="Design system interactions using simple text-based UML. See requests and responses visualize logically."
      connectionText={"• Define the actors and systems involved in an interaction.\n• Write steps line by line using -> for requests.\n• The generator will automatically convert responses into dashed arrows (-->) and format the UML for you."}
      stats={null}
    >
      <SectionCard title="Generate New Sequence Flow">
        <form onSubmit={handleGenerateAndSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Sequence Title (e.g., User Login Flow)" 
              required 
              style={{ 
                flex: 1, 
                padding: '12px 16px', 
                backgroundColor: 'var(--bg-base)',
                border: '1px solid var(--border-color)', 
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                fontSize: '1rem'
              }}
            />
          </div>
          <input 
            type="text" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Description (Optional)" 
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              backgroundColor: 'var(--bg-base)',
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: '1rem'
            }}
          />
          <textarea 
            value={rawSteps} 
            onChange={(e) => setRawSteps(e.target.value)} 
            placeholder={`Enter steps, one per line:\nUser -> System : Login Request\nSystem -> DB : Validate Credentials\nDB -> System : Success\nSystem -> User : Login Successful`} 
            required
            rows={6}
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              backgroundColor: 'var(--bg-base)',
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontFamily: 'monospace',
              resize: 'vertical'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Button type="submit" variant="primary">
              <Plus size={18} /> Generate Sequence Flow
            </Button>
          </div>
        </form>
      </SectionCard>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '32px' }}>
        {sequenceFlows.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
            <GitMerge size={48} style={{ color: 'var(--text-tertiary)', margin: '0 auto 16px auto', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '8px', fontFamily: 'var(--font-heading)' }}>No sequence flows yet</h3>
            <p style={{ color: 'var(--text-tertiary)' }}>Use the form above to generate your first text-based UML sequence flow.</p>
          </div>
        ) : (
          sequenceFlows.map(seq => (
            <SectionCard 
              key={seq._id} 
              title={seq.title}
              actions={
                <Button variant="danger" size="sm" onClick={() => handleDelete(seq._id)}>
                  <Trash2 size={16} /> Delete
                </Button>
              }
            >
              {seq.description && (
                <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.95rem' }}>{seq.description}</p>
              )}
              
              <div style={{ marginTop: '24px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '12px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Generated Sequence Flow
                  </h4>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      navigator.clipboard.writeText(seq.steps.join('\n'));
                      // Optional: Add a brief flash/toast effect here
                    }}
                    style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                  >
                    Copy to Clipboard
                  </Button>
                </div>
                
                {renderVisualDiagram(seq.steps)}
              </div>
            </SectionCard>
          ))
        )}
      </div>
    </ModuleLayout>
  );
}
