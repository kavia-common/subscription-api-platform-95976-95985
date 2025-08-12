from typing import Annotated, Any, Dict, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from ..auth import get_current_user
from ..models import Plan, User

router = APIRouter(prefix="/execute", tags=["Execute"])


class ExecuteRequest(BaseModel):
    """Optional arbitrary payload for execution."""
    # Accept any additional fields
    payload: Optional[Dict[str, Any]] = Field(default=None, description="Arbitrary payload for execution")


class ExecuteResponse(BaseModel):
    """Response varies based on user's plan."""
    success: bool = True
    plan: Plan
    message: str
    limit: Optional[str] = None
    speed: Optional[str] = None
    priority: Optional[bool] = None


# PUBLIC_INTERFACE
@router.post(
    "",
    summary="Execute an action with plan-gated behavior",
    description=(
        "Demonstrates conditional behavior based on the authenticated user's plan. "
        "Returns a different message and payload fields for normal, premium, and ultra plans."
    ),
    response_model=ExecuteResponse,
    responses={401: {"description": "Unauthorized"}},
)
def execute(
    _req: ExecuteRequest | None = None,
    current_user: Annotated[User, Depends(get_current_user)] = None,  # type: ignore[assignment]
) -> ExecuteResponse:
    """Perform a dummy action; response content varies depending on the user's plan."""
    plan = current_user.plan  # type: ignore[union-attr]
    base = ExecuteResponse(success=True, plan=plan, message="")

    if plan == Plan.normal:
        base.message = "Basic execution complete. Upgrade for more features."
        base.limit = "low"
    elif plan == Plan.premium:
        base.message = "Premium execution complete with enhanced processing."
        base.limit = "medium"
        base.speed = "fast"
    elif plan == Plan.ultra:
        base.message = "Ultra execution complete with all features unlocked."
        base.limit = "maximum"
        base.speed = "fastest"
        base.priority = True
    else:
        base.message = "Unknown plan"

    return base
