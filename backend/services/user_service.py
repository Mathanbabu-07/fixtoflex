import logging
import uuid
from typing import Dict, Any, Optional
from config.database import get_supabase_client

logger = logging.getLogger("backend.services.user_service")

class UserService:
    def __init__(self):
        self.table_name = "users"

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve a user profile from the database by ID (UUID).
        """
        try:
            client = get_supabase_client()
            logger.info(f"Querying database for user ID: {user_id}")
            response = client.table(self.table_name).select("*").eq("id", user_id).execute()
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.warning(
                f"Failed to query user by ID {user_id} from Supabase. "
                f"Assuming user not found or database table is offline. Error: {e}"
            )
            return None

    def get_user_by_linkedin_id(self, linkedin_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve a user profile from the database by their LinkedIn unique ID.
        """
        try:
            client = get_supabase_client()
            logger.info(f"Querying database for LinkedIn ID: {linkedin_id}")
            response = client.table(self.table_name).select("*").eq("linkedin_id", linkedin_id).execute()
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.warning(
                f"Failed to query user by LinkedIn ID {linkedin_id} from Supabase. "
                f"Assuming user not found or database table is offline. Error: {e}"
            )
            return None

    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """
        Retrieve a user profile from the database by email address.
        """
        try:
            client = get_supabase_client()
            logger.info(f"Querying database for Email: {email}")
            response = client.table(self.table_name).select("*").eq("email", email).execute()
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.warning(
                f"Failed to query user by Email {email} from Supabase. "
                f"Assuming user not found or database table is offline. Error: {e}"
            )
            return None

    def create_user_profile(
        self, 
        linkedin_id: str, 
        email: str, 
        full_name: str, 
        profile_picture: Optional[str] = None,
        role: str = "candidate"
    ) -> Dict[str, Any]:
        """
        Create a new user profile record in the database.
        If the remote database insert fails (e.g. table/column is missing),
        falls back to a local sandbox object so local development continues.
        Reference: Step 7: User Creation Logic
        """
        fallback_uuid = str(uuid.uuid4())
        try:
            client = get_supabase_client()
            logger.info(f"Inserting new user profile in database. Email: {email}")
            
            payload = {
                "linkedin_id": linkedin_id,
                "email": email,
                "full_name": full_name,
                "profile_picture": profile_picture,
                "role": role
            }
            
            payload = {k: v for k, v in payload.items() if v is not None}
            response = client.table(self.table_name).insert(payload).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            
            raise RuntimeError("Database returned empty response on insert user query.")
        except Exception as e:
            logger.warning(
                f"Failed to write user profile in Supabase database. "
                f"This is normal if you haven't deployed the database migrations in schema.sql yet. "
                f"Falling back to local sandbox session profile. Database Error: {e}"
            )
            # Return fallback mock profile
            return {
                "id": fallback_uuid,
                "linkedin_id": linkedin_id,
                "email": email,
                "full_name": full_name,
                "profile_picture": profile_picture,
                "role": role,
                "created_at": "2026-06-17T00:00:00Z"
            }

    def update_user_profile(self, user_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Update fields on an existing user profile by user UUID.
        """
        try:
            client = get_supabase_client()
            logger.info(f"Updating user profile fields for user ID: {user_id}")
            
            # Avoid mutating immutable fields
            if "id" in updates:
                updates = updates.copy()
                del updates["id"]
                
            response = client.table(self.table_name).update(updates).eq("id", user_id).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            logger.warning(
                f"Failed to update user profile {user_id} in Supabase database. "
                f"Returning merged local context. Database Error: {e}"
            )
            return {
                "id": user_id,
                **updates
            }

# Create singleton service instance
user_service = UserService()
