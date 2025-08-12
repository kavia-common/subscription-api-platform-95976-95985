import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .db import create_db_and_tables
from .routers import auth as auth_router
from .routers import user as user_router
from .routers import plan as plan_router
from .routers import execute as execute_router


def _build_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    tags_metadata = [
        {"name": "Auth", "description": "User signup and login"},
        {"name": "User", "description": "User profile"},
        {"name": "Plan", "description": "Plan management"},
        {"name": "Execute", "description": "Plan-dependent API behavior"},
    ]

    app = FastAPI(
        title="Subscription API Platform - Backend (FastAPI)",
        version="1.0.0",
        description=(
            "API with JWT authentication, user & plan management, and a single endpoint "
            "with plan-dependent behavior."
        ),
        docs_url="/api/docs",
        redoc_url=None,
        openapi_url="/api/openapi.json",
        openapi_tags=tags_metadata,
    )

    settings = get_settings()

    # CORS
    allow_all = settings.CORS_ORIGINS == ["*"]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"] if allow_all else settings.CORS_ORIGINS,
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Healthcheck
    @app.get("/healthz", tags=["User"], summary="Health check")
    def healthz():
        """Simple health check endpoint."""
        return {"status": "ok"}

    # Route registration under /api
    app.include_router(auth_router.router, prefix="/api")
    app.include_router(user_router.router, prefix="/api")
    app.include_router(plan_router.router, prefix="/api")
    app.include_router(execute_router.router, prefix="/api")

    return app


# PUBLIC_INTERFACE
def create_app() -> FastAPI:
    """Public factory to create the FastAPI app with database initialization."""
    # Load .env for local/dev scenarios
    load_dotenv()
    create_db_and_tables()
    return _build_app()


# For uvicorn: uvicorn fastapi_app.main:app --reload --port 4003
app = create_app()
