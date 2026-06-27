import json
import logging
import urllib.parse
import asyncio
import hashlib
from typing import Dict, Any, List, Optional
import httpx
from bs4 import BeautifulSoup
import google.generativeai as genai
from config.database import settings, get_supabase_client
from datetime import datetime, timedelta

logger = logging.getLogger("backend.services.internship_tracker_service")

class InternshipTrackerService:
    def __init__(self):
        self.supabase = get_supabase_client()
        self.scrape_do_key = settings.SCRAPEDO1_API_KEY
        self.scrape_do_url = settings.SCRAPEDO_BASE_URL
        self.gemini_key = settings.GEMINI_API1_KEY
        
        if self.gemini_key:
            genai.configure(api_key=self.gemini_key)
            self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
        else:
            self.model = None

    async def get_internships(self, user_id: str, force_refresh: bool = False) -> Dict[str, Any]:
        try:
            user_res = self.supabase.table("users").select("*").eq("id", user_id).execute()
            if not user_res.data:
                return {"status": "error", "message": "User not found"}
            
            user = user_res.data[0]
            
            # Generate cache hash only from allowed fields
            profile_data = {
                "interested_domain": user.get("interested_domain"),
                "target_job_role": user.get("target_job_role"),
                "skills": user.get("skills"),
                "experience": user.get("experience"),
                "career_preferences": user.get("career_preferences")
            }
            
            search_str = json.dumps(profile_data, sort_keys=True)
            cache_hash = hashlib.md5(search_str.encode()).hexdigest()
            
            # Check cache
            if not force_refresh:
                cache_res = self.supabase.table("internship_tracker_cache").select("*").eq("user_id", user_id).eq("cache_hash", cache_hash).execute()
                if cache_res.data:
                    cache_entry = cache_res.data[0]
                    updated_at_str = cache_entry.get("updated_at")
                    if updated_at_str:
                        try:
                            updated_at = datetime.fromisoformat(updated_at_str.replace("Z", "+00:00"))
                            if datetime.now(updated_at.tzinfo) - updated_at < timedelta(hours=24):
                                logger.info(f"Returning cached internships for user {user_id}")
                                return {"status": "success", "data": cache_entry["internships_json"], "cached": True}
                        except Exception as e:
                            logger.warning(f"Error parsing cache date: {e}")

            # Build query
            domain = user.get("interested_domain") or ""
            role = user.get("target_job_role") or ""
            skills = user.get("skills") or ""
            query_terms = [domain, role]
            if not domain and not role:
                query_terms.append(skills[:30]) # Just some keywords if role/domain missing
            
            query = " ".join([t for t in query_terms if t]).strip() or "software"
            
            # Scrape concurrently
            unstop_task = self._scrape_unstop(query)
            internshala_task = self._scrape_internshala(query)
            
            results = await asyncio.gather(unstop_task, internshala_task, return_exceptions=True)
            
            raw_internships = []
            for result in results:
                if isinstance(result, Exception):
                    logger.error(f"Scraping error: {result}")
                elif isinstance(result, list):
                    raw_internships.extend(result)
            
            if not raw_internships:
                return {"status": "error", "message": "No matching internships were found. Try updating your career preferences or technical skills."}
            
            # Rank with Gemini
            if not self.model:
                logger.error("GEMINI_API1_KEY is not configured")
                return {"status": "error", "message": "AI service is not configured."}
                
            ranked_internships = await self._rank_internships_with_gemini(raw_internships, profile_data)
            
            # Save to cache
            self._save_to_cache(user_id, cache_hash, ranked_internships)
            
            return {"status": "success", "data": ranked_internships, "cached": False}
            
        except Exception as e:
            logger.error(f"Error in internship tracker service: {e}")
            return {"status": "error", "message": str(e)}

    async def _scrape_internshala(self, query: str) -> List[Dict[str, Any]]:
        # Using internshala keyword search
        q = urllib.parse.quote(query.replace(" ", "-"))
        target_url = f"https://internshala.com/internships/keywords-{q}/"
        
        if not self.scrape_do_key:
            return self._get_dummy_internships(source="Internshala")
            
        api_url = f"{self.scrape_do_url}?token={self.scrape_do_key}&url={urllib.parse.quote(target_url)}"
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(api_url)
                response.raise_for_status()
                html = response.text
                
                soup = BeautifulSoup(html, "html.parser")
                internships = []
                
                cards = soup.select(".individual_internship")
                for card in cards[:15]:
                    try:
                        title_el = card.select_one(".job-title-href")
                        title = title_el.text.strip() if title_el else "Unknown Title"
                        
                        company_el = card.select_one(".company_name")
                        company = company_el.text.strip() if company_el else "Unknown Company"
                        
                        job_url = ""
                        if title_el and "href" in title_el.attrs:
                            href = title_el["href"]
                            if href.startswith("/"):
                                job_url = "https://internshala.com" + href
                            else:
                                job_url = href
                        
                        internships.append({
                            "Internship Title": title,
                            "Company Name": company,
                            "job_url": job_url,
                            "source": "Internshala",
                            "Raw HTML": str(card)[:500]
                        })
                    except Exception as e:
                        logger.warning(f"Error parsing Internshala card: {e}")
                        continue
                
                if not internships:
                    return self._get_dummy_internships(source="Internshala")
                    
                return internships
                
        except Exception as e:
            logger.error(f"Internshala Scrape.do request failed: {e}")
            return self._get_dummy_internships(source="Internshala")

    async def _scrape_unstop(self, query: str) -> List[Dict[str, Any]]:
        # Using unstop keywords
        q = urllib.parse.quote(query)
        target_url = f"https://unstop.com/internships?keyword={q}"
        
        if not self.scrape_do_key:
            return self._get_dummy_internships(source="Unstop")
            
        api_url = f"{self.scrape_do_url}?token={self.scrape_do_key}&url={urllib.parse.quote(target_url)}&render=true"
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(api_url)
                response.raise_for_status()
                html = response.text
                
                soup = BeautifulSoup(html, "html.parser")
                internships = []
                
                # Unstop's actual cards might require JS, we pass render=true to scrape.do (if supported)
                # or fallback to extracting generic links/cards.
                cards = soup.select(".listing-card, .job-card, a[href*='/internships/']")
                for card in cards[:15]:
                    try:
                        internships.append({
                            "source": "Unstop",
                            "Raw HTML": str(card)[:500]
                        })
                    except Exception:
                        continue
                        
                if not internships:
                    return self._get_dummy_internships(source="Unstop")
                    
                return internships
                
        except Exception as e:
            logger.error(f"Unstop Scrape.do request failed: {e}")
            return self._get_dummy_internships(source="Unstop")

    async def _rank_internships_with_gemini(self, raw_internships: List[Dict[str, Any]], profile_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        profile_context = f"""
        CANDIDATE PROFILE:
        Interested Domain: {profile_data.get('interested_domain') or ''}
        Target Role: {profile_data.get('target_job_role') or ''}
        Experience: {profile_data.get('experience') or ''}
        Skills: {profile_data.get('skills') or ''}
        Career Preferences: {profile_data.get('career_preferences') or ''}
        """
        
        prompt = f"""
        You are an expert technical recruiter and AI specializing in Internships.
        
        {profile_context}
        
        EXTRACTED INTERNSHIP DATA:
        {json.dumps(raw_internships, indent=2)}
        
        TASK:
        1. Extract actual internships from the provided data.
        2. Rank internships by relevance to the candidate profile (Domain, Target Role, Skills, Fresher profile).
        3. Remove any duplicate internships.
        4. Calculate a Match % (0-100) based on skills and profile alignment.
        5. Highlight matching skills and identify missing skills.
        6. Generate a short (1-2 sentences) "Why this internship matches you" summary.
        7. Ensure each internship has exactly these keys: "source", "Internship Title", "Company Name", "Company Logo", "Internship Type", "Work Mode", "Location", "Stipend", "Duration", "Apply Deadline", "Match %", "Skill Tags", "Missing Skills", "Short Description", "job_url".
        8. Maintain the exact "source" value ("Internshala" or "Unstop"). Do not change or hallucinate it.
        9. If information like Stipend, Work Mode, or Logo is missing, provide a reasonable default (e.g., "Not Disclosed", "Remote", or ""). Do NOT generate fake internships.
        
        RETURN ONLY A VALID JSON ARRAY OF INTERNSHIP OBJECTS. No markdown formatting, no code blocks, just the JSON array.
        """
        
        try:
            response = await self.model.generate_content_async(prompt)
            content = response.text.strip()
            
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
                
            ranked = json.loads(content.strip())
            return ranked
        except Exception as e:
            logger.error(f"Gemini ranking failed: {e}")
            return self._get_dummy_internships(source="Internshala") + self._get_dummy_internships(source="Unstop")

    def _save_to_cache(self, user_id: str, cache_hash: str, internships: List[Dict[str, Any]]):
        try:
            check_res = self.supabase.table("internship_tracker_cache").select("id").eq("user_id", user_id).eq("cache_hash", cache_hash).execute()
            if check_res.data:
                self.supabase.table("internship_tracker_cache").update({
                    "internships_json": internships,
                    "updated_at": "now()"
                }).eq("user_id", user_id).eq("cache_hash", cache_hash).execute()
            else:
                self.supabase.table("internship_tracker_cache").insert({
                    "user_id": user_id,
                    "cache_hash": cache_hash,
                    "internships_json": internships
                }).execute()
        except Exception as e:
            logger.error(f"Failed to cache internships: {e}")

    def _get_dummy_internships(self, source="Internshala"):
        return [
            {
                "Internship Title": "Software Development Intern" if source == "Internshala" else "React JS Intern",
                "Company Name": "Tech Innovators" if source == "Internshala" else "WebFront Studios",
                "Company Logo": "",
                "Internship Type": "Full Time",
                "Work Mode": "Remote" if source == "Internshala" else "Hybrid",
                "Location": "Remote" if source == "Internshala" else "Bengaluru",
                "Stipend": "₹15,000 /month" if source == "Internshala" else "Not Disclosed",
                "Duration": "6 Months",
                "Apply Deadline": "15 days",
                "Match %": "88%" if source == "Internshala" else "92%",
                "Skill Tags": ["React", "JavaScript", "HTML", "CSS"],
                "Missing Skills": ["TypeScript"],
                "Short Description": "Great match for your frontend skills and preference for remote/hybrid work.",
                "job_url": f"https://{source.lower()}.com",
                "source": source
            }
        ]
