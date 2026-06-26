FixToFlex – "My Target" Job Search Feature (Development Prompt)
Objective

Add a new My Target feature inside the existing Job Tracker. This feature allows candidates to search jobs based only on manually entered target preferences, without using their profile, cached data, or career intelligence.
The implementation must reuse the existing Indeed + Internshala scraping pipeline, Scrape.do integration, Gemini 3.1 Flash Lite ranking, UI components, scrolling behavior, apply flow, and backend architecture.

1. UI

Add a new secondary button beside Track My Jobs.

Button

Icon: 🎯 (Target icon)
Label: My Target
Same design language as existing buttons.
Responsive.

Clicking the button opens a centered modal with a close (×) button.

2. My Target Modal

Create a modal with the following fields.

Target Companies

Multi-select input.

Requirements:
Maximum 3 companies
Comma separated input supported
Searchable dropdown
Auto-suggestions while typing
Suggestions should come from a master company dataset
User may also enter a custom company not found in suggestions
Prevent duplicate companies

Example:

Google, Microsoft, OpenAI
Target Job Roles

Multi-select searchable dropdown.

Requirements:

Maximum 2 roles
Auto-complete suggestions
Custom role entry allowed
Comma separated supported

Example

AI Engineer
ML Engineer
Target Salary Range

Single select dropdown.

Options:

3 LPA – 5 LPA
6 LPA – 9 LPA
10 LPA – 15 LPA
15 LPA – 20 LPA
More than 20 LPA
Only one value can be selected.

Preferred Location
Searchable multi-select dropdown.
Use all Indian States and Union Territories.

Maximum:

3 locations
Example
Tamil Nadu
Karnataka
Telangana

Action Button

Bottom button

Fetch Results

Disable until at least:

one company OR
one job role

is selected.

3. Backend Workflow

When user clicks Fetch Results

DO NOT use

Candidate Profile
Resume
LinkedIn
Portfolio
GitHub
Career Intelligence
Cached profile analysis

This feature is completely independent.

Pipeline

Target Companies
Target Roles
Salary
Locations
        │
        ▼
Generate Search Queries
        │
        ▼
Scrape.do
        │
        ▼
Indeed Jobs
Internshala Jobs
        │
        ▼
Normalize Data
        │
        ▼
Gemini 3.1 Flash Lite
        │
        ▼
Rank Jobs
        │
        ▼
Job Tracker UI

4. Search Logic

Search only using modal values.

Examples

Company
Google AI Engineer Bangalore

Role
Machine Learning Engineer

Salary
10 LPA

Location
Tamil Nadu

Generate optimized search queries for both

Indeed
Internshala

5. Scraping

Reuse the existing pipeline.

Scrape

Indeed

Internshala

Extract exactly the same fields already used.

Do not create another scraper.

6. Gemini Ranking

Gemini should rank jobs only using

Target Companies
Target Roles
Salary Preference
Preferred Locations

Do not use profile skills.
Do not use resume.
Do not use LinkedIn.
Do not use cache.

7. Results UI

Reuse the existing Job Tracker interface.
Do not redesign.
Show
Left Panel

Combined Indeed + Internshala jobs
Platform logo
Match score
Company
Role
Salary
Location

Right Panel

Full job description
Skills
Company
Gemini Insights
Apply button

Everything should behave exactly like the existing Job Tracker.

8. Apply Buttons

Maintain the current workflow.

Indeed
Apply on Indeed

Internshala
Apply on Internshala

Always redirect to the real application page using the scraped apply_url.

Never redirect internally.
Never use dummy URLs.

9. Independent Scrolling

Keep the existing behavior.

Left
Scrollable Job List

Right
Scrollable Job Details

Both scroll independently.

10. Cache Rules

Do not reuse the profile job cache.
Create a separate cache namespace for target searches.

Cache key should depend on:

Companies
Roles
Salary
Locations

Reuse cached results only when the exact same target search is repeated.

11. Validation

Validate:

Maximum 3 companies
Maximum 2 job roles
Maximum 3 preferred locations
One salary option only
Remove duplicates
Ignore empty values
Trim whitespace
Allow custom company/role entries

12. Error Handling

If no jobs match:

Display:
No matching jobs found for your selected targets. Try changing your company, role, salary, or location preferences.

If one source fails:
Show jobs from the other source.

If both fail:
Show a friendly retry state.

13. Deliverables
Add a 🎯 My Target button beside Track My Jobs.
Implement a searchable multi-select modal with company, role, salary, and location filters.
Reuse the existing Scrape.do + Gemini + Indeed + Internshala pipeline without creating duplicate logic.
Search jobs only from the manually entered target preferences, completely independent of candidate profiles and cached profile data.
Display results using the existing Job Tracker UI with platform logos, independent scrolling, Gemini insights, and working Apply on Indeed / Apply on Internshala buttons that redirect to the real application pages.
Implement separate caching for target-based searches and preserve the existing profile-based job tracking workflow unchanged.