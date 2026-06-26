import asyncio
import httpx
from bs4 import BeautifulSoup
from config.database import settings
import urllib.parse

async def main():
    target_url = "https://internshala.com/jobs/keywords-zoho%20ai%20engineer/"
    api_url = f"{settings.SCRAPEDO_BASE_URL}?token={settings.SCRAPEDO1_API_KEY}&url={urllib.parse.quote(target_url)}"
    print(f"Fetching Internshala with keywords...")
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(api_url)
        html = response.text
        soup = BeautifulSoup(html, "html.parser")
        cards = soup.select(".individual_internship")
        print(f"Found {len(cards)} cards")
        for i, card in enumerate(cards[:2]):
            title_el = card.select_one(".job-title-href")
            company_el = card.select_one(".company_name")
            print(f"Card {i}: {title_el.text.strip() if title_el else 'N/A'} at {company_el.text.strip() if company_el else 'N/A'}")

if __name__ == "__main__":
    asyncio.run(main())
