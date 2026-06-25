from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import AsyncClient

from app.core.logger import logger
from app.core.security import get_current_user_client
from app.models.biometrics import BiometricCreate
from app.services import biometrics as bio_svc

router = APIRouter(prefix="/biometrics", tags=["Biometrics"])


@router.get("/", status_code=status.HTTP_200_OK)
async def list_biometrics(
    client: AsyncClient = Depends(get_current_user_client),
) -> Any:
    logger.info("GET /biometrics")
    try:
        return await bio_svc.get_my_biometrics(client)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))


@router.post("/", status_code=status.HTTP_201_CREATED)
async def upsert_biometric(
    payload: BiometricCreate,
    client: AsyncClient = Depends(get_current_user_client),
) -> Any:
    logger.info("POST /biometrics date=%s", payload.date)
    try:
        return await bio_svc.upsert_biometric(client, payload)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
