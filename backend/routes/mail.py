import base64
import logging
from datetime import datetime, timezone
from email.mime.text import MIMEText

import json
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from config.database import settings
from services.user_service import user_service
from middleware.auth_middleware import get_current_user
import google.generativeai as genai

class CreateDraftRequest(BaseModel):
    subject: str
    body: str

class GenerateDraftRequest(BaseModel):
    company: str
    job_title: str
    job_description: str = ""
    requirements: str = ""
    source: str = "Unknown"

logger = logging.getLogger("backend.routes.mail")

router = APIRouter(prefix="/mail", tags=["Mail"])

@router.post("/create-draft", status_code=status.HTTP_200_OK)
async def create_gmail_draft(request: CreateDraftRequest, current_user: dict = Depends(get_current_user)):
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
        message = MIMEText(request.body)
        
        google_email = current_user.get("google_email")
        if not google_email:
            # Fallback if google_email was not fetched for some reason
            google_email = current_user.get("email")

        message['To'] = google_email
        message['From'] = google_email
        message['Subject'] = request.subject

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

@router.post("/generate", status_code=status.HTTP_200_OK)
async def generate_outreach_email(request: GenerateDraftRequest, current_user: dict = Depends(get_current_user)):
    """
    Generates a personalized outreach email using Gemini API based on job details and user profile.
    """
    try:
        # Fetch user profile to enrich prompt
        profile = current_user
        
        # Configure Gemini
        api_key = settings.GEMINI_API_KEY
        if not api_key or api_key == "your-gemini-api-key":
            raise HTTPException(status_code=500, detail="Gemini API Key is not configured.")
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(settings.GEMINI_MODEL)
        
        prompt = f"""
You are an expert technical recruiter and career coach.
Write a highly personalized, professional, and confident cold outreach email to a hiring manager/recruiter for the following role.

Job Details:
- Company: {request.company}
- Role: {request.job_title}
- Source: {request.source}
- Description/Requirements: {request.job_description} {request.requirements}

Candidate Profile:
- Name: {profile.get('full_name', 'Candidate')}
- Headline: {profile.get('headline', '')}
- Education: {profile.get('institution_name', '')}
- Skills: {profile.get('skills', '')}
- Experience/Projects/Certifications: {profile.get('experience', '')}, {profile.get('certifications', '')}

Requirements for the Email:
- Tone: Professional, confident, personalized, human-written, ATS-friendly, NO generic AI wording, NO fake claims.
- Structure:
  1. Recruiter Subject Line (Catchy but professional)
  2. Greeting
  3. Personalized introduction
  4. Why the candidate matches the role (using candidate skills matching job requirements)
  5. Relevant projects/experience highlights
  6. Interest in the company
  7. Professional closing with Candidate Name

Return the response STRICTLY as a JSON object with this exact schema (no markdown, no codeblocks):
{{
  "subject": "string",
  "body": "string (use \\n for line breaks)"
}}
"""
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(response_mime_type="application/json")
        )
        
        result_text = response.text.strip()
        if result_text.startswith("```json"):
            result_text = result_text[7:]
        elif result_text.startswith("```"):
            result_text = result_text[3:]
        if result_text.endswith("```"):
            result_text = result_text[:-3]
            
        result_json = json.loads(result_text.strip())
        
        return {
            "success": True,
            "subject": result_json.get("subject", "Application for " + request.job_title),
            "body": result_json.get("body", "Please find my application attached.")
        }

    except Exception as e:
        logger.error(f"Error generating outreach email: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate email: {str(e)}")
