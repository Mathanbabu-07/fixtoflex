import google.generativeai as genai
import json
import logging
from typing import Dict, Any
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
            return json.loads(result_text)
            
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            raise Exception("Failed to generate AI analysis.")

    def _build_prompt(self, normalized_data: Dict[str, Any]) -> str:
        data_str = json.dumps(normalized_data, indent=2)
        
        return f"""
You are an expert tech recruiter and senior software engineering manager. 
Analyze the following structured GitHub profile data and provide a comprehensive, highly detailed career intelligence report.

Raw Profile Data:
{data_str}

IMPORTANT INSTRUCTIONS:
1. Make your summaries highly detailed and insightful, avoiding generic short responses.
2. In the `repositories_list` field, you MUST explicitly list ALL project repositories found in the data, detailing the tech stacks used in each project and a short description.
3. Provide a very detailed and thoughtful overall career summary.

Respond STRICTLY with a valid JSON object matching exactly the following schema. 
Do not include any markdown formatting, code blocks, or extra text.

JSON Schema:
{{
  "summary": {{
    "professional_profile_summary": "string",
    "technical_skills_summary": "string",
    "repositories_list": [
      {{
        "name": "string",
        "tech_stack": ["string"],
        "description": "string"
      }}
    ],
    "programming_languages": ["string"],
    "framework_experience": ["string"],
    "development_domains": ["string"],
    "major_projects_overview": "string",
    "open_source_contributions": "string",
    "development_experience_level": "string",
    "portfolio_quality": "string",
    "repository_quality": "string",
    "technical_strengths": ["string"],
    "overall_career_summary": "string"
  }},
  "scores": {{
    "github_profile_score": integer (0-100),
    "project_quality_score": integer (0-100),
    "repository_organization_score": integer (0-100),
    "documentation_score": integer (0-100),
    "technical_skills_score": integer (0-100),
    "open_source_activity_score": integer (0-100),
    "overall_career_readiness_score": integer (0-100)
  }}
}}
"""

    def _get_mock_response(self, normalized_data: Dict[str, Any]) -> Dict[str, Any]:
        """Mock response for development without API keys."""
        name = normalized_data.get("personal_profile", {}).get("name", "Candidate")
        return {
            "summary": {
                "professional_profile_summary": f"{name} presents a solid foundation in software development with visible activity on GitHub.",
                "technical_skills_summary": "Demonstrates proficiency across multiple modern web technologies and backend systems.",
                "repositories_list": [
                    {
                        "name": "Global_ontology",
                        "tech_stack": ["JavaScript", "HTML/CSS", "Python"],
                        "description": "A global ontology mapping engine."
                    },
                    {
                        "name": "Portfolio-v2",
                        "tech_stack": ["React", "Next.js", "TailwindCSS"],
                        "description": "Personal developer portfolio."
                    }
                ],
                "programming_languages": ["TypeScript", "Python", "JavaScript", "HTML/CSS"],
                "framework_experience": ["React", "Next.js", "FastAPI"],
                "development_domains": ["Full Stack Web Development", "API Design", "Frontend Architecture"],
                "major_projects_overview": "Projects exhibit a mix of frontend interfaces and backend APIs, suggesting capable full-stack abilities.",
                "open_source_contributions": "Active in personal repositories with some evidence of open-source awareness.",
                "development_experience_level": "Mid-Level Developer",
                "portfolio_quality": "Good. Projects are well-named and relevant to modern industry demands.",
                "repository_quality": "Standard. Most repositories contain descriptions and language tags.",
                "technical_strengths": ["Rapid Prototyping", "Modern JS Ecosystem", "API Integration"],
                "overall_career_summary": f"Overall, {name} is a capable developer ready for challenging roles in full-stack engineering."
            },
            "scores": {
                "github_profile_score": 85,
                "project_quality_score": 78,
                "repository_organization_score": 82,
                "documentation_score": 70,
                "technical_skills_score": 88,
                "open_source_activity_score": 65,
                "overall_career_readiness_score": 80
            }
        }
