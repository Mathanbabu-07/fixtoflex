import asyncio
from services.job_tracker_service import JobTrackerService
import json

async def main():
    service = JobTrackerService()
    print("Scraping raw Indeed jobs...")
    raw_jobs = await service._scrape_indeed("Software Engineer", "India")
    
    if raw_jobs:
        first_job = raw_jobs[0]
        if "Raw HTML" in first_job:
            first_job["Raw HTML"] = "..."
        print(json.dumps(first_job, indent=2))
        
        for i, j in enumerate(raw_jobs):
            print(f"Job {i}: {j.get('Job Title')} - {j.get('job_url')}")
    else:
        print("No jobs found")

if __name__ == "__main__":
    asyncio.run(main())
