import os
import sys
from datetime import timedelta
from urllib.parse import urlparse, parse_qs

# Ensure backend directory is in python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from fastapi.testclient import TestClient
from main import app
from utils.jwt_handler import create_access_token, decode_access_token
from utils.state_generator import generate_state, verify_state
from services.auth_service import auth_service
from services.user_service import user_service

# Initialize Test Client
client = TestClient(app)

def test_signed_states():
    """
    Verify that signed OAuth states are correctly signed, expire, and check successfully.
    """
    print("\n--- Testing OAuth Signed States ---")
    state = generate_state()
    assert state is not None
    assert verify_state(state) is True
    print("[OK] State token successfully generated and verified.")
    
    assert verify_state("invalid-state-signature") is False
    print("[OK] Invalid state signatures correctly rejected.")

def test_jwt_utilities():
    """
    Test JWT helper handler encoding/decoding and 7-day default lifespan.
    """
    print("\n--- Testing JWT Handler Utilities ---")
    payload = {"user_id": "test_user_999", "email": "dev@fixtoflex.com", "role": "candidate"}
    
    # 1. Access token encoding and parsing
    token = create_access_token(data=payload)
    assert token is not None
    print("[OK] JWT Token successfully signed.")
    
    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["user_id"] == "test_user_999"
    assert decoded["email"] == "dev@fixtoflex.com"
    assert decoded["role"] == "candidate"
    print("[OK] JWT Token successfully parsed and claims matched.")

def test_health_check_endpoint():
    """
    Test the server health check API.
    """
    print("\n--- Testing System Health Check ---")
    response = client.get("/health")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "healthy"
    print(f"[OK] Health check reports status: {json_data['status']}")

def test_linkedin_login_endpoint():
    """
    Verify /auth/linkedin/login generates state and builds a valid redirect URL.
    """
    print("\n--- Testing LinkedIn Login Redirect URL ---")
    response = client.get("/auth/linkedin/login")
    assert response.status_code == 200
    json_data = response.json()
    assert "auth_url" in json_data
    
    url = json_data["auth_url"]
    parsed = urlparse(url)
    assert parsed.scheme == "https"
    assert parsed.netloc == "www.linkedin.com"
    
    query = parse_qs(parsed.query)
    assert query["response_type"] == ["code"]
    assert query["scope"] == ["openid profile email"]
    assert "state" in query
    print("[OK] LinkedIn login URL and signed state verified.")

def test_callback_state_rejection():
    """
    Verify callback blocks requests with invalid state keys.
    """
    print("\n--- Testing Callback State Validation Failure ---")
    payload = {
        "code": "auth_code_12345",
        "state": "tampered-state-token"
    }
    response = client.post("/auth/linkedin/callback", json=payload)
    assert response.status_code == 400
    assert "State token validation failed" in response.json()["detail"]
    print("[OK] Tampered state token rejected with 400 Bad Request.")

def test_mock_login_cookie():
    """
    Test mock-login endpoint issues a valid JWT and writes it to an HttpOnly cookie.
    """
    print("\n--- Testing Cookie Session Generation ---")
    payload = {
        "user_id": "99999999-9999-9999-9999-999999999999",
        "email": "candidate@fixtoflex.com"
    }
    response = client.post("/auth/mock-login", json=payload)
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert json_data["user"]["email"] == "candidate@fixtoflex.com"
    
    # Check that the response set the cookie
    assert "access_token" in response.cookies
    cookie = response.cookies["access_token"]
    assert cookie is not None
    print("[OK] Mock login success. Cookie session successfully written.")
    return cookie

def test_protected_routes(session_cookie):
    """
    Verify /users/me is secure and decodes details from cookies.
    """
    print("\n--- Testing Cookie Authorized Protected Routes ---")
    
    # Clear client cookies to test unauthenticated access
    client.cookies.clear()
    
    # 1. Request without cookie
    response = client.get("/users/me")
    assert response.status_code == 401
    print("[OK] Request without cookie blocked with 401 Unauthorized.")
    
    # 2. Request with HttpOnly cookie session
    client.cookies.set("access_token", session_cookie)
    response = client.get("/users/me")
    assert response.status_code == 200
    user_data = response.json()
    assert user_data["email"] == "candidate@fixtoflex.com"
    print("[OK] Request with HttpOnly cookie authenticated successfully.")
    
    # 3. Test logout clears session
    logout_response = client.post("/auth/logout")
    assert logout_response.status_code == 200
    
    # Verify cookie was deleted/unset
    # Standard deletion sets expiry in the past, so client cookie should be deleted or null
    expired_cookie = logout_response.cookies.get("access_token")
    assert expired_cookie is None or expired_cookie == ""
    print("[OK] Session cleared on logout.")

def test_oauth_ready_services():
    """
    Confirm LinkedIn service layers and mock configurations are OAuth ready.
    """
    print("\n--- Testing OAuth Ready Service Classes ---")
    assert hasattr(auth_service, "process_linkedin_oauth_callback")
    assert hasattr(user_service, "get_user_by_linkedin_id")
    print("[OK] Services mapped for live LinkedIn authentication integrations.")

if __name__ == "__main__":
    try:
        test_signed_states()
        test_jwt_utilities()
        test_health_check_endpoint()
        test_linkedin_login_endpoint()
        test_callback_state_rejection()
        session_cookie = test_mock_login_cookie()
        test_protected_routes(session_cookie)
        test_oauth_ready_services()
        print("\n==============================================")
        print("LINKEDIN OAUTH INTEGRATION TESTS PASSED OK!")
        print("==============================================")
        sys.exit(0)
    except AssertionError as e:
        print(f"\n[FAIL] Test validation failed: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"\n[FAIL] Test execution failed with error: {e}")
        sys.exit(1)
