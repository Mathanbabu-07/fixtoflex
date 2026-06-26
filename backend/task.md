FixToFlex – Indeed Apply URL Fix (Development Prompt)
Objective

Fix the Apply on Indeed redirection. The current implementation redirects to /N/A, causing a 404 page. Instead, scrape and store the real Indeed application URL for every job and always redirect users to the original Indeed apply page.

Problem
Do not generate or guess the apply URL.
Do not use placeholder values like N/A, #, or empty strings.
The frontend must never construct the URL manually.
Backend Changes
1. Extract the Real Apply URL

During the existing Indeed scraping pipeline, also scrape:

apply_url (actual application link)
job_url (Indeed job page URL)

The scraper must extract the same destination used by the Apply button on Indeed.

Example response:

{
  "title": "...",
  "company": "...",
  "location": "...",
  "job_url": "https://in.indeed.com/viewjob?jk=...",
  "apply_url": "https://smartapply.indeed.com/... or the actual external apply URL"
}
2. Validate URLs

Before returning data:

Ensure apply_url is a valid HTTPS URL.
If unavailable, fall back to job_url.
Never return "N/A", null, or empty strings.

Priority:

apply_url
      ↓
job_url
      ↓
Skip Apply button
3. Database

Store both:

apply_url
job_url

Reuse cached URLs on refresh instead of re-scraping unnecessarily.

Frontend Changes

The Apply on Indeed button should:

if (apply_url exists)
    open apply_url

else if (job_url exists)
    open job_url

else
    disable button
    show "Application link unavailable"

Open in a new browser tab.

Never redirect to:

/N/A
#
javascript:void(0)

or any locally generated route.

Error Handling

If Indeed does not expose an application URL:

Open the original Indeed job page (job_url).
Let the user click the official Apply button there.

Do not fabricate links.

Testing

Verify:

Every listed job has a valid Apply destination.
Clicking Apply on Indeed opens the correct Indeed application page (or the original job page if direct application is unavailable).
No /N/A redirects.
No 404 pages.
Existing Job Tracker workflow, Gemini ranking, caching, and UI remain unchanged.