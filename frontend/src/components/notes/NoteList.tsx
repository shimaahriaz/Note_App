"use client";

import { useState } from "react";
import { useNotes } from "@/hooks/useNotes";
import { NoteCard } from "./NoteCard";
import { NoteForm } from "./NoteForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Note } from "@/types/note";
import { NotesSkeleton } from "../states/NotesSkeleton";
import { NotesError } from "../states/NotesError";

interface NoteListProps {
  searchQuery: string;
}

export function NoteList({ searchQuery }: NoteListProps) {
  const { data: notes, isLoading, isError, error } = useNotes();
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  console.log(isLoading, isError, notes);
  // ─── Loading ───────────────────────────────────────
  if (isLoading) {
    return <NotesSkeleton />;
  }

  // ─── Error ─────────────────────────────────────────
  if (isError) {
    return (
      <NotesError
        message={error.message}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // ─── Filter ────────────────────────────────────────
  const filtered = notes?.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // ─── Empty ─────────────────────────────────────────
  if (!filtered?.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>
          {searchQuery
            ? `No notes found for "${searchQuery}"`
            : "No notes yet. Create your first one!"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((note) => (
          <NoteCard key={note.id} note={note} onEdit={setEditingNote} />
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
        <DialogContent
          className="
    rounded-2xl
    border border-amber-200
    bg-amber-50
    p-0
    overflow-hidden
  "
        >
          <DialogHeader className="border-b border-amber-200 bg-amber-50 px-6 py-4">
            <DialogTitle className="text-amber-900">Edit Note</DialogTitle>
          </DialogHeader>
          {editingNote && (
            <NoteForm
              note={editingNote}
              onSuccess={() => setEditingNote(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
