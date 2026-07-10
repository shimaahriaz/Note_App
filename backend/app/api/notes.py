from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.deps import get_db, get_current_user_id
from app.models.note import Note
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse
from app.services import note as note_service
from app.services.ai_service import summarize_note, generate_ai_reply


class AIChatRequest(BaseModel):
    message: str
    draft_content: str | None = None
    draft_title: str | None = None


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


@router.post("/{note_id}/summarize")
def summarize(
    note_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == user_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    summary = summarize_note(note.content)
    return {"summary": summary}


@router.post("/{note_id}/ai-chat")
def ai_chat(
    note_id: int,
    payload: AIChatRequest,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    note = db.query(Note).filter(Note.id == note_id, Note.user_id == user_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    reply = generate_ai_reply(
        note.content,
        payload.message,
        payload.draft_content,
        payload.draft_title,
    )
    return reply