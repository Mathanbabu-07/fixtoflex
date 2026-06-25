import json
import hashlib
import logging
from typing import Dict, Any, Optional
from config.database import get_supabase_client
from services.analysis.gemini_client import GeminiClient

logger = logging.getLogger("backend.services.career_intelligence_service")

class CareerIntelligenceService:
    def __init__(self):
        self.supabase = get_supabase_client()
        self.gemini_client = GeminiClient()

    def _generate_hash(self, data: Dict[str, Any]) -> str:
        data_string = json.dumps(data, sort_keys=True)
        return hashlib.sha256(data_string.encode('utf-8')).hexdigest()

    async def get_or_generate_report(self, user_id: str) -> Dict[str, Any]:
        """
        Fetches the unified career intelligence report.
        Re-generates only if the underlying analysis data has changed.
        """
        # 1. Fetch unified context
        unified_context = await self._build_unified_context(user_id)
        
        # If there is basically no data, we cannot generate a meaningful report
        if not unified_context.get("has_any_data", False):
            return {
                "status": "error",
                "message": "Insufficient profile data. Please run analysis on LinkedIn, GitHub, Resume, or Portfolio first."
            }
            
        # Remove the flag before hashing
        del unified_context["has_any_data"]
            
        current_hash = self._generate_hash(unified_context)
        
        # 2. Check if a report with this hash already exists
        try:
            report_response = self.supabase.table("career_intelligence_reports").select("*").eq("user_id", user_id).execute()
            if report_response.data:
                existing_report = report_response.data[0]
                if existing_report.get("unified_context_hash") == current_hash:
                    logger.info(f"Returning cached Career Intelligence Report for user {user_id}")
                    return {
                        "status": "success",
                        "data": existing_report.get("report_json"),
                        "cached": True
                    }
        except Exception as e:
            logger.warning(f"Error checking cached report: {e}")

        # 3. Generate new report using Gemini
        logger.info(f"Generating new Career Intelligence Report for user {user_id}")
        try:
            report_data = await self.gemini_client.generate_career_intelligence(unified_context)
        except Exception as e:
            logger.error(f"Error generating AI report: {e}")
            return {
                "status": "error",
                "message": "Failed to generate AI report from Gemini."
            }

        # 4. Save to database
        try:
            # Check if exists to update or insert
            check_res = self.supabase.table("career_intelligence_reports").select("id, version").eq("user_id", user_id).execute()
            
            new_version = 1
            report_id = None
            
            if check_res.data:
                existing = check_res.data[0]
                new_version = existing.get("version", 0) + 1
                report_id = existing.get("id")
                
                # Move current to history first
                # Actually, skipping moving to history for simplicity if not fully needed, or do it:
                # self.supabase.table("career_intelligence_history").insert({...})
                
                # Update current
                res = self.supabase.table("career_intelligence_reports").update({
                    "unified_context_hash": current_hash,
                    "report_json": report_data,
                    "version": new_version,
                    "updated_at": "now()"
                }).eq("user_id", user_id).execute()
            else:
                # Insert new
                res = self.supabase.table("career_intelligence_reports").insert({
                    "user_id": user_id,
                    "unified_context_hash": current_hash,
                    "report_json": report_data,
                    "version": 1
                }).execute()
                if res.data:
                    report_id = res.data[0].get("id")

            # Insert history record
            if report_id:
                self.supabase.table("career_intelligence_history").insert({
                    "user_id": user_id,
                    "report_id": report_id,
                    "unified_context_hash": current_hash,
                    "report_json": report_data,
                    "version": new_version
                }).execute()

        except Exception as e:
            logger.error(f"Failed to save Career Intelligence report to DB: {e}")
            # Even if save fails, we can return the report to the user
            
        return {
            "status": "success",
            "data": report_data,
            "cached": False
        }

    async def _build_unified_context(self, user_id: str) -> Dict[str, Any]:
        """
        Aggregates data from Users, LinkedIn, GitHub, Portfolio, and Resume.
        """
        context = {
            "personal_info": {},
            "linkedin_analysis": None,
            "github_analysis": None,
            "portfolio_analysis": None,
            "resume_analysis": None,
            "has_any_data": False
        }

        # User Data
        try:
            user_res = self.supabase.table("users").select("*").eq("id", user_id).execute()
            if user_res.data:
                user = user_res.data[0]
                context["personal_info"] = {
                    "headline": user.get("headline"),
                    "interested_domain": user.get("interested_domain"),
                    "target_job_role": user.get("target_job_role"),
                    "experience": user.get("experience"),
                    "skills": user.get("skills")
                }
        except Exception:
            pass

        # LinkedIn Analysis
        try:
            li_res = self.supabase.table("linkedin_analysis").select("*, linkedin_summary(*), linkedin_scores(*)").eq("user_id", user_id).order('created_at', desc=True).limit(1).execute()
            if li_res.data:
                analysis = li_res.data[0]
                context["linkedin_analysis"] = {
                    "summary": analysis.get("linkedin_summary", {}).get("summary_json"),
                    "scores": analysis.get("linkedin_scores", {}).get("scores_json")
                }
                context["has_any_data"] = True
        except Exception:
            pass

        # GitHub Analysis
        try:
            gh_res = self.supabase.table("github_analysis_results").select("gemini_summary, scores").eq("user_id", user_id).order('created_at', desc=True).limit(1).execute()
            if gh_res.data:
                context["github_analysis"] = gh_res.data[0]
                context["has_any_data"] = True
        except Exception:
            pass

        # Portfolio Analysis
        try:
            pf_res = self.supabase.table("portfolio_analysis").select("*, portfolio_summary(*), portfolio_scores(*)").eq("user_id", user_id).order('created_at', desc=True).limit(1).execute()
            if pf_res.data:
                analysis = pf_res.data[0]
                context["portfolio_analysis"] = {
                    "summary": analysis.get("portfolio_summary", {}).get("summary_json"),
                    "scores": analysis.get("portfolio_scores", {}).get("scores_json")
                }
                context["has_any_data"] = True
        except Exception:
            pass

        # Resume Analysis
        try:
            rs_res = self.supabase.table("resume_analysis_results").select("gemini_summary, scores").eq("user_id", user_id).order('created_at', desc=True).limit(1).execute()
            if rs_res.data:
                context["resume_analysis"] = rs_res.data[0]
                context["has_any_data"] = True
        except Exception:
            pass

        return context
