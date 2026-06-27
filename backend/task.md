# FixToFlex – AI Voice Interview Simulator 

## Goal

Implement Personalized AI Voice Interview** inside the **Interview & Placement** section.
This module simulates a real software company HR/technical interview. The AI asks personalized interview questions generated only from the candidate's existing profile analysis (Resume, Portfolio, Skills, Projects, Experience, Certifications) and evaluates spoken answers in real time.
Reuse the existing backend architecture (analysis cache, profile summaries, queue system, Gemini workflow). Do not modify any existing Fix My Profile or Career Intelligence pipelines.

---
# Backend
## Reuse Existing Data

Do not analyze the profile again.

Reuse cached outputs from existing analysis:
* Resume Summary
* Portfolio Summary
* Candidate Details
* Skills
* Projects
* Experience
* Certifications
* Career Preferences

Only read existing cache.
Never re-run profile analysis.

---
# New Environment Variables

Create a separate Gemini key only for interviews.

```env
GEMINI_INTERVIEW_API_KEY=
```
Use:

Gemini 3.1 Flash Lite
Only this API handles:

* Question Generation
* Answer Evaluation
* Interview Feedback
* Final Report

Existing Gemini APIs remain unchanged.

---
# Interview Start UI

Create a clean card matching the existing FixToFlex UI.

Title
AI Voice Interview Simulator

Subtitle
Practice a realistic software company interview with personalized AI questions.

Configuration
Interview Difficulty

Dropdown
* Easy
* Hard

Number of Questions
Dropdown

5
6
7
...
15

Interview Mode
Voice Only

Estimated Time
Automatically calculated

Example
5 Questions → 5 Minutes
10 Questions → 10 Minutes
15 Questions → 15 Minutes
Primary Button
Start Interview

---
# Interview Flow

When Start Interview is clicked

Step 1
Load candidate profile from cache.
Do not call profile analysis.

Step 2
Gemini generates the first interview question.

Question sources

Resume
Portfolio
Projects in resume , portfolio
Technical Skills
Experience
Achievements in resume , portfolio
Certifications resume , portfolio
General HR Questions

No predefined question list.
Generate dynamically.

Examples

Tell me about yourself.

Explain your final year project.

Why did you choose FastAPI?

Explain your AI Job Tracker architecture.

What was your biggest technical challenge?

How did you optimize performance?

Why should we hire you?

Describe a failure.

Tell me about teamwork.

How do you solve production issues?

Every candidate receives different questions.

---

# Voice Answer

Voice only.

No typing.

When question appears

Start

60-second countdown

give Microphone symbol button with answer label text to start answering with voie. 

Live speech transcription.

Requirements

High accuracy

Low latency

Continuous transcription

No sentence loss

Partial transcript updates while speaking.

Display transcript live beneath the question.

Example

You

"I implemented the backend using FastAPI..."

The transcript updates continuously.

---

# Timer

Every question

Maximum

60 seconds

Display

Circular countdown

59

58

57

...

0

If candidate finishes early

Show

Next Question

button.

If timer reaches zero

Automatically stop recording

Save transcript

Evaluate answer

Generate next question.

---
# Question Navigation

Question 1 / N
↓
Answer
↓
Evaluate silently
↓
Generate next question
↓
Continue

Last Question

↓
View My Score

---
# Question Generation Logic

Gemini generates questions in this order

Resume
↓
Projects
↓
Technical Skills
↓
Experience
↓
Achievements
↓
Certifications
↓
General HR

Difficulty

Easy

Basic

Moderate

General HR

Hard

Deep technical

Architecture

Problem solving

Scenario questions

Follow-up questions

No repeated questions.

---
# AI Evaluation

After every answer

Evaluate internally.

Do not interrupt candidate.

Store

Question

Transcript

Evaluation

Score

Feedback

Use these scoring categories

Technical Knowledge

Problem Solving

Decision Making

Communication

Confidence

Content Delivery

Practical Thinking

Score each

0–100

Store all results.

---
# Final Score Screen

After the last question

Generate one unified interview report.

Sections

Overall Interview Score

Example

86 / 100

---

Performance Breakdown

Technical Knowledge

Communication

Confidence

Problem Solving

Decision Making

Content Delivery

Professionalism

Display

Progress bars

Circular charts

Overall recommendation

---

Strengths

Example

Strong technical fundamentals

Excellent project explanation

Good communication

Confident speaking

---

Areas to Improve

Separate section.

Not generic.

Question-specific.

Example

Question

Explain your AI Job Tracker.

Your Answer

"I used FastAPI..."

HR Feedback

You immediately started discussing technologies.

A recruiter first expects a high-level explanation of the business problem before technical implementation.

Preferred Answer Style

Start with

"The goal of this project was..."

Then

Architecture

Challenges

Impact

Result

Improvement

Structure your answers using

Problem

Solution

Result

---

Repeat this detailed feedback

for every interview question.

---
HR Perspective

Generate recruiter comments.

Examples

Recruiters prefer measurable achievements.

Avoid lengthy introductions.

Maintain eye contact.

Avoid filler words.

Provide business impact.

Speak confidently.

Use STAR method for behavioural questions.

---

Interview Summary

Generate

Overall hiring recommendation

Example

Likely to clear Round 1

Needs improvement before Technical Round 2

OR

Ready for Product Companies

---

Future Preparation Plan

Generate personalized preparation

Technical Topics

Communication

Behavioral

Projects

Resume

Mock Practice

Priority

High

Medium

Low

---

History

Save every interview.

Interview History

Date

Company Type

Difficulty

Questions

Overall Score

Allow reopening previous reports.

---

Architecture

Candidate

↓

Start Interview

↓

Load Cached Profile

↓

Gemini Generates Question

↓

Voice Recording

↓

Live Speech-to-Text

↓

Transcript

↓

Gemini Evaluation

↓

Store Result

↓

Next Question

↓

Final Report

↓

Save History

---

Constraints

* Voice-only interview; no typing.
* Never reanalyze the candidate profile.
* Reuse existing Resume, Portfolio, Skills, Projects, Experience, Certifications, and Career Preference cache.
* Use only `GEMINI_INTERVIEW_API_KEY` with Gemini 3.1 Flash Lite for interview generation and evaluation.
* One question at a time; do not generate all questions upfront.
* Each question has a strict 60-second limit.
* Live transcription must update continuously during recording.
* Store transcripts, scores, and feedback for every question.
* Generate detailed, actionable HR-style feedback instead of generic suggestions.
* Maintain the existing FixToFlex UI language, animations, spacing, and component design.
* Keep the implementation modular so future additions like company-specific interviews, coding rounds, and voice-based follow-up questions can reuse the same interview engine.
