# Follow-Along Test Guide: Local Bakery Ordering System

This document is a comprehensive walk-through for structurally testing all features within **InitPhase**. It utilizes a sample freelance project, "The Crusty Loaf Online Ordering", as the basis for the testing data.

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
2. **Name:** `Freelance Dev`
3. **Email:** `dev@freelance.test`
4. **Password:** `P@ssw0rd123`
5. **Action:** Click "Register"
   > *Result:* You will automatically authenticate and be routed back to the Login view, or if auto-login is scripted, directed straight to `/dashboard`. 

### 1b. Authenticate Session
1. **Navigate to:** `/login` (if not auto-redirected)
2. **Email:** `dev@freelance.test`
3. **Password:** `P@ssw0rd123`
4. **Action:** Click "Login"
   > *Result:* Directed to your project workspace portal.

---

## 2. Project Initializer Stage
1. **Navigate to:** `/dashboard`
2. **Project Name:** `The Crusty Loaf Online Ordering`
3. **Description:** `A bespoke frontend and eCommerce backend allowing customers to order custom cakes and daily breads ahead of time to skip the morning queue.`
4. **Action:** Click "Create Project"
   > *Result:* A new card appears listed under "Your Projects". Click it to enter the specific isolated workspace `(/projects/:id)`.

---

## 3. Requirements Authoring Phase
Begin by drafting user stories into the Requirement Repository. 

Navigate to the **Requirements Module** using the left navigation sidebar. Structure the data manually line by line:

### Requirement Alpha
- **User Story:** `The checkout cart must block orders placed past 8:00 PM for next-day pickup.`
- **Priority:** `Must-Have`
- **Action:** Click "Author Requirement"

### Requirement Beta
- **User Story:** `The systems must process orders securely using a third-party payment gateway (Stripe).`
- **Priority:** `Must-Have`
- **Action:** Click "Author Requirement"

### Requirement Gamma
- **User Story:** `The menu should allow filtering items by "Vegan" and "Gluten-Free" dietary tags.`
- **Priority:** `Should-Have`
- **Action:** Click "Author Requirement"

### Requirement Delta
- **User Story:** `The app could feature an interactive calendar letting users select their desired pickup date up to 30 days in advance.`
- **Priority:** `Nice-to-Have`
- **Action:** Click "Author Requirement"

> *Verification Check:* You should now see 4 total requirements on the StatCard. Use the 'Filter by Priority' dropdown set to `Must-Have`—you should see exactly two (Alpha and Beta) user stories.

---

## 4. Quality Assurance Module Initialization (Test Cases)
Navigate to the **Test Case Module** via the sidebar. We will map execution validations to the configured requirements.

### Test Validation 1
- **Select Requirement:** `[Must-Have] The checkout cart must block orders placed past 8:00 PM for next-day pickup.`
- **Test Case Name:** `Prevent Late Next-Day Pickups`
- **Execution Steps:** 
  `1. Set system mock time to 8:15 PM locally.`
  `2. Add a Sourdough Loaf to the cart.`
  `3. Attempt to select tomorrow's date.`
- **Expected Result:** `Tomorrow's date is greyed out. The system flashes a toast message saying, "Next-day orders close at 8 PM."`
- **Initial Status:** `Pass`
- **Action:** Click "Commit Test Case"

### Test Validation 2
- **Select Requirement:** `[Must-Have] The systems must process orders securely using a third-party payment gateway (Stripe).`
- **Test Case Name:** `Verify successful Stripe payment session`
- **Execution Steps:** 
  `1. Checkout with test card details 4242 4242...`
  `2. Complete the checkout flow.`
- **Expected Result:** `Payment succeeds and order is added to the backend.`
- **Initial Status:** `Pending`
- **Action:** Click "Commit Test Case"

### Test Validation 3
- **Select Requirement:** `[Should-Have] The menu should allow filtering items by "Vegan" and "Gluten-Free" dietary tags.`
- **Test Case Name:** `Verify Vegan Tag Filter Accuracy`
- **Execution Steps:** 
  `1. Load the primary menu payload.`
  `2. Click the specific "Vegan Only" toggle pill button.`
- **Expected Result:** `Structural DOM updates to strictly show vegan items. Non-vegan items disappear.`
- **Initial Status:** `Fail`
- **Action:** Click "Commit Test Case"

> *Verification Check:* Your "Requirement Coverage Indicator" should display `3 / 4`. 
> Note: The 'Nice-to-Have' interactive calendar requirement intentionally has no operational test cases against it.

---

## 5. Traceability Matrix Testing (RTM Module)
Navigate to the **RTM Analysis Module** via the sidebar.

**Observe the Dashboard Data Structurally:**
1. **Overall Coverage %:** Calculate your coverage string (Currently at precisely 75% coverage).
2. **Untestable Elements:** You should see `1` requirement sitting without tests (The calendar requirement).
3. **Execution Failures:** You should see `1` requirement flagged aggressively as failing (The Vegan tag filter).

**Interaction Test (Status Update Loop):**
1. Return strictly to the **Test Case Module**.
2. Locate the third test: `Verify Vegan Tag Filter Accuracy`.
3. Change its status drastically from `Fail` to `Pass` via the select dropdown in the Data Table.
4. Locate the second test: `Verify successful Stripe payment session`.
5. Change its status from `Pending` to `Pass`.
6. Return to the **RTM Module**. 

> *Final Verification:* The "Requirements with failures" metric should functionally read 0. The green coverage bar progression remains at `75%`. The overall matrices validate our structural integrity.
