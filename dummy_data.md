# Somaiya Results Declaration System - Demo Data Guide

This document is a comprehensive walk-through for testing all features within **InitPhase**. It utilizes the "Somaiya Results Declaration System" as the basis for the testing data.

Follow these steps directly to populate your workspace with minimum but sufficient data to showcase the proper working, interactive tools, and layout flow of all modules.

---

## 1. Authentication Stage

1. **Navigate to:** `/register`
2. **Name:** `Demo Tester`
3. **Email:** `demo@somaiya.test`
4. **Password:** `Admin@123`
5. **Action:** Click "Register"
6. *If not auto-redirected, log in using those credentials.*

---

## 2. Project Initializer Stage
1. **Navigate to:** `/dashboard`
2. **Project Name:** `Somaiya Results Declaration Portal`
3. **Description:** `A centralized academic result declaration and transcript management system for Somaiya Vidyavihar students, fetching real-time grades from the university database.`
4. **Action:** Click "Create Project". You will instantly navigate to the **Requirements Module**.

---

## 3. Requirements Authoring Phase
Add these user stories using the interactive input controls.

### Requirement 1
- **Title:** `Students must securely authenticate using their Somaiya SVV NetID.`
- **Priority:** Click `Must-Have` pill.
- **Action:** Click "Add Requirement"

### Requirement 2
- **Title:** `The dashboard should prominently display real-time SGPA and total CGPA.`
- **Priority:** Click `Must-Have` pill.
- **Action:** Click "Add Requirement"

### Requirement 3
- **Title:** `Students must be able to generate and download an official PDF transcript.`
- **Priority:** Click `Should-Have` pill.
- **Action:** Click "Add Requirement"

### Requirement 4
- **Title:** `Implement a Dark Mode toggle for students checking results late at night.`
- **Priority:** Click `Nice-to-Have` pill.
- **Action:** Click "Add Requirement"

> *Verification:* You will see 4 beautiful, distinct cards rendered in the masonry grid layout, distinctly colored by their priorities. 

---

## 4. Quality Assurance Setup (Test Cases)
Navigate to the **Test Execution Module**. 

### Test Case 1
- **Requirement:** `[Must-Have] Students must securely authenticate...`
- **Title:** `Verify SVV NetID LDAP validation.`
- **Steps:** `1. Enter mock SVV NetID\n2. Trigger login event`
- **Expected Result:** `User successfully routed to student dashboard.`
- **Status:** Select `Pass`

### Test Case 2
- **Requirement:** `[Must-Have] The dashboard should prominently display...`
- **Title:** `Verify semester CGPA calculation accuracy.`
- **Steps:** `1. Fetch mock grade payload\n2. Run calculation engine against 5 subjects`
- **Expected Result:** `Total grade correctly calculates and avoids floating point math errors.`
- **Status:** Select `Fail` (to test RTM functionality later)

### Test Case 3
- **Requirement:** `[Should-Have] Students must be able to generate...`
- **Title:** `Test PDF generation formatting and timeout limits.`
- **Steps:** `1. Request transcript download\n2. Validate styling logic`
- **Expected Result:** `PDF rendered in <3s with university watermarks.`
- **Status:** Select `Pending`

> *Verification:* You'll see the test rows rendered. Click on a row—it will elegantly slide down to display the nested steps and expected results!

---

## 5. Traceability & Updates (RTM Module)
Navigate to the **Dashboard / Analytics Matrix**.

1. **Overall Statistics:** You should view 75% coverage (1 requirement left uncovered - Dark Mode).
2. **Issue Detected:** One requirement will flag dynamically as failing (The CGPA calc test).
3. **Resolution Simulation:** 
   - Go back to **Test Execution Module**.
   - Edit Test Case 2 from `Fail` to `Pass`.
   - Edit Test Case 3 from `Pending` to `Pass`.
   - Go back to **Dashboard**. The matrix will reflect full compliance for the tested core components!

---

## 6. Sequence Flow Builder
Navigate to the **Sequence Flow** module. Ensure the "Visual Builder" tab is active.

**Sequence Title:** `SVV Student Login Flow`
**Description:** `Visualization of SSO network routing.`

Add the following steps iteratively by typing in the Visual Builder rows:

1. **Sender:** `Student` | **Receiver:** `SVV Portal` | **Message:** `Enter NetID Credentials`
2. **Sender:** `SVV Portal` | **Receiver:** `LDAP Server` | **Message:** `Validate Authenticity`
3. **Sender:** `LDAP Server` | **Receiver:** `SVV Portal` | **Message:** `Auth Success Token`
4. **Sender:** `SVV Portal` | **Receiver:** `Student` | **Message:** `Render Result Dashboard`

**Action:** Click "Generate Sequence Flow".
> *Verification:* A dynamic CSS-mapped sequence graph will be drawn matching exact request vectors. Response packets like "Auth Success Token" automatically translate to dashed lifelines natively!

---

## 7. Issue Tracker (Kanban Board)
Navigate to the **Issues** module. This features a dynamic HTML5 drag-and-drop Kanban Board structure.

**Log the following three issues by clicking "Create Issue":**

### Issue 1
- **Title:** `Grades not reflecting for Backlog students`
- **Description:** `Students with ATKT from the previous semester are seeing an empty array instead of their updated results.`
- **Type:** `Bug` | **Priority:** `Critical` | **Assigned:** `@BackendTeam`

### Issue 2
- **Title:** `PDF Generation timeout for massive transcripts`
- **Description:** `8th-semester students with large histories face a 504 gateway timeout waiting for their transcript creation.`
- **Type:** `Task` | **Priority:** `High` | **Assigned:** `@OpsTeam`
- *(Move this issue manually after creation to "In Progress")*

### Issue 3
- **Title:** `Add "Share to LinkedIn" button on results page`
- **Description:** `Add a quick-share widget for graduating students.`
- **Type:** `Enhancement` | **Priority:** `Low` | **Assigned:** `@FrontendEng`

> *Verification Check:* Your dynamic Kanban columns will instantly reflect tasks logic. Pick up an Issue card and simply **DRAG AND DROP** it into another column to instantly watch the internal tracking state update visually!
