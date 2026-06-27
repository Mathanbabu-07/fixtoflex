import json
import hashlib
import logging
import asyncio
from typing import Dict, Any, Optional
from config.database import get_supabase_client, settings
from services.career_intelligence_service import CareerIntelligenceService
from services.job_tracker_service import JobTrackerService
from services.analysis.gemini_client import GeminiClient
from datetime import datetime, timedelta

logger = logging.getLogger("backend.services.target_career_service")

class TargetCareerService:
    def __init__(self):
        self.supabase = get_supabase_client()
        self.gemini_client = GeminiClient()
        self.ci_service = CareerIntelligenceService()
        self.job_service = JobTrackerService()

    async def get_or_generate_target_report(
        self,
        user_id: str,
        company: str,
        role: str,
        location: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate a company-specific career intelligence report.
        Reuses cached profile data + fresh job scraping.
        """
        # 1. Build search hash
        search_key = json.dumps({"company": company.lower().strip(), "role": role.lower().strip(), "location": (location or "").lower().strip()}, sort_keys=True)
        search_hash = hashlib.md5(search_key.encode()).hexdigest()

        # 2. Check cache
        try:
            cache_res = self.supabase.table("target_career_reports").select("*").eq("user_id", user_id).eq("search_hash", search_hash).execute()
            if cache_res.data:
                cache_entry = cache_res.data[0]
                updated_at_str = cache_entry.get("updated_at")
                if updated_at_str:
                    try:
                        updated_at = datetime.fromisoformat(updated_at_str.replace("Z", "+00:00"))
                        if datetime.now(updated_at.tzinfo) - updated_at < timedelta(hours=24):
                            logger.info(f"Returning cached target career report for user {user_id}")
                            return {
                                "status": "success",
                                "data": cache_entry["report_json"],
                                "cached": True
                            }
                    except Exception as e:
                        logger.warning(f"Error parsing cache date: {e}")
        except Exception as e:
            logger.warning(f"Error checking target career cache: {e}")

        # 3. Build unified candidate context (reuse existing cached analyses)
        unified_context = await self.ci_service._build_unified_context(user_id)
        # Remove the flag
        if "has_any_data" in unified_context:
            del unified_context["has_any_data"]

        # 4. Scrape fresh company/job requirements from Indeed + Internshala
        company_query = f'"{company}" {role}'
        location_str = location or ""

        indeed_task = self.job_service._scrape_indeed(company_query, location_str)
        internshala_task = self.job_service._scrape_internshala(f"{company} {role}", location_str)

        results = await asyncio.gather(indeed_task, internshala_task, return_exceptions=True)

        raw_jobs = []
        for result in results:
            if isinstance(result, Exception):
                logger.error(f"Scraping error: {result}")
            elif isinstance(result, list):
                raw_jobs.extend(result)

        if not raw_jobs:
            return {
                "status": "error",
                "message": f"No matching job listings found for {company} - {role}. Try a different company, role, or location."
            }

        # 5. Generate target career intelligence using Gemini
        target_preferences = {"company": company, "role": role, "location": location or ""}

        try:
            report_data = await self.gemini_client.generate_target_career_intelligence(
                unified_context,
                raw_jobs,
                target_preferences
            )
        except Exception as e:
            logger.error(f"Error generating target career report: {e}")
            return {
                "status": "error",
                "message": "Failed to generate the AI career report. Please try again."
            }

        # 6. Cache the report
        try:
            check_res = self.supabase.table("target_career_reports").select("id").eq("user_id", user_id).eq("search_hash", search_hash).execute()
            if check_res.data:
                self.supabase.table("target_career_reports").update({
                    "report_json": report_data,
                    "updated_at": "now()"
                }).eq("user_id", user_id).eq("search_hash", search_hash).execute()
            else:
                self.supabase.table("target_career_reports").insert({
                    "user_id": user_id,
                    "search_hash": search_hash,
                    "report_json": report_data
                }).execute()
        except Exception as e:
            logger.error(f"Failed to cache target career report: {e}")

        return {
            "status": "success",
            "data": report_data,
            "cached": False
        }
