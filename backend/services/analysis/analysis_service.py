import logging
from typing import Dict, Any, Optional
from services.analysis.scrape_do_client import ScrapeDoClient
from services.analysis.github_extractor import GitHubExtractor

from services.analysis.gemini_client import GeminiClient
from config.database import get_supabase_client

logger = logging.getLogger("backend.services.analysis.analysis_service")

# Global active analyses set to prevent duplicate concurrent runs
active_analyses = set()

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

    async def process_portfolio(self, user_id: str, portfolio_url: str) -> Dict[str, Any]:
        """
        End-to-end pipeline for Portfolio analysis using Jina AI Reader & Gemini 3.1 Flash Lite.
        """
        logger.info(f"Starting Jina AI Portfolio analysis pipeline for user {user_id}, URL: {portfolio_url}")
        
        # 1. Validate Portfolio URL
        import urllib.parse
        parsed_url = urllib.parse.urlparse(portfolio_url)
        if not parsed_url.scheme or not parsed_url.netloc:
            raise ValueError("A valid Portfolio URL starting with http:// or https:// is required.")

        # 2. Prevent duplicate analysis requests (concurrent lock)
        lock_key = f"{user_id}:{portfolio_url}"
        if lock_key in active_analyses:
            raise Exception("A portfolio analysis request is already in progress for this URL.")
        active_analyses.add(lock_key)

        try:
            # 3. Verify website is accessible
            import httpx
            logger.info(f"Performing accessibility check on portfolio URL: {portfolio_url}")
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    response = await client.get(portfolio_url, follow_redirects=True)
                    if response.status_code == 404:
                        raise Exception("The portfolio website returned a 404 Not Found error.")
            except httpx.RequestError as e:
                logger.warning(f"Direct accessibility check failed/timed out: {e}. Proceeding with Jina extraction.")

            # 4. Extract webpage using Jina AI Reader
            from services.analysis.jina_client import jina_client
            try:
                raw_markdown = await jina_client.fetch_markdown(portfolio_url)
            except Exception as jina_err:
                logger.error(f"Jina AI Reader failed: {jina_err}")
                raise Exception(f"Jina AI Reader failed to extract website content: {str(jina_err)}")

            if not raw_markdown:
                raise Exception("Empty content returned from Jina AI Reader.")

            # 5. Clean Markdown & Normalize to Structured JSON
            from services.analysis.portfolio_extractor import PortfolioExtractor
            cleaned_markdown = PortfolioExtractor.clean_markdown(raw_markdown)
            
            try:
                normalized_json = await self.gemini_client.normalize_portfolio(cleaned_markdown)
            except Exception as norm_err:
                logger.error(f"Gemini normalization failed: {norm_err}")
                raise Exception(f"Failed to normalize portfolio data into structured profile: {str(norm_err)}")

            # 6. Analyze structured JSON with Gemini 3.1 Flash Lite
            try:
                ai_results = await self.gemini_client.analyze_portfolio(normalized_json)
                gemini_summary = ai_results.get("summary", {})
                scores = ai_results.get("scores", {})
            except Exception as ai_err:
                logger.error(f"Gemini analysis failed: {ai_err}")
                raise Exception(f"Failed to generate AI analysis summary: {str(ai_err)}")

            # 7. Store results separately in Supabase across 6 tables with history versioning
            try:
                supabase = get_supabase_client()
                
                # a) Raw markdown
                raw_insert = supabase.table("portfolio_raw_data").insert({
                    "user_id": user_id,
                    "portfolio_url": portfolio_url,
                    "raw_markdown": raw_markdown
                }).execute()
                raw_id = raw_insert.data[0]["id"] if raw_insert.data else None
                
                # b) Normalized JSON
                norm_insert = supabase.table("portfolio_normalized_data").insert({
                    "user_id": user_id,
                    "raw_data_id": raw_id,
                    "normalized_json": normalized_json
                }).execute()
                normalized_data_id = norm_insert.data[0]["id"] if norm_insert.data else None
                
                # c) Summary
                summary_insert = supabase.table("portfolio_summary").insert({
                    "user_id": user_id,
                    "summary_json": gemini_summary
                }).execute()
                summary_id = summary_insert.data[0]["id"] if summary_insert.data else None
                
                # d) Scores
                scores_insert = supabase.table("portfolio_scores").insert({
                    "user_id": user_id,
                    "scores_json": scores
                }).execute()
                scores_id = scores_insert.data[0]["id"] if scores_insert.data else None
                
                # e) Main analysis mapping
                analysis_insert = supabase.table("portfolio_analysis").insert({
                    "user_id": user_id,
                    "portfolio_url": portfolio_url,
                    "raw_data_id": raw_id,
                    "normalized_data_id": normalized_data_id,
                    "summary_id": summary_id,
                    "scores_id": scores_id
                }).execute()
                analysis_id = analysis_insert.data[0]["id"] if analysis_insert.data else None
                
                # f) History version tracking
                history_response = supabase.table("portfolio_analysis_history")\
                    .select("version")\
                    .eq("user_id", user_id)\
                    .order("version", desc=True)\
                    .limit(1)\
                    .execute()
                    
                next_version = 1
                if history_response.data and len(history_response.data) > 0:
                    next_version = history_response.data[0]["version"] + 1
                    
                supabase.table("portfolio_analysis_history").insert({
                    "user_id": user_id,
                    "analysis_id": analysis_id,
                    "portfolio_url": portfolio_url,
                    "summary_json": gemini_summary,
                    "scores_json": scores,
                    "version": next_version
                }).execute()
                
                logger.info(f"Successfully saved portfolio data for user {user_id} with history version {next_version}")
            except Exception as db_err:
                logger.error(f"Failed to store portfolio analysis results in Supabase: {db_err}")

            logger.info("Portfolio analysis pipeline completed successfully.")
            return {
                "portfolio_url": portfolio_url,
                "normalized_data": normalized_json,
                "summary": gemini_summary,
                "scores": scores
            }
        finally:
            active_analyses.discard(lock_key)

    async def process_linkedin(self, user_id: str, linkedin_url: str, current_user: dict) -> Dict[str, Any]:
        """
        End-to-end pipeline for LinkedIn analysis using a hybrid Jina + Scrape.do & Gemini 3.1 Flash Lite architecture.
        """
        logger.info(f"Starting LinkedIn hybrid analysis pipeline for user {user_id}, URL: {linkedin_url}")
        
        # 1. Validate LinkedIn URL
        if not linkedin_url or "linkedin.com/in/" not in linkedin_url.lower():
            raise ValueError("A valid LinkedIn profile URL (containing linkedin.com/in/) is required.")

        # 2. Prevent duplicate concurrent runs via active lock
        lock_key = f"{user_id}:linkedin"
        if lock_key in active_analyses:
            raise Exception("A LinkedIn profile analysis request is already in progress.")
        active_analyses.add(lock_key)

        try:
            # 3. Call Jina AI Reader (Primary Extraction)
            raw_markdown = None
            jina_failed = False
            try:
                from services.analysis.jina_client import jina_client
                raw_markdown = await jina_client.fetch_markdown(linkedin_url)
            except Exception as e:
                logger.error(f"Jina AI Reader failed for LinkedIn URL {linkedin_url}: {e}")
                jina_failed = True

            # 4. Fallback validation: Jina response is incomplete if under 1000 chars, or missing experience/education keywords
            is_incomplete = False
            if jina_failed or not raw_markdown or len(raw_markdown.strip()) < 1000:
                is_incomplete = True
            else:
                content_lower = raw_markdown.lower()
                if "experience" not in content_lower and "education" not in content_lower:
                    is_incomplete = True

            # 5. Scrape.do (Secondary Extraction) if Jina was incomplete/failed
            raw_html = None
            if is_incomplete:
                logger.info(f"Jina extraction was incomplete/failed for {linkedin_url}. Falling back to Scrape.do.")
                try:
                    raw_html = await self.scrape_client.fetch_html(linkedin_url)
                except Exception as scrape_err:
                    logger.error(f"Scrape.do fallback failed: {scrape_err}")

            # 6. Safety check: ensure at least one data source succeeded
            if not raw_markdown and not raw_html:
                raise Exception("Failed to retrieve any profile data from LinkedIn via Jina AI or Scrape.do fallback.")

            # 7. Step 4: Data Cleaning & Normalization via Gemini
            logger.info("Normalizing extracted LinkedIn data using Gemini...")
            
            try:
                normalized_json = await self.gemini_client.normalize_linkedin(
                    jina_markdown=raw_markdown or "",
                    scrapedo_html=raw_html
                )
            except Exception as norm_err:
                logger.error(f"Gemini LinkedIn normalization failed: {norm_err}")
                raise Exception(f"Failed to normalize LinkedIn profile data: {str(norm_err)}")

            # 8. Step 5: Gemini 3.1 Flash Lite Career Intelligence Analysis
            logger.info("Running Career Intelligence analysis using Gemini...")
            try:
                ai_results = await self.gemini_client.analyze_linkedin(normalized_json)
                gemini_summary = ai_results.get("summary", {})
                scores = ai_results.get("scores", {})
            except Exception as ai_err:
                logger.error(f"Gemini LinkedIn analysis failed: {ai_err}")
                raise Exception(f"Failed to generate LinkedIn AI Career Analysis: {str(ai_err)}")

            # 9. Step 6: Store results separately in Supabase
            try:
                supabase = get_supabase_client()
                
                # a) Raw Jina markdown
                raw_jina_id = None
                if raw_markdown:
                    jina_insert = supabase.table("linkedin_raw_jina").insert({
                        "user_id": user_id,
                        "linkedin_url": linkedin_url,
                        "raw_markdown": raw_markdown
                    }).execute()
                    if jina_insert.data:
                        raw_jina_id = jina_insert.data[0]["id"]
                
                # b) Raw Scrape.do HTML
                raw_scrapedo_id = None
                if raw_html:
                    scrapedo_insert = supabase.table("linkedin_raw_scrapedo").insert({
                        "user_id": user_id,
                        "linkedin_url": linkedin_url,
                        "raw_html": raw_html
                    }).execute()
                    if scrapedo_insert.data:
                        raw_scrapedo_id = scrapedo_insert.data[0]["id"]
                        
                # c) Normalized JSON
                normalized_data_id = None
                norm_insert = supabase.table("linkedin_normalized_data").insert({
                    "user_id": user_id,
                    "normalized_json": normalized_json
                }).execute()
                if norm_insert.data:
                    normalized_data_id = norm_insert.data[0]["id"]
                    
                # d) Summary JSON
                summary_id = None
                summary_insert = supabase.table("linkedin_summary").insert({
                    "user_id": user_id,
                    "summary_json": gemini_summary
                }).execute()
                if summary_insert.data:
                    summary_id = summary_insert.data[0]["id"]
                    
                # e) Scores JSON
                scores_id = None
                scores_insert = supabase.table("linkedin_scores").insert({
                    "user_id": user_id,
                    "scores_json": scores
                }).execute()
                if scores_insert.data:
                    scores_id = scores_insert.data[0]["id"]
                    
                # f) Main unified analysis mapping
                analysis_id = None
                analysis_insert = supabase.table("linkedin_analysis").insert({
                    "user_id": user_id,
                    "linkedin_url": linkedin_url,
                    "raw_jina_id": raw_jina_id,
                    "raw_scrapedo_id": raw_scrapedo_id,
                    "normalized_data_id": normalized_data_id,
                    "summary_id": summary_id,
                    "scores_id": scores_id
                }).execute()
                if analysis_insert.data:
                    analysis_id = analysis_insert.data[0]["id"]
                    
                # g) Versioned run history
                history_response = supabase.table("linkedin_analysis_history")\
                    .select("version")\
                    .eq("user_id", user_id)\
                    .order("version", desc=True)\
                    .limit(1)\
                    .execute()
                    
                next_version = 1
                if history_response.data and len(history_response.data) > 0:
                    next_version = history_response.data[0]["version"] + 1
                    
                supabase.table("linkedin_analysis_history").insert({
                    "user_id": user_id,
                    "analysis_id": analysis_id,
                    "linkedin_url": linkedin_url,
                    "summary_json": gemini_summary,
                    "scores_json": scores,
                    "version": next_version
                }).execute()
                
                logger.info(f"Successfully stored LinkedIn profile analysis (version {next_version}) in Supabase.")
            except Exception as db_err:
                logger.error(f"Failed to store LinkedIn analysis results in Supabase: {db_err}")

            return {
                "linkedin_url": linkedin_url,
                "normalized_data": normalized_json,
                "summary": gemini_summary,
                "scores": scores
            }
        finally:
            active_analyses.discard(lock_key)

    async def process_resume(self, user_id: str, file_bytes: bytes, filename: str) -> Dict[str, Any]:
        """
        End-to-end pipeline for Resume analysis.
        """
        logger.info(f"Starting Resume analysis pipeline for user {user_id}, file: {filename}")
        
        # 1. Extract and Normalize
        from services.analysis.resume_extractor import ResumeExtractor
        normalized_json = ResumeExtractor.extract(file_bytes, filename)
        
        # 2. Store Raw Data
        try:
            supabase = get_supabase_client()
            raw_insert = supabase.table("resume_analysis_raw").insert({
                "user_id": user_id,
                "filename": filename,
                "raw_text": normalized_json.get("raw_text", ""),
                "normalized_json": normalized_json
            }).execute()
            
            raw_id = raw_insert.data[0]["id"] if raw_insert.data else None
        except Exception as e:
            logger.error(f"Failed to store raw resume data: {e}")
            raw_id = None
            
        # 3. Analyze with Gemini
        ai_results = await self.gemini_client.analyze_resume(normalized_json)
        
        gemini_summary = ai_results.get("summary", {})
        scores = ai_results.get("scores", {})
        
        # 4. Store Results
        try:
            if raw_id:
                supabase.table("resume_analysis_results").insert({
                    "user_id": user_id,
                    "filename": filename,
                    "raw_id": raw_id,
                    "gemini_summary": gemini_summary,
                    "scores": scores
                }).execute()
        except Exception as e:
            logger.error(f"Failed to store resume analysis results: {e}")
            
        logger.info("Resume analysis pipeline completed successfully.")
        
        return {
            "filename": filename,
            "normalized_data": normalized_json,
            "summary": gemini_summary,
            "scores": scores
        }
