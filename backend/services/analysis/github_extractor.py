from bs4 import BeautifulSoup
import logging
import json
from typing import Dict, Any

logger = logging.getLogger("backend.services.analysis.github_extractor")

class GitHubExtractor:
    """
    Parses raw GitHub profile HTML and extracts normalized JSON data.
    """
    
    @staticmethod
    def extract(html_content: str) -> Dict[str, Any]:
        logger.info("Extracting data from raw GitHub HTML")
        soup = BeautifulSoup(html_content, 'html.parser')
        
        data = {
            "personal_profile": {},
            "repositories": [],
            "stats": {}
        }
        
        try:
            # 1. Personal Profile
            name_elem = soup.find(class_="vcard-fullname")
            data["personal_profile"]["name"] = name_elem.text.strip() if name_elem else None
            
            username_elem = soup.find(class_="vcard-username")
            data["personal_profile"]["username"] = username_elem.text.strip() if username_elem else None
            
            bio_elem = soup.find(class_="user-profile-bio")
            data["personal_profile"]["bio"] = bio_elem.text.strip() if bio_elem else None
            
            # Additional details (location, company, blog, twitter)
            details_list = soup.find(class_="vcard-details")
            if details_list:
                for item in details_list.find_all("li"):
                    text = item.text.strip()
                    if item.get("itemprop") == "homeLocation":
                        data["personal_profile"]["location"] = text
                    elif item.get("itemprop") == "worksFor":
                        data["personal_profile"]["company"] = text
                    elif item.get("itemprop") == "url":
                        data["personal_profile"]["website"] = text
            
            # 2. Stats (followers, following)
            followers_elem = soup.select_one("a[href$='?tab=followers'] .text-bold")
            data["stats"]["followers"] = followers_elem.text.strip() if followers_elem else "0"
            
            following_elem = soup.select_one("a[href$='?tab=following'] .text-bold")
            data["stats"]["following"] = following_elem.text.strip() if following_elem else "0"
            
            # 3. Repositories (Pinned or popular repos typically show up on the main page)
            pinned_items = soup.find_all(class_="pinned-item-list-item-content")
            
            for item in pinned_items:
                repo = {}
                repo_name_elem = item.find(class_="repo")
                repo["name"] = repo_name_elem.text.strip() if repo_name_elem else None
                
                desc_elem = item.find(class_="pinned-item-desc")
                repo["description"] = desc_elem.text.strip() if desc_elem else None
                
                lang_elem = item.find(itemprop="programmingLanguage")
                repo["language"] = lang_elem.text.strip() if lang_elem else None
                
                # Try to extract stars and forks
                meta_items = item.find_all(class_="pinned-item-meta")
                for meta in meta_items:
                    href = meta.get("href", "")
                    meta_text = meta.text.strip()
                    if "stargazers" in href:
                        repo["stars"] = meta_text
                    elif "network/members" in href:
                        repo["forks"] = meta_text
                
                # Fallback for mock parser (since we added it for development without API keys)
                if not repo.get("stars") and len(meta_items) >= 1:
                    repo["stars"] = meta_items[0].text.strip()
                if not repo.get("forks") and len(meta_items) >= 2:
                    repo["forks"] = meta_items[1].text.strip()

                data["repositories"].append(repo)
                
            # Note: A real implementation might hit the repositories tab or GraphQL API, 
            # but for Phase 1 we are scraping the main profile page which includes pinned repos and contribution graphs.
            
            # 4. Contribution Activity (if visible)
            contrib_elem = soup.find("h2", class_="f4 text-normal mb-2")
            if contrib_elem:
                data["stats"]["contributions_last_year"] = contrib_elem.text.strip()

        except Exception as e:
            logger.error(f"Error during HTML parsing: {e}")
            # Return whatever partial data we managed to extract
            
        logger.info(f"Extracted {len(data['repositories'])} repositories.")
        return data
