"use client";

import { useMemo } from "react";
import { Trip, Expense } from "@prisma/client";
import { TripStopWithActivities } from "@/actions/itinerary";
import { AddExpenseModal } from "@/components/finances/forms/add-expense-modal";
import { SetBudgetModal } from "@/components/finances/forms/set-budget-modal";
import { BudgetProgress } from "@/components/finances/budget-progress";
import { ExpenseCharts } from "@/components/finances/expense-charts";
import { ExpenseList } from "@/components/finances/expense-list";
import { Card, CardContent } from "@/components/ui/card";

interface FinanceDashboardProps {
  trip: Trip;
  expenses: Expense[];
  stops: TripStopWithActivities[];
}

export function FinanceDashboard({ trip, expenses, stops }: FinanceDashboardProps) {
  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  }, [expenses]);

  const tripDays = useMemo(() => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [trip.startDate, trip.endDate]);

  const perDayAverage = totalSpent / tripDays;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Finances</h2>
          <p className="text-sm text-muted-foreground">
            Track your budget, analyze spending, and add expenses.
          </p>
        </div>
        <div className="flex gap-2">
          <SetBudgetModal tripId={trip.id} currentBudget={trip.budget ? Number(trip.budget) : null} />
          <AddExpenseModal tripId={trip.id} stops={stops} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <BudgetProgress totalSpent={totalSpent} budget={trip.budget ? Number(trip.budget) : null} />
            
            {!trip.budget && (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">No budget set for this trip yet.</p>
                <SetBudgetModal tripId={trip.id} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col justify-center h-full">
            <p className="text-sm font-medium text-muted-foreground mb-2">Per-Day Average</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">${perDayAverage.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground">/ day</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on {tripDays} days total trip duration.
            </p>
          </CardContent>
        </Card>
      </div>

      <ExpenseCharts expenses={expenses} />

      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <ExpenseList expenses={expenses} />
      </div>
    </div>
  );
}
