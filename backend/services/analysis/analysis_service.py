import logging
from typing import Dict, Any, Optional
from services.analysis.scrape_do_client import ScrapeDoClient
from services.analysis.github_extractor import GitHubExtractor
from services.analysis.gemini_client import GeminiClient
from config.database import get_supabase_client

logger = logging.getLogger("backend.services.analysis.analysis_service")

class AnalysisService:
    def __init__(self):
        self.scrape_client = ScrapeDoClient()
        self.extractor = GitHubExtractor()
        self.gemini_client = GeminiClient()
        
    async def process_github_profile(self, user_id: str, github_url: str) -> Dict[str, Any]:
        """
        End-to-end pipeline for GitHub profile analysis.
        """
        logger.info(f"Starting GitHub analysis pipeline for user {user_id}, URL: {github_url}")
        
        # 1. Fetch raw HTML
        raw_html = await self.scrape_client.fetch_html(github_url)
        if not raw_html:
            raise Exception("Failed to retrieve HTML content from GitHub")
            
        # 2. Extract and Normalize
        normalized_json = self.extractor.extract(raw_html)
        
        # 3. Store Raw Data
        try:
            supabase = get_supabase_client()
            raw_insert = supabase.table("github_analysis_raw").insert({
                "user_id": user_id,
                "github_url": github_url,
                "raw_html": raw_html,
                "normalized_json": normalized_json
            }).execute()
            
            raw_id = raw_insert.data[0]["id"] if raw_insert.data else None
        except Exception as e:
            logger.error(f"Failed to store raw analysis data: {e}")
            raw_id = None
            
        # 4. Analyze with Gemini
        ai_results = await self.gemini_client.analyze_github_profile(normalized_json)
        
        gemini_summary = ai_results.get("summary", {})
        scores = ai_results.get("scores", {})
        
        # 5. Store Results
        try:
            if raw_id:
                supabase.table("github_analysis_results").insert({
                    "user_id": user_id,
                    "github_url": github_url,
                    "raw_id": raw_id,
                    "gemini_summary": gemini_summary,
                    "scores": scores
                }).execute()
        except Exception as e:
            logger.error(f"Failed to store analysis results: {e}")
            
        logger.info("GitHub analysis pipeline completed successfully.")
        
        return {
            "github_url": github_url,
            "normalized_data": normalized_json,
            "summary": gemini_summary,
            "scores": scores
        }
