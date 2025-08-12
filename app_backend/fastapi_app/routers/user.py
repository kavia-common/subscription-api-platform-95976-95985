from typing import Annotated

from fastapi import APIRouter, Depends
from ..auth import get_current_user
from ..models import User, UserRead

router = APIRouter(prefix="/user", tags=["User"])


# PUBLIC_INTERFACE
@router.get(
    "/me",
    summary="Get current user",
    description="Returns the authenticated user's profile.",
    response_model=UserRead,
    responses={401: {"description": "Unauthorized"}},
)
def get_me(current_user: Annotated[User, Depends(get_current_user)]) -> UserRead:
    """Return the profile of the currently authenticated user."""
    return UserRead(
        id=current_user.id,
        email=current_user.email,
        plan=current_user.plan,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at,
    )
