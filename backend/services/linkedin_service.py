import logging
import httpx
from fastapi import HTTPException, status
from config.database import settings

logger = logging.getLogger("backend.services.linkedin_service")

class LinkedInService:
    def __init__(self):
        self.token_url = "https://www.linkedin.com/oauth/v2/accessToken"
        self.userinfo_url = "https://api.linkedin.com/v2/userinfo"

    async def exchange_code_for_token(self, code: str) -> str:
        """
        Exchanges the LinkedIn authorization code for an access token.
        Reference: Step 4: LinkedIn Token Exchange
        """
        data = {
            "grant_type": "authorization_code",
            "code": code,
            "client_id": settings.LINKEDIN_CLIENT_ID,
            "client_secret": settings.LINKEDIN_CLIENT_SECRET,
            "redirect_uri": settings.LINKEDIN_REDIRECT_URI,
        }
        
        logger.info(f"Initiating LinkedIn token exchange with redirect_uri: {settings.LINKEDIN_REDIRECT_URI}")
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    self.token_url,
                    data=data,
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
                
                # Check for direct communication errors
                if response.status_code != 200:
                    error_msg = response.text
                    try:
                        error_json = response.json()
                        error_msg = error_json.get("error_description", error_json.get("error", error_msg))
                    except Exception:
                        pass
                    
                    logger.error(f"LinkedIn token exchange failed with status {response.status_code}: {response.text}")
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"LinkedIn token exchange failed: {error_msg}"
                    )
                
                result = response.json()
                access_token = result.get("access_token")
                if not access_token:
                    logger.error("LinkedIn response payload was missing access_token.")
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail="LinkedIn did not return an access token."
                    )
                
                logger.info("[STEP 5] Access token received")
                return access_token
            except httpx.RequestError as exc:
                logger.error(f"Network failure while reaching LinkedIn OAuth server: {exc}")
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Failed to communicate with LinkedIn authorization servers."
                )

    async def get_user_profile(self, access_token: str) -> dict:
        """
        Fetches the authenticated user's profile details.
        Reference: Step 5: Fetch User Profile
        """
        headers = {"Authorization": f"Bearer {access_token}"}
        
        logger.info("Fetching profile details from LinkedIn userinfo endpoint...")
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(self.userinfo_url, headers=headers)
                
                if response.status_code != 200:
                    logger.error(f"LinkedIn userinfo retrieval failed with status {response.status_code}: {response.text}")
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Failed to retrieve user profile information from LinkedIn."
                    )
                
                profile = response.json()
                
                # Verify OpenID Connect required keys
                sub = profile.get("sub")
                email = profile.get("email")
                name = profile.get("name")
                picture = profile.get("picture")
                
                if not sub or not email:
                    logger.error(f"Missing mandatory user profile claims in LinkedIn response: {profile}")
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail="User profile retrieved from LinkedIn was missing mandatory ID or email claims."
                    )
                
                logger.info("[STEP 6] User profile fetched")
                return {
                    "linkedin_id": sub,
                    "email": email,
                    "full_name": name or email.split("@")[0],
                    "profile_picture": picture
                }
            except httpx.RequestError as exc:
                logger.error(f"Network error trying to connect to LinkedIn API userinfo: {exc}")
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="Unable to reach LinkedIn Profile endpoints."
                )

# Create singleton service instance
linkedin_service = LinkedInService()
