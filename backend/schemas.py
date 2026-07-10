from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# ── Auth ──────────────────────────────────────
class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
  
    user_id: Optional[int] = None
    email: Optional[str] = None


# ── Notes ──────────────────────────────────────
class NoteCreate(BaseModel):
    title: str
    content: str


class NoteUpdate(BaseModel):
    title: str
    content: str


class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}