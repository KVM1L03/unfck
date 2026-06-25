from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from supabase import AsyncClient, acreate_client

from app.core.config import settings
from app.core.logger import logger


async def get_current_user_client(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(HTTPBearer())],
) -> AsyncClient:
    token = credentials.credentials
    try:
        client: AsyncClient = await acreate_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_ANON_KEY,
        )
        # Validate the JWT against Supabase Auth before touching any data.
        # get_user() verifies the signature and expiry server-side; a forged or
        # expired token is rejected here rather than producing a confusing DB error.
        user_resp = await client.auth.get_user(token)
        if not user_resp.user:
            raise ValueError("Token resolved to no user")

        # Forward the validated JWT so every PostgREST query runs under
        # auth.uid() — this is what triggers RLS policies.
        client.postgrest.auth(token)
        return client

    except HTTPException:
        raise  # already formatted, let it propagate
    except Exception as exc:
        logger.error("Auth failed — rejected request with invalid token: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )


# Single import alias for all routers — avoids repeating Depends(...) everywhere.
UserClient = Annotated[AsyncClient, Depends(get_current_user_client)]
