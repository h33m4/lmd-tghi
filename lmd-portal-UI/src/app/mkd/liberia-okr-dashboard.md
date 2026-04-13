---
title: "Liberia OKR Dashboard"
lastUpdated: "2026-04-01"
type: "documentation"
description: "How to use and update the Liberia OKR Tracker"
---

## Overview

The **Liberia OKR Dashboard** is a programmatic performance tracking tool built into LMD 2.0. It allows the Liberia country team to define, track, and report on **Objectives and Key Results (OKRs)** — linking organizational goals to measurable outcomes.

Each OKR is made up of:

- An **Objective** — the high-level goal (e.g. "Improve frontline health worker performance")
- A **Key Result** — the specific, measurable indicator used to track progress
- **Monthly updates** — data entries logged each month showing progress against the target
- **Milestones** — key deliverables with due dates and completion status

---

## Navigating to the Dashboard

1. From the left sidebar, go to **Country Programs → Liberia**
2. Select **Dashboards → OKR Dashboard**

The dashboard opens with a summary view showing all active OKRs grouped by objective, along with their current status and progress.

---

## Understanding the Status Indicators

Each OKR and its monthly updates carry a **status**:

| Status | Meaning |
|---|---|
| **On Track** | Progress is proceeding as expected |
| **At Risk** | Progress is lagging — attention needed |
| **Delayed** | Significantly behind schedule |
| **Under Review** | The OKR definition or data is being reviewed |
| **Achieved** | The target has been met |

The overall OKR status is set when submitting a monthly update.

---

## Submitting a Monthly Update

Any logged-in user can submit a monthly progress update for an OKR they are responsible for.

### Steps

1. Click on any OKR card to open the **detail view**
2. Scroll to the **Monthly Updates** section
3. Click **Add Update** for the relevant month
4. Fill in the required fields:
   - **Value** — the measured result for the month (e.g. a percentage, count, or Yes/No)
   - **Status** — select the appropriate status (On Track, At Risk, etc.)
   - **Narrative** — a short explanation of the result and what drove it
   - **Risks** *(optional)* — any risks that could affect future progress
   - **Mitigations** *(optional)* — steps being taken to address those risks
5. Click **Save** to submit the update

> **Note:** Each month can only have one update. If an update already exists for a given month, you will see the existing data when you open that month — you can edit it directly.

### Measurement types

OKRs can measure different things:

- **Percent** — a numerator/denominator (e.g. 45 out of 120 CHWs trained = 37.5%)
- **Number / Count** — a raw figure (e.g. number of facilities visited)
- **Yes / No** — a binary completion indicator
- **Currency** — a monetary value

The update form will show the appropriate input fields based on the OKR's measurement type.

---

## Admin Guide - Managing OKR Records

Users with **admin** or **global publisher** access can create, edit, archive, and configure OKR records.

### Accessing the Admin View

Navigate to **Liberia → OKR Management** (in the admin section of the sidebar). This shows the full admin table with all OKRs including archived records.

### Creating a New OKR

1. Click **Add OKR** in the top-right corner
2. Fill in the configuration:
   - **OKR ID** — a short identifier (e.g. `LBR-KR-01`)
   - **Objective** — the parent goal this key result belongs to
   - **Key Result** — the specific measurable outcome
   - **Period Start / End** — the date range for this OKR
   - **Baseline** — the starting value (before the intervention)
   - **Target Value** — the goal to reach by the end of the period
   - **Measurement Unit** — percent, number, currency, counties, or yes/no
   - **Calculation Method** — how monthly values are rolled up:
     - *Latest* — shows the most recent month's value
     - *Cumulative* — adds up all monthly values
     - *Average* — averages monthly values over the period
   - **Chart Type** — how the data will be visualised (bar, line, pie, geo map)
3. Click **Save**

### Editing an OKR

Click the **edit** icon on any OKR row in the admin table. You can update any field — changes take effect immediately and are reflected across the dashboard.

### Managing Milestones

Within the OKR detail view, admins can:

- **Add a milestone** — enter a description and due date
- **Mark as completed** — set the completion date
- **Delete a milestone** — remove milestones that are no longer relevant

Milestones help the team track key deliverables independently of the monthly data cadence.

### Archiving an OKR

OKRs that are no longer active can be **archived** rather than deleted. Archived OKRs are hidden from the main dashboard but remain accessible in the admin table for historical reference.

To archive, click the archive icon on the OKR row in the admin table and confirm the action.

---

## Tips & Best Practices

- **Update monthly, on time** — the dashboard is most useful when updates are submitted consistently. Aim to log each month's data within the first two weeks of the following month.
- **Write a meaningful narrative** — the narrative field is the most important part of the update. Reviewers rely on it to understand *why* progress is at its current level.
- **Flag risks early** — use the Risks field proactively, not just when something has already gone wrong.
- **Use milestones for qualitative progress** — not everything can be captured in a number. Milestones let you track whether key activities have happened.

---

## Need Help?

If you have questions about the OKR Dashboard, please reach out to the LMD support team or visit the [FAQs](/docs/faqs) section.
