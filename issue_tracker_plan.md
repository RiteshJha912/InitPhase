#  Internal Issue Tracker: Implementation Plan

This document outlines the roadmap and provides specific prompts to build a lightweight, internal issue tracker module for **InitPhase**.

## 1. Database Schema (`server/models/Issue.js`)
We will create a new schema that links issues to specific projects and allows for assignment to users.

**Fields:**
- `title` (String, Required)
- `description` (String)
- `priority` (Enum: Low, Medium, High, Critical)
- `status` (Enum: Open, In Progress, Resolved, Closed)
- `type` (Enum: Bug, Task, Enhancement)
- `projectId` (ObjectId, Ref: Project)
- `assignedTo` (String - Name or Email)
- `createdAt` (Date)

## 2. API Architecture
Following the project's existing pattern:
- **Routes:** `server/routes/issueRoutes.js`
- **Controller:** `server/controllers/issueController.js`

## 3. Implementation Prompts

###  Phase 1: Backend System
> [!TIP]
> Use this prompt to generate the entire backend logic in one go.

**Prompt:**
```text
"Create the backend logic for a new 'Internal Issue Tracker' module in InitPhase. 
1. Create a Mongoose model at 'server/models/Issue.js' with fields: title, description, priority (Low/Medium/High/Critical), status (Open/In Progress, Resolved, Closed), type (Bug, Task, Enhancement), projectId (ObjectId ref Project), and assignedTo (String).
2. Create 'server/controllers/issueController.js' with CRUD methods: getIssuesByProject, createIssue, updateIssueStatus, and deleteIssue.
3. Create 'server/routes/issueRoutes.js' and protect them with authMiddleware.
4. Export the router and register it in 'server/server.js'."
```

###  Phase 2: Frontend UI
> [!TIP]
> This prompt builds the React page using your existing component library.

**Prompt:**
```text
"Create a new React page component 'client/src/pages/IssuesModule.jsx'. 
1. It should use the existing 'ModuleLayout', 'SectionCard', 'DataTable', and 'StatCard' components.
2. Implement a 'Create Issue' modal/form.
3. Display a list of issues in a DataTable with columns for Title, Type, Priority, Status, and Assigned To.
4. Add status update buttons (e.g., 'Move to Resolved') for each row.
5. Ensure it fetches data based on the ':id' parameter from the URL (the Project ID)."
```

###  Phase 4: Integration & Routing
> [!TIP]
> Use this to finalize the navigation.

**Prompt:**
```text
"Integrate the IssuesModule into the main application:
1. Register the route '/projects/:id/issues' in 'client/src/App.jsx'.
2. Update the sidebar navigation in 'client/src/pages/ProjectWorkspace.jsx' (or wherever the project menu is located) to include a link to the 'Issues' module with a 'Ticket' icon style."
```

## 4. UI/UX Vision
The module should feature a high-level statistics bar at the top:
- **Total Open Issues** (Red/Alert)
- **Tasks in Progress** (Blue/Active)
- **Resolved Today** (Green/Success)

The table should use color-coded badges for priorities (e.g., **CRITICAL** in bold red, **LOW** in subtle grey).

---

