"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { notesApi } from "@/lib/api/notes"
import {
  createNoteAction,
  updateNoteAction,
  deleteNoteAction,
} from "@/actions/notes"

import { toast } from "sonner"
import type { CreateNoteDTO, UpdateNoteDTO, Note } from "@/types/note"

// ─── Query Keys ───────────────────────────────────────
export const noteKeys = {
  all: ["notes"] as const,
  detail: (id: number) => ["notes", id] as const,
}

// ─── GET ALL ───────────────────────────────────────────
export function useNotes() {
  return useQuery({
    queryKey: noteKeys.all,
    queryFn: notesApi.getAll,
    staleTime: 60 * 1000,
  })
}

// ─── GET BY ID ─────────────────────────────────────────
export function useNote(id: number) {
  return useQuery({
    queryKey: noteKeys.detail(id),
    queryFn: () => notesApi.getById(id),
    enabled: !!id,
  })
}

// ─── CREATE ────────────────────────────────────────────
export function useCreateNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateNoteDTO) => {
      const result = await createNoteAction(data)
      if (result.error) throw new Error(result.error)
      return result.data!
    },

    onMutate: async (newNote) => {
      await queryClient.cancelQueries({ queryKey: noteKeys.all })
      const previousNotes = queryClient.getQueryData<Note[]>(noteKeys.all)

      queryClient.setQueryData<Note[]>(noteKeys.all, (old = []) => [
        ...old,
        {
          id: Date.now(),
          ...newNote,
         
        },
      ])

      return { previousNotes }
    },

    onError: (err, _data, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(noteKeys.all, context.previousNotes)
      }
      toast.error(err.message ?? "Failed to create note")
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all })
    },
  })
}

// ─── UPDATE ────────────────────────────────────────────
export function useUpdateNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateNoteDTO }) => {
      const result = await updateNoteAction(id, data)
      if (result.error) throw new Error(result.error)
      return result.data!
    }, 
    
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: noteKeys.detail(id) })
      await queryClient.cancelQueries({ queryKey: noteKeys.all })

      const previousNote = queryClient.getQueryData<Note>(noteKeys.detail(id))
      const previousNotes = queryClient.getQueryData<Note[]>(noteKeys.all)

      
      queryClient.setQueryData<Note>(noteKeys.detail(id), (old) =>
        old ? { ...old, ...data } : old
      )

      queryClient.setQueryData<Note[]>(noteKeys.all, (old = []) =>
        old.map((note) =>
          note.id === id ? { ...note, ...data } : note
        )
      )

      return { previousNote, previousNotes }
    },

    onError: (err, { id }, context) => {
      if (context?.previousNote) {
        queryClient.setQueryData(noteKeys.detail(id), context.previousNote)
      }
      if (context?.previousNotes) {
        queryClient.setQueryData(noteKeys.all, context.previousNotes)
      }
      toast.error(err.message ?? "Failed to update note")
    },
    
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({
        queryKey: noteKeys.detail(id),
      })

      queryClient.invalidateQueries({
        queryKey: noteKeys.all,
      })
    },
  })
}

// ─── DELETE ────────────────────────────────────────────
export function useDeleteNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const result = await deleteNoteAction(id)
      if (result.error) throw new Error(result.error)
    },

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: noteKeys.all })
      const previousNotes = queryClient.getQueryData<Note[]>(noteKeys.all)

      queryClient.setQueryData<Note[]>(noteKeys.all, (old = []) =>
        old.filter((note) => note.id !== id)
      )

      return { previousNotes }
    },

    onError: (err, _id, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(noteKeys.all, context.previousNotes)
      }
      toast.error(err.message ?? "Failed to delete note")
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all })
    },
  })
}