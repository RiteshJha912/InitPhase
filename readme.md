# InitPhase

InitPhase is an enterprise-grade SaaS project management workspace designed to facilitate the systematic analysis, planning, and traceability of software requirements, testing, and issue pipelines throughout the development lifecycle.

## Tech Stack Overview

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Routing:** React Router DOM v7
- **Styling:** Vanilla CSS with scoped inline styling for components
- **Charts:** Recharts for data visualization
- **Icons:** Lucide React
- **PDF Generation:** html2pdf.js for documentation export
- **Architecture:** Modular component-based architecture with dedicated sub-routes for each major feature subsystem.

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js v5
- **Database:** MongoDB
- **ODM:** Mongoose v9
- **Authentication:** JSON Web Tokens (JWT)
- **Security:** BcryptJS for password hashing, CORS enabled.
- **LLM Provider:** Groq Chat Completions API for backend-only Idea-to-BRD generation
- **Development:** Nodemon for hot reloading

## Project Architecture

The application is structured sequentially into two main isolated directories: `client` and `server`.

### Repository Structure

```text
initphase/
├── client/                     # React 19 Frontend (Vite)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/             # Images, icons, global styling elements
│   │   ├── components/         # Reusable structural UI components
│   │   │   ├── DataTable.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ModuleLayout.jsx
│   │   │   ├── SectionCard.jsx
│   │   │   └── StatCard.jsx
│   │   ├── pages/              # Primary route views and module handlers
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ProjectOverview.jsx
│   │   │   ├── ProjectWorkspace.jsx
│   │   │   ├── RequirementsModule.jsx
│   │   │   ├── SequenceFlowModule.jsx
│   │   │   ├── IdeaBrdModule.jsx
│   │   │   ├── RtmModule.jsx
│   │   │   ├── IssuesModule.jsx
│   │   │   ├── DocumentationModule.jsx
│   │   │   └── TestCasesModule.jsx
│   │   ├── App.jsx             # Main router configuration
│   │   ├── main.jsx            # React root injection point
│   │   ├── App.css
│   │   └── index.css           # Global stylesheet containing design tokens
│   ├── index.html              # Entry HTML template
│   ├── package.json
│   └── vite.config.js          # Vite configuration
│
├── server/                     # Node.js + Express.js Backend
│   ├── config/                 # Environment and DB configuration
│   │   └── db.js               # MongoDB connection logic
│   ├── controllers/            # Business logic handlers
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── requirementController.js
│   │   ├── brdController.js
│   │   ├── sequenceController.js
│   │   ├── rtmController.js
│   │   ├── issueController.js
│   │   ├── documentationController.js
│   │   └── testCaseController.js
│   ├── middleware/             # Express middlewares (Auth/Security)
│   │   └── authMiddleware.js
│   ├── models/                 # Mongoose database schemas
│   │   ├── Project.js
│   │   ├── Requirement.js
│   │   ├── Brd.js
│   │   ├── SequenceFlow.js
│   │   ├── Issue.js
│   │   ├── TestCase.js
│   │   └── User.js
│   ├── routes/                 # Express API route declarations
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── requirementRoutes.js
│   │   ├── brdRoutes.js
│   │   ├── sequenceRoutes.js
│   │   ├── rtmRoutes.js
│   │   ├── issueRoutes.js
│   │   ├── documentationRoutes.js
│   │   └── testCaseRoutes.js
│   ├── services/               # External service integrations
│   │   └── groqService.js       # Groq prompt, API call, JSON parsing, BRD normalization
│   ├── .env                    # Secret environment configurations
│   ├── package.json
│   └── server.js               # Primary Express server entry point
│
├── dummy_data.md               # Follow-along testing manual
├── idea_to_brd_samples.md      # Idea-to-BRD sample inputs
└── readme.md                   # Enterprise technical documentation
```

### Frontend Architecture (`/client`)
The frontend is implemented as a Single Page Application (SPA) with a heavily modularized routing structure to simulate independent enterprise subsystems.

**Core Routes:**
- `/`: Landing page (SaaS-focused branding).
- `/login` & `/register`: Authentication views.
- `/dashboard`: Primary hub for creating, securing, editing, and deleting distinct projects.
- `/projects/:id/*`: The enterprise workspace wrapper, which contains nested routes:
  - `/overview`: High-level statistical overview of the project.
  - `/requirements`: The Requirements Management Module.
  - `/idea-brd`: AI-assisted Idea-to-BRD generation using Groq from the backend.
  - `/sequence`: System modeling via intuitive Visual Builder and direct text-based UML.
  - `/testcases`: The Test Case Management Module.
  - `/issues`: Interactive HTML5 Drag-and-Drop Kanban issue tracker.
  - `/rtm`: The Requirement Traceability Matrix (RTM) Analysis Module.
  - `/documentation`: Dynamic Markdown generator combining all project data.

**Shared Components (`/client/src/components`):**
To maintain visual consistency and DRY principles, shared UI components are utilized across modules:
- `ModuleLayout`: Standard wrapper providing titles, descriptions, contextual help panels, and embedded subtle styling grids.
- `StatCard`: Visual component for numerical data representation.
- `SectionCard`: Wrapper for distinct functional areas within a module.
- `DataTable`: Reusable structural table for entity lists.
- `EmptyState`: Placeholder graphics for unpopulated data views.

### Backend Architecture (`/server`)
The server follows an MVC (Model-View-Controller) derived pattern, exposing RESTful API endpoints.

**Core Components:**
- **Models (`/server/models`):** Mongoose schemas defining core structures (`User`, `Project`, `Requirement`, `TestCase`, `SequenceFlow`, `Issue`).
- **Controllers (`/server/controllers`):** Advanced business logic handling CRUD capabilities across namespaces.
- **Routes (`/server/routes`):** Express routers mapping HTTP methods to corresponding controllers.
- **Services (`/server/services`):** External integration wrappers, including the Groq BRD generation service.
- **Middleware (`/server/middleware`):** Secures the application via `authMiddleware` JWT verification layers.

## Detailed Module Documentation

### Authentication System

**Purpose:** Secure user registration, login, and session management for multi-tenant project isolation.

**Inputs/Outputs:**
- **Inputs:** Email, password for registration/login
- **Outputs:** JWT token for authenticated sessions

**Internal Logic:**
- Passwords hashed with bcryptjs before storage
- JWT tokens issued with user ID payload
- Middleware validates tokens on protected routes
- Automatic logout on invalid/expired tokens

**Interactions:**
- Provides user context to all project-related modules
- Enforces ownership validation on all data operations

**Key Functions:**
- `register`: Creates new user with hashed password
- `login`: Validates credentials and returns JWT
- `authMiddleware`: Validates JWT on incoming requests

### Project Management (Dashboard)

**Purpose:** Central hub for creating and managing isolated project workspaces.

**Inputs/Outputs:**
- **Inputs:** Project name, description
- **Outputs:** Project list with CRUD operations

**Internal Logic:**
- Projects are user-scoped for multi-tenancy
- Automatic navigation to requirements module after creation
- Inline editing with optimistic UI updates

**Interactions:**
- Creates context for all child modules via React Router outlet
- Triggers data refresh across modules on project changes

**Key Functions:**
- `fetchProjects`: Retrieves user's projects with auth
- `handleCreateProject`: Validates and creates new project
- `handleUpdateProject`: Updates project metadata
- `handleDeleteProject`: Cascades delete with confirmation

### Requirements Module

**Purpose:** Define and prioritize software requirements as the foundation for testing and traceability.

**Inputs/Outputs:**
- **Inputs:** Requirement title, priority level (Must-Have/Should-Have/Nice-to-Have)
- **Outputs:** Prioritized requirement list with statistics

**Internal Logic:**
- Requirements linked to projects with user authorization
- Priority-based filtering and statistics calculation
- Real-time updates trigger RTM recalculation

**Interactions:**
- Provides requirements data to Test Cases and RTM modules
- Updates trigger cascading refreshes in dependent modules

**Key Functions:**
- `handleAddRequirement`: Creates requirement with validation
- `handleDeleteRequirement`: Removes requirement and updates RTM
- Priority filtering and statistics computation

### Idea-to-BRD Module

**Purpose:** Convert rough software ideas into structured Business Requirement Documents (BRDs) that can feed downstream requirements, traceability, and documentation.

**Inputs/Outputs:**
- **Inputs:** Idea title, raw idea, target users, business goals, constraints
- **Outputs:** Generated BRD draft, saved project BRDs, and optional converted requirements

**Internal Logic:**
- The frontend collects idea context inside a project workspace
- The backend calls Groq using `GROQ_API_KEY` and normalizes the response into BRD sections
- BRDs are saved project-wise with ownership validation
- Functional requirements from a BRD can be converted into existing project requirements

**Interactions:**
- Converts generated functional requirements into the Requirements module
- Refreshes RTM after conversion so downstream traceability can continue
- Adds saved BRDs to the Documentation module output

**Key Functions:**
- `generateBrdDraft`: Creates a BRD draft from raw idea context using Groq
- `createBrd`: Saves reviewed BRD content to the project
- `convertBrdRequirements`: Creates project requirements from BRD functional requirements

### Test Cases Module

**Purpose:** Create executable test scenarios linked to specific requirements for validation.

**Inputs/Outputs:**
- **Inputs:** Test name, steps, expected result, linked requirement
- **Outputs:** Test case list with status updates (Pending/Pass/Fail)

**Internal Logic:**
- Test cases are requirement-scoped within projects
- Status updates affect RTM coverage calculations
- CRUD operations with authorization checks

**Interactions:**
- Consumes requirements from Requirements module
- Provides test data to RTM for coverage analysis
- Status changes trigger RTM updates

**Key Functions:**
- `handleAddTestCase`: Links test to requirement with validation
- `handleUpdateStatus`: Updates test status and refreshes RTM
- `handleDeleteTestCase`: Removes test and updates coverage

### Traceability Matrix (RTM) Module

**Purpose:** Provide real-time analytics on requirement-test coverage and project health.

**Inputs/Outputs:**
- **Inputs:** Aggregated requirements and test cases
- **Outputs:** Coverage percentage, detailed mapping table

**Internal Logic:**
- Joins requirements with test cases by project
- Calculates coverage metrics: total tests, passed/failed counts
- Highlights untested and failing requirements
- Percentage calculation: (covered requirements / total requirements) * 100

**Interactions:**
- Consumes data from Requirements and Test Cases modules
- Provides coverage insights for project overview
- Used in Documentation module for reporting

**Key Functions:**
- `getRTMAggregation`: Performs database joins and calculations
- Coverage percentage computation
- Requirement-test mapping generation

### Issues Module

**Purpose:** Kanban-style issue tracking for bugs, enhancements, and tasks.

**Inputs/Outputs:**
- **Inputs:** Issue title, description, status
- **Outputs:** Drag-and-drop Kanban board with status columns

**Internal Logic:**
- Issues stored with status enum (To Do, In Progress, Done)
- HTML5 drag-and-drop for status transitions
- Project-scoped with user authorization

**Interactions:**
- Standalone module with no direct dependencies
- Provides issue metrics to Project Overview

**Key Functions:**
- `handleAddIssue`: Creates new issue in To Do column
- `handleStatusChange`: Updates issue status via drag-drop
- `handleDeleteIssue`: Removes completed issues

### Sequence Flow Module

**Purpose:** Visual modeling of system interactions using swimlane diagrams.

**Inputs/Outputs:**
- **Inputs:** Diagram elements (actors, actions, flows)
- **Outputs:** Generated sequence diagrams with text representation

**Internal Logic:**
- Visual builder for creating swimlane diagrams
- Text-based UML alternative for direct input
- Diagrams persisted as structured data

**Interactions:**
- Provides sequence data to Documentation module
- Standalone creation with project scoping

**Key Functions:**
- `handleCreateSequence`: Saves diagram structure
- `handleDeleteSequence`: Removes diagram
- Visual rendering and text parsing

### Documentation Module

**Purpose:** Automated generation of comprehensive project documentation.

**Inputs/Outputs:**
- **Inputs:** Aggregated project data (BRDs, requirements, tests, RTM, sequences, issues)
- **Outputs:** Markdown documentation with PDF export

**Internal Logic:**
- Combines data from all modules into structured report
- Includes saved BRDs and generated functional requirements in exports
- Markdown generation with sections for each module
- PDF export using html2pdf.js

**Interactions:**
- Consumes data from all other modules
- Final output stage in project lifecycle

**Key Functions:**
- `getDocumentation`: Aggregates all project data
- Markdown compilation and PDF generation

## API Contracts

All protected routes require an `Authorization` header containing the JWT: `Bearer <token>`.

### Auth APIs
- `POST /api/auth/register` - Creates a new user account
  - Body: `{ email, password }`
  - Returns: User object with JWT
- `POST /api/auth/login` - Authenticates user
  - Body: `{ email, password }`
  - Returns: JWT token

### Project APIs
- `GET /api/projects` - Retrieves user's projects
- `POST /api/projects` - Creates new project
  - Body: `{ name, description }`
- `GET /api/projects/:id` - Gets project details
- `PATCH /api/projects/:id` - Updates project
  - Body: `{ name, description }`
- `DELETE /api/projects/:id` - Deletes project

### Requirement APIs
- `GET /api/requirements/:projectId` - Lists project requirements
- `POST /api/requirements/:projectId` - Creates requirement
  - Body: `{ title, priority }`
- `DELETE /api/requirements/:reqId` - Deletes requirement

### BRD APIs
- `POST /api/brds/:projectId/generate` - Generates a BRD draft from raw idea context
  - Body: `{ title, sourceIdea, targetUsers, businessGoals, constraints }`
- `GET /api/brds/:projectId` - Lists saved BRDs for a project
- `POST /api/brds/:projectId` - Saves a generated or edited BRD
- `GET /api/brds/detail/:id` - Gets one BRD by ID
- `DELETE /api/brds/:id` - Deletes a saved BRD
- `POST /api/brds/:id/convert-requirements` - Converts BRD functional requirements into project requirements

### Test Case APIs
- `GET /api/testcases/:projectId` - Lists project test cases
- `POST /api/testcases/:projectId/:requirementId` - Creates test case
  - Body: `{ name, steps, expectedResult }`
- `PATCH /api/testcases/:testId/status` - Updates test status
  - Body: `{ status }`

### Issue APIs
- `GET /api/issues/:projectId` - Lists project issues
- `POST /api/issues/:projectId` - Creates issue
  - Body: `{ title, description }`
- `PATCH /api/issues/:issueId/status` - Updates issue status
- `DELETE /api/issues/:issueId` - Deletes issue

### Sequence APIs
- `GET /api/sequence/:projectId` - Lists project sequences
- `POST /api/sequence/:projectId` - Creates sequence diagram
  - Body: Diagram data
- `DELETE /api/sequence/:id` - Deletes sequence

### RTM APIs
- `GET /api/rtm/:projectId` - Gets traceability matrix data

### Documentation APIs
- `GET /api/projects/:projectId/documentation` - Generates project docs

## Workflows and Usage Examples

### Typical Project Lifecycle

1. **Project Setup:**
   - Register/Login to dashboard
   - Create new project with name and description
   - Navigate to project workspace

2. **Idea-to-BRD Generation:**
   - Open the Idea to BRD module
   - Enter a rough project idea and optional context
   - Generate and save a structured BRD
   - Convert BRD functional requirements into project requirements when ready

3. **Requirements Gathering:**
   - Add requirements with priorities (Must-Have, Should-Have, Nice-to-Have)
   - Example: "User must authenticate with email and password" (Must-Have)

4. **Test Planning:**
   - For each requirement, create test cases
   - Example: Test login with valid/invalid credentials, check expected outcomes

5. **Sequence Modeling:**
   - Design system interactions using visual builder
   - Example: User login flow with actors (User, System, Database)

6. **Issue Tracking:**
   - Add bugs/enhancements to Kanban board
   - Drag from "To Do" → "In Progress" → "Done"

7. **Coverage Analysis:**
   - Check RTM for untested requirements
   - Aim for 100% coverage before deployment

8. **Documentation:**
   - Generate comprehensive project report
   - Export as Markdown or PDF

### Example API Usage

**Create a requirement:**
```bash
curl -X POST http://localhost:5000/api/requirements/64f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "User login functionality", "priority": "Must-Have"}'
```

**Get RTM data:**
```bash
curl http://localhost:5000/api/rtm/64f1a2b3c4d5e6f7g8h9i0j1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Design Decisions and Assumptions

### Architecture Choices
- **React 19:** Chosen for latest features, concurrent rendering, and ecosystem maturity
- **Vite:** Fast development server and optimized production builds
- **MongoDB:** Flexible schema for varying project structures, easy scaling
- **JWT Authentication:** Stateless sessions, suitable for API-first architecture
- **Modular Frontend:** Lazy loading for performance, clear separation of concerns

### Security Assumptions
- JWT secrets stored securely in environment variables
- Groq API keys are stored only on the backend and never exposed to the React client
- Passwords hashed with bcryptjs (salt rounds: default)
- CORS enabled for cross-origin requests
- User ownership enforced on all data operations

### Data Model Assumptions
- Single user per project (no team collaboration yet)
- Requirements are project-scoped and immutable once created
- BRDs are project-scoped and can be converted into normal project requirements
- Converted BRD functional requirements map into the current `Requirement` shape using title and priority
- Test cases linked 1:many to requirements
- Issues are simple status-based (no complex workflows)

### UI/UX Decisions
- Dark theme with CSS custom properties for consistency
- Responsive design with mobile-first approach
- Subtle grid backgrounds for enterprise feel
- Collapsible help panels for self-service usability

### Performance Considerations
- Lazy loading of route components
- Efficient database queries with Mongoose population
- Client-side caching with localStorage for tokens
- Minimal bundle size with tree-shaking

## Development Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas cluster)

### Environment Variables
**Server (`/server/.env`):**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/initphase (or custom remote URI)
JWT_SECRET=your_secure_random_string
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.1-8b-instant
```

`GROQ_API_KEY` is required only for Idea-to-BRD generation. `GROQ_MODEL` is optional and defaults to `llama-3.1-8b-instant` if omitted.

### Installation Steps
1. **Install Server Dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Install Client Dependencies:**
   ```bash
   cd client
   npm install
   ```

### Execution

1. **Run the Backend (Development Mode):**
   ```bash
   cd server
   npm start
   ```
   *The server runs via nodemon on http://localhost:5000.*

2. **Run the Frontend:**
   ```bash
   cd client
   npm run dev
   ```
   *Vite will compile and serve the frontend, typically on http://localhost:5173.*

## Deployment

To compile the frontend for production distribution:
```bash
cd client
npm run build
```
This yields optimized static files in the `/dist` directory, capable of being served rapidly via any standard static hosting methodology or reverse-proxied through the running Node.js server.

### Production Environment Notes

- **Render backend:** Add `MONGO_URI`, `JWT_SECRET`, `GROQ_API_KEY`, and optionally `GROQ_MODEL` in the Render service environment variables.
- **Vercel frontend:** Add `VITE_API_URL` pointing to the deployed Render backend URL. Do not add `GROQ_API_KEY` to Vercel.
- The backend uses `process.env.PORT || 5000`, so it can run locally on port `5000` and bind correctly to Render's assigned port in production.

## Dummy Data
The `dummy_data.md` file contains data to demonstrate how the active modules of the product are to be used in real world SW project cycles, including deep Somaiya Results testing metrics. The `idea_to_brd_samples.md` file contains reusable Idea-to-BRD inputs for testing Groq-backed BRD generation.

## Upcoming Features

- [x] Idea-to-BRD Conversion: Input raw ideas and convert them into structured Business Requirement Documents (BRD) within InitPhase.
- [ ] Automated User Stories: Transform BRD content into structured user stories and ready-to-use Jira tasks.
- [ ] Jira Integration: Connect InitPhase directly to Jira using a CLI or API wrapper (via npx) for seamless data flow.
- [ ] Professional Diagrams: Export sequence flows into professional diagrams using tools like Lucidchart (via MCP).
- [ ] Natural Language Project Setup: Set up entire projects using natural language commands.
- [ ] GitHub Integration: Link repositories to sync commits with requirements (e.g., REQ-12) and map PRs to features.
- [ ] Email-Based Workflow: Automate weekly reports and risk summaries via email.
- [ ] Calendar & Sprint Integration: Sync project timelines and sprints with Google Calendar.
- [ ] Webhooks System: Enable external tool connectivity via events like `requirement.created`, `testcase.failed`, and `project.updated`.
- [x] Internal Issue Tracker: Built-in drag-and-drop alternative to Jira for task handling natively.
- [ ] Lucidchart MCP Integration
