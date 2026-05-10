"use client";

import { useState, useTransition } from "react";
import { Plus, X, Save } from "lucide-react";

import { createTravelNote, updateTravelNote } from "@/actions/travel-notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NoteCard } from "./note-card";
import { RichTextEditor } from "./note-editor";

interface TravelNote {
  id: string;
  title: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NotesModuleProps {
  tripId: string;
  initialNotes: TravelNote[];
}

type EditorMode = { type: "closed" } | { type: "new" } | { type: "edit"; note: TravelNote };

export function NotesModule({ tripId, initialNotes }: NotesModuleProps) {
  const [notes, setNotes] = useState<TravelNote[]>(initialNotes);
  const [mode, setMode] = useState<EditorMode>({ type: "closed" });
  const [editorTitle, setEditorTitle] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openNew() {
    setEditorTitle("");
    setEditorContent("");
    setError(null);
    setMode({ type: "new" });
  }

  function openEdit(note: TravelNote) {
    setEditorTitle(note.title ?? "");
    setEditorContent(note.content);
    setError(null);
    setMode({ type: "edit", note });
  }

  function closeEditor() {
    setMode({ type: "closed" });
    setError(null);
  }

  function handleSave() {
    const strippedContent = editorContent.replace(/<[^>]*>/g, "").trim();
    if (!strippedContent) {
      setError("Note content cannot be empty.");
      return;
    }
    setError(null);

    if (mode.type === "new") {
      startTransition(async () => {
        try {
          const saved = await createTravelNote(tripId, editorTitle, editorContent);
          setNotes((prev) => [
            {
              ...saved,
              title: saved.title ?? null,
              createdAt: new Date(saved.createdAt),
              updatedAt: new Date(saved.updatedAt),
            },
            ...prev,
          ]);
          closeEditor();
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to save note.");
        }
      });
    } else if (mode.type === "edit") {
      const noteId = mode.note.id;
      startTransition(async () => {
        try {
          await updateTravelNote(noteId, editorTitle, editorContent);
          setNotes((prev) =>
            prev.map((n) =>
              n.id === noteId
                ? {
                    ...n,
                    title: editorTitle.trim() || null,
                    content: editorContent,
                    updatedAt: new Date(),
                  }
                : n,
            ),
          );
          closeEditor();
        } catch (e) {
          setError(e instanceof Error ? e.message : "Failed to update note.");
        }
      });
    }
  }

  const isEditorOpen = mode.type !== "closed";

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Travel Notes</h2>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </p>
        </div>
        <Button
          id="new-note-btn"
          onClick={openNew}
          disabled={isEditorOpen}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Note
        </Button>
      </div>

      {/* ── Editor Panel ─────────────────────────────────── */}
      {isEditorOpen && (
        <div className="bg-card rounded-xl border p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium">
              {mode.type === "new" ? "New Note" : "Edit Note"}
            </p>
            <button
              onClick={closeEditor}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close editor"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-3">
            <Input
              id="note-title-input"
              placeholder="Note title (optional)"
              value={editorTitle}
              onChange={(e) => setEditorTitle(e.target.value)}
              className="border-0 bg-transparent px-0 text-lg font-semibold shadow-none focus-visible:ring-0 placeholder:font-normal"
            />
          </div>

          <RichTextEditor
            value={editorContent}
            onChange={setEditorContent}
            placeholder="Write your travel memories, plans, or observations..."
            minHeight={240}
          />

          {error && (
            <p className="mt-2 text-xs text-destructive">{error}</p>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={closeEditor}>
              Cancel
            </Button>
            <Button
              id="save-note-btn"
              size="sm"
              onClick={handleSave}
              disabled={isPending}
              className="gap-2"
            >
              <Save className="h-3.5 w-3.5" />
              {isPending ? "Saving…" : "Save Note"}
            </Button>
          </div>
        </div>
      )}

      {/* ── Notes List ────────────────────────────────────── */}
      {notes.length === 0 && !isEditorOpen ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl">📔</span>
          <p className="mt-4 text-base font-medium">No notes yet</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Capture your travel memories, tips, and stories.
          </p>
          <Button className="mt-4 gap-2" onClick={openNew}>
            <Plus className="h-4 w-4" />
            Write your first note
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              {...note}
              onEdit={() => openEdit(note)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
