# InitPhase

InitPhase is an enterprise-grade project management workspace designed to facilitate the systematic analysis, planning, and traceability of software requirements and quality assurance processes throughout the development lifecycle.

## Tech Stack Overview

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Routing:** React Router DOM v7
- **Styling:** Vanilla CSS with scoped inline styling for components
- **Architecture:** Modular component-based architecture with dedicated sub-routes for each major feature subsystem.

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js v5
- **Database:** MongoDB
- **ODM:** Mongoose v9
- **Authentication:** JSON Web Tokens (JWT)
- **Security:** BcryptJS for password hashing, CORS enabled.

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
│   │   │   ├── RtmModule.jsx
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
│   │   ├── sequenceController.js
│   │   ├── rtmController.js
│   │   ├── documentationController.js
│   │   └── testCaseController.js
│   ├── middleware/             # Express middlewares (Auth/Security)
│   │   └── authMiddleware.js
│   ├── models/                 # Mongoose database schemas
│   │   ├── Project.js
│   │   ├── Requirement.js
│   │   ├── SequenceFlow.js
│   │   ├── TestCase.js
│   │   └── User.js
│   ├── routes/                 # Express API route declarations
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── requirementRoutes.js
│   │   ├── sequenceRoutes.js
│   │   ├── rtmRoutes.js
│   │   ├── documentationRoutes.js
│   │   └── testCaseRoutes.js
│   ├── .env                    # Secret environment configurations
│   ├── package.json
│   └── server.js               # Primary Express server entry point
│
├── dummy_data.md               # Follow-along testing manual
└── readme.md                   # Enterprise technical documentation
```

### Frontend Architecture (`/client`)
The frontend is implemented as a Single Page Application (SPA) with a heavily modularized routing structure to simulate independent enterprise subsystems.

**Core Routes:**
- `/`: Landing page.
- `/login` & `/register`: Authentication views.
- `/dashboard`: Primary hub for creating and selecting distinct projects.
- `/projects/:id/*`: The enterprise workspace wrapper, which contains nested routes:
  - `/overview`: High-level statistical overview of the project.
  - `/requirements`: The Requirements Management Module.
  - `/sequence`: Text-Based structural modeling into CSS visualizations.
  - `/testcases`: The Test Case Management Module.
  - `/rtm`: The Requirement Traceability Matrix (RTM) Analysis Module.
  - `/documentation`: Dynamic Markdown & PDF Generator combining all project data.

**Shared Components (`/client/src/components`):**
To maintain visual consistency and DRY principles, shared UI components are utilized across modules:
- `ModuleLayout`: Standard wrapper providing title, description, and statistics metrics.
- `StatCard`: Visual component for numerical data representation.
- `SectionCard`: Wrapper for distinct functional areas within a module.
- `DataTable`: Reusable structural table for entity lists.
- `EmptyState`: Placeholder graphics for unpopulated data views.

### Backend Architecture (`/server`)
The server follows an MVC (Model-View-Controller) derived pattern, exposing RESTful API endpoints.

**Core Components:**
- **Models (`/server/models`):** Mongoose schemas defining `User`, `Project`, `Requirement`, and `TestCase`.
- **Controllers (`/server/controllers`):** Business logic handlers for authentication, project management, requirements CRUD, test case execution, and RTM generation.
- **Routes (`/server/routes`):** Express routers mapping HTTP methods to corresponding controller logic.
- **Middleware (`/server/middleware`):** Reusable request interceptors, primarily `authMiddleware` for intercepting and verifying JWT tokens.

## Features

1. **Authentication:** Secure user registration, login, and tokenized session persistence.
2. **Project Segregation:** Users can maintain multiple isolated project environments.
3. **Requirements Management:** Authoring interface for user stories with priority scaling (Must-Have, Should-Have, Nice-to-Have).
4. **Sequence Flow Generator:** Transform simple text-based UML interactions into beautiful multi-lane responsive architecture visualizations.
5. **Test Case Console:** Ability to map technical test executions directly to specific requirements, tracking expected vs. actual outcomes.
6. **Traceability Matrix (RTM):** Real-time analytical matrix calculating requirement coverage ratios, highlighting untested or failing requirements.
7. **Documentation Generator:** Automates comprehensive project reporting, bundling overview, test logs, sequence diagrams, and traceability matrices into downloadable Markdown or elegantly styled, branded PDFs.

## API Contracts

All protected routes require an `Authorization` header containing the JWT: `Bearer <token>`.

- **Auth APIs:**
  - `POST /api/auth/register` - Creates a new user.
  - `POST /api/auth/login` - Authenticates and returns a JWT.

- **Project APIs:**
  - `GET /api/projects` - Retrieves all projects for the authenticated user.
  - `POST /api/projects` - Creates a new project.
  - `GET /api/projects/:id` - Retrieves singular project details.

- **Requirement APIs:**
  - `GET /api/requirements/:projectId` - Fetches all requirements for a project.
  - `POST /api/requirements/:projectId` - Authors a new requirement.
  - `DELETE /api/requirements/:reqId` - Removes a requirement.

- **Test Case APIs:**
  - `GET /api/testcases/:projectId` - Retrieves project-wide test cases.
  - `POST /api/testcases/:projectId/:requirementId` - Maps a new test case to a specific requirement.
  - `PATCH /api/testcases/:testId/status` - Updates execution status (Pass/Fail/Pending).

- **Sequence Flow APIs:**
  - `GET /api/sequence/:projectId` - Fetch all sequence diagrams for a project.
  - `POST /api/sequence/:projectId` - Generates and persists a system sequence model.
  - `DELETE /api/sequence/:id` - Deletes the generated logical diagram.

- **Analytical APIs:**
  - `GET /api/rtm/:projectId` - Aggregates requirements and dynamically cross-references test case statuses returning the structural traceability matrix.

- **Documentation Generating APIs:**
  - `GET /api/projects/:projectId/documentation` - Smart endpoint aggregating all relevant architecture, timeline, Sequence flow data, and RTM status matrices into a standardized export payload.

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
```

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

## Dummy Data
The dummy data files contain, data to demonstrate how the active modules of the product are to be used in real world SW project cycles.

ok so for now, 
1) Update the Dummy data, inlude more diagram modules 
2) Scale with AI, BRD, Github, Jira etc 
