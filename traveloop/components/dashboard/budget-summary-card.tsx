"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { BudgetCategory } from "@/actions/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: BudgetCategory }[] }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-card border-border rounded-lg border px-3 py-2 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.payload.color }} />
        <span className="text-xs font-medium">{item.name}</span>
      </div>
      <p className="mt-0.5 text-sm font-bold">${item.value.toLocaleString()}</p>
    </div>
  );
}

export function BudgetSummaryCard({ data }: { data: BudgetCategory[] }) {
  const total = data.reduce((sum, d) => sum + d.amount, 0);
  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle>Budget Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="relative mx-auto h-40 w-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="amount" nameKey="category" cx="50%" cy="50%" innerRadius={44} outerRadius={68} paddingAngle={2} animationDuration={800}>
                  {data.map((entry, i) => <Cell key={i} fill={entry.color} stroke="transparent" />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">Total</p>
              <p className="text-sm font-bold">${(total / 1000).toFixed(1)}k</p>
            </div>
          </div>
          <ul className="flex-1 space-y-2">
            {data.map((item) => (
              <li key={item.category} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: item.color }} />
                <span className="text-muted-foreground min-w-0 flex-1 truncate text-xs">{item.category}</span>
                <span className="text-xs font-semibold">${item.amount.toLocaleString()}</span>
                <span className="text-muted-foreground text-xs">{total > 0 ? Math.round((item.amount / total) * 100) : 0}%</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export function BudgetSummaryCardSkeleton() {
  return (
    <Card>
      <CardHeader className="border-b pb-4"><Skeleton className="h-5 w-36" /></CardHeader>
      <CardContent className="pt-4">
        <div className="flex gap-6">
          <Skeleton className="h-40 w-40 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2.5 pt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-2.5 w-2.5 rounded-full" />
                <Skeleton className="h-3 flex-1" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
