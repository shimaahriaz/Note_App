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

export const noteKeys = {
  all: ["notes"] as const,
  detail: (id: number) => ["notes", id] as const,
}

export function useNotes() {
  return useQuery({
    queryKey: noteKeys.all,
    queryFn: notesApi.getAll,
  })
}

export function useNote(id: number) {
  return useQuery({
    queryKey: noteKeys.detail(id),
    queryFn: () => notesApi.getById(id),
    enabled: !!id,
  })
}

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
          id: -Date.now(),
          user_id: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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

export function useUpdateNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateNoteDTO }) => {
      const result = await updateNoteAction(id, data)
      if (result.error) throw new Error(result.error)
      return result.data!
    },

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: noteKeys.all })

      const previousNotes = queryClient.getQueryData<Note[]>(noteKeys.all)

      queryClient.setQueryData<Note[]>(noteKeys.all, (old = []) =>
        old.map((note) =>
          note.id === id ? { ...note, ...data } : note
        )
      )

      return { previousNotes }
    },

    onError: (_err, { id: _id }, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(noteKeys.all, context.previousNotes)
      }
      toast.error("Failed to update note")
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: noteKeys.all })
    },
  })
}

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
