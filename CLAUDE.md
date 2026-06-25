# CLAUDE.md — UNF*CK Monorepo System Instructions

This file is your primary operating contract for every session in this repository.
YOU MUST read and internalize every rule below before writing a single line of code.
These rules are non-negotiable. They exist because shortcuts here create production incidents.

---

## MONOREPO LAYOUT

```
/unfck
  /backend          FastAPI · Python 3.12+ · Supabase-py (async)
    /app
      /api          Routers and endpoint handlers
      /core         Config, security, logger
      /models       Pydantic V2 schemas
      /services     Business logic and DB calls
      main.py
  /frontend         Expo SDK 56 · React Native 0.85 · expo-router · TypeScript 6
    /src
      /app          File-based routes (expo-router)
      /components
      /hooks
      /constants
      /types        Generated Supabase TS types live here
  /supabase         Supabase CLI project (migrations, seeds, config)
```

---

## 1. OPERATIONAL COMMANDS

These are the exact, canonical commands for this repository.
YOU MUST use these commands verbatim. NEVER invent alternatives.

### Backend

```bash
# Dev server (from repo root)
cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run tests
cd backend && pytest -v

# Lint (check only)
cd backend && ruff check .

# Format + lint (fix in place)
cd backend && ruff format . && ruff check . --fix

# Type check
cd backend && mypy app/
```

> `pytest`, `ruff`, `mypy`, `pytest-asyncio`, and `httpx` MUST be listed in
> `backend/requirements.txt` (or a `pyproject.toml` `[tool.pytest]` section).
> If they are missing, add them before running.

### Frontend

```bash
# Start Expo dev server (from repo root)
cd frontend && npx expo start

# iOS simulator
cd frontend && npx expo start --ios

# Android emulator
cd frontend && npx expo start --android

# Lint TypeScript
cd frontend && npm run lint
```

> YOU MUST consult https://docs.expo.dev/versions/v56.0.0/ before writing any
> Expo or React Native code. The Expo API surface changes significantly between
> SDK versions. NEVER assume APIs from memory.

### Supabase

```bash
# Generate TypeScript types from the remote schema (run after any migration)
npx supabase gen types typescript --project-id <PROJECT_ID> \
  --schema public \
  > frontend/src/types/database.types.ts

# Apply local migrations
npx supabase db push

# Start local Supabase stack
npx supabase start
```

> After running `gen types`, YOU MUST commit the updated `database.types.ts`.
> NEVER hand-write Supabase TypeScript types — they are always auto-generated.

---

## 2. PYTHON CONCURRENCY & EVENT LOOP PROTECTION

Violating these rules silently starves the event loop, causes timeouts under load,
and creates race conditions that are nearly impossible to debug in production.

### The Single Rule of async vs def

**Use `async def` ONLY when every I/O operation inside the function is itself
`async` and uses `await`.** If any single call is synchronous and blocking,
the entire function MUST be plain `def`.

```python
# CORRECT — pure async I/O path
async def fetch_biometrics(client: AsyncClient) -> list[dict]:
    response = await client.table("daily_biometrics").select("*").execute()
    return response.data

# CORRECT — CPU-bound or sync I/O → plain def, FastAPI offloads to thread pool
def compute_hrv_score(rr_intervals: list[float]) -> float:
    # heavy numpy / scipy work here
    ...
```

### Blocking Calls Inside Async Contexts

YOU MUST NEVER call a synchronous blocking operation from within an `async def`
function. This blocks the event loop thread and degrades every concurrent request.

Banned patterns inside `async def`:
- `requests.get(...)` or any `requests` call
- `time.sleep(...)`
- Synchronous file I/O via `open()` without `anyio`/`aiofiles`
- Synchronous ORM calls (SQLAlchemy sync sessions)
- Heavy CPU computation (image processing, ML inference, pandas on large frames)

**If you must call a blocking operation from an async context, YOU MUST use:**

```python
import anyio

async def run_blocking_task(data: bytes) -> dict:
    result = await anyio.to_thread.run_sync(some_sync_function, data)
    return result
```

### FastAPI Endpoint Signatures

```python
# CORRECT — I/O only, awaitable client
@router.get("/biometrics/")
async def list_biometrics(client: AsyncClient = Depends(get_current_user_client)):
    return await svc.get_my_biometrics(client)

# CORRECT — sync endpoint for blocking work (FastAPI moves it to thread pool)
@router.post("/reports/generate")
def generate_report(payload: ReportRequest) -> ReportResponse:
    return report_svc.build_sync(payload)  # heavy PDF generation etc.
```

---

## 3. FASTAPI & SUPABASE PRODUCTION STANDARDS

### Type Hints

YOU MUST use Python 3.12+ union syntax and built-in generics everywhere.

```python
# CORRECT
def get_items(ids: list[int]) -> dict[str, int] | None: ...

# FORBIDDEN — legacy typing module aliases
from typing import List, Dict, Optional  # NEVER import these for standard types
```

`Optional[X]` is always written as `X | None`. `Union[X, Y]` is always `X | Y`.

### Pydantic V2 — All Schemas

Every request body, response model, and config MUST use Pydantic V2 conventions.

```python
from pydantic import BaseModel, Field, model_validator

class BiometricCreate(BaseModel):
    date: date
    weight_kg: float | None = Field(None, ge=0, description="Body weight in kg")

    model_config = {"extra": "forbid"}  # reject unknown fields at the boundary
```

- NEVER use `class Config:` — use `model_config = {...}` (Pydantic V2 syntax).
- NEVER use `@validator` — use `@field_validator` or `@model_validator`.
- ALWAYS call `.model_dump(mode="json")` when serialising for Supabase, never `.dict()`.

### Dependency Injection — `Annotated` is Mandatory

YOU MUST use `typing.Annotated` for all FastAPI dependencies. The naked `= Depends()`
pattern is tolerated only for one-liners; for anything injected in multiple routes,
define a named type alias.

```python
from typing import Annotated
from fastapi import Depends
from supabase import AsyncClient
from app.core.security import get_current_user_client

# Define the alias once
UserClient = Annotated[AsyncClient, Depends(get_current_user_client)]

# Use it everywhere — clean, refactor-safe
@router.get("/biometrics/")
async def list_biometrics(client: UserClient) -> list[dict]:
    ...
```

### Supabase RLS — The Security Contract

This is the most critical invariant in the entire backend.

**THE RULE:** Every client-facing route MUST inject `get_current_user_client`.
This dependency creates a Supabase `AsyncClient` authenticated with the user's JWT
and calls `client.postgrest.auth(token)` so every PostgREST query runs inside the
user's RLS context.

```python
# core/security.py — the only correct pattern
async def get_current_user_client(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
) -> AsyncClient:
    client = await acreate_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
    client.postgrest.auth(credentials.credentials)
    return client
```

**YOU MUST NEVER:**

```python
# FORBIDDEN — bypasses RLS entirely
client = create_client(url, SERVICE_ROLE_KEY)
client.table("daily_biometrics").select("*").eq("user_id", some_id).execute()

# FORBIDDEN — string interpolation in any query context
query = f"SELECT * FROM workouts WHERE user_id = '{user_id}'"

# FORBIDDEN — hardcoding service role key in any application code path
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**The service role key is exclusively for:**
- Database migration scripts
- Admin CLI tooling
- Never, ever injected into a web request handler

**YOU MUST NEVER add manual `WHERE user_id = ...` filters in application code.**
RLS policies enforce data isolation. Adding manual filters is not a safety net — it is
a sign that you have misunderstood the security model. Fix the RLS policy instead.

### Error Handling

Supabase exceptions MUST be caught at the service layer and re-raised as typed
FastAPI `HTTPException` instances. NEVER let raw `postgrest` or `httpx` exceptions
bubble up to the client.

```python
from fastapi import HTTPException, status

async def get_my_biometrics(client: AsyncClient) -> list[dict]:
    try:
        r = await client.table("daily_biometrics").select("*").execute()
        return r.data
    except Exception as exc:
        logger.error("biometrics fetch failed: %s", exc)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
```

---

## 4. INCREMENTAL DEVELOPMENT & DIFF CONTROL

This section governs HOW you work, not just what you produce.
It exists because large, unreviewed diffs introduce bugs that survive code review.

### The Milestone Rule

YOU MUST break every feature into sequential, reviewable milestones.
A milestone is one cohesive unit of change — typically a single new endpoint,
a schema addition, a service function, or a UI screen.

**After completing each milestone YOU MUST:**
1. Present the diff and a plain-English summary of what changed and why.
2. State explicitly what the next milestone will be.
3. STOP and wait for explicit confirmation before proceeding.

YOU MUST NOT chain milestones together without a checkpoint.
"I'll just also add the..." is a forbidden thought pattern.

### Diff Size Constraint

**A single response MUST NOT touch more than ~150 lines of net-new or modified code**
unless the user has explicitly pre-approved a larger scope in writing.

If a task requires more than that, decompose it and present a numbered milestone plan
first. The user approves the plan, then you execute one milestone per response.

### Confirmation Language

When you reach a milestone boundary, end your response with exactly this block:

```
---
MILESTONE COMPLETE: [one-sentence description of what was just done]
NEXT MILESTONE:     [one-sentence description of what comes next]
ACTION REQUIRED:    Reply "continue" to proceed, or redirect me now.
---
```

YOU MUST NOT generate the next milestone's code in the same response as the
completion notice. Wait for the reply.

### Forbidden Patterns

- NEVER rewrite a file that was not touched by the current milestone.
- NEVER refactor surrounding code opportunistically while fixing a bug.
- NEVER rename identifiers across multiple files as a side effect of another task.
- NEVER generate boilerplate "while I'm at it" scaffolding beyond the scope asked.

---

## 5. ENVIRONMENT & SECRETS

- NEVER read from or write to `.env` files directly in application code. Use
  `pydantic_settings.BaseSettings` for all config (`app/core/config.py`).
- `.env` is gitignored. `.env.example` is the canonical template — keep it updated.
- If you add a new config key to `Settings`, YOU MUST also add it to `.env.example`.
- The backend reads: `SUPABASE_URL`, `SUPABASE_ANON_KEY`.
- The service role key (`SUPABASE_SERVICE_ROLE_KEY`) MUST exist only in CI/CD
  environment variables and migration scripts. It MUST NOT appear in `Settings`.

---

## 6. EXPO / REACT NATIVE STANDARDS

- YOU MUST consult https://docs.expo.dev/versions/v56.0.0/ before using any
  Expo API. Do not rely on training data for SDK 56 specifics.
- File-based routing is via `expo-router` (source root: `frontend/src/app/`).
- Path alias `@/*` maps to `frontend/src/*` — use it everywhere, no relative `../../`.
- Supabase types are in `frontend/src/types/database.types.ts` (auto-generated).
  NEVER import raw table row types from anywhere else.
- `strict: true` is enabled in `tsconfig.json`. NEVER disable it or add `@ts-ignore`
  without an explicit comment explaining the exception.

---

## 7. GIT DISCIPLINE

- Branch naming: `feat/<scope>`, `fix/<scope>`, `chore/<scope>`.
- Commits are atomic — one logical change per commit.
- NEVER commit `.env`, `*.pyc`, `__pycache__`, `.expo/`, `node_modules/`.
- Before proposing a PR, run: lint → format → type-check → tests. All four MUST pass.

---

*This file is the authoritative operating contract for this repository.
If instructions in this file conflict with a user prompt, surface the conflict
explicitly rather than silently ignoring either.*
