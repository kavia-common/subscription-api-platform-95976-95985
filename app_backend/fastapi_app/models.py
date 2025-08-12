from __future__ import annotations

import uuid
from datetime import datetime, timezone
from enum import Enum
from typing import Optional

from sqlalchemy import Column, DateTime, UniqueConstraint
from sqlmodel import Field, SQLModel


def utcnow() -> datetime:
    """UTC now helper using timezone-aware datetime."""
    return datetime.now(timezone.utc)


class Plan(str, Enum):
    """Enumeration of supported subscription plans."""
    normal = "normal"
    premium = "premium"
    ultra = "ultra"


class User(SQLModel, table=True):
    """User table definition with plan-gated access."""
    __tablename__ = "users"
    __table_args__ = (UniqueConstraint("email", name="uq_users_email"),)

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    email: str = Field(index=True, nullable=False)
    password_hash: str = Field(nullable=False)
    plan: Plan = Field(default=Plan.normal, nullable=False)

    created_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), nullable=False, default=utcnow),
        default_factory=utcnow,
    )
    updated_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), nullable=False, default=utcnow, onupdate=utcnow),
        default_factory=utcnow,
    )


# Response schemas

class UserRead(SQLModel):
    """Public user response schema."""
    id: uuid.UUID
    email: str
    plan: Plan
    created_at: datetime
    updated_at: datetime


class TokenResponse(SQLModel):
    """Authentication response including JWT token and user object."""
    token: str
    user: UserRead
