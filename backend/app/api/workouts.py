from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import AsyncClient

from app.core.logger import logger
from app.core.security import get_current_user_client
from app.models.workouts import WorkoutCreate
from app.services import workouts as workout_svc

router = APIRouter(prefix="/workouts", tags=["Workouts"])


@router.get("/", status_code=status.HTTP_200_OK)
async def list_workouts(
    client: AsyncClient = Depends(get_current_user_client),
) -> Any:
    logger.info("GET /workouts")
    try:
        return await workout_svc.get_my_workouts(client)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_workout(
    payload: WorkoutCreate,
    client: AsyncClient = Depends(get_current_user_client),
) -> Any:
    logger.info("POST /workouts name=%s", payload.name)
    try:
        return await workout_svc.create_workout(client, payload)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
