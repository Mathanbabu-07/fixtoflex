import asyncio
import urllib.parse
import httpx
from bs4 import BeautifulSoup
from config.database import settings

async def main():
    scrape_do_key = settings.SCRAPEDO1_API_KEY
    scrape_do_url = settings.SCRAPEDO_BASE_URL
    target_url = "https://internshala.com/jobs/software-engineering-jobs/"
    api_url = f"{scrape_do_url}?token={scrape_do_key}&url={urllib.parse.quote(target_url)}"
    
    print("Fetching Internshala...")
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(api_url)
        soup = BeautifulSoup(response.text, "html.parser")
        
        # Internshala job cards are usually under something like .internship_meta
        # Let's just find the first few cards and print their classes
        cards = soup.select(".individual_internship")
        print(f"Found {len(cards)} cards using .individual_internship")
        
        if cards:
            for i, card in enumerate(cards[:2]):
                print(f"--- Card {i} ---")
                title = card.select_one(".heading_4_5")
                company = card.select_one(".company_name")
                loc = card.select_one(".location_link")
                print("Title:", title.text.strip() if title else "None")
                print("Company:", company.text.strip() if company else "None")
                print("Location:", loc.text.strip() if loc else "None")
                print("Links:")
                for a in card.find_all("a", href=True):
                    print(f"  {a.get('class')} - {a['href']}")

if __name__ == "__main__":
    asyncio.run(main())
