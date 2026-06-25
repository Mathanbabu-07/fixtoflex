from fastapi import APIRouter, Depends, HTTPException
import logging
from middleware.auth_middleware import get_current_user
from services.career_intelligence_service import CareerIntelligenceService

logger = logging.getLogger("backend.routes.career_intelligence")

router = APIRouter(
    prefix="/career-intelligence",
    tags=["career_intelligence"]
)

@router.get("/report")
async def get_career_intelligence_report(
    current_user: dict = Depends(get_current_user)
):
    """
    Fetches the career intelligence report for the current user.
    If the underlying data has changed, it automatically re-generates the report.
    """
    try:
        user_id = current_user.get("id", "00000000-0000-0000-0000-000000000000")
        service = CareerIntelligenceService()
        result = await service.get_or_generate_report(user_id)
        
        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("message"))
            
        return {"status": "success", "data": result.get("data"), "cached": result.get("cached")}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching career intelligence report: {e}")
        raise HTTPException(status_code=500, detail=str(e))
