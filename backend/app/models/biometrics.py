from datetime import date
from typing import Optional

from pydantic import BaseModel, Field


class BiometricCreate(BaseModel):
    date: date
    weight_kg: Optional[float] = Field(None, ge=0)
    body_fat_pct: Optional[float] = Field(None, ge=0, le=100)
    sleep_hours: Optional[float] = Field(None, ge=0, le=24)
    steps: Optional[int] = Field(None, ge=0)
    resting_hr: Optional[int] = Field(None, ge=20, le=300)
    notes: Optional[str] = None


class BiometricResponse(BiometricCreate):
    id: str
    user_id: str
    created_at: str
    updated_at: str
