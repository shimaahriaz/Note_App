from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.auth import UserCreate, GoogleAuthRequest
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token


def _make_tokens(user: User) -> dict:
    data = {"user_id": user.id, "email": user.email}
    return {
        "access_token": create_access_token(data),
        "refresh_token": create_refresh_token(data),
    }


def register_user(db: Session, data: UserCreate) -> User:
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    user = User(
        email=data.email,
        hashed_password=hash_password(data.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def login_user(db: Session, data: UserCreate) -> dict:
    user = db.query(User).filter(User.email == data.email).first()

    # Guard against None hashed_password (OAuth-only accounts) before calling verify_password
    if not user or not user.hashed_password or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    return _make_tokens(user)


def google_auth(db: Session, data: GoogleAuthRequest) -> dict:
    user = db.query(User).filter(
        (User.google_id == data.google_id) |
        (User.email == data.email)
    ).first()

    if not user:
        user = User(email=data.email, google_id=data.google_id)
        db.add(user)
        db.commit()
        db.refresh(user)
    elif not user.google_id:
        user.google_id = data.google_id
        db.commit()

    return _make_tokens(user)
