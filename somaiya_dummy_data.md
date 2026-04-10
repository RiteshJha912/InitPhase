# Follow-Along Test Guide: Somaiya Results Declaration App

This document is a short walk-through for structurally testing features within **InitPhase**, utilizing a simple "Somaiya Results Declaration App" as the testing data. This is ideal for quick, live demonstrations.

---

## 1. Project Initializer Stage
1. **Navigate to:** `/dashboard`
2. **Project Name:** `Somaiya Results Declaration Portal`
3. **Description:** `A basic portal for college and university students to view their semester results securely.`
4. **Action:** Click "Create Project"

---

## 2. Requirements Authoring Phase
Navigate to the **Requirements Module** using the left navigation sidebar. Structure the data manually:

### Requirement 1
- **User Story:** `As a student, I want to log in using my Somaiya ID to view my grades.`
- **Priority:** `Must-Have`

### Requirement 2
- **User Story:** `As a professor, I want an admin dashboard to upload CSV files of final results.`
- **Priority:** `Should-Have`

---

## 3. Quality Assurance Module Initialization (Test Cases)
Navigate to the **Test Case Module** via the sidebar.

### Test Validation 1
- **Select Requirement:** `[Must-Have] As a student, I want to log in using my Somaiya ID...`
- **Test Case Name:** `Verify Somaiya Mail OAuth Login.`
- **Execution Steps:** 
  `1. Click "Login with Somaiya ID".`
  `2. Enter valid @somaiya.edu credentials.`
- **Expected Result:** `User is authenticated and redirected to their results dashboard.`
- **Initial Status:** `Pass`

### Test Validation 2
- **Select Requirement:** `[Should-Have] As a professor, I want an admin dashboard...`
- **Test Case Name:** `Verify CSV Upload Rejection.`
- **Execution Steps:** 
  `1. Login as Admin.`
  `2. Upload an invalid .pdf file instead of .csv.`
- **Expected Result:** `System throws an error preventing the upload.`
- **Initial Status:** `Fail`

---

## 4. Sequence Flow Builder
Navigate to the **Sequence Flow** module via the sidebar. 

1. **Sequence Title:** `Result Fetching Flow`
2. **Description:** `Visualizing the process of a student requesting their results.`
3. **Enter steps (copy and paste this strictly):**
   ```text
   Student -> Web Portal : Request Semester Results
   Web Portal -> Authentication Server : Verify Somaiya ID Session
   Authentication Server --> Web Portal : Session Valid
   Web Portal -> University Database : Fetch Grades by ID
   University Database --> Web Portal : Return Grades Array
   Web Portal --> Student : Render Result PDF
   ```
4. **Action:** Click "Generate Sequence Flow"

---

## 5. Issue Tracker Initialization
Navigate to the **Issues** module via the sidebar.

### Log Issue 1
- **Issue Title:** `Grades not reflecting for Backlog students`
- **Description:** `Students with ATKT from the previous semester are seeing an empty array instead of their updated results.`
- **Type:** `Bug`
- **Priority:** `Critical`
- **Assigned To:** `Backend Team`

### Log Issue 2
- **Issue Title:** `Add "Share to LinkedIn" button`
- **Description:** `Allow students to directly share achievement badges linked to their CGPA.`
- **Type:** `Enhancement`
- **Priority:** `Low`
- **Assigned To:** `Frontend Team`
