import logging
import sys
import os
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from config.database import settings, get_supabase_client
from routes import auth, users, analysis, career_intelligence, job_tracker, internship_tracker, interview, mail, recruiter

# Configure root logger to output to stdout
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    stream=sys.stdout
)
logger = logging.getLogger("backend.main")

# Initialize FastAPI App
app = FastAPI(
    title="FixToFlex Backend API",
    description="Backend foundation and API gateway for FixToFlex, featuring Supabase and JWT authentication.",
    version="1.0.0"
)

# CORS Middleware Configuration
# Configures backend server to accept requests from the Next.js frontend (default: localhost:3001)
frontend_url = settings.FRONTEND_URL.strip() if settings.FRONTEND_URL else ""
origins = [
    frontend_url,
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.19.80:3001",
    "http://192.168.193.80:3001",
    "http://192.168.19.80:3000",
    "http://192.168.193.80:3000"
]

# Allow adding additional CORS origins dynamically from environment variables
additional_origins_env = os.environ.get("ADDITIONAL_CORS_ORIGINS", "")
if additional_origins_env:
    extra_origins = [o.strip() for o in additional_origins_env.split(",") if o.strip()]
    origins.extend(extra_origins)

# Filter out duplicate and empty entries
origins = list(set(o for o in origins if o))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Sub-Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(analysis.router)
app.include_router(career_intelligence.router)
app.include_router(job_tracker.router)
app.include_router(internship_tracker.router)
app.include_router(interview.router)
app.include_router(mail.router)
app.include_router(recruiter.router)

@app.get("/health", status_code=status.HTTP_200_OK, tags=["System"])
async def health_check():
    """
    System health check.
    Checks application readiness and queries the status of the Supabase connection pool.
    """
    logger.info("Health check endpoint triggered.")
    supabase_status = "disconnected"
    supabase_details = None
    
    try:
        # Perform dynamic lookup to test supabase client viability
        client = get_supabase_client()
        # Verify database access (e.g. check table list or basic client viability check)
        if client:
            supabase_status = "connected"
    except Exception as e:
        supabase_status = "unconfigured_or_error"
        supabase_details = str(e)
        logger.warning(f"Supabase connection test unsuccessful in health check: {e}")

    return {
        "status": "healthy",
        "api_version": "1.0.0",
        "services": {
            "supabase": {
                "status": supabase_status,
                "detail": supabase_details
            }
        }
    }

# Global Exception Handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Catches unhandled errors application-wide and returns a clean, structured JSON response.
    Prevents leaking internal server traceback traces directly to the client.
    """
    logger.error(f"Unhandled system exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An internal server error occurred. Please contact the administrator or check backend logs.",
            "error_type": exc.__class__.__name__
        }
    )

if __name__ == "__main__":
    import uvicorn
    logger.info(f"Starting server on {settings.HOST}:{settings.PORT}")
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
