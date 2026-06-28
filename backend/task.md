Recruiter UI Development Prompt (FixToFlex)
Objective

Build a Recruiter Dashboard that is completely independent from the Candidate UI. Recruiter data, APIs, database tables, cache, sessions, and state must never share candidate information.

The UI should follow the same premium SaaS design language used throughout FixToFlex (white background, subtle shadows, rounded cards, purple accent, clean typography, smooth animations), without any left sidebar/menu. The page should be a full-width dashboard with only the existing top navigation.

Layout

Create a centered responsive page.

---------------------------------------------------------
Top Navbar
---------------------------------------------------------

Recruiter Dashboard

---------------------------------------------------------
|                 Job Details                          |
---------------------------------------------------------

---------------------------------------------------------
|                Requirements                          |
---------------------------------------------------------

---------------------------------------------------------
| Upload Resumes | AI Matching Information             |
---------------------------------------------------------

---------------------------------------------------------
|        Find Better Match Button                      |
---------------------------------------------------------

Everything should be inside premium rounded white cards.

Spacing should match the Candidate UI.

Section 1 — Job Details Card

Title

Create Job & Find Better Match

Subtitle

Define your hiring requirements and let AI identify the most suitable candidates.

Fields

Job Role *

Single line input

Example

AI Engineer
Company Location *

Searchable location field

Example

Bangalore, Karnataka
Salary Range

Dropdown

3 LPA – 5 LPA

6 LPA – 9 LPA

10 LPA – 15 LPA

15 LPA – 20 LPA

20+ LPA
Work Mode

Segmented buttons

○ Work From Home

○ Onsite

○ Hybrid

Only one selectable.

Job Description *

Large textarea

Approximately 15–20 lines

Character counter

Placeholder

Paste complete job description including responsibilities and expectations...
Section 2 — Requirements Card

Title

Requirements

Skills *

Tag input

Recruiter can continuously enter skills.

Examples

Python

SQL

TensorFlow

React

AWS

Docker

NodeJS

Show tags with removable chips.

Qualification *

Checkboxes

UG

PG

Students/Fresher

Experience

Dropdown

0 Years

1 Year

2 Years

3 Years

...

10+ Years
Certifications (Optional)

Tag input

Examples

AWS

Azure

Google Cloud

CCNA

PMP
Soft Skills

Tag input

Examples

Leadership

Communication

Critical Thinking

Problem Solving

Ownership

Time Management
Languages

Tag input

Examples

English

Tamil

Hindi

French
Tools & Frameworks

Tag input

Examples

Git

Docker

Kubernetes

TensorFlow

PyTorch

Spring Boot

React

Angular
Section 3 — Upload Resumes

Premium upload card.

Support

PDF

DOCX

Drag & Drop

Multiple upload.

Allow

Maximum 50 resumes.

After upload show

resume1.pdf

resume2.pdf

resume3.pdf

...

Each file shows

• icon

• filename

• size

• remove button

Upload progress animation.

Section 4 — AI Matching Information Card

Small side card.

Contains bullets only.

AI will analyze

✓ Skills

✓ Experience

✓ Projects

✓ Resume quality

✓ Technical match

✓ Cultural fit

✓ ATS compatibility

Bottom info card

Higher quality job descriptions
produce better candidate ranking.
Bottom CTA

Centered premium button

✨ Find Better Match

Large gradient purple button.

Hover animation.

Loading animation.

UI Design Requirements

Maintain FixToFlex styling.

Use

large rounded cards
soft shadows
18–22px border radius
purple gradients
subtle hover effects
premium whitespace
responsive layout
glass-like modern SaaS appearance

Do not add any left sidebar or vertical navigation.

Only use the existing top navigation already present in the Recruiter UI.

Responsiveness

Desktop

Two-column layout.

Tablet

Cards stack vertically.

Mobile

Single column.

Upload section moves below requirements.

Validation

Required fields

Job Role
Company Location
Job Description
Skills
Qualification
Resume Upload

Disable Find Better Match until required fields are completed.

Animations
Smooth fade-in on page load.
Card hover elevation.
Input focus glow (purple).
Upload progress animation.
Button ripple effect.
Loading spinner during processing.
Smooth transitions throughout.
Important Constraints
Keep the Recruiter UI completely isolated from the Candidate UI.
Do not reuse Candidate profile data, cache, analysis results, or stored state.
This page is only for recruiter job creation and resume matching.
Match the premium visual quality and spacing of the provided reference while removing the left sidebar entirely.