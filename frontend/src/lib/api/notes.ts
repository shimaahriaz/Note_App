import { apiClient } from "./client"
import type { Note, CreateNoteDTO, UpdateNoteDTO, NotesResponse } from "@/types/note"

export const notesApi = {

  getAll: async (): Promise<NotesResponse> => {
    const { data } = await apiClient.get<NotesResponse>("/notes")
    return data
  },

  getById: async (id: number): Promise<Note> => {
    const { data } = await apiClient.get<Note>(`/notes/${id}`)
    return data
  },

  create: async (note: CreateNoteDTO): Promise<Note> => {
    const { data } = await apiClient.post<Note>("/notes", note)
    return data
  },

  update: async (id: number, note: UpdateNoteDTO): Promise<Note> => {
    const { data } = await apiClient.put<Note>(`/notes/${id}`, note)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/notes/${id}`)
  },

}