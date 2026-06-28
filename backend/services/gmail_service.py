import logging
from typing import Optional
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from config.database import settings
from services.user_service import user_service

logger = logging.getLogger("backend.services.gmail_service")

class GmailService:
    def __init__(self):
        self.scopes = [
            "openid",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/gmail.compose"
        ]

    def get_gmail_client(self, user_id: str):
        """
        Builds and returns an authenticated Gmail API client for the user.
        Refreshes the token if necessary and saves the new token to the DB.
        """
        user = user_service.get_user_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        
        access_token = user.get("google_access_token")
        refresh_token = user.get("google_refresh_token")
        
        if not access_token or not refresh_token:
            raise ValueError("User has not authorized Gmail access.")
        
        creds = Credentials(
            token=access_token,
            refresh_token=refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=settings.GOOGLE_CLIENT_ID,
            client_secret=settings.GOOGLE_CLIENT_SECRET,
            scopes=self.scopes
        )
        
        if not creds.valid:
            if creds.expired and creds.refresh_token:
                logger.info(f"Refreshing expired Google OAuth token for user {user_id}")
                try:
                    creds.refresh(Request())
                    # Update new token in database
                    user_service.update_user_profile(
                        user_id=user_id,
                        updates={
                            "google_access_token": creds.token,
                            "google_token_expiry": creds.expiry.isoformat() if creds.expiry else None
                        }
                    )
                except Exception as e:
                    logger.error(f"Failed to refresh Google token: {e}")
                    raise ValueError("Failed to refresh Gmail token. Please re-authenticate.")
            else:
                raise ValueError("Google credentials are invalid or missing refresh token.")

        service = build('gmail', 'v1', credentials=creds)
        return service

gmail_service = GmailService()
