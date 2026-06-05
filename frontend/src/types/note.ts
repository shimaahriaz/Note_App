export interface Note {
  id: number
  title: string
  content: string
}

export type CreateNoteDTO = {
  title: string
  content: string
}

export type UpdateNoteDTO = Partial<CreateNoteDTO>

export type NotesResponse = Note[]