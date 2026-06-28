import base64
import logging
from datetime import datetime, timezone
from email.mime.text import MIMEText

from fastapi import APIRouter, Depends, HTTPException, status
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from config.database import settings
from services.user_service import user_service
from middleware.auth_middleware import get_current_user

logger = logging.getLogger("backend.routes.mail")

router = APIRouter(prefix="/mail", tags=["Mail"])

@router.post("/create-draft", status_code=status.HTTP_200_OK)
async def create_gmail_draft(current_user: dict = Depends(get_current_user)):
    """
    Creates a Gmail draft for the authenticated user using their stored Google OAuth tokens.
    """
    user_id = str(current_user["id"])
    logger.info(f"Received request to create Gmail draft for user {user_id}")
    
    # Check if user has Google credentials
    google_access_token = current_user.get("google_access_token")
    google_refresh_token = current_user.get("google_refresh_token")
    
    if not google_access_token:
        raise HTTPException(
            status_code=400,
            detail="Google OAuth tokens are missing. Please link your Google account first."
        )
        
    try:
        # Reconstruct Google Credentials
        creds = Credentials(
            token=google_access_token,
            refresh_token=google_refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=settings.GOOGLE_CLIENT_ID,
            client_secret=settings.GOOGLE_CLIENT_SECRET,
        )
        
        # Refresh the token if it has expired
        if creds.expired and creds.refresh_token:
            logger.info("Refreshing Google OAuth token...")
            creds.refresh(Request())
            
            # Save the refreshed token to the database
            user_service.update_user_profile(user_id, {
                "google_access_token": creds.token,
                "google_token_expiry": creds.expiry.replace(tzinfo=timezone.utc).isoformat() if creds.expiry else None
            })
            logger.info("Refreshed Google token saved to database.")

        # Build the Gmail service client
        gmail_service = build('gmail', 'v1', credentials=creds)

        # Build the email content
        message = MIMEText(
            "Hello Mathan,\n\n"
            "This is a test Gmail Draft created automatically by FixToFlex.\n\n"
            "If you are reading this inside Gmail Drafts, Gmail OAuth is working correctly.\n\n"
            "Regards,\n"
            "FixToFlex"
        )
        
        google_email = current_user.get("google_email")
        if not google_email:
            # Fallback if google_email was not fetched for some reason
            google_email = current_user.get("email")

        message['To'] = google_email
        message['From'] = google_email
        message['Subject'] = 'FixToFlex Gmail Draft Test'

        # Encode the message properly for Gmail API
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        draft_body = {
            'message': {
                'raw': raw_message
            }
        }

        # Create the draft
        draft = gmail_service.users().drafts().create(userId="me", body=draft_body).execute()
        
        logger.info(f"Successfully created draft for user {user_id}: {draft['id']}")
        
        return {
            "success": True,
            "draftId": draft["id"],
            "message": "Draft created successfully"
        }

    except HttpError as error:
        logger.error(f"Gmail API error: {error}")
        raise HTTPException(status_code=500, detail=f"Failed to create draft via Gmail API: {error.reason}")
    except Exception as e:
        logger.error(f"Error creating Gmail draft: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred while creating the draft.")
