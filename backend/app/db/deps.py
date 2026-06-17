from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.core.security import decode_token

bearer_scheme = HTTPBearer()

_CREDENTIALS_EXCEPTION = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> int:
    """
    Validates the access token and returns the user_id claim.
    Does NOT query the database — use this for all note endpoints.
    """
    payload = decode_token(credentials.credentials)

    if not payload or payload.get("type") != "access":
        raise _CREDENTIALS_EXCEPTION

    user_id: int | None = payload.get("user_id")
    if not user_id:
        raise _CREDENTIALS_EXCEPTION

    return user_id


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    """
    Full user fetch — only use when you need the User ORM object.
    Adds one DB query per request; prefer get_current_user_id where possible.
    """
    from app.models.user import User

    user_id = get_current_user_id(credentials)

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise _CREDENTIALS_EXCEPTION

    return user
