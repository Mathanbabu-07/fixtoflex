from fastapi import APIRouter, Depends, Query, HTTPException
from typing import Dict, Any
from middleware.auth_middleware import get_current_user
from services.internship_tracker_service import InternshipTrackerService
import logging

router = APIRouter(prefix="/internship-tracker", tags=["internship-tracker"])
logger = logging.getLogger(__name__)

internship_tracker_service = InternshipTrackerService()

@router.get("/search", response_model=Dict[str, Any])
async def search_internships(
    force_refresh: bool = Query(False, description="Force refresh the internship cache"),
    current_user: dict = Depends(get_current_user)
):
    try:
        user_id = current_user.get("id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Not authenticated")
            
        result = await internship_tracker_service.get_internships(user_id, force_refresh)
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("message"))
            
        return result
    except Exception as e:
        logger.error(f"Error in GET /internship-tracker/search: {e}")
        raise HTTPException(status_code=500, detail=str(e))
