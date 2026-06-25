from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from supabase import AsyncClient, acreate_client

from app.core.config import settings
from app.core.logger import logger

_bearer = HTTPBearer()


async def get_current_user_client(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
) -> AsyncClient:
    """
    Creates a per-request Supabase client authenticated with the caller's JWT.
    All downstream DB queries execute under that user's RLS context — never the
    service role.  No user_id filtering is needed in application code.
    """
    token = credentials.credentials
    try:
        client: AsyncClient = await acreate_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_ANON_KEY,
        )
        # Forward the user JWT so PostgREST evaluates RLS as auth.uid()
        client.postgrest.auth(token)
        return client
    except Exception as exc:
        logger.error(
            "Auth dependency failed — could not initialise Supabase client: %s", exc
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
