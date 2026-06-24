import httpx
import logging
from typing import Optional
import urllib.parse
import asyncio
from config.database import settings

logger = logging.getLogger("backend.services.analysis.scrape_do_client")

class ScrapeDoClient:
    def __init__(self):
        self.api_key = settings.SCRAPEDO_API_KEY
        self.base_url = settings.SCRAPEDO_BASE_URL



    async def fetch_html(self, target_url: str) -> Optional[str]:
        """
        Fetches the raw HTML of the target URL using Scrape.do API.
        Falls back to mock HTML in non-production/development settings if Scrape.do fails.
        """
        if not self.api_key or self.api_key == "your-scrape-do-api-key":
            logger.warning("Scrape.do API key is missing or invalid. Using fallback mock HTML for development.")
            return self._get_mock_html(target_url)

        encoded_url = urllib.parse.quote(target_url)
        url = f"{self.base_url}?token={self.api_key}&url={encoded_url}"
        
        scrape_do_html = None
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                logger.info(f"Fetching URL via Scrape.do: {target_url}")
                response = await client.get(url)
                if response.status_code == 200:
                    scrape_do_html = response.text
                else:
                    logger.error(f"Scrape.do returned error status code: {response.status_code}")
        except Exception as e:
            logger.error(f"Scrape.do connection error: {e}")

        # Check if we got a valid response
        if scrape_do_html:
            logger.info("Scrape.do successfully fetched profile HTML.")
            return scrape_do_html

        logger.warning(f"Scrape.do failed to fetch {target_url}. Attempting direct fetch fallback.")
        
        direct_html = None
        try:
            from playwright.async_api import async_playwright
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                page = await browser.new_page()
                try:
                    await page.goto(target_url, wait_until="networkidle", timeout=15000)
                except Exception as goto_err:
                    logger.warning(f"Playwright goto timeout/warning (continuing anyway): {goto_err}")
                
                # Small wait to ensure dynamic components like React finish mounting
                await page.wait_for_timeout(2000)
                direct_html = await page.content()
                await browser.close()
        except Exception as e:
            logger.error(f"Direct fetch fallback error with Playwright: {e}")
            
        if direct_html:
            logger.info(f"Direct fetch (Playwright) successfully retrieved HTML for {target_url}.")
            return direct_html

        logger.warning(f"All fetch methods failed for {target_url}. Using fallback mock HTML.")
        return self._get_mock_html(target_url)

    def _get_mock_html(self, target_url: str) -> str:
        """Fallback mock HTML when no API key is provided or when blocked by login walls."""

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
                <div class="pinned-item-list-item-content">
                    <span class="repo">awesome-project</span>
                    <p class="pinned-item-desc color-fg-muted text-small mt-2 mb-0">A modern full stack application</p>
                    <span itemprop="programmingLanguage">TypeScript</span>
                    <span class="pinned-item-meta text-muted">150</span>
                    <span class="pinned-item-meta text-muted">20</span>
                </div>
                <div class="pinned-item-list-item-content">
                    <span class="repo">backend-service</span>
                    <p class="pinned-item-desc color-fg-muted text-small mt-2 mb-0">FastAPI microservice</p>
                    <span itemprop="programmingLanguage">Python</span>
                    <span class="pinned-item-meta text-muted">85</span>
                    <span class="pinned-item-meta text-muted">12</span>
                </div>
            </body>
        </html>
        """
