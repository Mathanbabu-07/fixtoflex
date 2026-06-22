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
        # Fallback to a random UUID if current_user doesn't have an ID (e.g. in test envs)
        user_id = current_user.get("id", "00000000-0000-0000-0000-000000000000")
        
        result = await service.process_github_profile(user_id, request.github_url)
        return {"status": "success", "data": result}
        
    except Exception as e:
        logger.error(f"Error during GitHub analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))
