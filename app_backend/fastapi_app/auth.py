from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext
from sqlmodel import Session, select

from .config import get_settings
from .db import get_session
from .models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer(auto_error=True)


# PUBLIC_INTERFACE
def hash_password(plain_password: str) -> str:
    """Hash a plain text password using bcrypt."""
    return pwd_context.hash(plain_password)


# PUBLIC_INTERFACE
def verify_password(plain_password: str, password_hash: str) -> bool:
    """Verify a plain password against its hashed value."""
    return pwd_context.verify(plain_password, password_hash)


# PUBLIC_INTERFACE
def create_access_token(*, uid: str, email: str) -> str:
    """Create a signed JWT access token with expiration."""
    settings = get_settings()
    if not settings.SECRET_KEY:
        raise RuntimeError("SECRET_KEY is not configured")
    expire_minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES
    payload = {
        "uid": uid,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=expire_minutes),
        "iat": datetime.now(timezone.utc),
        "nbf": datetime.now(timezone.utc),
        "type": "access",
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    return token


# PUBLIC_INTERFACE
def decode_token(token: str) -> dict:
    """Decode and verify a JWT token, returning its payload."""
    settings = get_settings()
    if not settings.SECRET_KEY:
        raise RuntimeError("SECRET_KEY is not configured")
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")


# PUBLIC_INTERFACE
def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(bearer_scheme)],
    session: Annotated[Session, Depends(get_session)],
) -> User:
    """FastAPI dependency that returns the currently authenticated user from the JWT Bearer token."""
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid Authorization header")
    payload = decode_token(credentials.credentials)
    uid = payload.get("uid")
    if not uid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    user = session.get(User, uid)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user
```

Explanation: Auth routes for signup and login with OpenAPI docs
````write file="subscription-api-platform-95976-95985/app_backend/fastapi_app/routers/auth.py"
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlmodel import Session, select

from ..auth import create_access_token, hash_password, verify_password
from ..db import get_session
from ..models import TokenResponse, User, UserRead, Plan

router = APIRouter(prefix="/auth", tags=["Auth"])


class SignupRequest(BaseModel):
    """Request body for user signup."""
    email: EmailStr = Field(..., description="User email")
    password: str = Field(..., min_length=6, description="User password (min 6 chars)")
    plan: Optional[Plan] = Field(default=Plan.normal, description="Starting plan")


class LoginRequest(BaseModel):
    """Request body for user login."""
    email: EmailStr = Field(..., description="User email")
    password: str = Field(..., min_length=6, description="User password (min 6 chars)")


# PUBLIC_INTERFACE
@router.post(
    "/signup",
    summary="User signup",
    description="Create a new user with an initial plan and receive a JWT token.",
    response_model=TokenResponse,
    responses={
        200: {"description": "Signup successful"},
        400: {"description": "Validation error"},
        409: {"description": "Email already exists"},
    },
)
def signup(payload: SignupRequest, session: Annotated[Session, Depends(get_session)]) -> TokenResponse:
    """Create a user, return signed JWT token and user object."""
    # Check for existing user
    exists = session.exec(select(User).where(User.email == payload.email)).first()
    if exists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(
        email=payload.email,
        password_hash=hash_password(payload.password),
        plan=payload.plan or Plan.normal,
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    token = create_access_token(uid=str(user.id), email=user.email)
    return TokenResponse(
        token=token,
        user=UserRead(
            id=user.id,
            email=user.email,
            plan=user.plan,
            created_at=user.created_at,
            updated_at=user.updated_at,
        ),
    )


# PUBLIC_INTERFACE
@router.post(
    "/login",
    summary="User login",
    description="Authenticate a user by email/password and receive a JWT token.",
    response_model=TokenResponse,
    responses={
        200: {"description": "Login successful"},
        401: {"description": "Invalid credentials"},
    },
)
def login(payload: LoginRequest, session: Annotated[Session, Depends(get_session)]) -> TokenResponse:
    """Authenticate user and return JWT token and user profile."""
    user = session.exec(select(User).where(User.email == payload.email)).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token(uid=str(user.id), email=user.email)
    return TokenResponse(
        token=token,
        user=UserRead(
            id=user.id,
            email=user.email,
            plan=user.plan,
            created_at=user.created_at,
            updated_at=user.updated_at,
        ),
    )
