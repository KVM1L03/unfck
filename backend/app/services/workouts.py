from typing import Any

from supabase import AsyncClient

from app.core.logger import logger
from app.models.workouts import WorkoutCreate

WORKOUTS_TABLE = "workouts"
SETS_TABLE = "workout_sets"


async def get_my_workouts(client: AsyncClient) -> list[Any]:
    response = await (
        client.table(WORKOUTS_TABLE)
        .select("*, workout_sets(*)")
        .order("started_at", desc=True)
        .execute()
    )
    logger.info("Fetched %d workouts", len(response.data))
    return response.data


async def create_workout(client: AsyncClient, data: WorkoutCreate) -> dict[str, Any]:
    sets = data.sets
    workout_payload = data.model_dump(mode="json", exclude={"sets"})

    workout_resp = await client.table(WORKOUTS_TABLE).insert(workout_payload).execute()
    workout = workout_resp.data[0]
    workout_id: str = workout["id"]

    if sets:
        sets_payload = [
            {**s.model_dump(mode="json"), "workout_id": workout_id}
            for s in sets
        ]
        await client.table(SETS_TABLE).insert(sets_payload).execute()

    full_resp = await (
        client.table(WORKOUTS_TABLE)
        .select("*, workout_sets(*)")
        .eq("id", workout_id)
        .single()
        .execute()
    )
    logger.info("Created workout id=%s with %d sets", workout_id, len(sets))
    return full_resp.data
