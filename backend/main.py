from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal, engine, Base
from models import Note
from schemas import NoteCreate, NoteUpdate, NoteResponse
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)


# create tables
Base.metadata.create_all(bind=engine)

# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- CREATE ----------------
@app.post("/notes", response_model=NoteResponse)
def create_note(note: NoteCreate, db: Session = Depends(get_db)):

    db_note = Note(title=note.title, content=note.content)

    db.add(db_note)
    db.commit()
    db.refresh(db_note)

    return db_note


# ---------------- GET ALL ----------------
@app.get("/notes", response_model=list[NoteResponse])
def get_notes(db: Session = Depends(get_db)):

    return db.query(Note).all()


# ---------------- GET BY ID ----------------
@app.get("/notes/{note_id}", response_model=NoteResponse)
def get_note(note_id: int, db: Session = Depends(get_db)):

    note = db.query(Note).filter(Note.id == note_id).first()

    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    return note


# ---------------- UPDATE ----------------
@app.put("/notes/{note_id}", response_model=NoteResponse)
def update_note(note_id: int, note: NoteUpdate, db: Session = Depends(get_db)):

    db_note = db.query(Note).filter(Note.id == note_id).first()

    if not db_note:
        return {"message": "Note not found"}

    db_note.title = note.title
    db_note.content = note.content

    db.commit()
    db.refresh(db_note)

    return db_note


# ---------------- DELETE ----------------
@app.delete("/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):

    note = db.query(Note).filter(Note.id == note_id).first()

    if not note:
        return {"message": "Note not found"}

    db.delete(note)
    db.commit()

    return {"message": "Note deleted successfully"}