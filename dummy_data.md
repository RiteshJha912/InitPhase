# Follow-Along Test Guide: E-Commerce Platform Setup

This document is a comprehensive walk-through for structurally testing all features within **InitPhase**. It utilizes a sample "E-Commerce Checkout Application" as the basis for the testing data.

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
2. **Name:** `Admin Tester`
3. **Email:** `admin@ecommerce.test`
4. **Password:** `P@ssw0rd123`
5. **Action:** Click "Register"
   > *Result:* You will automatically authenticate and be routed back to the Login view, or if auto-login is scripted, directed straight to `/dashboard`. 

### 1b. Authenticate Session
1. **Navigate to:** `/login` (if not auto-redirected)
2. **Email:** `admin@ecommerce.test`
3. **Password:** `P@ssw0rd123`
4. **Action:** Click "Login"
   > *Result:* Directed to your project workspace portal.

---

## 2. Project Initializer Stage
1. **Navigate to:** `/dashboard`
2. **Project Name:** `E-Commerce Checkout Redesign`
3. **Description:** `A structural overhaul of the final payment phase, enforcing strict compliance on transaction gateways and shipping options.`
4. **Action:** Click "Create Project"
   > *Result:* A new card appears listed under "Your Projects". Click it to enter the specific isolated workspace `(/projects/:id)`.

---

## 3. Requirements Authoring Phase
Begin by drafting user stories into the Requirement Repository. 

Navigate to the **Requirements Module** using the left navigation sidebar. Structure the data manually line by line:

### Requirement Alpha
- **User Story:** `As a user, I must be securely authenticated before proceeding to payment.`
- **Priority:** `Must-Have`
- **Action:** Click "Author Requirement"

### Requirement Beta
- **User Story:** `As a user, I want the system to calculate tax based on my geo-IP automatically.`
- **Priority:** `Should-Have`
- **Action:** Click "Author Requirement"

### Requirement Gamma
- **User Story:** `As an admin, I must receive immediate notifications upon a failed transaction.`
- **Priority:** `Must-Have`
- **Action:** Click "Author Requirement"

### Requirement Delta
- **User Story:** `As a user, I want subtle confetti animations following a completed payment.`
- **Priority:** `Nice-to-Have`
- **Action:** Click "Author Requirement"

> *Verification Check:* You should now see 4 total requirements on the StatCard. Use the 'Filter by Priority' dropdown set to `Must-Have`—you should see exactly two (Alpha and Gamma) user stories.

---

## 4. Quality Assurance Module Initialization (Test Cases)
Navigate to the **Test Case Module** via the sidebar. We will map execution validations to the configured requirements.

### Test Validation 1
- **Select Requirement:** `[Must-Have] As a user, I must be securely authenticated before proceeding to payment.`
- **Test Case Name:** `Verify unauthorized redirection flow.`
- **Execution Steps:** 
  `1. Clear all session tokens.`
  `2. Navigate directly to /checkout.`
  `3. Validate redirection route.`
- **Expected Result:** `User is instantly vaulted back to /login with state-preserved intent parameters.`
- **Initial Status:** `Pending`
- **Action:** Click "Commit Test Case"

### Test Validation 2
- **Select Requirement:** `[Must-Have] As a user, I must be securely authenticated before proceeding to payment.`
- **Test Case Name:** `Verify successful login persists checkout.`
- **Execution Steps:** 
  `1. Authenticate with valid credentials.`
  `2. Navigate to /checkout.`
- **Expected Result:** `Checkout screen renders securely without authentication challenge.`
- **Initial Status:** `Pass`
- **Action:** Click "Commit Test Case"

### Test Validation 3
- **Select Requirement:** `[Should-Have] As a user, I want the system to calculate tax based on my geo-IP automatically.`
- **Test Case Name:** `Verify cross-border tax manipulation.`
- **Execution Steps:** 
  `1. Mock IP localization to an alternate state (e.g., California).`
  `2. View cart subtotal.`
- **Expected Result:** `Cart subtotal correctly identifies California region tax codes and calculates accurately.`
- **Initial Status:** `Fail`
- **Action:** Click "Commit Test Case"

### Test Validation 4
- **Select Requirement:** `[Must-Have] As an admin, I must receive immediate notifications upon a failed transaction.`
- **Test Case Name:** `Trigger artificial credit card decline webhook.`
- **Execution Steps:** 
  `1. Transmit Stripe declining test card metric.`
  `2. Assess internal admin notification queue.`
- **Expected Result:** `Real-time socket payload received within <1s indicating failure.`
- **Initial Status:** `Pending`
- **Action:** Click "Commit Test Case"

> *Verification Check:* Your "Requirement Coverage Indicator" should display `3 / 4`. 
> Note: The 'Nice-to-Have' confetti requirement intentionally has no operational test cases against it.

---

## 5. Traceability Matrix Testing (RTM Module)
Navigate to the **RTM Analysis Module** via the sidebar.

**Observe the Dashboard Data Structurally:**
1. **Overall Coverage %:** Calculate your coverage string (Currently at precisely 75% coverage).
2. **Untestable Elements:** You should see `1` requirement sitting without tests (The confetti layout requirement).
3. **Execution Failures:** You should see `1` requirement flagged aggressively as failing (The geo-IP tax requirement).

**Interaction Test (Status Update Loop):**
1. Return strictly to the **Test Case Module**.
2. Locate the third test: `Verify cross-border tax manipulation.`
3. Change its status drastically from `Fail` to `Pass` via the select dropdown in the Data Table.
4. Locate the fourth test: `Trigger artificial credit card decline webhook.`
5. Change its status from `Pending` to `Pass`.
6. Return to the **RTM Module**. 

> *Final Verification:* The "Requirements with failures" metric should functionally read 0. The green coverage bar progression remains at `75%`. The overall matrices validate our theoretical transaction integrity—save for the non-essential confetti user story deliberately skipped by QA.

---

## 6. Sequence Flow Builder
Navigate to the **Sequence Flow** module via the sidebar. Give it a test run to visualize your system interactions.

1. **Sequence Title:** `User Payment Flow`
2. **Description:** `Visualizing the checkout transaction between the User, Web System, and Payment Gateway.`
3. **Enter steps (copy and paste this strictly):**
   ```text
   User -> Web System : Submit Checkout
   Web System -> Stripe : Validate Card
   Stripe --> Web System : Charge Succeeded
   Web System --> User : Order Confirmation
   ```
4. **Action:** Click "Generate Sequence Flow"
   > *Result:* A beautiful multi-lane CSS sequence diagram renders dynamically below, highlighting "User", "Web System", and "Stripe" as distinct actors mapping request and response lifelines automatically.

---

## 7. Issue Tracker Initialization
Navigate to the **Issues** module via the sidebar to log tasks, bugs, and enhancements tracked throughout the project lifespan.

### Log Issue 1
- **Issue Title:** `Stripe API Key Rotation Protocol`
- **Description:** `Need to rotate the development Stripe keys before staging deployment.`
- **Type:** `Task`
- **Priority:** `Critical`
- **Assigned To:** `System Architect`
- **Action:** Click "Create Issue" and then "Submit Issue"

### Log Issue 2
- **Issue Title:** `Confetti missing on iOS devices`
- **Description:** `The 'Nice-to-Have' confetti animation is not rendering on Safari mobile.`
- **Type:** `Bug`
- **Priority:** `High`
- **Assigned To:** `Frontend Engineer`
- **Action:** Click "Create Issue" and then "Submit Issue"

### Log Issue 3
- **Issue Title:** `Integrate PayPal Gateway`
- **Description:** `Add PayPal button alongside the credit card component.`
- **Type:** `Enhancement`
- **Priority:** `Low`
- **Assigned To:** `Product Team`
- **Action:** Click "Create Issue" and then "Submit Issue"

> *Verification Check:* The Issues Dashboard should update its StatCards in real-time. You should see 3 'Total Open Issues'. From the Datatable, test out the tracking by clicking "Resolve" on Issue 1. The stats will immediately reflect the new state to 'Resolved Issues: 1' and 'Total Open Issues: 2'.
