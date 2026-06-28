import logging
import httpx
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Tuple
from config.database import settings
from services.user_service import user_service
from services.linkedin_service import linkedin_service
from utils.jwt_handler import create_access_token

logger = logging.getLogger("backend.services.auth_service")

class AuthService:
    def __init__(self):
        pass

    def authenticate_session(self, user_id: str, email: str, role: str = "candidate") -> str:
        """
        Generate a local FixToFlex session JWT for a user.
        Reference: Step 8: JWT Authentication
        """
        token_payload = {
            "user_id": user_id,
            "email": email,
            "role": role
        }
        return create_access_token(data=token_payload)

    async def process_linkedin_oauth_callback(self, code: str) -> Tuple[str, Dict[str, Any]]:
        """
        Processes the LinkedIn OAuth code redirect callback.
        1. Exchanges code for a LinkedIn access token.
        2. Retrieves user profile details via OpenID Connect userinfo.
        3. Queries Supabase users table to match linkedin_id.
        4. Upserts user profile (inserts new or links existing user profile).
        5. Issues a 7-day internal session JWT.
        """
        logger.info("Executing process_linkedin_oauth_callback flow...")
        
        # 1. Exchange authorization code for LinkedIn access token
        access_token = await linkedin_service.exchange_code_for_token(code)
        
        # 2. Retrieve user profile info using the access token
        li_profile = await linkedin_service.get_user_profile(access_token)
        
        linkedin_id = li_profile["linkedin_id"]
        email = li_profile["email"]
        full_name = li_profile["full_name"]
        profile_picture = li_profile["profile_picture"]
        
        try:
            # 3. Check if user already exists by their LinkedIn ID
            user = user_service.get_user_by_linkedin_id(linkedin_id)
            
            if not user:
                logger.info(f"User with LinkedIn ID {linkedin_id} not found in database. Checking by email...")
                
                # Check if a user with the same email already exists (e.g. created via another mechanism)
                existing_email_user = user_service.get_user_by_email(email)
                
                if existing_email_user:
                    logger.info(f"Linking LinkedIn ID {linkedin_id} to existing email profile: {email}")
                    # Link LinkedIn ID and update profile picture if needed
                    updates = {
                        "linkedin_id": linkedin_id,
                        "profile_picture": profile_picture or existing_email_user.get("profile_picture")
                    }
                    user = user_service.update_user_profile(
                        user_id=existing_email_user["id"],
                        updates=updates
                    )
                else:
                    logger.info(f"Creating a new user profile record for {email}...")
                    # Reference: Step 7: User Creation Logic
                    user = user_service.create_user_profile(
                        linkedin_id=linkedin_id,
                        email=email,
                        full_name=full_name,
                        profile_picture=profile_picture,
                        role="candidate"
                    )
            else:
                logger.info(f"LinkedIn ID {linkedin_id} mapped to existing user profile: {user['id']}")
                # Proactively update profile picture if changed in LinkedIn
                if profile_picture and user.get("profile_picture") != profile_picture:
                    logger.info(f"Updating profile picture for user {user['id']}")
                    user = user_service.update_user_profile(
                        user_id=user["id"],
                        updates={"profile_picture": profile_picture}
                    )

            # 4. Generate local application session JWT
            user_id_str = str(user["id"])
            user_email = user["email"]
            user_role = user.get("role", "candidate")
            
            logger.info("[STEP 7] User stored in Supabase")

            token = self.authenticate_session(
                user_id=user_id_str,
                email=user_email,
                role=user_role
            )
            
            logger.info("[STEP 8] JWT generated")
            return token, user
            
        except Exception as e:
            logger.error(f"Error executing user mapping and session creation: {e}")
            raise e

    async def process_google_oauth_callback(self, code: str, user_id: str, redirect_uri: str) -> None:
        """
        Exchanges Google OAuth code for tokens and saves them to the user's profile.
        """
        logger.info(f"Exchanging Google OAuth code for user {user_id}")
        
        token_url = "https://oauth2.googleapis.com/token"
        payload = {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": redirect_uri
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(token_url, data=payload)
            
            if response.status_code != 200:
                logger.error(f"Failed to exchange Google code: {response.text}")
                raise ValueError("Failed to retrieve Google tokens.")
                
            token_data = response.json()
            
            access_token = token_data.get("access_token")
            refresh_token = token_data.get("refresh_token")
            expires_in = token_data.get("expires_in", 3599)
            
            expiry_date = datetime.now(timezone.utc) + timedelta(seconds=expires_in)
            
            updates = {
                "google_access_token": access_token,
                "google_token_expiry": expiry_date.isoformat()
            }
            if refresh_token:
                updates["google_refresh_token"] = refresh_token
                
            user_service.update_user_profile(user_id, updates)
            logger.info("Successfully updated Google OAuth tokens for user.")

# Create a singleton instance
auth_service = AuthService()
