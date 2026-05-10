"use client";

import { AlertTriangle, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BudgetProgressProps {
  totalSpent: number;
  budget: number | null;
}

export function BudgetProgress({ totalSpent, budget }: BudgetProgressProps) {
  if (!budget) return null;

  const percentage = Math.min((totalSpent / budget) * 100, 100);
  const isOverBudget = totalSpent > budget;
  const remaining = budget - totalSpent;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">Budget Progress</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">${totalSpent.toFixed(2)}</span>
            <span className="text-sm text-muted-foreground">/ ${budget.toFixed(2)}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {isOverBudget ? "Over Budget By" : "Remaining"}
          </p>
          <span className={`text-lg font-semibold ${isOverBudget ? "text-destructive" : "text-emerald-500"}`}>
            ${Math.abs(remaining).toFixed(2)}
          </span>
        </div>
      </div>

      <Progress 
        value={percentage} 
        className="h-3" 
        indicatorClassName={isOverBudget ? "bg-destructive" : percentage > 85 ? "bg-amber-500" : "bg-emerald-500"} 
      />

      {isOverBudget && (
        <Alert variant="destructive" className="mt-4 bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Overbudget Warning</AlertTitle>
          <AlertDescription>
            You have exceeded your trip budget by ${Math.abs(remaining).toFixed(2)}. 
            Review your expenses below.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
