const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.1-8b-instant';

const emptySections = {
  executiveSummary: '',
  problemStatement: '',
  businessObjectives: [],
  stakeholders: [],
  scope: [],
  outOfScope: [],
  functionalRequirements: [],
  nonFunctionalRequirements: [],
  assumptions: [],
  risks: [],
  successMetrics: [],
  openQuestions: [],
};

const listOrEmpty = (value) => (Array.isArray(value) ? value.filter(Boolean).map(String) : []);

const normalizePriority = (priority) => {
  if (['Must-Have', 'Should-Have', 'Nice-to-Have'].includes(priority)) {
    return priority;
  }
  return 'Should-Have';
};

const normalizeBrdSections = (sections = {}) => ({
  executiveSummary: String(sections.executiveSummary || ''),
  problemStatement: String(sections.problemStatement || ''),
  businessObjectives: listOrEmpty(sections.businessObjectives),
  stakeholders: listOrEmpty(sections.stakeholders),
  scope: listOrEmpty(sections.scope),
  outOfScope: listOrEmpty(sections.outOfScope),
  functionalRequirements: Array.isArray(sections.functionalRequirements)
    ? sections.functionalRequirements.map((item) => ({
        title: String(item?.title || ''),
        description: String(item?.description || ''),
        priority: normalizePriority(item?.priority),
      })).filter((item) => item.title || item.description)
    : [],
  nonFunctionalRequirements: listOrEmpty(sections.nonFunctionalRequirements),
  assumptions: listOrEmpty(sections.assumptions),
  risks: listOrEmpty(sections.risks),
  successMetrics: listOrEmpty(sections.successMetrics),
  openQuestions: listOrEmpty(sections.openQuestions),
});

const extractJson = (content) => {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : trimmed;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Groq did not return a JSON object');
  }

  return JSON.parse(candidate.slice(start, end + 1));
};

const buildPrompt = ({ project, title, sourceIdea, targetUsers, businessGoals, constraints }) => `
Project name: ${project.name}
Project description: ${project.description || 'Not provided'}

Idea title: ${title}
Raw idea:
${sourceIdea}

Target users:
${targetUsers || 'Not provided'}

Business goals:
${businessGoals || 'Not provided'}

Constraints and assumptions:
${constraints || 'Not provided'}

Return only valid JSON with exactly this shape:
{
  "executiveSummary": "string",
  "problemStatement": "string",
  "businessObjectives": ["string"],
  "stakeholders": ["string"],
  "scope": ["string"],
  "outOfScope": ["string"],
  "functionalRequirements": [
    { "title": "string", "description": "string", "priority": "Must-Have | Should-Have | Nice-to-Have" }
  ],
  "nonFunctionalRequirements": ["string"],
  "assumptions": ["string"],
  "risks": ["string"],
  "successMetrics": ["string"],
  "openQuestions": ["string"]
}

Keep the BRD practical for a software delivery team. Do not include markdown inside JSON values.
`;

const generateBrdWithGroq = async (input) => {
  if (!process.env.GROQ_API_KEY) {
    const error = new Error('Groq API key is not configured');
    error.statusCode = 500;
    throw error;
  }

  let response;

  try {
    response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || DEFAULT_MODEL,
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: 'You are a senior business analyst. Convert rough product ideas into practical Business Requirement Documents for software teams. Return only valid JSON matching the requested schema.',
          },
          {
            role: 'user',
            content: buildPrompt(input),
          },
        ],
      }),
    });
  } catch (error) {
    const groqError = new Error('Unable to reach Groq. Check your internet connection, API key, and whether the backend was restarted after updating server/.env.');
    groqError.statusCode = 502;
    throw groqError;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.error?.message || 'Groq request failed';
    const error = new Error(message);
    error.statusCode = response.status;
    throw error;
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Groq returned an empty response');
  }

  return normalizeBrdSections({ ...emptySections, ...extractJson(content) });
};

module.exports = { generateBrdWithGroq, normalizeBrdSections };
