import httpx
import logging
from typing import Optional
import urllib.parse
from config.database import settings

logger = logging.getLogger("backend.services.analysis.scrape_do_client")

class ScrapeDoClient:
    def __init__(self):
        self.api_key = settings.SCRAPEDO_API_KEY
        self.base_url = settings.SCRAPEDO_BASE_URL
        
    async def fetch_html(self, target_url: str) -> Optional[str]:
        """
        Fetches the raw HTML of the target URL using Scrape.do API.
        """
        if not self.api_key or self.api_key == "your-scrape-do-api-key":
            logger.warning("Scrape.do API key is missing or invalid. Using fallback mock HTML for development.")
            return self._get_mock_html(target_url)

        encoded_url = urllib.parse.quote(target_url)
        # Using basic Scrape.do proxy endpoint
        url = f"{self.base_url}?token={self.api_key}&url={encoded_url}"
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                logger.info(f"Fetching URL via Scrape.do: {target_url}")
                response = await client.get(url)
                response.raise_for_status()
                return response.text
        except httpx.HTTPStatusError as e:
            logger.error(f"Scrape.do API HTTP error: {e.response.status_code} - {e.response.text}")
            raise Exception(f"Failed to fetch profile: {e.response.status_code}")
        except Exception as e:
            logger.error(f"Scrape.do API connection error: {e}")
            raise Exception(f"Connection error while fetching profile.")
            
    def _get_mock_html(self, target_url: str) -> str:
        """Fallback mock HTML when no API key is provided."""
        username = target_url.strip("/").split("/")[-1]
        return f"""
        <html>
            <head><title>{username} - GitHub</title></head>
            <body>
                <h1 class="vcard-names">
                    <span class="p-name vcard-fullname d-block overflow-hidden">{username} Demo</span>
                    <span class="p-nickname vcard-username d-block">{username}</span>
                </h1>
                <div class="p-note user-profile-bio mb-3 js-user-profile-bio f4">
                    <div>Passionate Full Stack Developer | Open Source Contributor</div>
                </div>
                <div class="js-profile-editable-area">
                    <div class="d-flex flex-wrap flex-items-center mb-3">
                        <span class="text-bold color-fg-default">120</span> followers
                        <span class="text-bold color-fg-default">45</span> following
                    </div>
                </div>
                <!-- Mock Repositories -->
                <div class="pinned-item-list-item-content">
                    <span class="repo">awesome-project</span>
                    <p class="pinned-item-desc color-fg-muted text-small mt-2 mb-0">A modern full stack application</p>
                    <span itemprop="programmingLanguage">TypeScript</span>
                    <span class="pinned-item-meta text-muted">150</span> <!-- stars -->
                    <span class="pinned-item-meta text-muted">20</span> <!-- forks -->
                </div>
                <div class="pinned-item-list-item-content">
                    <span class="repo">backend-service</span>
                    <p class="pinned-item-desc color-fg-muted text-small mt-2 mb-0">FastAPI microservice</p>
                    <span itemprop="programmingLanguage">Python</span>
                    <span class="pinned-item-meta text-muted">85</span> <!-- stars -->
                    <span class="pinned-item-meta text-muted">12</span> <!-- forks -->
                </div>
            </body>
        </html>
        """
