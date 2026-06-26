import json
import logging
import urllib.parse
from typing import Dict, Any, List
import httpx
from bs4 import BeautifulSoup
import google.generativeai as genai
from config.database import settings, get_supabase_client
from datetime import datetime, timedelta

logger = logging.getLogger("backend.services.job_tracker_service")

class JobTrackerService:
    def __init__(self):
        self.supabase = get_supabase_client()
        self.scrape_do_key = settings.SCRAPEDO1_API_KEY
        self.scrape_do_url = settings.SCRAPEDO_BASE_URL
        self.gemini_key = settings.GEMINI_API1_KEY
        
        # Isolated Gemini client using the new key
        if self.gemini_key:
            genai.configure(api_key=self.gemini_key)
            self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
        else:
            self.model = None

    async def get_jobs(self, user_id: str, force_refresh: bool = False) -> Dict[str, Any]:
        try:
            # 1. Fetch user context
            user_res = self.supabase.table("users").select("*").eq("id", user_id).execute()
            if not user_res.data:
                return {"status": "error", "message": "User not found"}
            
            user = user_res.data[0]
            
            # 2. Check Cache
            if not force_refresh:
                cache_res = self.supabase.table("job_tracker_cache").select("*").eq("user_id", user_id).execute()
                if cache_res.data:
                    cache_entry = cache_res.data[0]
                    updated_at_str = cache_entry.get("updated_at")
                    if updated_at_str:
                        # Simple expiry check (e.g., 24 hours)
                        try:
                            updated_at = datetime.fromisoformat(updated_at_str.replace("Z", "+00:00"))
                            if datetime.now(updated_at.tzinfo) - updated_at < timedelta(hours=24):
                                logger.info(f"Returning cached jobs for user {user_id}")
                                return {"status": "success", "data": cache_entry["jobs_json"], "cached": True}
                        except Exception as e:
                            logger.warning(f"Error parsing cache date: {e}")

            # 3. Build search parameters
            role = user.get("target_job_role") or user.get("headline") or "Software Engineer"
            location = user.get("state") or user.get("district") or "India"
            
            # 4. Scrape Indeed
            raw_jobs = await self._scrape_indeed(role, location)
            
            if not raw_jobs:
                return {"status": "error", "message": "No jobs found or scraping failed. Please try again."}
            
            # 5. Gemini Personalization
            if not self.model:
                logger.error("GEMINI_API1_KEY is not configured")
                return {"status": "error", "message": "AI service is not configured."}
                
            ranked_jobs = await self._rank_jobs_with_gemini(raw_jobs, user)
            
            # 6. Save to cache
            self._save_to_cache(user_id, ranked_jobs)
            
            return {"status": "success", "data": ranked_jobs, "cached": False}
            
        except Exception as e:
            logger.error(f"Error in job tracker service: {e}")
            return {"status": "error", "message": str(e)}

    async def _scrape_indeed(self, role: str, location: str) -> List[Dict[str, Any]]:
        query = urllib.parse.quote(role)
        loc = urllib.parse.quote(location)
        target_url = f"https://in.indeed.com/jobs?q={query}&l={loc}&sort=date"
        
        if not self.scrape_do_key:
            logger.warning("SCRAPEDO1_API_KEY not configured. Falling back to dummy data for development.")
            return self._get_dummy_jobs()
            
        api_url = f"{self.scrape_do_url}?token={self.scrape_do_key}&url={urllib.parse.quote(target_url)}"
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(api_url)
                response.raise_for_status()
                html = response.text
                
                # Basic extraction using BeautifulSoup
                soup = BeautifulSoup(html, "html.parser")
                jobs = []
                
                # Indeed typically uses 'div.job_seen_beacon' for job cards
                cards = soup.select(".job_seen_beacon")
                for card in cards[:15]: # Limit to top 15 jobs to save processing
                    try:
                        title_el = card.select_one(".jobTitle span[title]") or card.select_one(".jobTitle")
                        title = title_el.text.strip() if title_el else "Unknown Title"
                        
                        company_el = card.select_one("[data-testid='company-name']")
                        company = company_el.text.strip() if company_el else "Unknown Company"
                        
                        location_el = card.select_one("[data-testid='text-location']")
                        loc_text = location_el.text.strip() if location_el else "Unknown Location"
                        
                        # Job URL
                        link_el = card.select_one(".jobTitle a") or card.select_one("a.jcs-JobTitle")
                        job_url = ""
                        if link_el and "href" in link_el.attrs:
                            href = link_el["href"]
                            if href.startswith("/"):
                                job_url = "https://in.indeed.com" + href
                            else:
                                job_url = href
                        
                        jobs.append({
                            "Job Title": title,
                            "Company": company,
                            "Location": loc_text,
                            "job_url": job_url,
                            "Raw HTML": str(card)[:500] # Pass a snippet to Gemini for extraction of salary/skills if available
                        })
                    except Exception as e:
                        logger.warning(f"Error parsing a job card: {e}")
                        continue
                
                if not jobs:
                    logger.warning("No jobs parsed from Indeed HTML. Structure might have changed.")
                    # Return full text to let Gemini try
                    return [{"Raw Text": soup.get_text()[:5000]}]
                    
                return jobs
                
        except Exception as e:
            logger.error(f"Scrape.do request failed: {e}")
            return []

    async def _rank_jobs_with_gemini(self, raw_jobs: List[Dict[str, Any]], user_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        prompt = f"""
        You are an expert technical recruiter and AI.
        
        CANDIDATE PROFILE:
        Role: {user_profile.get('target_job_role')} / {user_profile.get('headline')}
        Experience: {user_profile.get('experience')}
        Skills: {user_profile.get('skills')}
        
        EXTRACTED JOB DATA (from Indeed):
        {json.dumps(raw_jobs, indent=2)}
        
        TASK:
        1. Extract the actual jobs from the provided data.
        2. Rank jobs by relevance to the candidate profile.
        3. Remove any duplicate jobs.
        4. Calculate a Match % (0-100) based on skills and experience.
        5. Highlight matching skills and identify missing skills for each job.
        6. Generate a short (1-2 sentences) "Why this job matches you" summary.
        7. Ensure each job has these exact keys: "Job Title", "Company", "Location", "Salary", "Work Mode", "Posted Date", "Match %", "Skill Tags", "Missing Skills", "Short Description", "apply_url", "job_url", "Company Logo", "Rating".
        8. If information like Salary, Rating, or Logo is missing, provide a reasonable default (e.g., "Not Disclosed", "N/A", or a default logo URL). Do NOT generate fake jobs.
        
        RETURN ONLY A VALID JSON ARRAY OF JOB OBJECTS. No markdown formatting, no code blocks, just the JSON array.
        """
        
        try:
            response = await self.model.generate_content_async(prompt)
            content = response.text.strip()
            
            # Clean up potential markdown formatting
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
                
            ranked_jobs = json.loads(content.strip())
            return ranked_jobs
        except Exception as e:
            logger.error(f"Gemini ranking failed: {e}")
            # Fallback format if Gemini fails
            return self._get_dummy_jobs()

    def _save_to_cache(self, user_id: str, jobs: List[Dict[str, Any]]):
        try:
            check_res = self.supabase.table("job_tracker_cache").select("id").eq("user_id", user_id).execute()
            if check_res.data:
                self.supabase.table("job_tracker_cache").update({
                    "jobs_json": jobs,
                    "updated_at": "now()"
                }).eq("user_id", user_id).execute()
            else:
                self.supabase.table("job_tracker_cache").insert({
                    "user_id": user_id,
                    "jobs_json": jobs
                }).execute()
        except Exception as e:
            logger.error(f"Failed to cache jobs: {e}")

    def _get_dummy_jobs(self):
        return [
            {
                "Job Title": "Frontend Developer (React)",
                "Company": "TechCorp India",
                "Location": "Bengaluru, Karnataka",
                "Salary": "₹8,00,000 - ₹12,00,000 a year",
                "Work Mode": "Hybrid",
                "Posted Date": "2 days ago",
                "Match %": "92%",
                "Skill Tags": ["React", "TypeScript", "Tailwind CSS"],
                "Missing Skills": ["Next.js"],
                "Short Description": "Strong match for your frontend skills and location preference.",
                "apply_url": "",
                "job_url": "https://in.indeed.com",
                "Company Logo": "",
                "Rating": "4.2"
            }
        ]
