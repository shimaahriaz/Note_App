from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db, get_current_user_id
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse
from app.services import note as note_service

router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("", response_model=list[NoteResponse])
def get_notes(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    return note_service.get_all(db, user_id)


@router.get("/{note_id}", response_model=NoteResponse)
def get_note(
    note_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    return note_service.get_by_id(db, note_id, user_id)


@router.post("", response_model=NoteResponse)
def create_note(
    data: NoteCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    return note_service.create(db, data, user_id)


@router.put("/{note_id}", response_model=NoteResponse)
def update_note(
    note_id: int,
    data: NoteUpdate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    return note_service.update(db, note_id, data, user_id)


@router.delete("/{note_id}")
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    note_service.delete(db, note_id, user_id)
    return {"message": "Note deleted successfully"}
