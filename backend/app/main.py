from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import biometrics, workouts
from app.core.logger import logger

app = FastAPI(
    title="UNF*CK API",
    description="AI-powered health and performance tracking",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(biometrics.router, prefix="/api/v1")
app.include_router(workouts.router, prefix="/api/v1")


@app.on_event("startup")
async def on_startup() -> None:
    logger.info("UNF*CK API started")


@app.get("/health", tags=["Health"])
async def health() -> dict[str, str]:
    return {"status": "ok"}
