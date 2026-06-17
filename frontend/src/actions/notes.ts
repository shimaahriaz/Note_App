"use server"

import { auth } from "@/auth"
import type { CreateNoteDTO, UpdateNoteDTO, Note } from "@/types/note"

const API_URL = process.env.NEXT_PUBLIC_API_URL

async function getAuthHeader(): Promise<{ Authorization: string }> {
  const session = await auth()
  if (!session?.accessToken) throw new Error("Unauthorized")
  return { Authorization: `Bearer ${session.accessToken}` }
}

export async function createNoteAction(
  data: CreateNoteDTO
): Promise<{ data: Note | null; error: string | null }> {
  try {
    const authHeader = await getAuthHeader()
    const res = await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      return { data: null, error: err.detail ?? "Failed to create note" }
    }
    const note: Note = await res.json()
    return { data: note, error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to create note",
    }
  }
}

export async function updateNoteAction(
  id: number,
  data: UpdateNoteDTO
): Promise<{ data: Note | null; error: string | null }> {
  try {
    const authHeader = await getAuthHeader()
    const res = await fetch(`${API_URL}/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      return { data: null, error: err.detail ?? "Failed to update note" }
    }
    const note: Note = await res.json()
    return { data: note, error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Failed to update note",
    }
  }
}

export async function deleteNoteAction(
  id: number
): Promise<{ error: string | null }> {
  try {
    const authHeader = await getAuthHeader()
    const res = await fetch(`${API_URL}/notes/${id}`, {
      method: "DELETE",
      headers: authHeader,
    })
    if (!res.ok) {
      const err = await res.json()
      return { error: err.detail ?? "Failed to delete note" }
    }
    return { error: null }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete note",
    }
  }
}
