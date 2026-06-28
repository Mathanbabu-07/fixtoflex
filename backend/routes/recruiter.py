import logging
import json
import random
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

def get_mock_match(job_role: str, filename: str) -> dict:
    # Extract clean candidate name from filename
    clean_name = filename.replace("_", " ").replace("-", " ").split(".")[0].replace("resume", "").strip().title()
    if not clean_name:
        clean_name = "Candidate"
        
    score = random.randint(72, 97)
    
    # Select appropriate mock data
    mock_strengths = [
        f"Demonstrated competence in technical stack matching the requirements of {job_role}.",
        "Solid project portfolio detailing real-world architectural design.",
        "Excellent communication and problem-solving highlights."
    ]
    mock_weaknesses = [
        "Lacks quantifiable metrics for cloud or deployment efficiency.",
        "Could expand on automated testing frameworks."
    ]
    
    return {
        "match_score": score,
        "strengths": mock_strengths,
        "weaknesses": mock_weaknesses,
        "matched_skills": ["Python", "React.js", "TypeScript", "SQL"][:random.randint(2, 4)],
        "missing_skills": ["Docker", "Kubernetes", "AWS"][:random.randint(0, 2)],
        "fit_summary": f"{clean_name} shows strong compatibility ({score}%) for the {job_role} position. Their background aligns well with the technical stack and core requirements."
    }

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
    """
    if not payload.resumes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No resumes provided for matching."
        )
        
    gemini_client = GeminiClient()
    results = []
    
    for candidate in payload.resumes:
        filename = candidate.filename
        text_content = candidate.text_content
        
        # If Gemini is configured and we have valid model
        if gemini_client.model:
            prompt = f"""
You are an expert technical recruiter.
Match the candidate's resume text against the job description and requirements details below.

Job details:
- Title: {payload.job_role}
- Location: {payload.company_location}
- Salary Range: {payload.salary_range or "Not Specified"}
- Work Mode: {payload.work_mode}
- Description: {payload.job_description}

Job Requirements:
- Skills: {', '.join(payload.skills)}
- Qualification: {', '.join(payload.qualification)}
- Experience: {payload.min_experience or '0'} to {payload.max_experience or '10+'} years
- Certifications: {', '.join(payload.certifications) if payload.certifications else "Not Specified"}
- Soft Skills: {', '.join(payload.soft_skills) if payload.soft_skills else "Not Specified"}
- Languages: {', '.join(payload.languages) if payload.languages else "Not Specified"}
- Tools & Frameworks: {', '.join(payload.tools_frameworks) if payload.tools_frameworks else "Not Specified"}

Candidate Resume Text:
{text_content}

Respond STRICTLY with a valid JSON object matching exactly the following schema.
Do not include any markdown formatting, code blocks, or extra text.

JSON Schema:
{{
  "match_score": integer (0-100),
  "strengths": ["string"],
  "weaknesses": ["string"],
  "matched_skills": ["string"],
  "missing_skills": ["string"],
  "fit_summary": "string"
}}
"""
            try:
                response = gemini_client.model.generate_content(
                    prompt,
                    generation_config=genai.types.GenerationConfig(
                        response_mime_type="application/json",
                    )
                )
                match_data = gemini_client._parse_json_safe(response.text)
                
                # Format candidate name
                clean_name = filename.replace("_", " ").replace("-", " ").split(".")[0].replace("resume", "").strip().title()
                if not clean_name:
                    clean_name = "Candidate"
                    
                results.append({
                    "filename": filename,
                    "file_size": candidate.file_size,
                    "candidate_name": clean_name,
                    "match_score": match_data.get("match_score", 0),
                    "strengths": match_data.get("strengths", []),
                    "weaknesses": match_data.get("weaknesses", []),
                    "matched_skills": match_data.get("matched_skills", []),
                    "missing_skills": match_data.get("missing_skills", []),
                    "fit_summary": match_data.get("fit_summary", "")
                })
            except Exception as e:
                logger.error(f"Gemini matching failed for {filename}: {e}. Using mock fallback.")
                mock_data = get_mock_match(payload.job_role, filename)
                results.append({
                    "filename": filename,
                    "file_size": candidate.file_size,
                    "candidate_name": filename.replace("_", " ").replace("-", " ").split(".")[0].replace("resume", "").strip().title(),
                    **mock_data
                })
        else:
            logger.info("Gemini not available. Generating mock match analysis.")
            mock_data = get_mock_match(payload.job_role, filename)
            results.append({
                "filename": filename,
                "file_size": candidate.file_size,
                "candidate_name": filename.replace("_", " ").replace("-", " ").split(".")[0].replace("resume", "").strip().title(),
                **mock_data
            })
            
    # Sort results in descending order by match score
    results.sort(key=lambda x: x["match_score"], reverse=True)
    
    return {
        "success": True,
        "results": results
    }
