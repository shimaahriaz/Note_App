"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateNote, useUpdateNote } from "@/hooks/useNotes";
import { noteSchema, type NoteFormValues } from "@/lib/validations/note";
import type { Note } from "@/types/note";
import { askAiAction } from "@/actions/notes";
import {
  Sparkles,
  SendHorizonal,
  Bot,
  BrainCircuit,
  Copy,
  Check,
  RefreshCw,
  CornerDownLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface NoteFormProps {
  note?: Note;
  onSuccess?: () => void;
}

export function NoteForm({ note, onSuccess }: NoteFormProps) {
  const isEditing = !!note;
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [aiUpdatedContent, setAiUpdatedContent] = useState<string | null>(null);
  const [aiUpdatedTitle, setAiUpdatedTitle] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { mutate: createNote, isPending: isCreating } = useCreateNote();
  const { mutate: updateNote, isPending: isUpdating } = useUpdateNote();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: note?.title ?? "",
      content: note?.content ?? "",
    },
  });

  const titleValue = watch("title");
  const contentValue = watch("content");

  async function handleAskAi(prompt?: string) {
    const message = (prompt ?? aiInput).trim();
    if (!message) {
      setAiError("Type a question for the AI assistant.");
      return;
    }

    if (!isEditing || !note?.id) {
      setAiError("Save this note first to use the AI assistant.");
      setIsAiOpen(true);
      return;
    }

    setIsAiLoading(true);
    setAiError(null);
    setAiReply("");
    setAiUpdatedContent(null);
    setAiUpdatedTitle(null);

    const result = await askAiAction(note.id, message, contentValue, titleValue);

    if (result.error || !result.data) {
      setAiError(result.error ?? "Unable to ask AI right now.");
    } else {
      setAiReply(result.data.reply);
      setAiUpdatedContent(result.data.updated_content ?? null);
      setAiUpdatedTitle(result.data.updated_title ?? null);
      setAiInput("");
    }

    setIsAiLoading(false);
  }

  const handleCopy = () => {
    if (!aiReply) return;
    navigator.clipboard.writeText(aiReply);
    setCopied(true);
    toast.success("Copied AI reply to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReplace = () => {
    const newContent = aiUpdatedContent ?? aiReply;
    if (!newContent) return;
    setValue("content", newContent, {
      shouldDirty: true,
      shouldValidate: true,
    });
    if (aiUpdatedTitle) {
      setValue("title", aiUpdatedTitle, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
    toast.success("Note content updated with AI suggestion");
  };

  const handleInsert = () => {
    const newContent = aiUpdatedContent ?? aiReply;
    if (!newContent) return;
    setValue("content", contentValue ? `${contentValue}\n\n${newContent}` : newContent, {
      shouldDirty: true,
      shouldValidate: true,
    });
    toast.success("AI suggestion inserted at the end of the note");
  };

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
      {!isEditing && (
        <div className="animate-in fade-in duration-200">
          <h2 className="text-xl font-extrabold text-amber-950 flex items-center gap-2">
            New Note <span className="text-base">📝</span>
          </h2>
          <p className="text-xs font-medium text-amber-700">
            Capture your thoughts and ideas.
          </p>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-amber-900/80 px-0.5">Title</label>
        <Input
          placeholder="Note title..."
          disabled={isPending}
          {...register("title")}
          className="
            border-amber-200/80
            bg-white/80
            backdrop-blur-xs
            focus-visible:ring-amber-500
            focus-visible:border-amber-500
            hover:border-amber-300
            transition-colors
            shadow-inner-sm
          "
        />
        {errors.title && (
          <p className="text-xs font-semibold text-red-500 pl-1 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-amber-900/80 px-0.5">Content</label>
        <Textarea
          placeholder="Write your thoughts here..."
          rows={6}
          disabled={isPending}
          {...register("content")}
          className="
            resize-none
            border-amber-200/80
            bg-white/80
            backdrop-blur-xs
            focus-visible:ring-amber-500
            focus-visible:border-amber-500
            hover:border-amber-300
            transition-colors
            shadow-inner-sm
          "
        />
        {errors.content && (
          <p className="text-xs font-semibold text-red-500 pl-1 mt-1">{errors.content.message}</p>
        )}
      </div>

      <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 p-5 shadow-md backdrop-blur-xs transition-all duration-300">
        <button
          type="button"
          onClick={() => setIsAiOpen((prev) => !prev)}
          className="flex w-full items-center justify-between text-sm font-bold text-amber-950 transition-colors hover:text-amber-700 font-sans"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 shadow-inner">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <span className="text-sm tracking-tight">Ask AI assistant</span>
            <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-700 uppercase">Gemini 3.5</span>
          </div>
          {isAiOpen ? (
            <ChevronUp className="h-4 w-4 text-amber-600" />
          ) : (
            <ChevronDown className="h-4 w-4 text-amber-600" />
          )}
        </button>

        {isAiOpen && (
          <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-wrap gap-2">
              {[
                "Summarize this note",
                "Make this more professional",
                "Turn this into bullet points",
              ].map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleAskAi(prompt)}
                  className="rounded-full border border-amber-200/80 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-amber-950 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-100 hover:border-amber-300 hover:shadow-md active:translate-y-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Ask AI anything about this note..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="border-amber-200 bg-white/90 pr-10 shadow-inner focus-visible:ring-amber-400"
                />
                <Sparkles className="absolute right-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-amber-400 animate-pulse" />
              </div>
              <Button
                type="button"
                onClick={() => handleAskAi()}
                disabled={isAiLoading}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-md transition-all active:scale-95 duration-200 cursor-pointer"
              >
                {isAiLoading ? (
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.3s]"></span>
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.15s]"></span>
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white"></span>
                  </div>
                ) : (
                  <SendHorizonal className="h-4 w-4" />
                )}
              </Button>
            </div>

            {aiError && (
              <p className="text-xs font-semibold text-red-500 flex items-center gap-1.5 pl-1">
                ⚠️ {aiError}
              </p>
            )}

            {aiReply && (
              <div className="relative rounded-2xl border border-amber-200/50 bg-white/95 p-4.5 shadow-md animate-in zoom-in-95 duration-200">
                <div className="mb-3.5 flex items-center justify-between border-b border-amber-100 pb-2.5">
                  <span className="flex items-center gap-2 font-bold text-amber-950 text-xs uppercase tracking-wider">
                    <Bot className="h-4 w-4 text-amber-600" />
                    AI Response
                  </span>
                  
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-slate-50 border border-slate-100 text-slate-500 shadow-sm transition active:scale-95 cursor-pointer"
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-green-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
                
                <p className="whitespace-pre-wrap leading-relaxed text-slate-800 text-sm font-medium pr-1 mb-4 select-text">
                  {aiReply}
                </p>

                <div className="flex gap-2 justify-end border-t border-amber-100/50 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReplace}
                    className="h-8 gap-1.5 px-3 text-[11px] font-bold border-amber-200 bg-amber-50/50 hover:bg-amber-100 text-amber-900 shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Replace Note
                  </Button>
                  <Button
                    type="button"
                    onClick={handleInsert}
                    className="h-8 gap-1.5 px-3 text-[11px] font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    <CornerDownLeft className="h-3.5 w-3.5" />
                    Insert at End
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="
          w-full
          bg-gradient-to-r from-amber-500 to-orange-500
          text-white font-bold text-sm
          hover:from-amber-600 hover:to-orange-600
          shadow-md shadow-amber-500/10 hover:shadow-lg hover:shadow-amber-500/20
          active:scale-[0.99]
          transition-all duration-200
          cursor-pointer
          py-2.5 rounded-xl
        "
      >
        {isPending ? "Saving..." : isEditing ? "Update Note" : "Create Note"}
      </Button>
    </form>
  );
}
