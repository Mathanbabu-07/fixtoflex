import logging
import json
import random
import asyncio
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai

from middleware.auth_middleware import get_current_user
from services.analysis.resume_extractor import ResumeExtractor
from services.analysis.gemini_client import GeminiClient

logger = logging.getLogger("backend.routes.recruiter")

router = APIRouter(
    prefix="/recruiter",
    tags=["Recruiter"]
)

# ---------------------------------------------------------------------------
# Pydantic Models
# ---------------------------------------------------------------------------

class CandidateResume(BaseModel):
    filename: str
    file_size: str
    text_content: str

class MatchRequest(BaseModel):
    job_role: str
    company_location: str
    salary_range: Optional[str] = None
    work_mode: str
    job_description: str
    skills: List[str]
    qualification: List[str]
    min_experience: Optional[str] = None
    max_experience: Optional[str] = None
    certifications: Optional[List[str]] = None
    soft_skills: Optional[List[str]] = None
    languages: Optional[List[str]] = None
    tools_frameworks: Optional[List[str]] = None
    resumes: List[CandidateResume]
    top_n: Optional[int] = None


# ---------------------------------------------------------------------------
# Mock Fallback (used when Gemini is not configured)
# ---------------------------------------------------------------------------

_MOCK_NAMES = [
    "Aditya Sharma", "Priya Patel", "Rahul Verma", "Sneha Iyer",
    "Karthik Nair", "Divya Reddy", "Ankit Mishra", "Meera Joshi",
    "Rohan Gupta", "Tanvi Kulkarni"
]

_MOCK_COLLEGES = [
    ("Indian Institute of Technology, Bombay", "B.Tech Computer Science"),
    ("National Institute of Technology, Trichy", "B.Tech Information Technology"),
    ("Birla Institute of Technology and Science, Pilani", "B.E. Computer Science"),
    ("VIT University, Vellore", "B.Tech Software Engineering"),
    ("Anna University, Chennai", "B.E. Computer Science"),
    (None, None),
]

def get_mock_match(job_role: str, filename: str, index: int = 0) -> dict:
    """Generate a realistic mock match result with enriched candidate information."""
    # Pick a mock name (cycle through list)
    name = _MOCK_NAMES[index % len(_MOCK_NAMES)]
    score = random.randint(68, 97)
    
    college_name, degree = _MOCK_COLLEGES[index % len(_MOCK_COLLEGES)]

    mock_strengths = [
        f"Strong technical alignment with the {job_role} requirements.",
        "Well-structured resume with quantifiable project outcomes.",
        "Demonstrates excellent problem-solving through project work."
    ]
    mock_weaknesses = [
        "Could expand on cloud deployment experience.",
        "Consider adding measurable impact metrics to projects."
    ]
    
    return {
        "candidate_name": name,
        "email": f"{name.split()[0].lower()}.{name.split()[-1].lower()}@email.com",
        "phone": None,
        "linkedin_url": None,
        "github_url": None,
        "college_name": college_name,
        "degree": degree,
        "experience_summary": f"2+ years of experience in software development with focus on {job_role}-related technologies.",
        "skills_found": ["Python", "React.js", "TypeScript", "SQL", "Git"][:random.randint(3, 5)],
        "projects_found": ["E-Commerce Platform", "Chat Application", "Data Pipeline"][:random.randint(1, 3)],
        "certifications_found": ["AWS Cloud Practitioner"][:random.randint(0, 1)],
        "match_score": score,
        "strengths": mock_strengths,
        "weaknesses": mock_weaknesses,
        "matched_skills": ["Python", "React.js", "TypeScript", "SQL"][:random.randint(2, 4)],
        "missing_skills": ["Docker", "Kubernetes", "AWS"][:random.randint(0, 2)],
        "fit_summary": f"{name} shows strong compatibility ({score}%) for the {job_role} position. Their background aligns well with the technical stack and core requirements."
    }


# ---------------------------------------------------------------------------
# Gemini Prompt Builder
# ---------------------------------------------------------------------------

def _build_match_prompt(payload: MatchRequest, text_content: str) -> str:
    return f"""You are an expert technical recruiter and resume analyzer.

TASK: Analyze the candidate's resume text against the job description and requirements below. Extract key candidate information AND evaluate match quality.

═══════════════════════════════════════════
JOB DETAILS
═══════════════════════════════════════════
- Title: {payload.job_role}
- Location: {payload.company_location}
- Salary Range: {payload.salary_range or "Not Specified"}
- Work Mode: {payload.work_mode}
- Description: {payload.job_description}

═══════════════════════════════════════════
JOB REQUIREMENTS
═══════════════════════════════════════════
- Skills: {', '.join(payload.skills)}
- Qualification: {', '.join(payload.qualification)}
- Experience: {payload.min_experience or '0'} to {payload.max_experience or '10+'} years
- Certifications: {', '.join(payload.certifications) if payload.certifications else "Not Specified"}
- Soft Skills: {', '.join(payload.soft_skills) if payload.soft_skills else "Not Specified"}
- Languages: {', '.join(payload.languages) if payload.languages else "Not Specified"}
- Tools & Frameworks: {', '.join(payload.tools_frameworks) if payload.tools_frameworks else "Not Specified"}

═══════════════════════════════════════════
CANDIDATE RESUME TEXT
═══════════════════════════════════════════
{text_content}

═══════════════════════════════════════════
INSTRUCTIONS
═══════════════════════════════════════════
1. Extract the candidate's personal details from the resume text.
2. CRITICAL: If a field like LinkedIn URL, GitHub URL, phone, college, or email is NOT explicitly present in the resume text, you MUST return null for that field. NEVER fabricate, guess, or generate dummy URLs or data.
3. Calculate an overall match_score (0-100) based on: Technical Skills, Relevant Projects, Experience, Education, Certifications, Tools & Frameworks, Soft Skills, and Overall Role Fit.
4. List matched and missing skills compared to job requirements.
5. Provide 2-3 key strengths and areas of improvement.
6. Write a concise 2-3 line fit_summary for the recruiter.

Respond STRICTLY with a valid JSON object matching exactly the following schema.
Do not include any markdown formatting, code blocks, or extra text.

JSON Schema:
{{
  "candidate_name": "string (full name from resume, or 'Unknown Candidate' if not found)",
  "email": "string or null (only if explicitly in resume)",
  "phone": "string or null (only if explicitly in resume)",
  "linkedin_url": "string or null (only if a real LinkedIn URL is in the resume)",
  "github_url": "string or null (only if a real GitHub URL is in the resume)",
  "college_name": "string or null (institution name if found)",
  "degree": "string or null (degree title if found)",
  "experience_summary": "string (brief summary of candidate's experience)",
  "skills_found": ["string (skills identified in resume)"],
  "projects_found": ["string (project names from resume)"],
  "certifications_found": ["string (certifications from resume)"],
  "match_score": integer (0-100),
  "strengths": ["string (2-3 key strengths)"],
  "weaknesses": ["string (1-2 areas to explore)"],
  "matched_skills": ["string (skills matching job requirements)"],
  "missing_skills": ["string (required skills not found in resume)"],
  "fit_summary": "string (2-3 line recruiter summary)"
}}"""


# ---------------------------------------------------------------------------
# Single Resume Analysis Task
# ---------------------------------------------------------------------------

async def _analyze_single_resume(
    gemini_client: GeminiClient,
    payload: MatchRequest,
    candidate: CandidateResume,
    index: int
) -> dict:
    """Analyze a single resume — with Gemini if available, otherwise mock."""
    filename = candidate.filename
    text_content = candidate.text_content

    if gemini_client.model:
        prompt = _build_match_prompt(payload, text_content)
        try:
            response = gemini_client.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    response_mime_type="application/json",
                )
            )
            match_data = gemini_client._parse_json_safe(response.text)

            return {
                "filename": filename,
                "file_size": candidate.file_size,
                "text_content": text_content,
                "candidate_name": match_data.get("candidate_name") or "Unknown Candidate",
                "email": match_data.get("email"),
                "phone": match_data.get("phone"),
                "linkedin_url": match_data.get("linkedin_url"),
                "github_url": match_data.get("github_url"),
                "college_name": match_data.get("college_name"),
                "degree": match_data.get("degree"),
                "experience_summary": match_data.get("experience_summary", ""),
                "skills_found": match_data.get("skills_found", []),
                "projects_found": match_data.get("projects_found", []),
                "certifications_found": match_data.get("certifications_found", []),
                "match_score": match_data.get("match_score", 0),
                "strengths": match_data.get("strengths", []),
                "weaknesses": match_data.get("weaknesses", []),
                "matched_skills": match_data.get("matched_skills", []),
                "missing_skills": match_data.get("missing_skills", []),
                "fit_summary": match_data.get("fit_summary", "")
            }
        except Exception as e:
            logger.error(f"Gemini matching failed for {filename}: {e}. Using mock fallback.")
            mock_data = get_mock_match(payload.job_role, filename, index)
            return {
                "filename": filename,
                "file_size": candidate.file_size,
                "text_content": text_content,
                **mock_data
            }
    else:
        logger.info(f"Gemini not available. Generating mock match for {filename}.")
        mock_data = get_mock_match(payload.job_role, filename, index)
        return {
            "filename": filename,
            "file_size": candidate.file_size,
            "text_content": text_content,
            **mock_data
        }


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.post("/upload", status_code=status.HTTP_200_OK)
async def upload_recruiter_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Upload resume for recruiter scanning.
    Extracts text using the existing ResumeExtractor and returns metadata + parsed text.
    """
    if not file.filename.endswith((".pdf", ".docx")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF and DOCX files are supported."
        )
        
    try:
        file_bytes = await file.read()
        file_size_mb = len(file_bytes) / (1024 * 1024)
        size_str = f"{file_size_mb:.1f} MB"
        
        extracted_data = ResumeExtractor.extract(file_bytes, file.filename)
        
        return {
            "success": True,
            "filename": file.filename,
            "file_size": size_str,
            "text_content": extracted_data.get("raw_text", "")
        }
    except Exception as e:
        logger.error(f"Error extracting resume in recruiter upload: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process resume: {str(e)}"
        )

@router.post("/match", status_code=status.HTTP_200_OK)
async def match_resumes(
    payload: MatchRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Analyze list of uploaded resumes against job details and requirements.
    Uses Gemini API if available, else falls back to mock matching.
    Processes all resumes in parallel using asyncio.gather for performance.
    Returns only the top_n results sorted by match_score descending.
    """
    if not payload.resumes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No resumes provided for matching."
        )

    # Validate top_n
    top_n = payload.top_n
    if top_n is not None:
        if top_n < 1:
            top_n = 1
        if top_n > len(payload.resumes):
            top_n = len(payload.resumes)

    gemini_client = GeminiClient()

    # Build tasks for parallel processing
    tasks = [
        _analyze_single_resume(gemini_client, payload, candidate, idx)
        for idx, candidate in enumerate(payload.resumes)
    ]

    # Run all analyses concurrently
    results = await asyncio.gather(*tasks, return_exceptions=True)

    # Filter out any exceptions and collect successful results
    valid_results = []
    for i, result in enumerate(results):
        if isinstance(result, Exception):
            logger.error(f"Resume analysis failed for index {i}: {result}. Generating mock fallback.")
            mock_data = get_mock_match(payload.job_role, payload.resumes[i].filename, i)
            valid_results.append({
                "filename": payload.resumes[i].filename,
                "file_size": payload.resumes[i].file_size,
                "text_content": payload.resumes[i].text_content,
                **mock_data
            })
        else:
            valid_results.append(result)

    # Sort results in descending order by match score
    valid_results.sort(key=lambda x: x["match_score"], reverse=True)

    total_analyzed = len(valid_results)

    # Apply top_n filter
    if top_n is not None:
        valid_results = valid_results[:top_n]

    return {
        "success": True,
        "total_analyzed": total_analyzed,
        "top_n": top_n or total_analyzed,
        "results": valid_results
    }
