from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any, Optional
import logging

from middleware.auth import get_current_user
from services.job_tracker_service import JobTrackerService

logger = logging.getLogger("backend.routes.job_tracker")
router = APIRouter(prefix="/job-tracker", tags=["Job Tracker"])

@router.get("/jobs")
async def get_tracked_jobs(
    force_refresh: bool = False,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Fetch personalized Indeed jobs for the user.
    Uses cached results by default unless force_refresh is True or cache is expired.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user session")

    try:
        service = JobTrackerService()
        result = await service.get_jobs(user_id=user_id, force_refresh=force_refresh)
        
        if result.get("status") == "error":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result.get("message"))
            
        return result
    except Exception as e:
        logger.error(f"Error fetching jobs: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
