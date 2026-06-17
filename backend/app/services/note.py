from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.note import Note
from app.schemas.note import NoteCreate, NoteUpdate


def get_all(db: Session, user_id: int) -> list[Note]:
    return db.query(Note).filter(Note.user_id == user_id).all()


def get_by_id(db: Session, note_id: int, user_id: int) -> Note:
    note = db.query(Note).filter(
        Note.id == note_id,
        Note.user_id == user_id
    ).first()

    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


def create(db: Session, data: NoteCreate, user_id: int) -> Note:
    note = Note(**data.model_dump(), user_id=user_id)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


def update(db: Session, note_id: int, data: NoteUpdate, user_id: int) -> Note:
    note = get_by_id(db, note_id, user_id)
    note.title = data.title
    note.content = data.content
    db.commit()
    db.refresh(note)
    return note


def delete(db: Session, note_id: int, user_id: int) -> None:
    note = get_by_id(db, note_id, user_id)
    db.delete(note)
    db.commit()