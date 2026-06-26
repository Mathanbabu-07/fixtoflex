FixToFlex – Job Tracker (Indeed Integration) Development Prompt
Objective

Implement the Job Tracker feature inside the existing Job Tracker section (UI already available). Reuse the existing backend architecture, database, workflow, and job pipeline. Only introduce new API keys for optimized API usage; do not modify any existing AI analysis or profile workflows.

1. API Configuration

Add new environment variables only for the Job Tracker module.

SCRAPEDO1_API_KEY=
GEMINI_API1_KEY=
Keep all existing Scrape.do and Gemini API keys unchanged.
Use SCRAPEDO1_API_KEY only for job extraction.
Use GEMINI_API1_KEY only for job ranking and personalization.
2. Existing Workflow (Do Not Change)

Reuse the existing:

Backend project structure
FastAPI architecture
Authentication
Supabase connection
Existing API service layer
Existing database models
Existing caching logic
Existing frontend architecture
Existing loading animations
Existing error handling

Only add the Job Tracker functionality.

3. Candidate Context

Build the search automatically from the already stored candidate data.

Use:

Target Job Role
Interested Domain
Skills
Experience
Preferred Location
Target Companies (if available)
Target Salary (if available)

No additional user input should be required.

4. Job Extraction

Use Scrape.do (API 1) to scrape live jobs from:

https://in.indeed.com

Extract:

Job Title
Company
Company Logo
Rating
Location
Salary
Employment Type
Experience
Work Mode
Posted Date
Job Description
Required Skills
Apply URL
Company URL

Return a clean normalized JSON.

5. Gemini Personalization

Send the extracted jobs together with the candidate profile to Gemini API 1.

Gemini should:

Rank jobs by relevance
Remove duplicates
Calculate Match %
Highlight matching skills
Identify missing skills
Generate a short "Why this job matches you" summary

Never generate fake jobs.

Only analyze extracted Indeed data.

6. Job Tracker UI

Use the existing Job Tracker page with track my jobs button.

give job lists data with live results after clicking the button.

Design should closely follow the Indeed experience.

Each job card should display:

Company Logo
Job Title
Company
Rating
Location
Salary
Work Mode
Posted Date
Match %
Skill Tags
Short Description
Apply button

Selecting a job displays the complete job details on the right panel.

7. Apply Button

The Apply button must open the original Indeed application URL extracted during scraping.

Do not proxy or recreate the application page.

Always redirect to the real Indeed apply page.

8. Cache & Refresh

Reuse the existing caching mechanism.

Only re-fetch jobs when:

Candidate profile changes
Career preferences change
User manually refreshes jobs
Cache expires

Avoid unnecessary API calls.

9. Performance
Fast loading
Pagination / Infinite scroll
Lazy loading
Background fetching
Optimized API usage
No duplicate requests
Smooth SaaS loading animations
10. Error Handling

Handle:

No jobs found
API failures
Scraping failures
Rate limits
Invalid responses
Network issues

Show clean retry messages without breaking the UI.

Deliverables
Integrate the feature into the existing Job Tracker page.
Preserve all existing backend workflows and architecture.
Use only the new API keys (SCRAPEDO1_API_KEY and GEMINI_API1_KEY) for this module.
Display real Indeed jobs with personalized ranking.
Redirect users to the original Indeed application page.
Maintain a fast, scalable, production-ready implementation with minimal changes to the existing codebase.