# Dummy Data: Freelance Project - Local Bakery Ordering System

This document contains a very simple, relatable dataset designed for a freelance web developer building a custom ordering application for a client's local bakery.

## Project Details
- **Project Name:** The Crusty Loaf Online Ordering
- **Description:** A bespoke frontend and eCommerce backend allowing customers to order custom cakes and daily breads ahead of time to skip the morning queue.

---

## Authoritative Requirements

**1. Must-Have (Critical)**
- **Title:** The system must process orders securely using a third-party payment gateway (Stripe).
- **Title:** The checkout cart must block orders placed past 8:00 PM for next-day pickup.
- **Title:** The bakery owner must have an admin dashboard to view daily active orders and mark them as "Completed".

**2. Should-Have (High)**
- **Title:** The system should send an SMS notification to the customer when their order is ready for pickup.
- **Title:** The menu should allow filtering items by "Vegan" and "Gluten-Free" dietary tags.

**3. Nice-to-Have (Low)**
- **Title:** The app could feature an interactive calendar letting users select their desired pickup date up to 30 days in advance.

---

## Test Executions (Validation Protocols)

**Parent Requirement:** The checkout cart must block orders placed past 8:00 PM for next-day pickup.
- **Test Instance Nomenclature:** Prevent Late Next-Day Pickups
- **Sequential Context Operations:**
  1. Set system mock time to 8:15 PM locally.
  2. Add a "Sourdough Loaf" to the cart.
  3. Attempt to select tomorrow's date on the checkout schedule.
- **Anticipated Console State Results:** Tomorrow's date is greyed out. The system flashes a toast message saying, "Next-day orders close at 8 PM."
- **Initial Return Code:** Process: Pass

**Parent Requirement:** The menu should allow filtering items by dietary tags.
- **Test Instance Nomenclature:** Verify Vegan Tag Filter Accuracy
- **Sequential Context Operations:**
  1. Load the primary menu payload.
  2. Click the specific "Vegan Only" toggle pill button.
- **Anticipated Console State Results:** Structural DOM updates to strictly show 4 vegan items. The "Butter Croissant" is successfully removed from view.
- **Initial Return Code:** Process: Fail
