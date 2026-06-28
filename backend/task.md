Recruiter AI Resume Matching Backend
Objective

Implement the complete backend pipeline for the Recruiter – Find Better Match feature. The recruiter uploads multiple resumes and enters a job description. The system analyzes every uploaded resume individually and returns the Top N best-matched candidates.

Backend Workflow
Recruiter fills Job Details
        │
        ▼
Uploads Multiple Resumes
        │
        ▼
Clicks "Find Better Match"
        │
        ▼
Select Top Results
(Top 1 / Top 2 / Top 5 / Custom Number ≤ Uploaded Count)
        │
        ▼
Extract text from every resume
        │
        ▼
Analyze each resume individually using Gemini 3.5 Flash
        │
        ▼
Compare against:
• Job Description
• Requirements
• Skills
• Qualification
• Experience
• Certifications
• Tools
• Soft Skills
        │
        ▼
Generate Matching Score (0–100)
        │
        ▼
Sort by Highest Score
        │
        ▼
Return only requested Top N candidates
Analysis Rules

Analyze every uploaded resume independently.

Extract:

Candidate Name
Email ID
Phone Number (optional)
LinkedIn URL (if available)
GitHub URL (if available)
College Name & Degree (if available)
Experience
Skills
Projects
Certifications

Compare with the complete job requirements and calculate an overall matching score based on:

Technical Skills
Relevant Projects
Experience
Education
Certifications
Tools & Frameworks
Soft Skills
Overall Role Fit

Return candidates sorted by highest score.

Result Card

Display only the requested Top N candidates.

Each result card should contain:

Candidate Name
Match Score
Email ID
LinkedIn Profile (if available) dont give duplicate or dummy data
GitHub Profile (if available) dont give duplicate or dummy data
College Name & Degree (if available) dont give duplicate or dummy data
Resume Preview Button
Match Summary (2–3 lines)
Top Results Dropdown

Inside Find Better Match button, add a dropdown:

Top 1

Top 2

Top 5

Custom Number

If Custom Number is selected:

Allow numeric input.
Maximum value = Uploaded Resume Count.
Validate before processing.
Loading Experience

Do not mention Gemini or any AI model.

Show a premium multi-stage loading animation:

✓ Reading uploaded resumes...

✓ Extracting candidate information...

✓ Understanding job requirements...

✓ Comparing candidate profiles...

✓ Ranking the strongest matches...

✓ Preparing recruiter insights...

Add:

Animated progress bar
Smooth card shimmer
Rotating workflow icon
Live processed count

Example:

Processing resumes...

18 / 42 Completed

The loading should feel dynamic and professional.

Performance
Process resumes asynchronously where possible.
Cache extracted resume text during the current recruiter session.
Analyze each resume only once per search unless the recruiter changes the job description or uploads/removes resumes.
Return results sorted by score in descending order.
Constraints
Use Gemini 3.5 Flash for resume analysis and matching.
Keep recruiter analysis completely isolated from candidate data and caches.
Never access or reuse candidate-side stored results.
Handle missing fields (LinkedIn, GitHub, College, etc.) gracefully without failing the analysis.
Ensure stable, fast processing for large batches of uploaded resumes.