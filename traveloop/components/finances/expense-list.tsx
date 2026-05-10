"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CreditCard, MoreHorizontal, Trash } from "lucide-react";
import { Expense } from "@prisma/client";
import { deleteExpense } from "@/actions/finances";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExpenseListProps {
  expenses: Expense[];
}

export function ExpenseList({ expenses }: ExpenseListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;
    setDeletingId(id);
    await deleteExpense(id);
    setDeletingId(null);
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground italic border-2 border-dashed rounded-xl">
        No expenses recorded yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <div 
          key={expense.id} 
          className={`flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors ${deletingId === expense.id ? "opacity-50" : ""}`}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium leading-none mb-1.5">
                {expense.merchant || expense.category}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="bg-muted px-2 py-0.5 rounded-md font-medium">
                  {expense.category}
                </span>
                <span>•</span>
                <span>{format(new Date(expense.occurredAt), "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-lg">
                ${Number(expense.amount).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                {expense.paymentMethod}
              </p>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={() => handleDelete(expense.id)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}
