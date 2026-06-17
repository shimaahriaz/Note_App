from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.schemas.auth import UserCreate, UserResponse, Token, AccessToken, GoogleAuthRequest, RefreshRequest
from app.core.security import decode_token, create_access_token
from app.services import auth as auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse)
def register(data: UserCreate, db: Session = Depends(get_db)):
    return auth_service.register_user(db, data)


@router.post("/login", response_model=Token)
def login(data: UserCreate, db: Session = Depends(get_db)):
    return auth_service.login_user(db, data)


@router.post("/google", response_model=Token)
def google_login(data: GoogleAuthRequest, db: Session = Depends(get_db)):
    return auth_service.google_auth(db, data)


@router.post("/refresh", response_model=AccessToken)
def refresh_token(body: RefreshRequest):
    payload = decode_token(body.refresh_token)

    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    data = {"user_id": payload["user_id"], "email": payload["email"]}
    return {"access_token": create_access_token(data)}
