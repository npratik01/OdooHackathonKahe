"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  AlignLeft,
  Undo2,
  Redo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolbarButton {
  command: string;
  value?: string;
  icon: React.ElementType;
  title: string;
}

const toolbarButtons: ToolbarButton[] = [
  { command: "bold", icon: Bold, title: "Bold" },
  { command: "italic", icon: Italic, title: "Italic" },
  { command: "underline", icon: Underline, title: "Underline" },
  { command: "formatBlock", value: "h2", icon: Heading2, title: "Heading 2" },
  { command: "formatBlock", value: "h3", icon: Heading3, title: "Heading 3" },
  { command: "formatBlock", value: "p", icon: AlignLeft, title: "Paragraph" },
  { command: "insertUnorderedList", icon: List, title: "Bullet List" },
  { command: "insertOrderedList", icon: ListOrdered, title: "Numbered List" },
  { command: "undo", icon: Undo2, title: "Undo" },
  { command: "redo", icon: Redo2, title: "Redo" },
];

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: number;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing your travel notes...",
  className,
  minHeight = 220,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  // Set initial content once
  useEffect(() => {
    if (editorRef.current && !isInitialized.current) {
      editorRef.current.innerHTML = value;
      isInitialized.current = true;
    }
  }, [value]);

  // Sync external value changes (e.g. when switching notes)
  useEffect(() => {
    if (editorRef.current && isInitialized.current) {
      const currentHtml = editorRef.current.innerHTML;
      if (currentHtml !== value) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  const execCmd = useCallback((command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value ?? undefined);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const isEmpty =
    !value || value === "" || value === "<br>" || value === "<div><br></div>";

  return (
    <div className={cn("overflow-hidden rounded-xl border", className)}>
      {/* Toolbar */}
      <div className="border-b bg-muted/40 px-2 py-1.5">
        <div className="flex flex-wrap gap-0.5">
          {toolbarButtons.map(({ command, value: cmdValue, icon: Icon, title }) => (
            <button
              key={`${command}-${cmdValue ?? ""}`}
              type="button"
              title={title}
              onMouseDown={(e) => {
                e.preventDefault(); // prevent editor blur
                execCmd(command, cmdValue);
              }}
              className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              aria-label={title}
            >
              <Icon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Editor area */}
      <div className="relative">
        {isEmpty && (
          <p
            className="text-muted-foreground pointer-events-none absolute left-4 top-3 select-none text-sm"
            aria-hidden
          >
            {placeholder}
          </p>
        )}
        <div
          ref={editorRef}
          id="rich-text-editor"
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          style={{ minHeight }}
          className={cn(
            "prose prose-sm dark:prose-invert max-w-none focus:outline-none",
            "px-4 py-3 text-sm leading-relaxed",
            // Heading styles within editor
            "[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-bold",
            "[&_h3]:mb-1 [&_h3]:mt-3 [&_h3]:text-base [&_h3]:font-semibold",
            "[&_ul]:ml-5 [&_ul]:list-disc",
            "[&_ol]:ml-5 [&_ol]:list-decimal",
          )}
          aria-label="Note editor"
          aria-multiline="true"
        />
      </div>
    </div>
  );
}
