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

The application is structured into two main directories: `client` and `server`.

### Frontend Architecture (`/client`)
The frontend is implemented as a Single Page Application (SPA) with a heavily modularized routing structure to simulate independent enterprise subsystems.

**Core Routes:**
- `/`: Landing page.
- `/login` & `/register`: Authentication views.
- `/dashboard`: Primary hub for creating and selecting distinct projects.
- `/projects/:id/*`: The enterprise workspace wrapper, which contains nested routes:
  - `/overview`: High-level statistical overview of the project.
  - `/requirements`: The Requirements Management Module.
  - `/testcases`: The Test Case Management Module.
  - `/rtm`: The Requirement Traceability Matrix (RTM) Analysis Module.

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
4. **Test Case Console:** Ability to map technical test executions directly to specific requirements, tracking expected vs. actual outcomes.
5. **Traceability Matrix (RTM):** Real-time analytical matrix calculating requirement coverage ratios, highlighting untested or failing requirements.

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

- **Analytical APIs:**
  - `GET /api/rtm/:projectId` - Aggregates requirements and dynamically cross-references test case statuses returning the structural traceability matrix.

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