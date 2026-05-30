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

const stringOrEmpty = (value) => String(value || '').trim();

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

const normalizeFileList = (files = []) => (
  Array.isArray(files)
    ? files.map((item) => ({
        path: stringOrEmpty(item?.path),
        type: stringOrEmpty(item?.type),
        size: Number(item?.size) || 0,
      })).filter((item) => item.path)
    : []
);

const normalizeAffectedFiles = (files = []) => (
  Array.isArray(files)
    ? files.map((item) => ({
        path: stringOrEmpty(item?.path),
        reason: stringOrEmpty(item?.reason),
      })).filter((item) => item.path)
    : []
);

const normalizeComplexity = (complexity) => {
  if (['Low', 'Medium', 'High'].includes(complexity)) {
    return complexity;
  }
  return 'Medium';
};

const numberOrZero = (value, decimals = 0) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;

  const factor = 10 ** decimals;
  return Math.round(parsed * factor) / factor;
};

const normalizeRange = (range = {}, decimals = 0) => {
  const min = numberOrZero(range.min, decimals);
  const max = numberOrZero(range.max, decimals);
  return {
    min,
    max: max < min ? min : max,
  };
};

const roundUsd = (value) => Math.ceil((Number(value) || 0) / 5) * 5;

const matchesAny = (value, patterns) => patterns.some((pattern) => pattern.test(value));

const getCalibratedEstimate = ({ changeRequest = '', affectedFiles = [], summary = {}, complexity = 'Medium' }) => {
  const text = `${changeRequest} ${(summary.majorAreas || []).join(' ')} ${(summary.techStack || []).join(' ')}`.toLowerCase();
  const filePaths = affectedFiles.map((file) => String(file.path || '').toLowerCase());
  const fileCount = Math.max(filePaths.length, 1);
  const frontendOnly = filePaths.length > 0 && filePaths.every((path) => (
    path.includes('src/') || path.includes('client/') || path.endsWith('.tsx') || path.endsWith('.jsx') || path.endsWith('.css')
  )) && !filePaths.some((path) => (
    path.includes('server/') || path.includes('routes/') || path.includes('controllers/') || path.includes('models/') || path.includes('api/')
  ));
  const simplePatterns = [
    /customi[sz]e/,
    /configurable/,
    /change (the )?(number|count|limit|value|text|label|copy|color|default)/,
    /not fix/,
    /input/,
    /dropdown/,
    /toggle/,
    /slider/,
    /field/,
    /monte carlo/,
    /iteration/,
  ];
  const hardPatterns = [
    /auth/,
    /login/,
    /oauth/,
    /payment/,
    /checkout/,
    /subscription/,
    /database/,
    /schema/,
    /migration/,
    /permission/,
    /security/,
    /role/,
    /api integration/,
    /third[- ]party/,
  ];
  const isSimple = matchesAny(text, simplePatterns);
  const isHard = matchesAny(text, hardPatterns);
  const isTinyParameterChange = matchesAny(text, [/monte carlo/, /iteration/, /count/, /number of times/, /hardcoded/, /fixed value/]);

  if (isSimple && !isHard && frontendOnly && fileCount <= 3) {
    return {
      complexity: 'Low',
      hours: { min: 0.25, max: isTinyParameterChange ? 1 : fileCount === 1 ? 1 : 2 },
      rate: 50,
      drivers: [
        'Small scoped UI/control change',
        'Limited affected file count',
        'AI-assisted implementation and quick manual verification',
      ],
      notes: [
        'Estimate assumes the existing simulation logic is easy to parameterize and no backend work is required.',
      ],
    };
  }

  if (isSimple && !isHard && fileCount <= 4) {
    return {
      complexity: 'Low',
      hours: { min: 1, max: 4 },
      rate: 60,
      drivers: ['Small behavior change across a few files', 'Basic regression check'],
      notes: ['Estimate assumes no new service integration, persistence, or data migration.'],
    };
  }

  if (isHard) {
    return {
      complexity: normalizeComplexity(complexity) === 'High' ? 'High' : 'Medium',
      hours: normalizeComplexity(complexity) === 'High' ? { min: 16, max: 60 } : { min: 6, max: 24 },
      rate: 75,
      drivers: ['Integration or security-sensitive behavior', 'Review and regression testing'],
      notes: ['Estimate includes implementation, review, QA, and light PM coordination.'],
    };
  }

  const baseline = {
    Low: { min: 1, max: 4 },
    Medium: { min: 4, max: 16 },
    High: { min: 16, max: 60 },
  }[normalizeComplexity(complexity)];

  return {
    complexity: normalizeComplexity(complexity),
    hours: baseline,
    rate: 65,
    drivers: ['Affected file count and implementation uncertainty', 'Review and focused QA'],
    notes: ['Estimate is calibrated for a small-to-mid codebase with AI-assisted development.'],
  };
};

const normalizeCostAnalysis = (costAnalysis = {}, context = {}) => {
  const calibrated = getCalibratedEstimate(context);
  const fallbackHours = {
    Low: { min: 1, max: 4 },
    Medium: { min: 4, max: 16 },
    High: { min: 16, max: 60 },
  }[normalizeComplexity(context.complexity)];
  const modelHours = normalizeRange(costAnalysis.estimatedHours?.max ? costAnalysis.estimatedHours : fallbackHours, 2);
  const estimatedHours = {
    min: Math.min(modelHours.min || calibrated.hours.min, calibrated.hours.min),
    max: Math.min(modelHours.max || calibrated.hours.max, calibrated.hours.max),
  };
  const assumedHourlyRateUsd = numberOrZero(costAnalysis.assumedHourlyRateUsd) || calibrated.rate;
  const calibratedRate = Math.min(assumedHourlyRateUsd, calibrated.rate);
  const estimatedCostUsd = {
    min: estimatedHours.min * assumedHourlyRateUsd,
    max: estimatedHours.max * assumedHourlyRateUsd,
  };

  return {
    estimatedHours,
    estimatedCostUsd: normalizeRange({
      min: roundUsd(estimatedHours.min * calibratedRate),
      max: roundUsd(estimatedHours.max * calibratedRate),
    }),
    assumedHourlyRateUsd: calibratedRate,
    costDrivers: [...calibrated.drivers, ...listOrEmpty(costAnalysis.costDrivers)].slice(0, 5),
    pmNotes: [...calibrated.notes, ...listOrEmpty(costAnalysis.pmNotes)].slice(0, 5),
  };
};

const normalizeRepositorySummary = (summary = {}) => ({
  overview: stringOrEmpty(summary.overview),
  techStack: listOrEmpty(summary.techStack),
  architecture: stringOrEmpty(summary.architecture),
  majorAreas: listOrEmpty(summary.majorAreas),
  notableFiles: normalizeFileList(summary.notableFiles),
});

const normalizeChangeImpact = (impact = {}, context = {}) => {
  const affectedFiles = normalizeAffectedFiles(impact.affectedFiles);
  const calibrated = getCalibratedEstimate({
    ...context,
    complexity: impact.complexity,
    affectedFiles,
  });
  const complexity = calibrated.complexity;

  return {
    complexity,
    affectedModules: listOrEmpty(impact.affectedModules),
    affectedFiles,
    implementationConsiderations: listOrEmpty(impact.implementationConsiderations),
    risks: listOrEmpty(impact.risks),
    costAnalysis: normalizeCostAnalysis(impact.costAnalysis, {
      ...context,
      complexity,
      affectedFiles,
    }),
  };
};

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

const buildRepositorySummaryPrompt = ({ repositoryName, repositoryUrl, files }) => `
Repository: ${repositoryName}
Repository URL: ${repositoryUrl}

Selected files with compact excerpts:
${files.map((file) => `
FILE: ${file.path} (${file.type}, ${file.size} bytes)
${file.content || ''}
`).join('\n')}

Return only valid compact JSON:
{
  "overview": "one sentence",
  "techStack": ["short item"],
  "architecture": "one sentence",
  "majorAreas": ["short module"],
  "notableFiles": [
    { "path": "file path", "type": "route | controller | model | frontend page | component | config | docs | service | middleware | source", "size": 123 }
  ]
}

Keep arrays to 8 items or fewer. Do not include markdown inside JSON values. Do not claim repository-wide certainty because only selected files were inspected.
`;

const buildChangeImpactPrompt = ({ summary, notableFiles, changeRequest }) => `
Repository summary:
${JSON.stringify(summary, null, 2)}

Known important files:
${JSON.stringify(notableFiles, null, 2)}

Change request:
${changeRequest}

Return only valid JSON with exactly this shape:
{
  "complexity": "Low | Medium | High",
  "affectedModules": ["module or application area"],
  "affectedFiles": [
    { "path": "file path", "reason": "why this file may be affected" }
  ],
  "implementationConsiderations": ["practical implementation note"],
  "risks": ["risk or regression concern"],
  "costAnalysis": {
    "estimatedHours": { "min": 0.5, "max": 2 },
    "estimatedCostUsd": { "min": 25, "max": 100 },
    "assumedHourlyRateUsd": 50,
    "costDrivers": ["short cost driver"],
    "pmNotes": ["short PM-facing note"]
  }
}

Estimate for an AI-assisted developer working in an existing small-to-mid repository, not for a full agency engagement. Calibrate tightly:
- Tiny UI/text/config/default-value changes: 0.25-1 hour, $15-$75.
- Simple frontend parameter/input/control changes across 1-3 files: 0.5-2 hours, $25-$150.
- Small behavior changes without auth, backend, schema, or integrations: 1-4 hours, $50-$300.
- Auth, payment, backend API, database, security, or third-party integrations: 6-24 hours, $450-$1,800 unless clearly larger.
- Major cross-cutting changes: 16-60 hours.
Use USD and a realistic small-team blended rate between $50/hr and $75/hr. Keep the answer grounded in the provided summary and files. If a likely file is not visible, mention the module name instead of inventing exact paths.
`;

const requestGroqJson = async ({ system, prompt, temperature = 0.2, maxTokens = 700 }) => {
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
        temperature,
        max_tokens: maxTokens,
        messages: [
          {
            role: 'system',
            content: system,
          },
          {
            role: 'user',
            content: prompt,
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
    const isTokenLimit = /tokens per minute|request too large|reduce your message size/i.test(message);
    const error = new Error(isTokenLimit ? 'Repository context was too large for the current Groq token limit. The backend now uses compact file excerpts; please try Analyze Repository again.' : message);
    error.statusCode = response.status;
    throw error;
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Groq returned an empty response');
  }

  return extractJson(content);
};

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

const generateRepositorySummaryWithGroq = async (input) => {
  const summary = await requestGroqJson({
    system: 'You are a senior software architect. Summarize a repository from a limited set of important files. Be concise and practical. Return only valid JSON matching the requested schema.',
    prompt: buildRepositorySummaryPrompt(input),
  });

  return normalizeRepositorySummary(summary);
};

const generateChangeImpactWithGroq = async (input) => {
  const impact = await requestGroqJson({
    system: 'You are a senior software engineer performing lightweight change impact analysis. Use only the supplied repository summary and file list. Return concise, practical JSON.',
    prompt: buildChangeImpactPrompt(input),
    maxTokens: 1100,
  });

  return normalizeChangeImpact(impact, input);
};

module.exports = {
  generateBrdWithGroq,
  generateChangeImpactWithGroq,
  generateRepositorySummaryWithGroq,
  normalizeBrdSections,
  normalizeChangeImpact,
  normalizeRepositorySummary,
};
