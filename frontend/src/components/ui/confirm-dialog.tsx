"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isLoading = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent
    className="
      rounded-2xl
      border border-amber-200
      bg-amber-50
      p-0
      pb-2
      overflow-hidden
    "
  >
    {/* Header */}
    <DialogHeader className=" px-2 py-4">
      <DialogTitle className="text-amber-900">
        {title}
      </DialogTitle>

      <DialogDescription className="text-amber-700">
        {description}
      </DialogDescription>
    </DialogHeader>

    {/* Footer */}
    <DialogFooter className="flex gap-2 px-6 py-4 border-t border-amber-200 justify-end">
      <DialogClose asChild>
        <Button
          variant="outline"
          size="sm"
          className="
            border-amber-200
            bg-white/60
            hover:bg-amber-100
            text-amber-900
            cursor-pointer
          "
        >
          {cancelText}
        </Button>
      </DialogClose>

      <Button
        size="sm"
        disabled={isLoading}
        onClick={onConfirm}
        className="
          bg-red-500
          text-white
          hover:bg-red-600
          transition
          cursor-pointer
        "
      >
        {isLoading ? "Deleting..." : confirmText}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
  );
}
