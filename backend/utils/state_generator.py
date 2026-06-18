import logging
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from config.database import settings

logger = logging.getLogger("backend.utils.state_generator")

def generate_state() -> str:
    """
    Generate a cryptographically signed state token to mitigate CSRF attacks.
    Embeds a unique ID and an expiration timestamp (10 minutes).
    """
    payload = {
        "jti": str(uuid.uuid4()),
        "exp": datetime.now(timezone.utc) + timedelta(minutes=10)
    }
    
    try:
        state_token = jwt.encode(
            payload,
            settings.JWT_SECRET,
            algorithm=settings.JWT_ALGORITHM
        )
        return state_token
    except Exception as e:
        logger.error(f"Failed to generate signed OAuth state: {e}")
        # Fallback to simple uuid if signing fails (not recommended in production)
        return str(uuid.uuid4())

def verify_state(state: str) -> bool:
    """
    Verify the signature and expiration of the state token returned from the callback.
    """
    try:
        jwt.decode(
            state,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return True
    except jwt.ExpiredSignatureError:
        logger.error("OAuth callback state verification failed: State token has expired.")
        return False
    except jwt.InvalidTokenError as e:
        logger.error(f"OAuth callback state verification failed: Invalid state token ({e}).")
        return False
    except Exception as e:
        logger.error(f"State verification failed with unexpected error: {e}")
        return False
