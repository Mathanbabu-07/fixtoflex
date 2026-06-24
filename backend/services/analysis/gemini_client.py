import google.generativeai as genai
import json
import logging
from typing import Dict, Any, Optional
from config.database import settings

logger = logging.getLogger("backend.services.analysis.gemini_client")

class GeminiClient:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        if self.api_key and self.api_key != "your-gemini-api-key":
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel(self.model_name)
        else:
            logger.warning("Gemini API key is missing. Using mock AI response.")
            self.model = None

    async def analyze_github_profile(self, normalized_data: Dict[str, Any]) -> Dict[str, Any]:
        if not self.model:
            return self._get_mock_response(normalized_data)
        
        prompt = self._build_prompt(normalized_data)
        
        try:
            # We want a strict JSON response.
            # Depending on the gemini sdk version, we can pass response_mime_type="application/json"
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    response_mime_type="application/json",
                )
            )
            
            result_text = response.text
            return self._parse_json_safe(result_text)
            
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            raise Exception("Failed to generate AI analysis.")

    async def normalize_portfolio(self, markdown_content: str) -> Dict[str, Any]:
        """
        Step 3: Converts Jina AI Reader markdown response into a structured JSON PortfolioProfile.
        Removes duplicates, footers, navigation, boilerplate, and empty fields.
        """
        if not self.model:
            return self._get_portfolio_normalization_mock()

        prompt = f"""
You are a precise data engineering system. Parse the following webpage raw Markdown content extracted from a candidate's portfolio site.
Convert the content into a structured JSON matching the schema below.

Mandatory Rules:
1. Extract details only if present in the markdown. If a section or field is completely missing or has no data, set it to null or an empty list/object.
2. Remove navigation menus/links (like 'Home', 'About', 'Projects', 'Contact', social page tabs).
3. Remove footer links, copyright notices, cookie policies, and generic boilerplate website text.
4. Remove duplicate content and sections.
5. Extract only facts directly supported by the website content. Do NOT hallucinate, assume, or invent details.
6. Validate every section and filter out empty fields.

JSON Schema:
{{
  "personal_information": {{
    "name": "string or null",
    "professional_title": "string or null",
    "hero_section": "string or null",
    "about_me": "string or null"
  }},
  "about": "string or null",
  "skills": {{
    "technical_skills": ["string"],
    "programming_languages": ["string"],
    "frameworks": ["string"],
    "tools": ["string"],
    "technologies": ["string"]
  }},
  "projects": [
    {{
      "name": "string",
      "description": "string",
      "technologies_used": ["string"],
      "live_demo_link": "string or null",
      "github_link": "string or null",
      "project_outcome": "string or null"
    }}
  ],
  "experience": [
    {{
      "role": "string",
      "company": "string",
      "description": "string",
      "start_date": "string or null",
      "end_date": "string or null",
      "type": "string" -- Standardized to: 'Work', 'Internship', or 'Freelance'
    }}
  ],
  "education": [
    {{
      "institution": "string",
      "degree": "string",
      "academic_details": "string or null",
      "start_date": "string or null",
      "end_date": "string or null"
    }}
  ],
  "certifications": ["string"],
  "achievements": ["string"],
  "blogs": [
    {{
      "title": "string",
      "link": "string"
    }}
  ],
  "social_links": {{
    "github": "string or null",
    "linkedin": "string or null",
    "resume": "string or null",
    "email": "string or null",
    "portfolio_links": ["string"]
  }},
  "contact": {{
    "email": "string or null",
    "phone": "string or null",
    "location": "string or null"
  }},
  "portfolio_metadata": {{
    "title": "string or null",
    "description": "string or null"
  }}
}}

Raw Webpage Markdown:
{markdown_content}
"""
        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(response_mime_type="application/json")
            )
            return self._parse_json_safe(response.text)
        except Exception as e:
            logger.error(f"Gemini API error during portfolio normalization: {e}")
            raise Exception("Failed to normalize portfolio data via Gemini.")

    async def analyze_portfolio(self, normalized_json: Dict[str, Any]) -> Dict[str, Any]:
        """
        Step 4: Analyze normalized JSON with Gemini 3.1 Flash Lite.
        Acts as: Senior Technical Recruiter, Portfolio Reviewer, Career Mentor, Hiring Manager.
        """
        if not self.model:
            return self._get_portfolio_mock_response(normalized_json)
        
        prompt = self._build_portfolio_prompt(normalized_json)
        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(response_mime_type="application/json")
            )
            return self._parse_json_safe(response.text)
        except Exception as e:
            logger.error(f"Gemini API error for portfolio analysis: {e}")
            raise Exception("Failed to generate Portfolio AI analysis.")

    def _get_portfolio_normalization_mock(self) -> Dict[str, Any]:
        return {
            "personal_information": {
                "name": "Arjun Kumar",
                "professional_title": "Full Stack Software Engineer",
                "hero_section": "Building scalable web solutions and user-centric designs",
                "about_me": "Passionate developer with 2+ years of experience in JavaScript frameworks and Python backend development."
            },
            "about": "Full stack engineer focused on React/Node stacks and AWS integrations.",
            "skills": {
                "technical_skills": ["Frontend Engineering", "REST APIs", "AWS"],
                "programming_languages": ["JavaScript", "TypeScript", "Python", "SQL"],
                "frameworks": ["React", "Next.js", "Express", "FastAPI"],
                "tools": ["Git", "Docker", "VS Code"],
                "technologies": ["PostgreSQL", "MongoDB", "Redux"]
            },
            "projects": [
                {
                    "name": "FixToFlex Dashboard",
                    "description": "SaaS recruiter dashboard with AI profile scanning capabilities.",
                    "technologies_used": ["React", "TypeScript", "Tailwind CSS", "FastAPI"],
                    "live_demo_link": "https://fixtoflex.dev",
                    "github_link": "https://github.com/fixtoflex/dashboard",
                    "project_outcome": "Improved user engagement rate by 24% and reduced page latency."
                }
            ],
            "experience": [
                {
                    "role": "Frontend Developer Intern",
                    "company": "Tech Solutions Inc.",
                    "description": "Built responsive dashboard features and optimized landing pages.",
                    "start_date": "2025-01",
                    "end_date": "2025-06",
                    "type": "Internship"
                }
            ],
            "education": [
                {
                    "institution": "National Institute of Technology",
                    "degree": "Bachelor of Technology in Computer Science",
                    "academic_details": "CGPA: 8.5/10",
                    "start_date": "2022-08",
                    "end_date": "2026-05"
                }
            ],
            "certifications": ["AWS Certified Solutions Architect", "TensorFlow Developer Certificate"],
            "achievements": ["1st Place at Hack NIT 2024", "Top 5% on LeetCode"],
            "blogs": [
                {
                    "title": "Mastering React Server Components",
                    "link": "https://arjunkumar.dev/blog/react-rsc"
                }
            ],
            "social_links": {
                "github": "https://github.com/arjunkumar",
                "linkedin": "https://linkedin.com/in/arjunkumar",
                "resume": "https://arjunkumar.dev/resume.pdf",
                "email": "arjun@example.com",
                "portfolio_links": ["https://arjunkumar.dev"]
            },
            "contact": {
                "email": "arjun@example.com",
                "phone": "+91 98765 43210",
                "location": "Bengaluru, India"
            },
            "portfolio_metadata": {
                "title": "Arjun Kumar | Portfolio",
                "description": "Personal developer portfolio of Arjun Kumar."
            }
        }

    def _build_portfolio_prompt(self, normalized_data: Dict[str, Any]) -> str:
        data_str = json.dumps(normalized_data, indent=2)
        return f"""
You are an expert Senior Technical Recruiter, Portfolio Reviewer, Career Mentor, and Hiring Manager.
Analyze the following structured Portfolio Profile JSON data and generate a comprehensive, evidence-based career intelligence report.

Raw Portfolio Profile JSON Data:
{data_str}

Strict Instructions:
1. Rely ONLY on the verified data in the JSON. Never assume projects, experience, or skills. Never invent certifications.
2. If information for a section (e.g. education, projects) is unavailable in the data, return "Not Available", "Not Listed", or "Unable to Verify" for the corresponding fields.
3. Perform Domain Identification: Identify primary domains (like AI, Data Science, Full Stack, Cloud, DevOps, Mobile, Cyber Security, UI/UX) only if supported by portfolio content.
4. Calculate portfolio scores out of 100 based strictly on verified details.
5. Every single observation, strength, or observation in the summary must be directly supported by the extracted portfolio data.

Respond STRICTLY with a valid JSON object matching exactly the following schema.
Do not include any markdown formatting, code blocks, or extra text outside the JSON.

JSON Schema:
{{
  "summary": {{
    "career_overview": "string (Executive Portfolio Summary - professional overview based solely on extracted data)",
    "technical_skills_summary": "string (Technical Skills Summary - analysis of languages, frameworks, tools, technologies)",
    "technical_skills": ["string (Flat list of all verified technical skills)"],
    "domain_identification": ["string (Matched primary domains like Full Stack, Cloud, AI, only if supported)"],
    "project_analysis": "string (Deep projects analysis evaluating objective, tech stack, complexity, innovation, impact for strongest projects)",
    "experience_summary": "string (Summary of verified work, internship, or freelance experience)",
    "education_summary": "string (Summary of verified education details)",
    "portfolio_strength": "string (Only evidence-based portfolio strengths)",
    "missing_sections": ["string (Missing portfolio sections like About, Projects, Skills, Resume, GitHub, Contact, Certifications, Blogs)"],
    "improvement_suggestions": ["string (Actionable ideas for enhancements)"],
    "learning_roadmap": ["string (Suggested technologies based on identified skill gaps)"],
    "suggested_career_paths": ["string (Suitable roles based only on verified skills)"],
    "final_observation": "string (Concise recruiter-style observation conclusion)",
    "recruiter_impression": "string (Detailed summary of recruiter review opinion)",
    "personal_branding": "string (Cohesiveness and tone of branding)",
    "ui_ux_quality": "string (Evaluation of visual appeal and design structure based on page titles/metadata)"
  }},
  "scores": {{
    "portfolio_score": integer (0-100, maps to Portfolio Quality Score),
    "portfolio_quality_score": integer (0-100),
    "technical_skills_score": integer (0-100),
    "project_quality_score": integer (0-100),
    "personal_branding_score": integer (0-100),
    "recruiter_readiness_score": integer (0-100),
    "career_readiness_score": integer (0-100)
  }}
}}
"""

    def _get_portfolio_mock_response(self, normalized_data: Dict[str, Any]) -> Dict[str, Any]:
        personal_info = normalized_data.get("personal_information", {})
        name = personal_info.get("name") or "Candidate"
        title = personal_info.get("professional_title") or "Software Engineer"
        about = normalized_data.get("about") or personal_info.get("about_me") or "A skilled developer"
        skills_dict = normalized_data.get("skills", {})
        flat_skills = skills_dict.get("programming_languages", []) + skills_dict.get("frameworks", []) + skills_dict.get("tools", []) + skills_dict.get("technologies", [])
        if not flat_skills:
            flat_skills = ["React", "TypeScript", "Node.js", "Python"]
        
        return {
            "summary": {
                "career_overview": f"{name} is an active {title} specializing in modern software development. Their portfolio highlights: '{about}'",
                "technical_skills_summary": "Demonstrates strong foundational knowledge in web programming languages and frontend/backend frameworks.",
                "technical_skills": flat_skills,
                "domain_identification": ["Full Stack", "UI/UX"],
                "project_analysis": "Projects are well-organized with descriptions and demonstrate capable full-stack engineering skills, particularly in dashboards.",
                "experience_summary": "Verified internship experience in software development with focus on building user interfaces.",
                "education_summary": "Bachelor of Technology in Computer Science from a verified institution.",
                "portfolio_strength": "Clear layouts, clean typography, links to live demos and GitHub repositories are fully provided.",
                "missing_sections": ["Certifications", "Blogs"] if not normalized_data.get("blogs") else [],
                "improvement_suggestions": [
                    "Add more case studies detailing architectural choices",
                    "Include performance optimization metrics for key projects"
                ],
                "learning_roadmap": ["Docker", "Kubernetes", "AWS Cloud Services"],
                "suggested_career_paths": ["Full Stack Developer", "Frontend Engineer"],
                "final_observation": f"{name} shows solid readiness for professional developer positions, backed by real projects.",
                "recruiter_impression": f"Standout presentation for a candidate. Highly professional layout and responsive design elements.",
                "personal_branding": "Excellent. Professional title, clear tagline, and linked socials build immediate trust.",
                "ui_ux_quality": "High. Clear grid structure, dark/light contrast elements, and direct project outcomes listed."
            },
            "scores": {
                "portfolio_score": 88,
                "portfolio_quality_score": 88,
                "technical_skills_score": 82,
                "project_quality_score": 85,
                "personal_branding_score": 90,
                "recruiter_readiness_score": 84,
                "career_readiness_score": 86
            }
        }

    def _build_resume_prompt(self, normalized_data: Dict[str, Any]) -> str:
        data_str = json.dumps(normalized_data, indent=2)
        return f"""
You are an expert tech recruiter and ATS system. 
Analyze the following extracted Resume Text and provide a comprehensive, highly detailed career intelligence report.

Raw Resume Text:
{data_str}

Respond STRICTLY with a valid JSON object matching exactly the following schema.
{{
  "summary": {{
    "executive_summary": "string",
    "resume_strength": "string",
    "skills_analysis": "string",
    "experience_analysis": "string",
    "project_evaluation": "string",
    "missing_keywords": ["string"],
    "resume_weaknesses": ["string"],
    "improvement_suggestions": ["string"],
    "target_role_matching": "string"
  }},
  "scores": {{
    "ats_score": integer (0-100),
    "career_readiness_score": integer (0-100)
  }}
}}
"""

    def _get_resume_mock_response(self, normalized_data: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "summary": {
                "executive_summary": "A results-driven software engineer with a track record of delivering scalable web solutions and optimizing backend performance.",
                "resume_strength": "Clear progression of responsibilities and good use of action verbs. Technical skills are prominently displayed.",
                "skills_analysis": "Strong coverage of modern web stack, though cloud infrastructure skills could be more prominent.",
                "experience_analysis": "Solid trajectory from junior to mid-level roles. Demonstrates impact through quantifiable metrics.",
                "project_evaluation": "Projects highlight full-stack capabilities, particularly in API design and frontend integration.",
                "missing_keywords": ["Docker", "Kubernetes", "CI/CD", "AWS"],
                "resume_weaknesses": ["Some bullet points lack measurable outcomes", "Education section is overly detailed for a mid-level professional"],
                "improvement_suggestions": ["Quantify achievements (e.g., 'improved performance by X%').", "Condense the education section to focus purely on degree and university.", "Add specific cloud computing keywords."],
                "target_role_matching": "Highly suitable for Mid-Level Full Stack Developer or Frontend Engineer roles."
            },
            "scores": {
                "ats_score": 75,
                "career_readiness_score": 82
            }
        }

    def _parse_json_safe(self, text: str) -> Dict[str, Any]:
        text = text.strip()
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text.strip())

    def _clean_html(self, html_content: str) -> str:
        if not html_content:
            return ""
        try:
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(html_content, "html.parser")
            for tag in soup(["script", "style", "nav", "footer", "header", "svg", "noscript", "iframe"]):
                tag.decompose()
            text = soup.get_text(separator="\n")
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            return "\n".join(chunk for chunk in chunks if chunk)
        except Exception as e:
            logger.warning(f"Failed to clean HTML content with BeautifulSoup: {e}. Returning raw content slice.")
            return html_content[:20000]

    async def normalize_linkedin(self, jina_markdown: str, scrapedo_html: Optional[str] = None) -> Dict[str, Any]:
        """
        Step 4: Converts primary Jina markdown and secondary Scrape.do HTML into a structured JSON CandidateProfile.
        Merges datasets, removes duplicates, footers, navigation, and empty fields.
        """
        if not self.model:
            return self._get_linkedin_normalization_mock()

        cleaned_html = self._clean_html(scrapedo_html) if scrapedo_html else None

        prompt = f"""
You are a precise data engineering system. Parse the following webpage content extracted from a candidate's LinkedIn profile.
You are provided with:
1. Primary Source (Markdown from Jina Reader)
2. Secondary Source (Text from Scrape.do - optional enrichment)

Merge both datasets into a structured JSON matching the schema below.

Mandatory Rules:
1. Clean and merge both outputs.
2. Remove navigation headers, sidebar links, sign-in alerts, copyright notices, and generic footer text.
3. Eliminate duplicate positions, skills, or schools.
4. Extract only facts directly supported by the provided texts. Do NOT hallucinate, assume, or invent details.
5. If a section or field has no data, set it to null or an empty list/object.
6. For posts, analyze and categorize their type as 'Technical', 'Learning', 'Achievement', 'Project Showcase', or 'General'.

JSON Schema:
{{
  "personal_information": {{
    "name": "string or null",
    "professional_headline": "string or null",
    "about_section": "string or null",
    "location": "string or null",
    "industry": "string or null",
    "current_position": "string or null",
    "current_company": "string or null",
    "profile_summary": "string or null"
  }},
  "about": "string or null",
  "experience": [
    {{
      "role": "string",
      "company": "string",
      "duration": "string or null",
      "responsibilities": "string or null",
      "start_date": "string or null",
      "end_date": "string or null"
    }}
  ],
  "education": [
    {{
      "institution": "string",
      "degree": "string or null",
      "department": "string or null",
      "graduation_year": "string or null"
    }}
  ],
  "skills": {{
    "technical_skills": ["string"],
    "soft_skills": ["string"],
    "endorsed_skills": ["string"],
    "frequently_mentioned_technologies": ["string"]
  }},
  "projects": [
    {{
      "name": "string",
      "description": "string",
      "technologies_used": ["string"],
      "link": "string or null"
    }}
  ],
  "certifications": ["string"],
  "posts": [
    {{
      "title": "string or null",
      "content": "string",
      "type": "string"
    }}
  ],
  "interests": ["string"],
  "awards": ["string"],
  "organizations": ["string"],
  "languages": ["string"],
  "volunteer_experience": [
    {{
      "role": "string",
      "organization": "string",
      "description": "string or null"
    }}
  ],
  "featured_section": ["string"],
  "recommendations": [
    {{
      "author": "string",
      "relationship": "string or null",
      "text": "string"
    }}
  ],
  "contact": {{
    "email": "string or null",
    "phone": "string or null",
    "location": "string or null"
  }},
  "career_timeline": ["string"]
}}

---
Primary Jina Markdown:
{jina_markdown}

---
Secondary Scrape.do Text:
{cleaned_html or "Not Provided"}
"""
        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(response_mime_type="application/json")
            )
            return self._parse_json_safe(response.text)
        except Exception as e:
            logger.error(f"Gemini API error during LinkedIn normalization: {e}")
            raise Exception("Failed to normalize LinkedIn profile data via Gemini.")

    async def analyze_linkedin(self, normalized_json: Dict[str, Any]) -> Dict[str, Any]:
        """
        Step 5: Analyze normalized JSON with Gemini 3.1 Flash Lite.
        Acts as: Senior Technical Recruiter, Hiring Manager, Career Mentor, ATS Specialist.
        """
        if not self.model:
            return self._get_linkedin_analysis_mock(normalized_json)

        prompt = f"""
You are an expert Senior Technical Recruiter, Hiring Manager, Career Mentor, and ATS Specialist.
Analyze the following structured LinkedIn CandidateProfile JSON and provide a recruiter-quality intelligence analysis report.

Normalized Candidate Profile JSON:
{json.dumps(normalized_json, indent=2)}

Strict Instructions:
1. Rely ONLY on the verified data in the JSON. Never assume projects, experience, or skills. Never invent certifications or seniority levels.
2. If information for a section (e.g. posts, certifications) is unavailable in the data, return "Not Available", "Not Listed", or "Unable to Verify" for the corresponding fields.
3. Every summary statement, score, or observation must be directly supported by the verified LinkedIn profile data.
4. Calculate career scores out of 100 based strictly on verified details.

Respond STRICTLY with a valid JSON object matching exactly the following schema.
Do not include any markdown formatting, code blocks, or extra text outside the JSON.

JSON Schema:
{{
  "summary": {{
    "executive_career_summary": "string (Executive Career Summary overview)",
    "professional_profile_summary": "string (Professional Profile Summary)",
    "skills_summary": {{
      "technical_skills": ["string"],
      "soft_skills": ["string"],
      "domain_expertise": ["string"]
    }},
    "experience_summary": "string (Summary of verified experience)",
    "internship_summary": "string (Summary of verified internships - return Not Listed if none)",
    "education_summary": "string (Summary of verified education)",
    "projects_summary": "string (Summary of verified projects - return Not Listed if none)",
    "professional_interests": ["string"],
    "linkedin_activity_summary": "string (Summary of analyzed profile posts & engagement)",
    "strengths": ["string (Evidence-based strengths)"],
    "improvement_areas": ["string (Actionable notes regarding missing sections, missing skills, weak branding)"],
    "suggested_career_paths": ["string (Suggested career pathways based on profile skills)"],
    "learning_roadmap": ["string (Suggested target skills/tools based on identified gaps)"],
    "final_observation": "string (Concise recruiter-style observation conclusion)"
  }},
  "scores": {{
    "profile_strength_score": integer (0-100),
    "linkedin_optimization_score": integer (0-100),
    "ats_readiness_score": integer (0-100),
    "recruiter_visibility_score": integer (0-100),
    "professional_branding_score": integer (0-100),
    "career_readiness_score": integer (0-100)
  }}
}}
"""
        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(response_mime_type="application/json")
            )
            return self._parse_json_safe(response.text)
        except Exception as e:
            logger.error(f"Gemini API error during LinkedIn analysis: {e}")
            raise Exception("Failed to generate LinkedIn AI Career Analysis.")

    def _get_linkedin_normalization_mock(self) -> Dict[str, Any]:
        return {
            "personal_information": {
                "name": "Arjun Kumar",
                "professional_headline": "Software Engineer Intern at NIT | React & Python Developer",
                "about_section": "Passionate full stack developer focused on user experience and cloud technologies.",
                "location": "Bengaluru, India",
                "industry": "Software Development",
                "current_position": "Software Engineer Intern",
                "current_company": "National Institute of Technology",
                "profile_summary": "Aspiring developer with experience in Next.js and API services."
            },
            "about": "Full stack engineer focused on JavaScript frameworks and REST APIs.",
            "experience": [
                {
                    "role": "Software Engineer Intern",
                    "company": "National Institute of Technology",
                    "duration": "6 months",
                    "responsibilities": "Developed modern web views, mapped core schemas, and reduced latency.",
                    "start_date": "2025-01",
                    "end_date": "2025-06"
                }
            ],
            "education": [
                {
                    "institution": "National Institute of Technology",
                    "degree": "Bachelor of Technology",
                    "department": "Computer Science and Engineering",
                    "graduation_year": "2026"
                }
            ],
            "skills": {
                "technical_skills": ["React", "Next.js", "TypeScript", "Python", "FastAPI"],
                "soft_skills": ["Communication", "Problem Solving", "Teamwork"],
                "endorsed_skills": ["React", "Python"],
                "frequently_mentioned_technologies": ["React", "FastAPI", "Supabase"]
            },
            "projects": [
                {
                    "name": "FixToFlex SaaS Core",
                    "description": "Premium developer career pipeline portal.",
                    "technologies_used": ["Next.js", "FastAPI", "Supabase", "Gemini API"],
                    "link": "https://fixtoflex.dev"
                }
            ],
            "certifications": ["AWS Certified Cloud Practitioner"],
            "posts": [
                {
                    "title": "Thrilled to share my Next.js tutorial",
                    "content": "Just published an article on Next.js Server Actions and how they streamline api calls.",
                    "type": "Technical"
                }
            ],
            "interests": ["Machine Learning", "Open Source", "Software Architecture"],
            "awards": [" NIT Hackathon 1st Place"],
            "organizations": ["NIT Coding Club"],
            "languages": ["English", "Hindi"],
            "volunteer_experience": [
                {
                    "role": "Coding Mentor",
                    "organization": "CoderDojo NIT",
                    "description": "Helped school students learn scratch and basic python."
                }
            ],
            "featured_section": ["https://arjunkumar.dev/blog/react"],
            "recommendations": [
                {
                    "author": "Dr. Ramesh Babu",
                    "relationship": "Academic Professor",
                    "text": "Arjun is a highly proactive developer who consistently delivers high-quality software."
                }
            ],
            "contact": {
                "email": "arjun@example.com",
                "phone": "+91 98765 43210",
                "location": "Bengaluru, India"
            },
            "career_timeline": ["2022: Enrolled in NIT CSE", "2024: NIT Hackathon Winner", "2025: Software Intern"]
        }

    def _get_linkedin_analysis_mock(self, normalized_data: Dict[str, Any]) -> Dict[str, Any]:
        personal = normalized_data.get("personal_information", {})
        name = personal.get("name") or "Candidate"
        headline = personal.get("professional_headline") or "Software Engineer"
        skills = normalized_data.get("skills", {})
        
        return {
            "summary": {
                "executive_career_summary": f"{name} is an active professional with a strong trajectory as a {headline}. They exhibit solid technical core capabilities.",
                "professional_profile_summary": "Extremely well-optimized profile showcasing continuous development, technical project contributions, and validated skills.",
                "skills_summary": {
                    "technical_skills": skills.get("technical_skills", ["React", "TypeScript", "Python"]),
                    "soft_skills": skills.get("soft_skills", ["Problem Solving", "Teamwork"]),
                    "domain_expertise": ["Full Stack Engineering", "API Integrations"]
                },
                "experience_summary": f"Verified history of experience as: {personal.get('current_position', 'Software Developer')}.",
                "internship_summary": "Completed a structured software engineering internship focused on front-end features.",
                "education_summary": "Bachelor of Technology degree in Computer Science from a recognized institution.",
                "projects_summary": "Showcases key projects built using React, Python APIs, and cloud database backends.",
                "professional_interests": normalized_data.get("interests", ["Software Architecture", "Cloud Services"]),
                "linkedin_activity_summary": "Active contributor sharing technical tutorials and project updates, highlighting high recruiter engagement.",
                "strengths": ["Clear professional headline", "Strong list of core programming skills", "Linked demo projects"],
                "improvement_areas": ["Add more details to job descriptions", "Collect more peer recommendations"],
                "suggested_career_paths": ["Full Stack Software Engineer", "React Frontend Developer"],
                "learning_roadmap": ["Docker", "Kubernetes", "AWS Architecture Solutions"],
                "final_observation": f"{name} demonstrates exceptional career readiness and active industry presence."
            },
            "scores": {
                "profile_strength_score": 85,
                "linkedin_optimization_score": 88,
                "ats_readiness_score": 82,
                "recruiter_visibility_score": 90,
                "professional_branding_score": 86,
                "career_readiness_score": 85
            }
        }


