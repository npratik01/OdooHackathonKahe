"use client";

import { useState, useTransition, useRef } from "react";
import { ChecklistCategory } from "@prisma/client";
import { Plus, RefreshCcw, PackageCheck } from "lucide-react";

import {
  addChecklistItem,
  resetChecklist,
} from "@/actions/checklist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChecklistItemRow, CATEGORY_META } from "./checklist-item-row";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  title: string;
  category: ChecklistCategory;
  isDone: boolean;
}

interface ChecklistModuleProps {
  tripId: string;
  initialItems: ChecklistItem[];
}

const CATEGORIES = Object.keys(CATEGORY_META) as ChecklistCategory[];
const ALL_FILTER = "ALL" as const;
type Filter = ChecklistCategory | typeof ALL_FILTER;

export function ChecklistModule({ tripId, initialItems }: ChecklistModuleProps) {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const [filter, setFilter] = useState<Filter>(ALL_FILTER);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<ChecklistCategory>(
    ChecklistCategory.OTHER,
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showReset, setShowReset] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const packed = items.filter((i) => i.isDone).length;
  const total = items.length;
  const progress = total > 0 ? Math.round((packed / total) * 100) : 0;

  const filtered =
    filter === ALL_FILTER ? items : items.filter((i) => i.category === filter);

  const grouped = CATEGORIES.reduce(
    (acc, cat) => {
      const catItems = filtered.filter((i) => i.category === cat);
      if (catItems.length > 0) acc[cat] = catItems;
      return acc;
    },
    {} as Record<ChecklistCategory, ChecklistItem[]>,
  );

  function handleAdd() {
    if (!newTitle.trim()) {
      setError("Please enter an item name.");
      inputRef.current?.focus();
      return;
    }
    setError(null);
    const optimistic: ChecklistItem = {
      id: `temp-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      isDone: false,
    };
    setItems((prev) => [...prev, optimistic]);
    setNewTitle("");

    startTransition(async () => {
      try {
        const saved = await addChecklistItem(tripId, optimistic.title, newCategory);
        setItems((prev) =>
          prev.map((i) =>
            i.id === optimistic.id
              ? { id: saved.id, title: saved.title, category: saved.category, isDone: saved.isDone }
              : i,
          ),
        );
      } catch {
        setItems((prev) => prev.filter((i) => i.id !== optimistic.id));
        setError("Failed to add item. Please try again.");
      }
    });
  }

  function handleReset() {
    setShowReset(false);
    const prev = [...items];
    setItems((i) => i.map((item) => ({ ...item, isDone: false })));
    startTransition(async () => {
      try {
        await resetChecklist(tripId);
      } catch {
        setItems(prev);
        setError("Failed to reset checklist.");
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Packing Checklist
          </h2>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {packed} of {total} items packed
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowReset(true)}
          disabled={packed === 0}
          className="gap-2"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Reset All
        </Button>
      </div>

      {/* ── Progress Bar ────────────────────────────────────── */}
      {total > 0 && (
        <div className="space-y-1">
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress === 100 && (
            <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-500">
              <PackageCheck className="h-4 w-4" />
              All packed — you&apos;re ready to go!
            </div>
          )}
        </div>
      )}

      {/* ── Add Item Form ────────────────────────────────────── */}
      <div className="bg-card rounded-xl border p-4">
        <p className="text-muted-foreground mb-3 text-xs font-medium uppercase tracking-wider">
          Add New Item
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            ref={inputRef}
            id="checklist-new-item"
            placeholder="e.g. Passport, Charger, Sunscreen…"
            value={newTitle}
            onChange={(e) => {
              setNewTitle(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1"
          />
          <select
            id="checklist-category-select"
            value={newCategory}
            onChange={(e) =>
              setNewCategory(e.target.value as ChecklistCategory)
            }
            className="border-input bg-background text-foreground h-9 rounded-md border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_META[cat].label}
              </option>
            ))}
          </select>
          <Button
            id="checklist-add-btn"
            onClick={handleAdd}
            disabled={isPending}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      </div>

      {/* ── Category Filter Tabs ─────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter(ALL_FILTER)}
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium transition-all",
            filter === ALL_FILTER
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground",
          )}
        >
          All ({total})
        </button>
        {CATEGORIES.filter((cat) => items.some((i) => i.category === cat)).map(
          (cat) => {
            const meta = CATEGORY_META[cat];
            const count = items.filter((i) => i.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-all",
                  filter === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {meta.label} ({count})
              </button>
            );
          },
        )}
      </div>

      {/* ── Item List ───────────────────────────────────────── */}
      {total === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-4xl">🎒</span>
          <p className="text-muted-foreground mt-3 text-sm">
            No items yet. Add your first packing item above!
          </p>
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-muted-foreground py-8 text-center text-sm">
          No items in this category.
        </div>
      ) : (
        <div className="space-y-6">
          {(Object.entries(grouped) as [ChecklistCategory, ChecklistItem[]][]).map(
            ([cat, catItems]) => {
              const meta = CATEGORY_META[cat];
              const Icon = meta.icon;
              const catPacked = catItems.filter((i) => i.isDone).length;

              return (
                <div key={cat}>
                  <div className="mb-2 flex items-center gap-2">
                    <Icon className={cn("h-4 w-4", meta.color)} />
                    <span className="text-sm font-medium">{meta.label}</span>
                    <span className="text-muted-foreground text-xs">
                      {catPacked}/{catItems.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {catItems.map((item) => (
                      <ChecklistItemRow key={item.id} {...item} />
                    ))}
                  </div>
                </div>
              );
            },
          )}
        </div>
      )}

      {/* ── Reset Confirmation Dialog ───────────────────── */}
      {showReset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowReset(false)}
        >
          <div
            className="bg-card mx-4 max-w-sm rounded-2xl border p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold">Reset Checklist?</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              This will mark all {packed} packed items as unpacked. This
              action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReset(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
