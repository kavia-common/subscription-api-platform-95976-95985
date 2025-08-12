from contextlib import contextmanager
from typing import Iterator

from sqlalchemy import Engine
from sqlmodel import Session, SQLModel, create_engine

from .config import get_settings


def _make_engine() -> Engine:
    settings = get_settings()
    connect_args = {}
    if settings.DATABASE_URL.startswith("sqlite"):
        # Needed for SQLite in multi-threaded frameworks like FastAPI/uvicorn
        connect_args = {"check_same_thread": False}
    return create_engine(settings.DATABASE_URL, connect_args=connect_args)


# Lazy-initialized engine
_engine: Engine | None = None


# PUBLIC_INTERFACE
def get_engine() -> Engine:
    """Get or create the global SQLAlchemy engine instance."""
    global _engine
    if _engine is None:
        _engine = _make_engine()
    return _engine


# PUBLIC_INTERFACE
def create_db_and_tables() -> None:
    """Create database tables if they do not exist."""
    from . import models  # ensure models are imported so SQLModel knows about them

    SQLModel.metadata.create_all(get_engine())


# PUBLIC_INTERFACE
def get_session() -> Iterator[Session]:
    """FastAPI dependency that yields a SQLModel Session tied to the global engine."""
    with Session(get_engine()) as session:
        yield session
