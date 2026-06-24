from fastapi import APIRouter, Depends, HTTPException, Request
from typing import Dict, Any
from pydantic import BaseModel
import logging
from services.analysis.analysis_service import AnalysisService
from middleware.auth_middleware import get_current_user

logger = logging.getLogger("backend.routes.analysis")

router = APIRouter(
    prefix="/analysis",
    tags=["analysis"]
)

class GitHubAnalysisRequest(BaseModel):
    github_url: str

class PortfolioAnalysisRequest(BaseModel):
    portfolio_url: str

class LinkedInAnalysisRequest(BaseModel):
    linkedin_url: str

@router.post("/github")
async def analyze_github_profile(
    request: GitHubAnalysisRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Endpoint to trigger the GitHub Profile Analysis pipeline.
    """
    if not request.github_url or "github.com" not in request.github_url.lower():
        raise HTTPException(status_code=400, detail="A valid GitHub URL is required.")
        
    try:
        service = AnalysisService()
        user_id = current_user.get("id", "00000000-0000-0000-0000-000000000000")
        
        result = await service.process_github_profile(user_id, request.github_url)
        return {"status": "success", "data": result}
        
    except Exception as e:
        logger.error(f"Error during GitHub analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/portfolio")
async def analyze_portfolio(
    request: PortfolioAnalysisRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Endpoint to trigger the Portfolio Analysis pipeline.
    """
    if not request.portfolio_url or not request.portfolio_url.startswith("http"):
        raise HTTPException(status_code=400, detail="A valid Portfolio URL is required.")
        
    try:
        service = AnalysisService()
        user_id = current_user.get("id", "00000000-0000-0000-0000-000000000000")
        
        result = await service.process_portfolio(user_id, request.portfolio_url)
        return {"status": "success", "data": result}
        
    except Exception as e:
        logger.error(f"Error during Portfolio analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/linkedin")
async def analyze_linkedin_profile(
    request: LinkedInAnalysisRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Endpoint to trigger the LinkedIn Profile Analysis hybrid pipeline.
    """
    if not request.linkedin_url or "linkedin.com" not in request.linkedin_url.lower():
        raise HTTPException(status_code=400, detail="A valid LinkedIn profile URL is required.")
        
    try:
        service = AnalysisService()
        user_id = current_user.get("id", "00000000-0000-0000-0000-000000000000")
        
        result = await service.process_linkedin(user_id, request.linkedin_url, current_user)
        return {"status": "success", "data": result}
        
    except Exception as e:
        logger.error(f"Error during LinkedIn analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))


from fastapi import UploadFile, File

@router.post("/resume")
async def analyze_resume(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Endpoint to trigger the Resume Analysis pipeline.
    """
    if not file.filename.endswith((".pdf", ".docx")):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported.")
        
    try:
        file_bytes = await file.read()
        service = AnalysisService()
        user_id = current_user.get("id", "00000000-0000-0000-0000-000000000000")
        
        result = await service.process_resume(user_id, file_bytes, file.filename)
        return {"status": "success", "data": result}
        
    except Exception as e:
        logger.error(f"Error during Resume analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))
