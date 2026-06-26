import logging
from urllib.parse import urlencode
from fastapi import APIRouter, HTTPException, Response, status
from pydantic import BaseModel, EmailStr
from config.database import settings
from services.auth_service import auth_service
from services.user_service import user_service
from utils.state_generator import generate_state, verify_state

logger = logging.getLogger("backend.routes.auth")

router = APIRouter(prefix="/auth", tags=["Authentication"])

class CallbackRequest(BaseModel):
    code: str
    state: str

class MockLoginRequest(BaseModel):
    user_id: str
    email: EmailStr

from fastapi.responses import RedirectResponse

@router.get("/linkedin/login", status_code=status.HTTP_307_TEMPORARY_REDIRECT)
async def get_linkedin_login_url():
    """
    Generate the official LinkedIn OAuth 2.0 authorization URL and redirect the user.
    Reference: Step 1: LinkedIn Login Endpoint
    """
    try:
        # Generate secure signed state parameter
        state = generate_state()
        
        # Build query parameters
        params = {
            "response_type": "code",
            "client_id": settings.LINKEDIN_CLIENT_ID,
            "redirect_uri": settings.LINKEDIN_REDIRECT_URI,
            "state": state,
            "scope": "openid profile email"
        }
        
        # Build URL
        auth_url = f"https://www.linkedin.com/oauth/v2/authorization?{urlencode(params)}"
        logger.info(f"Redirecting user to LinkedIn authorization URL: {auth_url}")
        
        return RedirectResponse(url=auth_url)
    except Exception as e:
        logger.error(f"Error creating LinkedIn authorization URL: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to initialize LinkedIn login flow."
        )

@router.post("/linkedin/callback", status_code=status.HTTP_200_OK)
async def linkedin_callback(payload: CallbackRequest, response: Response):
    """
    Handles the redirect callback from LinkedIn.
    Validates state token, exchanges code, upserts user profile,
    and sets HttpOnly cookie session.
    Reference: Step 4, Step 9, Step 10
    """
    logger.info("Received request on LinkedIn OAuth callback endpoint.")
    
    # 1. CSRF Verification of the state parameter
    if not verify_state(payload.state):
        logger.error("OAuth state verification failed. Rejecting callback.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="State token validation failed. Request may have expired or been tampered with."
        )
        
    try:
        # 2. Exchange code, query profile, and setup user profile / session
        token, user = await auth_service.process_linkedin_oauth_callback(payload.code)
        
        # Enforce SameSite=None and Secure=True in production, otherwise read from settings
        cookie_secure = settings.COOKIE_SECURE
        cookie_samesite = settings.COOKIE_SAMESITE
        if settings.APP_ENV == "production":
            cookie_secure = True
            cookie_samesite = "none"

        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=cookie_secure,
            samesite=cookie_samesite,
            max_age=7 * 24 * 60 * 60,  # 7 days in seconds
            path="/"
        )
        
        # 4. Return user details
        # Reference: Step 10: Return User Session
        return {
            "success": True,
            "user": {
                "id": str(user["id"]),
                "name": user["full_name"],
                "email": user["email"],
                "profile_picture": user.get("profile_picture")
            }
        }
    except HTTPException as http_exc:
        # Propagate custom service-level HTTPExceptions
        raise http_exc
    except Exception as e:
        logger.error(f"Failed to process OAuth callback: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication failed during code exchange."
        )

@router.post("/mock-login", status_code=status.HTTP_200_OK)
async def mock_login(payload: MockLoginRequest, response: Response):
    """
    Sandbox endpoint to log in local developers.
    Creates or retrieves the mock profile and sets the HttpOnly cookie session.
    """
    try:
        # Check if user already exists
        user = user_service.get_user_by_email(payload.email)
        if not user:
            # Create a mock database user
            user = user_service.create_user_profile(
                linkedin_id=f"mock_li_{payload.user_id}",
                email=payload.email,
                full_name="Mock Sandboxed User",
                profile_picture="https://images.linkedin.com/mock-profile.png",
                role="candidate"
            )
            
        token = auth_service.authenticate_session(
            user_id=str(user["id"]),
            email=user["email"],
            role=user.get("role", "candidate")
        )
        
        # Enforce SameSite=None and Secure=True in production, otherwise read from settings
        cookie_secure = settings.COOKIE_SECURE
        cookie_samesite = settings.COOKIE_SAMESITE
        if settings.APP_ENV == "production":
            cookie_secure = True
            cookie_samesite = "none"

        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=cookie_secure,
            samesite=cookie_samesite,
            max_age=7 * 24 * 60 * 60,
            path="/"
        )
        
        return {
            "success": True,
            "user": {
                "id": str(user["id"]),
                "name": user["full_name"],
                "email": user["email"],
                "profile_picture": user.get("profile_picture")
            }
        }
    except Exception as e:
        logger.error(f"Failed to execute mock login: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Sandbox authentication failed."
        )

@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(response: Response):
    """
    Clears the HttpOnly authentication session cookie.
    """
    cookie_secure = settings.COOKIE_SECURE
    cookie_samesite = settings.COOKIE_SAMESITE
    if settings.APP_ENV == "production":
        cookie_secure = True
        cookie_samesite = "none"

    response.delete_cookie(
        key="access_token", 
        path="/",
        secure=cookie_secure,
        samesite=cookie_samesite
    )
    return {"success": True, "detail": "Logged out successfully."}

