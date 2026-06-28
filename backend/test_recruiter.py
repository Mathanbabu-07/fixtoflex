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

    # 1. Test Match resumes with empty payload (Should return 422 Validation Error)
    print("Testing match endpoint with invalid payload...")
    response = client.post("/recruiter/match", json={})
    assert response.status_code == 422
    print("[OK] Invalid matching payload rejected.")

    # 2. Test Match resumes with valid payload (3 resumes, no top_n → returns all)
    print("Testing match endpoint with valid payload (all results)...")
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
                "text_content": "John Doe. Software Engineer with expertise in Python, FastAPI, React, and AWS. Email: john@example.com. LinkedIn: https://linkedin.com/in/johndoe"
            },
            {
                "filename": "jane_smith_resume.pdf",
                "file_size": "0.8 MB",
                "text_content": "Jane Smith. Frontend Developer skilled in React, TypeScript, and CSS. Email: jane@example.com"
            },
            {
                "filename": "alice_wang_resume.pdf",
                "file_size": "1.5 MB",
                "text_content": "Alice Wang. Data Scientist with Python, TensorFlow, and SQL. GitHub: https://github.com/alicewang"
            }
        ]
    }
    response = client.post("/recruiter/match", json=match_payload)
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["success"] is True
    assert res_data["total_analyzed"] == 3
    assert len(res_data["results"]) == 3
    print(f"[OK] All 3 resumes matched. Top score: {res_data['results'][0]['match_score']}%")

    # 3. Verify enriched fields are present in results
    print("Verifying enriched candidate fields...")
    first = res_data["results"][0]
    assert "candidate_name" in first
    assert "email" in first
    assert "linkedin_url" in first
    assert "github_url" in first
    assert "college_name" in first
    assert "degree" in first
    assert "experience_summary" in first
    assert "skills_found" in first
    assert "projects_found" in first
    assert "certifications_found" in first
    assert "match_score" in first
    assert "strengths" in first
    assert "weaknesses" in first
    assert "matched_skills" in first
    assert "missing_skills" in first
    assert "fit_summary" in first
    print(f"[OK] Enriched fields verified for candidate: {first['candidate_name']}")

    # 4. Test top_n filtering (request top 2 from 3 resumes)
    print("Testing top_n filtering (top 2 of 3)...")
    match_payload["top_n"] = 2
    response = client.post("/recruiter/match", json=match_payload)
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["success"] is True
    assert res_data["total_analyzed"] == 3
    assert res_data["top_n"] == 2
    assert len(res_data["results"]) == 2
    print(f"[OK] Top 2 returned from 3 analyzed. Scores: {res_data['results'][0]['match_score']}%, {res_data['results'][1]['match_score']}%")

    # 5. Test top_n = 1
    print("Testing top_n = 1...")
    match_payload["top_n"] = 1
    response = client.post("/recruiter/match", json=match_payload)
    assert response.status_code == 200
    res_data = response.json()
    assert len(res_data["results"]) == 1
    print(f"[OK] Top 1 returned. Best candidate: {res_data['results'][0]['candidate_name']} ({res_data['results'][0]['match_score']}%)")

    # 6. Test top_n exceeding resume count (should clamp)
    print("Testing top_n > resume count (should clamp)...")
    match_payload["top_n"] = 100
    response = client.post("/recruiter/match", json=match_payload)
    assert response.status_code == 200
    res_data = response.json()
    assert len(res_data["results"]) == 3  # clamped to actual count
    print(f"[OK] Clamped to {len(res_data['results'])} results.")

    # 7. Verify results are sorted descending by score
    print("Verifying results are sorted by score descending...")
    scores = [r["match_score"] for r in res_data["results"]]
    assert scores == sorted(scores, reverse=True), f"Scores not sorted: {scores}"
    print(f"[OK] Scores sorted correctly: {scores}")

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
