FixToFlex – Multi-Source Job Tracker (Indeed + Internshala) Development Prompt
Objective

Extend the existing Job Tracker by integrating Internshala Jobs while preserving the current Indeed workflow, backend architecture, UI, caching, Gemini ranking, and data pipeline.

The Job Tracker should aggregate jobs from Indeed and Internshala into a single experience while clearly indicating the source of each job.

1. Existing Architecture (Do Not Change)

Reuse the existing:

FastAPI backend
Scrape.do service layer
Gemini 3.1 Flash Lite ranking pipeline
Candidate profile context
Job ranking algorithm
Cache mechanism
Supabase schemas
Existing Job Tracker UI
Existing loading animations
Existing error handling

Only extend the pipeline to support Internshala.

2. Job Sources

The Track My Jobs workflow should fetch jobs from:

Indeed
Internshala

using the same candidate profile.

Candidate Context:

Target Role
Interested Domain
Skills
Experience
Preferred Location
Target Companies
Target Salary (optional)
3. Scraping Pipeline

For both sources:

Candidate Profile
        │
        ▼
Generate Search Query
        │
        ▼
Scrape.do
        │
        ▼
Extract Jobs
        │
        ▼
Normalize JSON
        │
        ▼
Gemini 3.1 Flash Lite
        │
        ▼
Ranking & Match Score
        │
        ▼
Combined Job List

Do not create a separate architecture for Internshala.

Reuse the existing Indeed pipeline.

4. Internshala Extraction

Scrape

https://internshala.com/jobs/

Extract:

Job Title
Company
Company Logo
Location
Salary / CTC
Experience
Employment Type
Posted Date
Job Description
Required Skills
Company Name
Job URL
Apply URL
Company Profile URL

Normalize to the same schema used by Indeed.

5. Unified Job Model

Both Indeed and Internshala jobs must return exactly the same JSON structure.

Example:

{
  "source": "Indeed",
  "title": "",
  "company": "",
  "company_logo": "",
  "location": "",
  "salary": "",
  "experience": "",
  "posted_date": "",
  "description": "",
  "skills": [],
  "match_score": 90,
  "job_url": "",
  "apply_url": ""
}

Internshala should populate the same fields.

6. Combined Job List UI

Use the same existing Job Tracker layout.

Do not redesign it.

The left panel should display a unified list containing jobs from both platforms.

Each job card should show:

Official platform logo
Indeed logo
Internshala logo
Job Title
Company
Location
Match Score
Salary
Platform Badge

Example:

Indeed Logo
AI Engineer
Google

Internshala Logo
ML Engineer
Tech Company

The platform source should be immediately visible.

7. Job Details Panel

Reuse the current right-side details panel.

Do not create a new design.

Display:

Company Logo
Job Title
Company
Location
Salary
Experience
Work Mode
Description
Required Skills
Gemini Match Analysis
Matching Skills
Missing Skills

If source == Indeed

show

Apply on Indeed

If source == Internshala

show

Apply on Internshala

Use the official platform branding.

8. Apply Button

Maintain the same logic already implemented for Indeed.

During scraping extract:

apply_url
job_url

Priority:

apply_url
      ↓
job_url
      ↓
Disable Apply Button

Never return

N/A
Empty URLs

When clicked:

Indeed jobs

↓

Open actual Indeed application page.

Internshala jobs

↓

Open actual Internshala application page.

Do not redirect to internal routes.

Do not fabricate URLs.

9. Independent Scroll Areas

Improve the viewing experience by making both panels independently scrollable.

Left Panel

Scrollable Job List

Vertical scrolling
Infinite scrolling / pagination support
Position preserved after selecting jobs
Right Panel

Scrollable Job Details

Description
Responsibilities
Skills
Gemini Insights

Scrolling the details panel must not move the job list.

Scrolling the list must not affect the details panel.

10. Gemini Ranking

Gemini receives jobs from both platforms together.

Responsibilities:

Remove duplicates
Rank by candidate relevance
Generate Match Score
Explain why the job matches
Detect missing skills
Prioritize better opportunities regardless of source

Never fabricate jobs.

Only analyze scraped data.

11. Cache

Reuse the existing cache.

Cache both sources together.

Refresh only when:

Refresh Jobs clicked
Candidate profile updated
Career preferences changed
Cache expired

Avoid unnecessary API calls.

12. Loading Experience

Maintain the existing premium SaaS UI.

Show:

Loading skeletons
Progressive job loading
Smooth source merging
Incremental rendering
No UI blocking
13. Error Handling

Handle independently:

Indeed unavailable

↓

Show Internshala jobs.

Internshala unavailable

↓

Show Indeed jobs.

Both unavailable

↓

Display a friendly "No jobs available" state.

The failure of one platform must never stop the other.

14. Final Deliverables
Extend the existing Job Tracker to support Indeed + Internshala.
Reuse the current backend architecture, schemas, caching, and Gemini pipeline.
Display a unified job list with official platform logos and source badges.
Use a single, consistent UI for both platforms.
Implement independent scrolling for the job list and job details panels.
Ensure Apply on Indeed and Apply on Internshala redirect to the real application pages.
Preserve the existing design language, animations, and production-ready performance without introducing duplicate workflows or separate implementations.