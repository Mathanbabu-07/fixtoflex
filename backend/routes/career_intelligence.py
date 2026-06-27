from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
import logging
from middleware.auth_middleware import get_current_user
from services.career_intelligence_service import CareerIntelligenceService
from services.target_career_service import TargetCareerService

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

class TargetReportRequest(BaseModel):
    company: str
    role: str
    location: Optional[str] = None

@router.post("/target-report")
async def get_target_career_report(
    payload: TargetReportRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate a company-specific career intelligence report.
    Scrapes fresh job data and compares against cached candidate profile.
    """
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user session")

    try:
        service = TargetCareerService()
        result = await service.get_or_generate_target_report(
            user_id=user_id,
            company=payload.company,
            role=payload.role,
            location=payload.location
        )

        if result.get("status") == "error":
            raise HTTPException(status_code=400, detail=result.get("message"))

        return {"status": "success", "data": result.get("data"), "cached": result.get("cached")}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating target career report: {e}")
        raise HTTPException(status_code=500, detail=str(e))
