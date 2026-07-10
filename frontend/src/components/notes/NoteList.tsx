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
  const { data: notes, isLoading, isError, error, refetch } = useNotes();
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  if (isLoading) {
    return <NotesSkeleton />;
  }

  if (isError) {
    return (
      <NotesError
        message={error.message}
        onRetry={refetch}
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
            border border-amber-200/50
            bg-white
            p-0
            overflow-hidden
            shadow-2xl
          "
        >
          <DialogHeader className="border-b border-amber-100 bg-amber-50/50 px-6 py-4">
            <DialogTitle className="text-amber-950 font-bold text-base flex items-center gap-2">
              Edit Note <span className="text-[10px] font-bold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-md uppercase tracking-wider">✏️ Mode</span>
            </DialogTitle>
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
