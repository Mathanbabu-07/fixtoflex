import asyncio
import httpx
from bs4 import BeautifulSoup
import urllib.parse
import os
from dotenv import load_dotenv

load_dotenv()

async def test_scrape():
    scrape_do_key = os.getenv("SCRAPEDO1_API_KEY")
    scrape_do_url = os.getenv("SCRAPEDO_BASE_URL", "http://api.scrape.do")
    
    query = "react"
    target_url = f"https://unstop.com/internships?keyword={query}"
    api_url = f"{scrape_do_url}?token={scrape_do_key}&url={urllib.parse.quote(target_url)}"
    
    print(f"Fetching from {target_url}...")
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(api_url)
        print(f"Status: {response.status_code}")
        html = response.text
        
        soup = BeautifulSoup(html, "html.parser")
        
        # Try to find common job cards
        cards = soup.select(".listing-card, .job-card, .internship_card, a[href*='/internships/']")
        print(f"Found {len(cards)} potential cards")
        if cards:
            print("Sample card:")
            print(str(cards[0])[:300])
        else:
            print("No cards found, let's dump a bit of the body text")
            print(soup.get_text()[:1000])

if __name__ == "__main__":
    asyncio.run(test_scrape())
