import logging
import asyncio
import httpx
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, Optional
from config.database import get_supabase_client
import httpx
from typing import Dict, Any, Optional
from config.database import get_supabase_client
from services.user_service import user_service
from services.analysis.analysis_service import AnalysisService

logger = logging.getLogger("backend.services.analysis.queue_service")

# Local fallback for queue status if DB table does not exist
_local_queue_store: Dict[str, Dict[str, Any]] = {}

class QueueService:
    def __init__(self):
        self.table_name = "analysis_queue_jobs"
        self.analysis_service = AnalysisService()

    def get_status(self, user_id: str) -> Dict[str, Any]:
        """
        Fetch the current status of the background queue for a given user.
        """
        try:
            client = get_supabase_client()
            response = client.table(self.table_name).select("*").eq("user_id", user_id).execute()
            if response.data and len(response.data) > 0:
                return response.data[0]
        except Exception as e:
            logger.warning(f"Failed to fetch from DB, using local queue store. Error: {e}")
        
        # Fallback to local store
        return _local_queue_store.get(user_id, {
            "user_id": user_id,
            "candidate_profile_status": "Pending",
            "linkedin_status": "Pending",
            "github_status": "Pending",
            "portfolio_status": "Pending",
            "resume_status": "Pending",
            "overall_status": "Pending",
            "schedule_preference": "Analyze Now",
            "last_analysis_time": None,
            "cached_linkedin_url": None,
            "cached_github_url": None,
            "cached_portfolio_url": None,
            "cached_resume_url": None
        })

    def _update_status(self, user_id: str, updates: Dict[str, Any]) -> None:
        """
        Update the status in the DB or local fallback.
        """
        # Always update local fallback for consistency if DB fails
        if user_id not in _local_queue_store:
            _local_queue_store[user_id] = {
                "user_id": user_id,
                "candidate_profile_status": "Pending",
                "linkedin_status": "Pending",
                "github_status": "Pending",
                "portfolio_status": "Pending",
                "resume_status": "Pending",
                "overall_status": "Pending",
                "schedule_preference": "Analyze Now",
                "last_analysis_time": None,
                "cached_linkedin_url": None,
                "cached_github_url": None,
                "cached_portfolio_url": None,
                "cached_resume_url": None
            }
        
        _local_queue_store[user_id].update(updates)

        try:
            client = get_supabase_client()
            # Try to update existing
            response = client.table(self.table_name).update(updates).eq("user_id", user_id).execute()
            if not response.data:
                # If no existing row, insert
                payload = {**_local_queue_store[user_id]}
                client.table(self.table_name).insert(payload).execute()
        except Exception as e:
            logger.warning(f"Failed to update queue DB, local store updated. Error: {e}")

    def _is_cache_valid(self, schedule_pref: str, last_time_str: Optional[str], current_url: str, cached_url: str) -> bool:
        """
        Check if the cached analysis is still valid based on URL match and schedule expiration.
        """
        if not current_url:
            return True # Nothing to analyze
        if current_url != cached_url:
            return False # URL changed, must re-run
            
        if not last_time_str:
            return False # Never run
            
        try:
            # Parse ISO datetime
            last_time = datetime.fromisoformat(last_time_str.replace('Z', '+00:00'))
            now = datetime.now(timezone.utc)
            delta = now - last_time
            
            if schedule_pref == "Every 6 Hours" and delta < timedelta(hours=6): return True
            if schedule_pref == "Daily" and delta < timedelta(days=1): return True
            if schedule_pref == "Weekly" and delta < timedelta(weeks=1): return True
            if schedule_pref == "Monthly" and delta < timedelta(days=30): return True
            if schedule_pref == "Analyze Now": return False # Always force re-run if triggered manually
        except Exception as e:
            logger.warning(f"Error parsing date {last_time_str}: {e}")
            return False
            
        return False

    async def _run_queue(self, user_id: str, current_user: Dict[str, Any]):
        """
        Execute the background queue sequentially:
        Candidate Profile -> LinkedIn -> GitHub -> Portfolio -> Resume
        """
        logger.info(f"Starting background queue for user {user_id}")
        self._update_status(user_id, {"overall_status": "Running", "candidate_profile_status": "Running"})
        
        status_record = self.get_status(user_id)
        schedule_pref = status_record.get("schedule_preference", "Analyze Now")
        last_analysis = status_record.get("last_analysis_time")
        
        # Step 1: Candidate Profile
        try:
            # For now, Candidate Profile step just verifies DB is fetched correctly and user exists
            user_data = user_service.get_user_by_id(user_id)
            if not user_data:
                raise Exception("User data not found")
            await asyncio.sleep(1) # simulate brief work
            self._update_status(user_id, {"candidate_profile_status": "Completed"})
        except Exception as e:
            logger.error(f"Candidate profile queue step failed: {e}")
            self._update_status(user_id, {"candidate_profile_status": "Failed"})
            
        # Step 2: LinkedIn
        self._update_status(user_id, {"linkedin_status": "Running"})
        try:
            linkedin_url = user_data.get("linkedin_url")
            cached_url = status_record.get("cached_linkedin_url")
            
            if not linkedin_url:
                self._update_status(user_id, {"linkedin_status": "Skipped"})
            elif self._is_cache_valid(schedule_pref, last_analysis, linkedin_url, cached_url):
                logger.info(f"LinkedIn cached analysis valid for {user_id}")
                self._update_status(user_id, {"linkedin_status": "Completed"})
            else:
                await self.analysis_service.process_linkedin(user_id, linkedin_url, current_user)
                self._update_status(user_id, {"linkedin_status": "Completed", "cached_linkedin_url": linkedin_url})
        except Exception as e:
            logger.error(f"LinkedIn queue step failed: {e}")
            self._update_status(user_id, {"linkedin_status": "Failed"})

        # Step 3: GitHub
        self._update_status(user_id, {"github_status": "Running"})
        try:
            github_url = user_data.get("github_url")
            cached_url = status_record.get("cached_github_url")
            
            if not github_url:
                self._update_status(user_id, {"github_status": "Skipped"})
            elif self._is_cache_valid(schedule_pref, last_analysis, github_url, cached_url):
                logger.info(f"GitHub cached analysis valid for {user_id}")
                self._update_status(user_id, {"github_status": "Completed"})
            else:
                await self.analysis_service.process_github_profile(user_id, github_url)
                self._update_status(user_id, {"github_status": "Completed", "cached_github_url": github_url})
        except Exception as e:
            logger.error(f"GitHub queue step failed: {e}")
            self._update_status(user_id, {"github_status": "Failed"})
            
        # Step 4: Portfolio
        self._update_status(user_id, {"portfolio_status": "Running"})
        try:
            portfolio_url = user_data.get("portfolio_url")
            cached_url = status_record.get("cached_portfolio_url")
            
            if not portfolio_url:
                self._update_status(user_id, {"portfolio_status": "Skipped"})
            elif self._is_cache_valid(schedule_pref, last_analysis, portfolio_url, cached_url):
                logger.info(f"Portfolio cached analysis valid for {user_id}")
                self._update_status(user_id, {"portfolio_status": "Completed"})
            else:
                await self.analysis_service.process_portfolio(user_id, portfolio_url)
                self._update_status(user_id, {"portfolio_status": "Completed", "cached_portfolio_url": portfolio_url})
        except Exception as e:
            logger.error(f"Portfolio queue step failed: {e}")
            self._update_status(user_id, {"portfolio_status": "Failed"})

        # Step 5: Resume
        self._update_status(user_id, {"resume_status": "Running"})
        try:
            resume_url = user_data.get("resume_url")
            cached_url = status_record.get("cached_resume_url")
            
            if not resume_url:
                self._update_status(user_id, {"resume_status": "Skipped"})
            elif self._is_cache_valid(schedule_pref, last_analysis, resume_url, cached_url):
                logger.info(f"Resume cached analysis valid for {user_id}")
                self._update_status(user_id, {"resume_status": "Completed"})
            else:
                # Mock file bytes since we don't have the actual file downloaded here
                # but we need to satisfy process_resume signature.
                # In production, we'd download the file from Supabase storage via resume_url
                async with httpx.AsyncClient() as client:
                    resp = await client.get(resume_url)
                    file_bytes = resp.content
                filename = resume_url.split("/")[-1] if "/" in resume_url else "resume.pdf"
                
                await self.analysis_service.process_resume(user_id, file_bytes, filename)
                self._update_status(user_id, {"resume_status": "Completed", "cached_resume_url": resume_url})
        except Exception as e:
            logger.error(f"Resume queue step failed: {e}")
            self._update_status(user_id, {"resume_status": "Failed"})

        # Finally, mark overall queue as complete and update timestamp
        self._update_status(user_id, {
            "overall_status": "Completed",
            "last_analysis_time": datetime.now(timezone.utc).isoformat()
        })
        logger.info(f"Background queue completed for user {user_id}")

    def start_queue(self, user_id: str, current_user: Dict[str, Any]) -> None:
        """
        Kick off the background queue task.
        """
        status = self.get_status(user_id)
        if status.get("overall_status") == "Running":
            logger.info(f"Queue is already running for user {user_id}. Ignoring start request.")
            return

        asyncio.create_task(self._run_queue(user_id, current_user))

queue_service = QueueService()
