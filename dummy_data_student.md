# Follow-Along Test Guide: University Book Sharing App

This document is a comprehensive walk-through for structurally testing all features within **InitPhase**. It utilizes a sample college student project, "UniShare Book Exchange", as the basis for the testing data.

By executing these steps precisely, the workspace will simulate a production environment, dynamically displaying statistical variations in test tracking, priority matrices, and requirement coverage calculations.

---

## Prerequisites

1. Ensure the Node backend is actively listening.
2. Ensure the Vite frontend development environment is operational.
3. Keep the browser open at `http://localhost:5173`.

---

## 1. Authentication Stage

### 1a. Register a New Subject
1. **Navigate to:** `/register`
2. **Name:** `Student Tester`
3. **Email:** `student@university.test`
4. **Password:** `P@ssw0rd123`
5. **Action:** Click "Register"
   > *Result:* You will automatically authenticate and be routed back to the Login view, or if auto-login is scripted, directed straight to `/dashboard`. 

### 1b. Authenticate Session
1. **Navigate to:** `/login` (if not auto-redirected)
2. **Email:** `student@university.test`
3. **Password:** `P@ssw0rd123`
4. **Action:** Click "Login"
   > *Result:* Directed to your project workspace portal.

---

## 2. Project Initializer Stage
1. **Navigate to:** `/dashboard`
2. **Project Name:** `UniShare Book Exchange`
3. **Description:** `A mobile-first web app allowing university students to lend and borrow semester textbooks safely within campus.`
4. **Action:** Click "Create Project"
   > *Result:* A new card appears listed under "Your Projects". Click it to enter the specific isolated workspace `(/projects/:id)`.

---

## 3. Requirements Authoring Phase
Begin by drafting user stories into the Requirement Repository. 

Navigate to the **Requirements Module** using the left navigation sidebar. Structure the data manually line by line:

### Requirement Alpha
- **User Story:** `User must be able to authenticate using a valid .edu university email address only.`
- **Priority:** `Must-Have`
- **Action:** Click "Author Requirement"

### Requirement Beta
- **User Story:** `Borrowers must be able to search for available books by Course Code or Title.`
- **Priority:** `Must-Have`
- **Action:** Click "Author Requirement"

### Requirement Gamma
- **User Story:** `Users should receive an automated email notification when a requested book becomes available.`
- **Priority:** `Should-Have`
- **Action:** Click "Author Requirement"

### Requirement Delta
- **User Story:** `The system could feature a messaging module to arrange physical campus meetup spots securely.`
- **Priority:** `Nice-to-Have`
- **Action:** Click "Author Requirement"

> *Verification Check:* You should now see 4 total requirements on the StatCard. Use the 'Filter by Priority' dropdown set to `Must-Have`—you should see exactly two (Alpha and Beta) user stories.

---

## 4. Quality Assurance Module Initialization (Test Cases)
Navigate to the **Test Case Module** via the sidebar. We will map execution validations to the configured requirements.

### Test Validation 1
- **Select Requirement:** `[Must-Have] User must be able to authenticate using a valid .edu university email address only.`
- **Test Case Name:** `Verify Login Rejection for Non-EDU Emails`
- **Execution Steps:** 
  `1. Navigate to the registration portal.`
  `2. Input username, password, and email: student@gmail.com.`
  `3. Attempt to submit the registration payload.`
- **Expected Result:** `System rejects submission and displays error "Domain unauthorized. Please use your university email."`
- **Initial Status:** `Pass`
- **Action:** Click "Commit Test Case"

### Test Validation 2
- **Select Requirement:** `[Must-Have] Borrowers must be able to search for available books by Course Code or Title.`
- **Test Case Name:** `Validate Course Code Filter Query`
- **Execution Steps:** 
  `1. Login as an authenticated student.`
  `2. Enter 'CS101' into the global search bar.`
  `3. Execute search protocol.`
- **Expected Result:** `Matrix returns exactly the 3 books currently tagged with CS101 in the database, ignoring title matches.`
- **Initial Status:** `Pending`
- **Action:** Click "Commit Test Case"

### Test Validation 3
- **Select Requirement:** `[Should-Have] Users should receive an automated email notification when a requested book becomes available.`
- **Test Case Name:** `Validate Email Notifier Webhook`
- **Execution Steps:** 
  `1. User 1 adds CS101 book to wishlist.`
  `2. User 2 registers a new CS101 book in inventory.`
  `3. Check User 1 email logs.`
- **Expected Result:** `Automated email is triggered and received within 1 minute.`
- **Initial Status:** `Fail`
- **Action:** Click "Commit Test Case"

> *Verification Check:* Your "Requirement Coverage Indicator" should display `3 / 4`. 
> Note: The 'Nice-to-Have' messaging module requirement intentionally has no operational test cases against it.

---

## 5. Traceability Matrix Testing (RTM Module)
Navigate to the **RTM Analysis Module** via the sidebar.

**Observe the Dashboard Data Structurally:**
1. **Overall Coverage %:** Calculate your coverage string (Currently at precisely 75% coverage).
2. **Untestable Elements:** You should see `1` requirement sitting without tests (The messaging requirement).
3. **Execution Failures:** You should see `1` requirement flagged aggressively as failing (The email webhook).

**Interaction Test (Status Update Loop):**
1. Return strictly to the **Test Case Module**.
2. Locate the third test: `Validate Email Notifier Webhook`.
3. Change its status drastically from `Fail` to `Pass` via the select dropdown in the Data Table.
4. Locate the second test: `Validate Course Code Filter Query`.
5. Change its status from `Pending` to `Pass`.
6. Return to the **RTM Module**. 

> *Final Verification:* The "Requirements with failures" metric should functionally read 0. The green coverage bar progression remains at `75%`. The overall matrices validate our theoretical transaction integrity.
