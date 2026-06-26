import os
import logging
from pydantic_settings import BaseSettings, SettingsConfigDict
from supabase import create_client, Client

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("backend.config.database")

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    # Server settings
    PORT: int = 8000
    HOST: str = "127.0.0.1"
    FRONTEND_URL: str = "http://localhost:3001"
    APP_ENV: str = "development"
    COOKIE_SECURE: bool = False
    COOKIE_SAMESITE: str = "lax"

    # Supabase configuration
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str

    # JWT internal token configuration (for session generation after OAuth validation)
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # LinkedIn credentials
    LINKEDIN_CLIENT_ID: str = ""
    LINKEDIN_CLIENT_SECRET: str = ""
    LINKEDIN_REDIRECT_URI: str = "http://localhost:3001/auth/linkedin/callback"

    # Scrape.do settings
    SCRAPEDO_API_KEY: str = ""
    SCRAPEDO1_API_KEY: str = ""
    SCRAPEDO_BASE_URL: str = "http://api.scrape.do"

    # Gemini settings
    GEMINI_API_KEY: str = ""
    GEMINI_API1_KEY: str = ""
    GEMINI_MODEL: str = "gemini-3.1-flash-lite"

    # Jina Reader settings
    JINA_API_KEY: str = ""

# Find and load the appropriate .env file depending on working directory
env_path = ".env"
if not os.path.exists(env_path):
    if os.path.exists("backend/.env"):
        env_path = "backend/.env"
    elif os.path.exists("../backend/.env"):
        env_path = "../backend/.env"

try:
    settings = Settings(_env_file=env_path)
    logger.info(f"Configuration loaded from {env_path}")
except Exception as e:
    logger.error(f"Error loading configuration. Ensure your .env file is present and properly configured. Details: {e}")
    # Create an empty settings object with default or environment-level lookups so the app compiles
    # but actual Supabase initialization will fail gracefully on start or request.
    class FallbackSettings:
        PORT = 8000
        HOST = "127.0.0.1"
        FRONTEND_URL = "http://localhost:3001"
        SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://placeholder-project-id.supabase.co")
        SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "placeholder")
        JWT_SECRET = os.environ.get("JWT_SECRET", "fixtoflex-development-secret-key-32-characters-long-min")
        JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")
        ACCESS_TOKEN_EXPIRE_MINUTES = 60
        LINKEDIN_CLIENT_ID = os.environ.get("LINKEDIN_CLIENT_ID", "")
        LINKEDIN_CLIENT_SECRET = os.environ.get("LINKEDIN_CLIENT_SECRET", "")
        LINKEDIN_REDIRECT_URI = os.environ.get("LINKEDIN_REDIRECT_URI", "http://localhost:3001/auth/linkedin/callback")
        SCRAPEDO_API_KEY = os.environ.get("SCRAPEDO_API_KEY", "")
        SCRAPEDO1_API_KEY = os.environ.get("SCRAPEDO1_API_KEY", "")
        SCRAPEDO_BASE_URL = os.environ.get("SCRAPEDO_BASE_URL", "http://api.scrape.do")
        GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
        GEMINI_API1_KEY = os.environ.get("GEMINI_API1_KEY", "")
        GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-3.1-flash-lite")
        JINA_API_KEY = os.environ.get("JINA_API_KEY", "")
    settings = FallbackSettings()

# Singleton reference for the Supabase Client
_supabase_client: Client = None

def get_supabase_client() -> Client:
    """
    Returns a initialized, reusable Supabase Client instance.
    Uses lazy initialization to prevent startup crashes when configuration keys are missing.
    """
    global _supabase_client
    if _supabase_client is None:
        if not settings.SUPABASE_URL or "placeholder" in settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
            raise ValueError(
                "Invalid Supabase configuration. Please configure SUPABASE_URL and "
                "SUPABASE_SERVICE_ROLE_KEY with actual keys in your backend/.env file."
            )
        try:
            logger.info("Initializing connection to Supabase...")
            _supabase_client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_SERVICE_ROLE_KEY
            )
            logger.info("Successfully connected to Supabase.")
        except Exception as e:
            logger.error(f"Failed to create Supabase client: {e}")
            raise e
    return _supabase_client
