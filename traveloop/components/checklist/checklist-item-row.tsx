"use client";

import { ChecklistCategory } from "@prisma/client";
import {
  Shirt,
  Sparkles,
  Laptop,
  FileText,
  Pill,
  UtensilsCrossed,
  Package,
  Trash2,
} from "lucide-react";

import { toggleChecklistItem, deleteChecklistItem } from "@/actions/checklist";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ChecklistItemRowProps {
  id: string;
  title: string;
  category: ChecklistCategory;
  isDone: boolean;
}

export const CATEGORY_META: Record<
  ChecklistCategory,
  { label: string; icon: React.ElementType; color: string }
> = {
  CLOTHING: {
    label: "Clothing",
    icon: Shirt,
    color: "text-blue-500",
  },
  TOILETRIES: {
    label: "Toiletries",
    icon: Sparkles,
    color: "text-pink-500",
  },
  ELECTRONICS: {
    label: "Electronics",
    icon: Laptop,
    color: "text-violet-500",
  },
  DOCUMENTS: {
    label: "Documents",
    icon: FileText,
    color: "text-amber-500",
  },
  MEDICATIONS: {
    label: "Medications",
    icon: Pill,
    color: "text-red-500",
  },
  FOOD: {
    label: "Food & Snacks",
    icon: UtensilsCrossed,
    color: "text-emerald-500",
  },
  OTHER: {
    label: "Other",
    icon: Package,
    color: "text-slate-400",
  },
};

export function ChecklistItemRow({
  id,
  title,
  isDone,
}: ChecklistItemRowProps) {
  async function handleToggle() {
    await toggleChecklistItem(id, !isDone);
  }

  async function handleDelete() {
    await deleteChecklistItem(id);
  }

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-lg border px-4 py-3 transition-all duration-200",
        isDone
          ? "border-border/40 bg-muted/30 opacity-60"
          : "border-border bg-card hover:border-primary/30 hover:shadow-sm",
      )}
    >
      {/* Custom Checkbox */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isDone ? "Mark unpacked" : "Mark packed"}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
          isDone
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/40 hover:border-primary",
        )}
      >
        {isDone && (
          <svg
            viewBox="0 0 12 10"
            fill="none"
            className="h-3 w-3"
            stroke="currentColor"
            strokeWidth={2}
          >
            <polyline points="1,5 4,8 11,1" />
          </svg>
        )}
      </button>

      {/* Title */}
      <span
        className={cn(
          "flex-1 text-sm transition-all duration-200",
          isDone && "line-through",
        )}
      >
        {title}
      </span>

      {/* Delete */}
      <form action={handleDelete}>
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:text-destructive"
          aria-label="Delete item"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </form>
    </div>
  );
}
