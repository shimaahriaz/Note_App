"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDeleteNote } from "@/hooks/useNotes";
import type { Note } from "@/types/note";
import { Pencil, Trash2 } from "lucide-react";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
}

export function NoteCard({ note, onEdit }: NoteCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: deleteNote, isPending } = useDeleteNote();

  function handleDelete() {
    deleteNote(note.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        toast.success("Note deleted ✅");
      },
      onError: (error) => {
        toast.error("Failed to delete note", {
          description: error.message,
        });
      },
    });
  }

  return (
    <Card
      className="
    h-full
    flex flex-col justify-between
    cursor-pointer
    bg-amber-50
    border-amber-200
    shadow-sm
    transition-all duration-200
    hover:-rotate-1
    hover:shadow-xl
  "
    >
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800 line-clamp-1">
          Title: {note.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-slate-600 line-clamp-4">
          Content: {note.content}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="flex gap-2 cursor-pointer">
          <Button
            variant="outline"
            size="sm"
            className="
    flex-1
    cursor-pointer
    border-amber-300
    bg-white/70
    hover:bg-amber-100
    hover:border-amber-400
  "
            onClick={() => onEdit(note)}
            disabled={isPending}
          >
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button
            size="sm"
            className="
    flex-1
    bg-red-500
    text-white
    hover:bg-red-600
    cursor-pointer
  "
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isPending}
          >
            {isPending ? (
              "Deleting..."
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </div>
      </CardFooter>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Confirm Delete"
        description="Are you sure you want to delete this note? This action cannot be undone."
        onConfirm={handleDelete}
        isLoading={isPending}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </Card>
  );
}
