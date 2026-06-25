from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class WorkoutSetCreate(BaseModel):
    exercise_name: str
    set_number: int = Field(ge=1)
    reps: Optional[int] = Field(None, ge=0)
    weight_kg: Optional[float] = Field(None, ge=0)
    duration_secs: Optional[int] = Field(None, ge=0)
    notes: Optional[str] = None


class WorkoutSetResponse(WorkoutSetCreate):
    id: str
    workout_id: str
    created_at: str


class WorkoutCreate(BaseModel):
    name: str
    started_at: datetime
    ended_at: Optional[datetime] = None
    notes: Optional[str] = None
    sets: List[WorkoutSetCreate] = []


class WorkoutResponse(BaseModel):
    id: str
    user_id: str
    name: str
    started_at: datetime
    ended_at: Optional[datetime] = None
    notes: Optional[str] = None
    created_at: str
    sets: List[WorkoutSetResponse] = []
