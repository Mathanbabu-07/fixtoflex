Implement Gmail OAuth by extending the existing custom authentication system. Do not introduce NextAuth, Firebase, Clerk, Supabase Auth, or any new authentication framework.

Current authentication already exists in:

* backend/routes/auth.py
* backend/services/auth_service.py
* backend/middleware/auth_middleware.py
* frontend/app/auth/linkedin/callback/page.tsx

Reuse this authentication architecture.

## Backend

Update the Google OAuth flow inside `backend/routes/auth.py` and `backend/services/auth_service.py`.

When redirecting users to Google OAuth, request the following scopes:

* openid
* email
* profile
* https://www.googleapis.com/auth/gmail.compose

Also include OAuth parameters:

* access_type=offline
* prompt=consent

This ensures Google returns a Refresh Token together with the Access Token.

Do not modify the LinkedIn authentication flow.

---

## Token Storage

After successful Google login, save these values with the user:

* google_access_token
* google_refresh_token
* google_token_expiry

Do not overwrite existing authentication fields.

If the user already exists, update these Gmail OAuth fields.

---

## Database

If necessary, add nullable columns:

* google_access_token
* google_refresh_token
* google_token_expiry

Do not modify existing authentication logic.

---

## Frontend

give login button inside the draft mail section in candidate ui

Do not create another login page.

If the logged-in user does not have Gmail permission, automatically redirect them through the existing Google OAuth flow requesting the new Gmail scope.

After successful authorization, return to the previous page.

---

## Environment Variables

Reuse:

GOOGLE_CLIENT_ID

GOOGLE_CLIENT_SECRET

Do not create duplicate variables.

---

## Gmail Service

Create a new backend service:

backend/services/gmail_service.py

This service should:

* Build Google OAuth credentials from the stored access token and refresh token.
* Automatically refresh expired access tokens.
* Return an authenticated Gmail API client.

Do not implement draft creation yet.

Only implement Gmail authentication.

---

## API Endpoint

Create:

GET /auth/google/gmail

Purpose:

* Request Gmail permission if missing.
* Save Gmail OAuth tokens.
* Redirect back to the frontend.

---

## Validation

After login, verify:

* Gmail compose scope is granted.
* Refresh token exists.
* Access token exists.
* Tokens are stored successfully.
* Existing Google login continues to work.
* Existing LinkedIn login remains unchanged.

Do not implement email generation or Gmail Draft creation in this step. Only implement Gmail OAuth authentication while preserving the current authentication architecture.
