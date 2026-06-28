import os
import sys

# Ensure backend directory is in python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from main import app
from utils.jwt_handler import create_access_token

client = TestClient(app)

def test_recruiter_endpoints():
    print("\n--- Testing Recruiter Endpoints ---")
    
    # Generate a mock token for recruiter user
    payload = {"user_id": "00000000-0000-0000-0000-000000000000", "email": "recruiter@techcorp.com", "role": "recruiter"}
    token = create_access_token(data=payload)
    client.cookies.set("access_token", token)

    # 1. Test Match resumes with empty lists (Should return 422 Validation Error or 400 Bad Request)
    print("Testing match endpoint with invalid payload...")
    response = client.post("/recruiter/match", json={})
    assert response.status_code == 422
    print("[OK] Invalid matching payload rejected.")

    # 2. Test Match resumes with valid lists (Mocking response)
    print("Testing match endpoint with valid payload...")
    match_payload = {
        "job_role": "Python Backend Developer",
        "company_location": "Bangalore",
        "salary_range": "10 LPA – 15 LPA",
        "work_mode": "Hybrid",
        "job_description": "We need a strong Python FastAPI developer with experience in React and AWS.",
        "skills": ["Python", "FastAPI"],
        "qualification": ["UG (Bachelor's)"],
        "min_experience": "2 Years",
        "max_experience": "5 Years",
        "resumes": [
            {
                "filename": "john_doe_resume.pdf",
                "file_size": "1.2 MB",
                "text_content": "John Doe. Software Engineer with expertise in Python, FastAPI, React, and AWS."
            }
        ]
    }
    response = client.post("/recruiter/match", json=match_payload)
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["success"] is True
    assert len(res_data["results"]) == 1
    assert res_data["results"][0]["filename"] == "john_doe_resume.pdf"
    assert "match_score" in res_data["results"][0]
    print(f"[OK] Resume matched successfully. Score: {res_data['results'][0]['match_score']}%")

if __name__ == "__main__":
    try:
        test_recruiter_endpoints()
        print("\n==============================================")
        print("RECRUITER BACKEND ENDPOINTS TESTS PASSED OK!")
        print("==============================================")
        sys.exit(0)
    except AssertionError as e:
        print(f"\n[FAIL] Test validation failed: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n[FAIL] Test execution failed with error: {e}")
        sys.exit(1)
