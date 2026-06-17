export interface Note {
  id: number
  title: string
  content: string
  user_id: number
  created_at: string
  updated_at: string
}

export type CreateNoteDTO = {
  title: string
  content: string
}

export type UpdateNoteDTO = CreateNoteDTO

export type NotesResponse = Note[]
