"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateNote, useUpdateNote } from "@/hooks/useNotes";
import { noteSchema, type NoteFormValues } from "@/lib/validations/note";
import type { Note } from "@/types/note";

interface NoteFormProps {
  note?: Note;
  onSuccess?: () => void;
}

export function NoteForm({ note, onSuccess }: NoteFormProps) {
  const isEditing = !!note;

  const { mutate: createNote, isPending: isCreating } = useCreateNote();
  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: note?.title ?? "",
      content: note?.content ?? "",
    },
  });

  function onSubmit(values: NoteFormValues) {
    if (isEditing) {
      updateNote(
        { id: note.id, data: values },
        {
          onSuccess: () => {
            toast.success("Note updated ");
            onSuccess?.();
          },
          onError: (error) => {
            toast.error("Failed to update note", {
              description: error.message,
            });
          },
        },
      );
    } else {
      createNote(values, {
        onSuccess: () => {
          toast.success("Note created ✅");
          reset();
          onSuccess?.();
        },
        onError: (error) => {
          toast.error("Failed to create note", {
            description: error.message,
          });
        },
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-6 py-5">
      <div>
        <h2 className="text-xl font-bold text-amber-900">
          {isEditing ? "Edit Note ✏️" : "New Note 📝"}
        </h2>
        <p className="text-sm text-amber-700">
          Capture your thoughts and ideas.
        </p>
      </div>

      <div className="space-y-1">
        <Input
          placeholder="Note title..."
          disabled={isPending}
          {...register("title")}
          className="
    border-amber-200
    bg-white/70
    focus-visible:ring-amber-400
  "
        />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Textarea
          placeholder="Write your thoughts here..."
          rows={6}
          disabled={isPending}
          {...register("content")}
          className="
    resize-none
    border-amber-200
    bg-white/70
    focus-visible:ring-amber-400
  "
        />
        {errors.content && (
          <p className="text-xs text-red-500">{errors.content.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="
    w-full
    bg-amber-500
    text-white
    hover:bg-amber-600
    transition
    cursor-pointer
  "
      >
        {isPending ? "Saving..." : isEditing ? "Update Note" : "Create Note"}
      </Button>
    </form>
  );
}
