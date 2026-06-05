"use server"

import { revalidatePath } from "next/cache"
import { notesApi } from "@/lib/api/notes"
import type { CreateNoteDTO, UpdateNoteDTO } from "@/types/note"

export async function createNoteAction(data: CreateNoteDTO) {
  try {
    const note = await notesApi.create(data)
    revalidatePath("/")
    return { data: note, error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to create note",
    }
  }
}

export async function updateNoteAction(id: number, data: UpdateNoteDTO) {
  try {
    const note = await notesApi.update(id, data)
    revalidatePath("/")
    revalidatePath(`/notes/${id}`)
    return { data: note, error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to update note",
    }
  }
}

export async function deleteNoteAction(id: number) {
  try {
    await notesApi.delete(id)
    revalidatePath("/")
    return { error: null }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete note",
    }
  }
}