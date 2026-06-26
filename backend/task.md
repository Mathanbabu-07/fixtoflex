# Career Intelligence UI Redesign (Unified AI Report)

## Objective

Redesign the **Career Intelligence** page to use a **single, continuous AI report layout** similar to ChatGPT/Claude/Perplexity instead of multiple independent cards or boxes. Keep the existing backend workflow, Gemini prompts, and APIs unchanged—only redesign the presentation layer.

### Layout

* Replace separate suggestion cards with **one unified scrollable AI report**.
* Present the report as a continuous document with clear headings, spacing, icons, and dividers.
* Use a premium SaaS style with soft shadows, rounded sections, and consistent typography.
* No repeated cards for every recommendation.

### AI Report Structure

Generate and display in this order:

1. Executive Career Summary
2. Overall Career Readiness
3. Profile Strength Analysis
4. Skill Gap Analysis

   * Group by **Critical**, **Important**, **Optional**, **Future**
   * Each recommendation contains:

     * Skill title
     * Why it matters
     * Action to complete
     * Related technologies (tag chips)
5. Project Roadmap
6. Resume Improvements
7. LinkedIn Improvements
8. GitHub Improvements
9. Portfolio Improvements
10. Learning Roadmap (Week → Month → 3 Months → 6 Months)
11. Target Role Readiness
12. Final AI Observation

### Content Style

* Generate concise, personalized recommendations.
* Avoid duplicate information across sections.
* Recommendations must directly reference the user's existing profile analysis.
* Merge similar suggestions instead of repeating them.
* Use professional recruiter-style language.

### Animations

* Stream the report section-by-section like ChatGPT/Claude.
* Show typing animation while Gemini generates.
* Fade in each completed section smoothly.
* Keep the existing loading screen until generation finishes.

### Backend

* Reuse the existing Career Intelligence pipeline.
* Do **not** regenerate profile analysis.
* Use cached analysis from Plan 1.
* Only change the response rendering layer.

### Expected Result

The Career Intelligence page should feel like an **AI-generated career consultation report**, with one premium, unified document rather than many disconnected boxes, while preserving the current workflow and backend logic.
