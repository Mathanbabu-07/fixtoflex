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

@router.get("/validate")
async def validate_candidate_profile_route(
    current_user: dict = Depends(get_current_user)
):
    """
    Phase 1.1 Candidate Validation Endpoint.
    Checks if the user has completed all required fields before allowing analysis.
    """
    try:
        service = AnalysisService()
        user_id = current_user.get("id", "00000000-0000-0000-0000-000000000000")
        result = await service.validate_candidate_profile(user_id)
        return {"status": "success", "data": result}
    except Exception as e:
        logger.error(f"Error during candidate validation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

from services.analysis.queue_service import queue_service

@router.post("/start-queue")
async def start_analysis_queue(
    current_user: dict = Depends(get_current_user)
):
    """
    Phase 1.2: Start the automatic background analysis queue.
    """
    try:
        user_id = current_user.get("id", "00000000-0000-0000-0000-000000000000")
        # Ensure validation passes first
        service = AnalysisService()
        val_result = await service.validate_candidate_profile(user_id)
        if val_result.get("status") != "ready":
            raise HTTPException(status_code=400, detail={"message": "Profile incomplete", "missing_fields": val_result.get("missing_fields")})
            
        queue_service.start_queue(user_id, current_user)
        return {"status": "success", "message": "Background analysis queue started."}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error starting queue: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to start queue")

class ScheduleUpdateRequest(BaseModel):
    schedule_preference: str

@router.post("/schedule")
async def update_schedule(
    request: ScheduleUpdateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    try:
        user_id = current_user.get("id")
        
        # We try to update Supabase. If not initialized, fallback to local store in QueueService
        try:
            supabase = get_supabase_client()
            supabase.table("analysis_queue_jobs").upsert({
                "user_id": user_id,
                "schedule_preference": request.schedule_preference,
                "updated_at": "now()"
            }).execute()
        except Exception as e:
            logger.warning(f"Failed to update schedule in Supabase, using local fallback: {e}")
            
        queue_service._update_status(user_id, {"schedule_preference": request.schedule_preference})
            
        return {"status": "success", "message": "Schedule updated successfully"}
    except Exception as e:
        logger.error(f"Error updating schedule: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update schedule")

@router.get("/status")
async def get_analysis_status(
    current_user: dict = Depends(get_current_user)
):
    """
    Phase 1.3: Get the real-time progress status of the background analysis queue.
    """
    try:
        user_id = current_user.get("id", "00000000-0000-0000-0000-000000000000")
        status = queue_service.get_status(user_id)
        status["cache_valid"] = queue_service.is_queue_cache_valid(user_id)
        return {"status": "success", "data": status}
    except Exception as e:
        logger.error(f"Error fetching queue status: {e}")
        raise HTTPException(status_code=500, detail=str(e))


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
        
        # Phase 1.1 Validation Check
        val_result = await service.validate_candidate_profile(user_id)
        if val_result.get("status") != "ready":
            raise HTTPException(status_code=400, detail={"message": "Profile incomplete", "missing_fields": val_result.get("missing_fields")})
            
        result = await service.process_github_profile(user_id, request.github_url)
        return {"status": "success", "data": result}
    except HTTPException:
        raise
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
        
        # Phase 1.1 Validation Check
        val_result = await service.validate_candidate_profile(user_id)
        if val_result.get("status") != "ready":
            raise HTTPException(status_code=400, detail={"message": "Profile incomplete", "missing_fields": val_result.get("missing_fields")})
            
        result = await service.process_portfolio(user_id, request.portfolio_url)
        return {"status": "success", "data": result}
    except HTTPException:
        raise
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
        
        # Phase 1.1 Validation Check
        val_result = await service.validate_candidate_profile(user_id)
        if val_result.get("status") != "ready":
            raise HTTPException(status_code=400, detail={"message": "Profile incomplete", "missing_fields": val_result.get("missing_fields")})
            
        result = await service.process_linkedin(user_id, request.linkedin_url, current_user)
        return {"status": "success", "data": result}
    except HTTPException:
        raise
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
        
        # Phase 1.1 Validation Check
        val_result = await service.validate_candidate_profile(user_id)
        if val_result.get("status") != "ready":
            raise HTTPException(status_code=400, detail={"message": "Profile incomplete", "missing_fields": val_result.get("missing_fields")})
            
        result = await service.process_resume(user_id, file_bytes, file.filename)
        return {"status": "success", "data": result}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during Resume analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))
