# Plan: Idea-to-BRD Conversion

## Goal

Implement the first upcoming feature from `readme.md`: **Idea-to-BRD Conversion**.

The feature should let a user open an existing project, enter a raw product or software idea, and generate a structured Business Requirement Document (BRD) inside InitPhase. If LLM usage is needed, all generation should run through Groq's free LLM API from the backend, not from the browser.

## Product Scope

### User Flow

1. User opens a project workspace.
2. User navigates to a new `Idea to BRD` module.
3. User enters:
   - Idea title
   - Raw idea/problem statement
   - Optional target users
   - Optional business goals
   - Optional constraints or assumptions
4. User clicks `Generate BRD`.
5. Backend sends a structured prompt to Groq and receives a JSON BRD draft.
6. User reviews the generated BRD in the UI.
7. User can save the BRD to the project.
8. Saved BRDs appear in a project-scoped BRD list.
9. User can later convert selected BRD sections into requirements manually or through a follow-up action.

### MVP Boundaries

The first implementation should focus only on Idea-to-BRD. Do not implement Automated User Stories, Jira integration, or full natural-language project setup yet.

For MVP, the BRD should include:

- Executive summary
- Problem statement
- Business objectives
- Stakeholders / target users
- Scope
- Out of scope
- Functional requirements
- Non-functional requirements
- Assumptions
- Risks
- Success metrics
- Open questions

## Architecture Fit

The current app has a React/Vite client and an Express/Mongoose backend. Existing modules are project-scoped and follow this pattern:

- Model in `server/models`
- Controller in `server/controllers`
- Route in `server/routes`
- Protected route mounted from `server/server.js`
- Workspace page in `client/src/pages`
- Sidebar route from `client/src/pages/ProjectWorkspace.jsx`
- Nested route in `client/src/App.jsx`

The BRD feature should follow the same structure.

## Backend Implementation

### 1. Add Environment Variables

Add these to `server/.env`:

```env
GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama-3.1-8b-instant
```

`GROQ_MODEL` should be optional in code and default to a low-cost/free Groq model if unset.

### 2. Add BRD Model

Create `server/models/Brd.js`.

Suggested schema:

```js
const mongoose = require('mongoose');

const brdSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Project' },
    title: { type: String, required: true },
    sourceIdea: { type: String, required: true },
    targetUsers: { type: String, default: '' },
    businessGoals: { type: String, default: '' },
    constraints: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Draft', 'Saved', 'Converted'],
      default: 'Draft'
    },
    sections: {
      executiveSummary: { type: String, default: '' },
      problemStatement: { type: String, default: '' },
      businessObjectives: [{ type: String }],
      stakeholders: [{ type: String }],
      scope: [{ type: String }],
      outOfScope: [{ type: String }],
      functionalRequirements: [
        {
          title: String,
          description: String,
          priority: {
            type: String,
            enum: ['Must-Have', 'Should-Have', 'Nice-to-Have'],
            default: 'Should-Have'
          }
        }
      ],
      nonFunctionalRequirements: [{ type: String }],
      assumptions: [{ type: String }],
      risks: [{ type: String }],
      successMetrics: [{ type: String }],
      openQuestions: [{ type: String }]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Brd', brdSchema);
```

### 3. Add Groq Service

Create `server/services/groqService.js`.

Responsibilities:

- Read `GROQ_API_KEY` and `GROQ_MODEL`.
- Call `https://api.groq.com/openai/v1/chat/completions`.
- Ask for strict JSON only.
- Validate that the response can be parsed as JSON.
- Return a normalized BRD object.

Use native `fetch` from Node 18+ to avoid adding an extra dependency.

If `GROQ_API_KEY` is missing, the endpoint should return a clear `500` response:

```json
{ "message": "Groq API key is not configured" }
```

### 4. Add BRD Controller

Create `server/controllers/brdController.js`.

Controller functions:

- `generateBrdDraft(req, res)`
  - Validates project ownership.
  - Validates `title` and `sourceIdea`.
  - Calls Groq service.
  - Returns generated draft without saving by default.

- `createBrd(req, res)`
  - Validates project ownership.
  - Saves a generated or manually edited BRD.

- `getProjectBrds(req, res)`
  - Lists all BRDs for a project.
  - Sort by newest first.

- `getBrdById(req, res)`
  - Loads one BRD after ownership validation.

- `deleteBrd(req, res)`
  - Deletes one BRD after ownership validation.

- `convertBrdRequirements(req, res)`
  - Optional MVP-plus endpoint.
  - Takes `sections.functionalRequirements`.
  - Creates records in the existing `Requirement` collection.
  - Maps BRD priority directly to the existing requirement priority enum.

Keep ownership validation consistent with existing controllers by checking the parent project's `user` field against `req.user._id`.

### 5. Add BRD Routes

Create `server/routes/brdRoutes.js`.

Suggested API contract:

```txt
POST   /api/brds/:projectId/generate
GET    /api/brds/:projectId
POST   /api/brds/:projectId
GET    /api/brds/detail/:id
DELETE /api/brds/:id
POST   /api/brds/:id/convert-requirements
```

Mount the routes in `server/server.js`:

```js
app.use("/api/brds", require("./routes/brdRoutes"));
```

### 6. Include BRDs in Documentation

Update `server/controllers/documentationController.js`:

- Import `Brd`.
- Fetch BRDs for the project.
- Add `brds` to `docData`.

Update `client/src/pages/DocumentationModule.jsx`:

- Add a `Business Requirement Documents` section to Markdown export.
- Add a matching section to PDF export.

## Groq Prompting Plan

Use a backend-only prompt builder. The browser should never see the API key.

System message:

```txt
You are a senior business analyst. Convert rough product ideas into practical Business Requirement Documents for software teams. Return only valid JSON matching the requested schema.
```

User message should include:

- Project name and description
- Idea title
- Raw idea
- Target users
- Business goals
- Constraints
- Required JSON schema

The output schema should match the `sections` object from the Mongoose model. Ask Groq to avoid markdown formatting inside JSON fields.

Add a defensive JSON extraction helper because LLMs sometimes wrap JSON in code fences.

## Frontend Implementation

### 1. Add Route

Update `client/src/App.jsx`:

- Lazy-load `IdeaBrdModule`.
- Add nested route:

```jsx
<Route path="idea-brd" element={<IdeaBrdModule />} />
```

### 2. Add Sidebar Item

Update `client/src/pages/ProjectWorkspace.jsx`:

- Import a suitable Lucide icon, for example `Sparkles` or `ScrollText`.
- Add nav item:

```jsx
<NavLink to="idea-brd" ...>Idea to BRD</NavLink>
```

### 3. Add Page Component

Create `client/src/pages/IdeaBrdModule.jsx`.

Use existing UI components:

- `ModuleLayout`
- `SectionCard`
- `StatCard`
- `EmptyState`
- `Button`

Recommended layout:

- Top stats:
  - Saved BRDs
  - Draft sections
  - Functional requirements generated
- Left/top form:
  - Title input
  - Raw idea textarea
  - Target users textarea
  - Business goals textarea
  - Constraints textarea
  - Generate button
- Generated BRD preview:
  - Render each BRD section clearly
  - Let the user edit generated text before saving if feasible
- Saved BRDs list:
  - Title
  - Created date
  - Number of functional requirements
  - Delete action
  - Convert requirements action if implementing MVP-plus

### 4. Frontend API Calls

Use the same API base pattern as existing modules:

```js
const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

Calls:

- `GET /api/brds/${projectId}` on load.
- `POST /api/brds/${projectId}/generate` when generating.
- `POST /api/brds/${projectId}` when saving.
- `DELETE /api/brds/${brdId}` when deleting.
- `POST /api/brds/${brdId}/convert-requirements` when converting BRD functional requirements into existing requirements.

After converting to requirements, call:

```js
fetchRequirements(token);
fetchRtm(token);
```

from `useOutletContext()`.

## Requirement Conversion Strategy

The existing `Requirement` model only supports:

- `project`
- `title`
- `priority`

So BRD functional requirements should convert like this:

```js
{
  title: `${item.title}: ${item.description}`,
  priority: item.priority || 'Should-Have'
}
```

This keeps the MVP compatible with the current requirements module without expanding the requirement schema.

Later, the requirement model can be upgraded to support description, source BRD, acceptance criteria, and status.

## Error Handling

Handle these states in both backend and frontend:

- Missing title or idea.
- Missing/invalid project.
- Unauthorized project access.
- Missing Groq API key.
- Groq request failure.
- Groq returns invalid JSON.
- Empty BRD list.
- Save succeeds but requirement conversion partially fails.

The UI should show friendly module-level messages, not just `console.error`.

## Security

- Keep `GROQ_API_KEY` only in `server/.env`.
- Do not expose Groq API calls from the React app.
- Use existing `protect` middleware on every BRD route.
- Validate project ownership on every controller action.
- Limit input size for `sourceIdea`, for example 8,000 to 12,000 characters, to control free-tier usage.
- Consider basic rate limiting later if generation abuse becomes a problem.

## Testing Checklist

Manual checks:

1. Login and open a project.
2. Open `Idea to BRD`.
3. Generate a BRD from a short idea.
4. Save generated BRD.
5. Refresh page and confirm the saved BRD persists.
6. Delete BRD and confirm it disappears.
7. Convert BRD functional requirements.
8. Confirm new requirements appear in the Requirements module.
9. Confirm RTM refreshes after conversion.
10. Confirm Documentation export includes saved BRDs.
11. Remove `GROQ_API_KEY` and confirm a clear error appears.
12. Try accessing another user's project and confirm authorization is blocked.

Build checks:

```bash
cd client
npm run build
```

Server smoke check:

```bash
cd server
npm start
```

## Suggested Implementation Order

1. Add `Brd` model.
2. Add Groq service.
3. Add BRD controller and routes.
4. Mount routes in `server/server.js`.
5. Test backend with curl/Postman using a project token.
6. Add `IdeaBrdModule.jsx`.
7. Add client route and sidebar entry.
8. Add save/delete/generate UI states.
9. Add optional `Convert to Requirements` action.
10. Add BRDs to documentation generation.
11. Run client build and manual workflow test.

## Future Enhancements

- Rich editor for BRD sections.
- Version history for generated BRDs.
- Source traceability from requirement back to BRD section.
- Acceptance criteria generation.
- Export individual BRDs as Markdown/PDF.
- Compare generated BRD drafts.
- Add user approval workflow before requirement conversion.
- Use BRD as input for the next upcoming feature: Automated User Stories.
