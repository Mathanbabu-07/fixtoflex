# Development Task: AI Personalized Gmail Draft Generation

Implement a complete **AI-powered personalized Gmail Draft workflow** integrated with the existing **Job Tracker**, **My Target**, and **Internship Tracker**. Reuse the current backend pipeline, ScrapeDo workflow, Gemini integration, Gmail OAuth, and Gmail Draft creation. Do not change any existing APIs or authentication.

---

## 1. Job & Internship Tracker UI

Add a new small rectangular button with the **official Gmail logo** beside every job/internship card (top-right position as marked in the design).

Button label:

**Make Draft**

Supported sources:

* Indeed
* Internshala
* Unstop

Each card must have its own independent **Make Draft** button.

---

## 2. Button Workflow

When the user clicks **Make Draft**:

Do not scrape again.

Reuse the already cached job/internship data from the existing tracker pipeline.

Retrieve:

* Company Name
* Job/Internship Title
* Job Description
* Responsibilities
* Requirements
* Skills Required
* Portal Name
* Apply URL

Then internally fetch the candidate's stored profile:

* name , college(for internships mail requesting)
* Resume
* Portfolio
* Projects
* Skills
* Experience (if available)
* Education
* Certifications
* Career Preferences

Use the existing cache and backend workflow only.

---

## 3. AI Mail Generation

Use the new Gemini 3.1 Flash Lite API key from the existing environment.

Generate a unique outreach email specifically for the selected role.

The mail must be personalized using:

* Candidate profile
* Resume
* Skills
* Projects
* Experience
* Company
* Role
* Job requirements
* Tone

Tone:

* Professional
* Confident
* Personalized
* Human-written
* Recruiter-friendly
* No generic AI wording
* No fake claims
* ATS-friendly

The generated draft should contain:

* Recruiter Subject
* Greeting
* Personalized introduction
* Why the candidate matches the role
* Relevant projects
* Relevant skills
* Interest in the company
* Professional closing
* Candidate name

---

## 4. Draft Mail Section UI

Immediately after clicking **Make Draft**:

Navigate to the **Draft Mail** page.

Show a mail generation animation.

Example status:

* Collecting profile...
* Reading job details...
* Matching resume...
* Writing personalized email...
* Preparing Gmail Draft...

After generation, automatically append a new mail card.

---

## 5. Multiple Draft Queue

Support unlimited draft generation.

Each generated mail becomes a separate card.

Order must follow generation sequence.

Example:

1. Google — Software Engineer
2. Microsoft — SDE Intern
3. Amazon — AI Engineer
4. Internshala — AI Internship

Never overwrite previous drafts.

Always append to the bottom.

---

## 6. Draft Card Layout

Reuse the existing AI Outreach Draft design.

Each card should display:

* Company Logo
* Company Name
* Role
* Portal Badge (Indeed / Internshala / Unstop)
* Subject
* Email Preview
* Generated Time

Buttons:

* Preview
* Edit
* Generate Gmail Draft

---

## 7. Gmail Draft Generation

When the user clicks **Generate Gmail Draft**:

Use the existing Gmail OAuth tokens.

Create a Gmail Draft using Gmail API.

Do not send the email.

Only save it inside Gmail Drafts.

Return success after creation.

---

## 8. Gmail Draft Success

After successful creation:

* Disable the button.
* Show:

✓ Draft Saved to Gmail

Display the Gmail Draft creation timestamp.

Allow regenerating the content if required without deleting previous drafts.

---

## 9. Backend Requirements

Reuse the existing pipeline.

Never scrape again during mail generation.

Never call ScrapeDo again.

Never call the trackers again.

Only use:

* Cached job data
* Cached internship data
* Stored profile
* Stored resume analysis
* Existing Gemini workflow
* Existing Gmail OAuth

---

## 10. Error Handling

Handle:

* Gmail OAuth expired
* Missing Gmail permission
* Empty cached job
* Missing resume
* Gemini failure
* Gmail API failure

Show meaningful UI messages.

Never lose generated drafts.

---

## 11. Acceptance Criteria

* Every job and internship card has a **Make Draft** button.
* Clicking **Make Draft** generates a personalized outreach email using cached data.
* Draft Mail page shows a generation animation.
* Multiple generated mails are maintained in an ordered list.
* Each mail has its own **Generate Gmail Draft** button.
* Clicking **Generate Gmail Draft** creates a real Gmail Draft in the user's Gmail account.
* Existing Job Tracker, Internship Tracker, Gmail OAuth, backend workflow, and UI remain unchanged.
* No duplicate scraping, no duplicate analysis, and no unnecessary API calls.
