# Dummy Data: Student Project - University Book Sharing App

This document provides a set of relatable, simple dummy data for adding a "Student Project" into the InitPhase structured environment.

## Project Details
- **Project Name:** UniShare Book Exchange
- **Description:** A mobile-first web app allowing university students to lend and borrow semester textbooks safely within campus.

---

## Authoritative Requirements

**1. Must-Have (Critical)**
- **Title:** User must be able to authenticate using a valid `.edu` university email address only.
- **Title:** The system must allow users to list a textbook by ISBN and set its condition (New, Good, Fair).
- **Title:** Borrowers must be able to search for available books by Course Code or Title.

**2. Should-Have (High)**
- **Title:** The system should implement a 7-day lending countdown timer displaying days remaining.
- **Title:** Users should receive an automated email notification when a requested book becomes available.

**3. Nice-to-Have (Low)**
- **Title:** The system could feature a messaging module to arrange physical campus meetup spots securely.

---

## Test Executions (Validation Protocols)

**Parent Requirement:** User must be able to authenticate using a valid `.edu` university email address only.
- **Test Instance Nomenclature:** Verify Login Rejection for Non-EDU Emails
- **Sequential Context Operations:**
  1. Navigate to the registration portal.
  2. Input username, password, and email: "student@gmail.com".
  3. Attempt to submit the registration payload.
- **Anticipated Console State Results:** System rejects submission and displays error "Domain unauthorized. Please use your university email."
- **Initial Return Code:** Process: Pass

**Parent Requirement:** Borrower must be able to search for available books by Course Code.
- **Test Instance Nomenclature:** Validate Course Code Filter Query
- **Sequential Context Operations:**
  1. Login as an authenticated student.
  2. Enter 'CS101' into the global search bar.
  3. Execute search protocol.
- **Anticipated Console State Results:** Matrix returns exactly the 3 books currently tagged with CS101 in the database, ignoring title matches.
- **Initial Return Code:** Process: Pending
