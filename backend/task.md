FixToFlex – Fix My Profile "My Target" Career Intelligence (Development Prompt)
Objective

Implement a new 🎯 My Target feature inside the Fix My Profile section.

This feature allows candidates to choose one target company and one target job role, then automatically collect real hiring expectations from Indeed and Internshala, compare them against the candidate's complete profile, and generate a detailed AI career improvement report.

Reuse the existing Scrape.do + Gemini 3.1 Flash Lite + backend workflow + analysis pipeline + cache structure. Do not create duplicate pipelines.

1. UI

Add a new 🎯 My Target button in the top-right area of the Fix My Profile card.

Style:

Same design language as existing buttons.
Secondary purple outline/button style.
Responsive.

Clicking it opens a centered modal with a close (×) button.

2. Target Modal

Collect only the following fields.

Target Company
Searchable autocomplete dropdown.
Only one company can be selected.
Suggest companies while typing.
Allow custom company names.
Target Job Role
Searchable autocomplete dropdown.
Only one role can be selected.
Suggest roles while typing.
Allow custom roles.
Preferred Location (Optional)
Single searchable dropdown.
Indian states/cities.
Button

Replace Fetch Results with

Search & Analyze

Disable until Company + Job Role are selected.

3. Backend Workflow

When the user clicks Search & Analyze, reuse the existing backend architecture.

Pipeline:

Target Company
        +
Target Job Role
        +
Location (Optional)
        │
        ▼
Generate Search Queries
        │
        ▼
Scrape.do
        │
        ▼
Indeed
        +
Internshala
        │
        ▼
Extract Matching Jobs
        │
        ▼
Extract Full Job Description
Responsibilities
Requirements
Preferred Skills
Qualifications
Experience
Company Expectations
        │
        ▼
Normalize & Merge Data
        │
        ▼
Gemini 3.1 Flash Lite
        │
        ▼
Compare With Candidate Profile
        │
        ▼
Generate Career Intelligence Report
4. Scraping Rules

Search only for

Selected Company
Selected Role
Optional Location

Scrape from:

Indeed
Internshala

Extract:

Job title
Company
Location
Salary
Employment type
Full Job Description
Responsibilities
Required Skills
Preferred Skills
Experience
Education
Technologies
Tools
Frameworks
Apply URL

Merge duplicate postings from both platforms.

5. AI Analysis

Reuse the existing candidate analysis.

Load existing:

Career Preferences
Skills
Resume Analysis
Portfolio Analysis
GitHub Analysis
LinkedIn Analysis

Do not re-run these analyses if cached.

Use the cached profile intelligence.

Only scrape fresh company/job requirements.

6. Gemini Analysis

Gemini should compare

Candidate Profile

↓

Target Company Requirements

Generate a structured report.

Section 1 — Company Hiring Expectations

Show exactly what the company is looking for.

Include:

Role Overview
Responsibilities
Required Skills
Preferred Skills
Required Tools
Required Frameworks
Experience Expectations
Education Requirements

Use the scraped job descriptions.

Do not invent requirements.

Section 2 — Match Analysis

Show

Current Match Score

Strengths

Weaknesses

Missing Skills

Missing Technologies

Missing Experience

Explain why.

Section 3 — Skill Improvement Roadmap

Recommend:

Programming Languages

Frameworks

Libraries

Cloud Platforms

AI Tools

Developer Tools

Soft Skills

Learning order

Prioritize as:

Critical

Important

Nice to Have

Section 4 — Project Roadmap

Recommend projects that directly improve the candidate's chances.

For every project include:

Project Title
Difficulty
Objective
Required Skills
Tech Stack
Features
Expected Outcome
Why it matches the company

Arrange Beginner → Intermediate → Advanced.

Section 5 — Resume Improvements

Generate company-specific suggestions.

Recommend:

Resume headline
Summary improvements
ATS keywords
Skills ordering
Project ordering
Bullet improvements
Missing sections
Experience wording
Achievement formatting
Certifications to include

Tailor everything to the selected company and role.

Section 6 — Portfolio Improvements

Recommend:

Homepage improvements
Featured projects
Skills section
Technology badges
Project descriptions
Live demos
GitHub links
Case studies
UI improvements
Recruiter-focused content

Everything should align with the selected company.

Section 7 — Career Action Plan

Generate an implementation roadmap.

Example:

Week 1

Week 2

Month 1

Month 2

Month 3

Prioritize tasks from highest impact to lowest.

7. Excluded Sections

Do not generate:

LinkedIn Improvements
GitHub Improvements

Those remain part of the existing Career Intelligence workflow.

8. Caching

Cache the report separately.

Cache key:

userId
+
company
+
role
+
location

Do not regenerate if the same target is searched again.

Allow regeneration only when:

Company changes
Role changes
Location changes
User clicks Analyze Now
9. UI Result

Reuse the existing Career Intelligence page.

Do not create a new page.

Replace the generic recommendations with this target-specific report.

Keep the existing clean unified layout.

Display sections in order:

Company Hiring Expectations
Match Analysis
Skill Improvement Roadmap
Project Roadmap
Resume Improvements
Portfolio Improvements
Career Action Plan

Use collapsible sections and smooth loading animations consistent with the existing UI.

10. Error Handling
If no matching jobs are found, display a clear message asking the user to try another company, role, or location.
If only one source (Indeed or Internshala) succeeds, generate the report from the available data.
Never fabricate company requirements when scraping returns no valid job descriptions.
Deliverables
Add a 🎯 My Target button to the Fix My Profile page.
Implement a modal with one target company, one target role, optional location, and a Search & Analyze button.
Reuse the existing Scrape.do + Gemini + analysis pipeline; only scrape fresh company/job data while reusing cached candidate profile analysis.
Scrape and merge real job requirements from Indeed and Internshala.
Generate a detailed, company-specific AI report including Company Hiring Expectations, Match Analysis, Skill Roadmap, Project Roadmap, Resume Improvements, Portfolio Improvements, and a Career Action Plan.
Cache target reports independently and regenerate only when the target changes or the user explicitly requests a fresh analysis.