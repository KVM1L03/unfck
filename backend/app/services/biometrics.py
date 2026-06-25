from typing import Any

from supabase import AsyncClient

from app.core.logger import logger
from app.models.biometrics import BiometricCreate

TABLE = "daily_biometrics"


async def get_my_biometrics(client: AsyncClient) -> list[Any]:
    response = await client.table(TABLE).select("*").order("date", desc=True).execute()
    logger.info("Fetched %d biometric rows", len(response.data))
    return response.data


async def upsert_biometric(
    client: AsyncClient, data: BiometricCreate
) -> dict[str, Any]:
    # user_id is intentionally omitted — the DB DEFAULT auth.uid() fills it and
    # RLS enforces ownership.  Conflict resolution relies on the UNIQUE(user_id, date)
    # constraint defined in the DB schema.
    payload = data.model_dump(mode="json")
    response = await (
        client.table(TABLE).upsert(payload, on_conflict="user_id,date").execute()
    )
    return response.data[0]
