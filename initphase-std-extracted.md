# InitPhase - STD Extracted Information

### 1. System Overview
* Project Purpose: A comprehensive project management and testing lifecycle application handling requirements, tests, issues, and traceability.
* Major Modules: Auth, Projects, Requirements, Sequence Flows, Test Cases, Issues, RTM, Documentation.
* Tech Stack: MongoDB, Express.js, React, Node.js.

### 2. Features to be Tested
* User Authentication
* Project Management
* Requirements Tracking
* Sequence Flow Building
* Test Case Management
* Issue Tracking
* Traceability Matrix (RTM)
* PDF Documentation Generation

### 3. Testable Units
* Key API Endpoints: `/api/auth`, `/api/projects`, `/api/requirements`, `/api/testcases`, `/api/issues`, `/api/rtm`, `/api/documentation`
* Key UI Actions: Login Submit, Create Project, Add Requirement, Create Test Case, Report Issue, View RTM, Generate PDF. 
* Important Functions: Auth controller, project CRUD, requirement linking, PDF generation logic.

### 4. Test Scenarios

| Testcase ID | Description | Input | Expected Output | Actual Output | Status |
| ----------- | ----------- | ----- | --------------- | ------------- | ------ |
| TC_01 | User login | Valid credentials | Successful login | As expected | Pass |
| TC_02 | Create new project | Valid project details | Project created | As expected | Pass |
| TC_03 | Add requirement | Valid requirement data | Appended to project | As expected | Pass |
| TC_04 | Link requirement | Mismatched ID | Validation error | Error occurred | Fail |
| TC_05 | Create test case | Valid test steps | Linked to project | As expected | Pass |
| TC_06 | Execute test case | Missing status | Rejects execution | Error occurred | Fail |
| TC_07 | Report an issue | Linked to test case | Issue logged | As expected | Pass |
| TC_08 | Generate RTM | valid Project ID | RTM matrix renders | TBD | Pending |
| TC_09 | Export Docs | PDF button click | PDF downloads | Error occurred | Fail |
| TC_10 | Delete project | Valid project ID | Project removed | TBD | Pending |

### 5. Constraints / Gaps
* Missing validations for deeply nested test steps
* Possible edge cases with RTM generation for projects with no requirements
* Incomplete or weak constraint handling on sequence flow limits
* Missing input sanitization on requirement descriptions
* No pagination for large lists of issues

### 6. Testing Environment
* Node.js
* React
* MongoDB
* Browser/Postman
