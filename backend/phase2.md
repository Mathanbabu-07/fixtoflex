# FixToFlex – Plan 2 Development Prompt

## AI Career Intelligence & Personalized Suggestions Engine

### Objective

Implement the **Fix My Profile AI Career Intelligence Engine** that transforms the analysis results generated in **Plan 1** into a personalized career improvement roadmap. This phase must **reuse the cached analysis data** from Plan 1 and **must not trigger profile re-analysis**. Use **Gemini 3.1 Flash Lite** as the reasoning engine to generate highly personalized, actionable, and structured recommendations.

---

# Core Architecture

Do **NOT** re-run LinkedIn, GitHub, Portfolio, or Resume analysis.

Reuse the cached outputs generated in Plan 1.

Workflow:

Candidate Profile

*

LinkedIn Analysis (Cached)

*

GitHub Analysis (Cached)

*

Portfolio Analysis (Cached)

*

Resume Analysis (Cached)

↓

Unified Career Intelligence Context

↓

Gemini 3.1 Flash Lite

↓

Personalized Career Intelligence Report

↓

Store Report in Supabase

↓

Display Suggestions in Fix My Profile

---

# Phase 2.1 – Unified Career Intelligence

Create a centralized AI context by merging:

* Personal Details
* Career Preferences
* Target Role
* Interested Domain
* Target Companies
* Target Location
* Experience
* Technical Skills
* Soft Skills
* Education
* Certifications
* Resume Analysis
* LinkedIn Analysis
* GitHub Analysis
* Portfolio Analysis

Normalize all collected data into a single structured JSON object before sending it to Gemini.

Remove duplicate or conflicting information.

Use this unified context as the **single source of truth** for all recommendations.

---

# Phase 2.2 – Gemini Recommendation Engine

Use Gemini 3.1 Flash Lite to generate personalized recommendations based only on the unified career context.

Generate the following sections:

### 1. Skill Improvement Roadmap

Recommend:

* Programming Languages
* Frameworks
* Libraries
* AI Tools
* Cloud Technologies
* Databases
* Development Tools
* Soft Skills

Each recommendation must include:

* Why it is important
* Learning priority
* Career relevance
* Estimated learning difficulty

---

### 2. Project Roadmap

Recommend projects based on:

* Current skills
* Target role
* Interested domain
* Skill gaps

Each project should include:

* Project title
* Difficulty level
* Technologies
* Learning outcomes
* Portfolio impact
* Recruiter value

Projects should progressively increase in complexity.

---

### 3. Resume Improvement

Generate personalized resume recommendations:

* Missing ATS keywords
* Better project descriptions
* Experience improvements
* Skills ordering
* Achievement quantification
* Resume structure
* Resume customization for target roles

---

### 4. Portfolio Improvement

Recommend improvements for:

* Homepage
* About section
* Featured projects
* UI/UX
* Deployment
* GitHub integration
* Case studies
* Live demos
* Performance
* SEO
* Missing sections

---

### 5. LinkedIn Improvement

Recommend:

* Professional headline
* About section
* Skills section
* Experience section
* Featured section
* Banner
* Profile photo
* Certifications
* Posting strategy
* Content ideas
* Connection strategy
* Networking recommendations
* Recruiter visibility improvements

---

### 6. GitHub Improvement

Recommend:

* Repository organization
* README improvements
* Documentation
* Commit quality
* Pinned repositories
* Open-source contributions
* CI/CD
* Testing
* Deployment
* Project structure

---

# Phase 2.3 – Personalized Career Roadmap

Generate a time-based action plan.

Sections:

### Next 7 Days

Quick improvements and profile updates.

### Next Month

Learning goals, projects, certifications, networking.

### Next 3 Months

Advanced projects, portfolio enhancement, interview preparation.

### Next 6 Months

Career milestones, internship/job readiness, advanced certifications, open-source contributions.

All milestones must align with the candidate's target role and career goals.

---

# Phase 2.4 – Improvement Prioritization

Categorize every recommendation into:

* Critical
* Important
* Optional
* Future

Display recommendations in priority order so candidates know what to complete first.

---

# Phase 2.5 – Dynamic Progress Estimation

Using the current profile analysis, estimate the candidate's improvement potential.

Display:

Current Profile Strength

↓

Expected Profile Strength

Display expected improvements for:

* Overall Profile Score
* ATS Readiness
* Recruiter Visibility
* Career Readiness
* Technical Strength
* Portfolio Quality
* Resume Quality
* LinkedIn Optimization

Show the estimated score increase after implementing the recommendations.

---

# Phase 2.6 – AI Memory & Progress Comparison

Store every generated Career Intelligence Report.

On subsequent executions:

Compare:

Previous Report

↓

Current Report

Identify:

* Improved
* No Change
* Needs Update

Only regenerate sections affected by profile changes.

Do not regenerate the entire report if nothing has changed.

---

# Frontend Requirements

Maintain the existing SaaS UI.

Do not redesign existing layouts.

Replace the placeholder Fix My Profile results with a premium AI-generated report.

Implement:

* Streaming AI response animation
* Typing effect similar to ChatGPT/Claude
* Skeleton loading
* Expandable suggestion cards
* Smooth section transitions
* Progress comparison indicators
* Priority badges (Critical, Important, Optional, Future)
* Score comparison charts
* Timeline roadmap cards

---

# Backend Requirements

Reuse the existing backend architecture.

Create a dedicated **Career Intelligence Service** that:

* Reads cached analysis data
* Builds unified AI context
* Calls Gemini 3.1 Flash Lite
* Stores generated reports
* Handles versioning
* Detects profile changes
* Regenerates only affected sections

Do not modify or duplicate existing profile analysis pipelines.

---

# Database Updates

Create only the necessary tables for:

* Career Intelligence Report
* Recommendation History
* Progress Comparison
* AI Report Version
* Improvement Status
* Recommendation Categories

Reuse existing analysis cache from Plan 1.

---

# Performance Requirements

* Never re-analyze profiles in this phase.
* Always use cached analysis from Plan 1.
* Only regenerate recommendations when profile data changes.
* Minimize Gemini API calls.
* Ensure fast report loading from cache.
* Support future expansion with additional profile sources.

---

# Deliverables

Successfully implement:

* Unified Career Intelligence Engine
* Gemini-powered personalized recommendations
* Skill Improvement Roadmap
* Project Roadmap
* Resume Guidance
* Portfolio Guidance
* LinkedIn Guidance
* GitHub Guidance
* Personalized Career Roadmap
* Improvement Prioritization
* Dynamic Progress Estimation
* AI Memory & Progress Comparison
* Cached recommendation system
* Premium SaaS result presentation

The final output should transform **Fix My Profile** into a true **AI Career Coach**, delivering personalized, data-driven career guidance based on the candidate's complete professional profile while efficiently reusing the infrastructure and cached analysis from Plan 1.

