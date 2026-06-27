FixToFlex – Internship Tracker (Development Prompt)
Objective

Implement a Internship Tracker section that recommends internships using only the candidate's Career Preferences and Technical Skills (do not use Resume, GitHub, Portfolio, LinkedIn, or Career Intelligence cache).

Reuse the existing Job Tracker architecture, Scrape.do pipeline, Gemini 3.1 Flash Lite ranking, frontend layout, UI components, independent scrolling, apply button flow, caching, and backend services. Do not create duplicate implementations.

1. Data Sources

Scrape internships from:

Unstop: https://unstop.com/internships
Internshala: https://internshala.com/internships

Use the existing Scrape.do workflow.

2. Candidate Input

Generate internship search queries only from:

Interested Domain
Target Job Role
Technical Skills
Experience (Fresher/Student)
Career Preferences

Do NOT use:

Resume
GitHub
Portfolio
LinkedIn
Previous Career Intelligence
Job Tracker cache
3. Backend Workflow

Reuse the existing backend architecture.

Career Preferences
+
Technical Skills
        │
        ▼
Generate Internship Search Queries
        │
        ▼
Scrape.do
        │
        ├──────────────┐
        ▼              ▼
   Unstop       Internshala
        │              │
        └──────┬───────┘
               ▼
Normalize Internship Data
               ▼
Gemini 3.1 Flash Lite
(Profile Matching & Ranking)
               ▼
Internship Tracker UI
4. Scraping Requirements

Collect as many internships as possible from both platforms.

Extract:

Internship Title
Company Name
Company Logo
Internship Type
Work From Home / On-site / Hybrid
Location
Stipend
Duration
Apply Deadline
Skills Required
Eligibility
Responsibilities
Internship Description
Selection Process (if available)
Perks
Posted Date
Company Profile URL
Direct Apply URL

Never scrape only the first page if additional results are available.

Support pagination where possible.

Merge duplicate internships.

5. Internship Ranking

Gemini should rank internships using:

Career Domain
Target Role
Skills
Fresher/Student profile

Return:

Match Score
Matching Skills
Missing Skills
Short explanation

Reuse the Job Tracker Gemini prompt structure.

6. Frontend Layout

Reuse the existing Job Tracker UI.

Do not redesign.

Left Panel:

Combined internship list from Unstop and Internshala.
Platform logo.
Internship title.
Company.
Location.
Stipend.
Match score.

Right Panel:

Internship details.
Description.
Responsibilities.
Required Skills.
Eligibility.
Duration.
Perks.
Gemini Insights.
Apply button.

Maintain independent scrolling for both panels.

7. Apply Buttons

Display platform-specific buttons.

For Internshala:

Apply on Internshala

For Unstop:

Apply on Unstop

Use the scraped direct application URL.

Never redirect internally.

Never use placeholder or dummy URLs.

Always open the actual application page of the selected internship.

8. Filters

Add filters above the internship list.

Support:

Stipend
All
With Stipend
Without Stipend
Work Mode
All
Remote (Work From Home)
On-site
Hybrid
Platform
All
Internshala
Unstop

Filters should update results instantly without re-scraping.

9. Refresh

Add a Refresh Internships button.

Behavior:

Clear internship cache.
Re-run scraping.
Fetch fresh internships.
Update ranking.
10. Cache

Create a dedicated internship cache.

Cache key:

userId
+
career_preferences
+
technical_skills

Cache only internship results.

Do not reuse Job Tracker cache.

11. Error Handling

If one source fails:

Show internships from the other source.

If both fail:

Show a friendly retry state.

If no internships match:

Display:

No matching internships were found. Try updating your career preferences or technical skills.

12. Performance
Run Unstop and Internshala scraping in parallel.
Normalize both datasets before Gemini analysis.
Paginate backend requests when supported.
Lazy-load internship details.
Cache ranked results to reduce API usage.
13. Deliverables
Implement an Internship Tracker using the existing Job Tracker architecture.
Scrape internships from Unstop and Internshala using the existing Scrape.do pipeline.
Use only Career Preferences and Technical Skills to search and rank internships.
Display a unified internship list with platform logos, match scores, stipend, work mode, and company details.
Reuse the existing two-panel UI with independent scrolling and Gemini insights.
Implement working Apply on Unstop and Apply on Internshala buttons that redirect to the actual application pages.
Add filters for Stipend, Work Mode, and Platform, plus a Refresh Internships action and a dedicated internship cache.