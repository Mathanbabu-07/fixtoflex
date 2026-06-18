import logging
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, Optional
import jwt
from config.database import settings

logger = logging.getLogger("backend.utils.jwt_handler")

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Generate an internal FixToFlex JWT access token.
    Default expiration is 7 days.
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        # Step 8 Requirement: Expiry 7 days
        expire = datetime.now(timezone.utc) + timedelta(days=7)
        
    to_encode.update({"exp": expire})
    
    try:
        encoded_jwt = jwt.encode(
            to_encode,
            settings.JWT_SECRET,
            algorithm=settings.JWT_ALGORITHM
        )
        return encoded_jwt
    except Exception as e:
        logger.error(f"Error encoding JWT token: {e}")
        raise e

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode and validate a FixToFlex JWT access token.
    Returns the payload if valid, else returns None.
    """
    try:
        decoded_payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return decoded_payload
    except jwt.ExpiredSignatureError:
        logger.warning("Decoded token has expired.")
        return None
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid JWT token: {e}")
        return None
    except Exception as e:
        logger.error(f"Error decoding JWT token: {e}")
        return None
