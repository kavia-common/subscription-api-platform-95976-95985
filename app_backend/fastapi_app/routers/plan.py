from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlmodel import Session

from ..auth import get_current_user
from ..db import get_session
from ..models import Plan, User, UserRead

router = APIRouter(prefix="/plan", tags=["Plan"])


class PlanResponse(BaseModel):
    """Response schema for returning the current plan."""
    plan: Plan = Field(..., description="The user's current subscription plan")


class UpdatePlanRequest(BaseModel):
    """Request schema for updating the user's plan."""
    plan: Plan = Field(..., description="New plan value")


# PUBLIC_INTERFACE
@router.get(
    "",
    summary="Get user plan",
    description="Returns the current subscription plan for the authenticated user.",
    response_model=PlanResponse,
    responses={401: {"description": "Unauthorized"}},
)
def get_plan(current_user: Annotated[User, Depends(get_current_user)]) -> PlanResponse:
    """Return the authenticated user's current plan."""
    return PlanResponse(plan=current_user.plan)


# PUBLIC_INTERFACE
@router.put(
    "",
    summary="Update user plan",
    description="Change the authenticated user's subscription plan.",
    response_model=UserRead,
    responses={400: {"description": "Validation error"}, 401: {"description": "Unauthorized"}},
)
def update_plan(
    payload: UpdatePlanRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
) -> UserRead:
    """Update the user's plan and return the updated user profile."""
    if payload.plan not in {Plan.normal, Plan.premium, Plan.ultra}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid plan")

    current_user.plan = payload.plan
    session.add(current_user)
    session.commit()
    session.refresh(current_user)

    return UserRead(
        id=current_user.id,
        email=current_user.email,
        plan=current_user.plan,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at,
    )
