from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import logging
from services.interview_service import InterviewService
from middleware.auth_middleware import get_current_user

router = APIRouter(
    prefix="/interview",
    tags=["Interview Simulator"]
)
logger = logging.getLogger("backend.routes.interview")

class StartInterviewRequest(BaseModel):
    difficulty: str = "Easy"
    total_questions: int = 5

class EvaluateAnswerRequest(BaseModel):
    session_id: str
    question_text: str
    transcript: str

@router.post("/start", response_model=Dict[str, Any])
async def start_interview(payload: StartInterviewRequest, current_user: dict = Depends(get_current_user)):
    try:
        service = InterviewService()
        result = await service.start_interview(current_user["id"], payload.dict())
        return result
    except Exception as e:
        logger.error(f"Error starting interview: {e}")
        raise HTTPException(status_code=500, detail="Failed to start interview")

@router.post("/evaluate-and-next", response_model=Dict[str, Any])
async def evaluate_and_next(payload: EvaluateAnswerRequest, current_user: dict = Depends(get_current_user)):
    try:
        service = InterviewService()
        # Verify session belongs to user
        res = service.supabase.table("interview_sessions").select("user_id").eq("id", payload.session_id).execute()
        if not res.data or res.data[0]["user_id"] != current_user["id"]:
             raise HTTPException(status_code=403, detail="Not authorized to access this session")
             
        result = await service.evaluate_answer(current_user["id"], payload.session_id, payload.dict())
        return result
    except Exception as e:
        logger.error(f"Error in evaluate_and_next: {e}")
        raise HTTPException(status_code=500, detail="Failed to evaluate answer")

@router.get("/{session_id}/report", response_model=Dict[str, Any])
async def get_report(session_id: str, current_user: dict = Depends(get_current_user)):
    try:
        service = InterviewService()
        # Verify session belongs to user
        res = service.supabase.table("interview_sessions").select("*").eq("id", session_id).execute()
        if not res.data or res.data[0]["user_id"] != current_user["id"]:
             raise HTTPException(status_code=403, detail="Not authorized to access this session")
             
        return res.data[0].get("final_report_json", {})
    except Exception as e:
        logger.error(f"Error fetching report: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch report")

@router.get("/history", response_model=List[Dict[str, Any]])
async def get_history(current_user: dict = Depends(get_current_user)):
    try:
        service = InterviewService()
        history = await service.get_history(current_user["id"])
        return history
    except Exception as e:
        logger.error(f"Error fetching history: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch history")
