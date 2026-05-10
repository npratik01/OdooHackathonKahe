"use client";

import { useState } from "react";
import { Edit3, Trash2, Clock } from "lucide-react";

import { deleteTravelNote } from "@/actions/travel-notes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NoteCardProps {
  id: string;
  title: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  onEdit: () => void;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function NoteCard({
  id,
  title,
  content,
  createdAt,
  updatedAt,
  onEdit,
}: NoteCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const preview = stripHtml(content).slice(0, 200);
  const isEdited =
    new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 1000;

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteTravelNote(id);
    } catch {
      setDeleting(false);
    }
  }

  return (
    <>
      <div
        className={cn(
          "group relative rounded-xl border p-5 transition-all duration-200",
          "bg-card hover:border-primary/30 hover:shadow-md",
          deleting && "pointer-events-none opacity-40",
        )}
      >
        {/* Header */}
        <div className="mb-3 flex items-start gap-2">
          <div className="flex-1">
            {title ? (
              <h3 className="truncate text-base font-semibold">{title}</h3>
            ) : (
              <h3 className="text-muted-foreground truncate text-base italic">
                Untitled note
              </h3>
            )}
            <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-xs">
              <Clock className="h-3 w-3" />
              <span>{formatDate(createdAt)}</span>
              {isEdited && (
                <span className="text-muted-foreground/60">
                  · edited {formatDate(updatedAt)}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={onEdit}
              aria-label="Edit note"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:text-destructive"
              onClick={() => setShowConfirm(true)}
              aria-label="Delete note"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Preview */}
        {preview ? (
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
            {preview}
            {stripHtml(content).length > 200 && "…"}
          </p>
        ) : (
          <p className="text-muted-foreground/40 text-sm italic">Empty note</p>
        )}
      </div>

      {/* Delete confirmation */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-card mx-4 max-w-sm rounded-2xl border p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold">Delete Note?</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              &ldquo;{title ?? "Untitled note"}&rdquo; will be permanently
              deleted.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
