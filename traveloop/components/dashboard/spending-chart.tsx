"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlyExpense } from "@/actions/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SpendingChartProps {
  data: MonthlyExpense[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border-border rounded-lg border px-3 py-2 shadow-lg">
      <p className="text-muted-foreground text-xs">{label}</p>
      <p className="text-sm font-bold">
        ${payload[0].value.toLocaleString("en", { minimumFractionDigits: 0 })}
      </p>
    </div>
  );
}

export function SpendingChart({ data }: SpendingChartProps) {
  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle>Monthly Spending</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={data}
            margin={{ top: 4, right: 4, bottom: 0, left: -16 }}
          >
            <defs>
              <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v >= 1000 ? `${v / 1000}k` : v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#spendGrad)"
              dot={{ fill: "#3b82f6", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function SpendingChartSkeleton() {
  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <Skeleton className="h-5 w-36" />
      </CardHeader>
      <CardContent className="pt-4">
        <Skeleton className="h-[200px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}
