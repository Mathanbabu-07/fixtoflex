import logging
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from middleware.auth_middleware import get_current_user
from services.user_service import user_service

logger = logging.getLogger("backend.routes.users")

router = APIRouter(prefix="/users", tags=["Users"])

class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    profile_picture: Optional[str] = None
    headline: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    resume_url: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    email: Optional[str] = None
    mobile_number: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    institution_name: Optional[str] = None
    institution_district: Optional[str] = None
    interested_domain: Optional[str] = None
    target_job_role: Optional[str] = None
    experience: Optional[str] = None
    skills: Optional[str] = None
    language_proficiency: Optional[str] = None
    certifications: Optional[str] = None

@router.get("/me", status_code=status.HTTP_200_OK)
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    """
    Retrieve the current logged-in user's profile details.
    Protected by Bearer JWT Authentication.
    """
    logger.info(f"Retrieving profile for authenticated user ID: {current_user.get('id')}")
    return current_user

@router.put("/me", status_code=status.HTTP_200_OK)
async def update_my_profile(
    payload: UserProfileUpdate, 
    current_user: dict = Depends(get_current_user)
):
    """
    Update profile details for the authenticated user (e.g. full_name, avatar_url).
    Protected by Bearer JWT Authentication.
    """
    user_id = current_user.get("id")
    logger.info(f"Received update profile request for user ID: {user_id}")
    
    # Extract fields sent by client
    updates = payload.model_dump(exclude_unset=True)
    if not updates:
        return current_user

    try:
        updated_profile = user_service.update_user_profile(user_id=user_id, updates=updates)
        if updated_profile:
            return updated_profile
        
        # If database was bypassed in middleware, return the modified token context
        logger.warning(f"Could not save updates to database for {user_id}. Returning merged local context.")
        merged_profile = {**current_user, **updates}
        return merged_profile
    except Exception as e:
        logger.error(f"Failed to update profile for user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while saving user updates: {str(e)}"
        )
