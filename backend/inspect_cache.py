import asyncio
import json
from config.database import get_supabase_client

async def main():
    supabase = get_supabase_client()
    res = supabase.table("job_tracker_cache").select("*").limit(1).execute()
    if res.data:
        jobs = res.data[0]["jobs_json"]
        if jobs and len(jobs) > 0:
            print(json.dumps(jobs[0], indent=2))
        else:
            print("Jobs list is empty.")
    else:
        print("No cache entries found.")

if __name__ == "__main__":
    asyncio.run(main())
