import httpx
import logging
from typing import Optional
from config.database import settings

logger = logging.getLogger("backend.services.analysis.jina_client")

class JinaClient:
    """
    Client for Jina AI Reader to convert webpages into clean Markdown.
    """
    def __init__(self):
        self.api_key = getattr(settings, "JINA_API_KEY", "")
        self.base_url = "https://r.jina.ai"

    async def fetch_markdown(self, target_url: str) -> str:
        """
        Fetches webpage content as Markdown using Jina AI Reader.
        """
        if not target_url.startswith(("http://", "https://")):
            raise ValueError(f"Invalid target URL for Jina Reader: {target_url}")

        headers = {
            "Accept": "text/plain"
        }
        if self.api_key and self.api_key.strip():
            headers["Authorization"] = f"Bearer {self.api_key.strip()}"
            logger.info("Using Jina API Key for authentication.")

        url = f"{self.base_url}/{target_url}"
        logger.info(f"Connecting to Jina AI Reader to fetch: {target_url}")

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, headers=headers)
                
                # Check status
                if response.status_code == 200:
                    markdown_content = response.text
                    if not markdown_content or len(markdown_content.strip()) < 50:
                        logger.error(f"Jina AI Reader returned empty or very short response: {markdown_content}")
                        raise Exception("Empty or insufficient website content returned from Jina AI Reader.")
                    
                    logger.info("Successfully fetched Markdown via Jina AI Reader.")
                    return markdown_content
                else:
                    logger.error(f"Jina AI Reader failed with status code {response.status_code}: {response.text}")
                    raise Exception(f"Jina AI Reader failed with status code {response.status_code}.")

        except httpx.TimeoutException as e:
            logger.error(f"Timeout occurred while connecting to Jina AI Reader: {e}")
            raise Exception("Timeout connecting to Jina AI Reader.")
        except Exception as e:
            logger.error(f"Error fetching markdown via Jina: {e}")
            raise Exception(f"Jina AI Reader extraction failed: {str(e)}")

# Singleton instance
jina_client = JinaClient()
