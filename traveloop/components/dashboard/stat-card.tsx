"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number; // positive = up, negative = down
  icon: React.ReactNode;
  accent?: "blue" | "purple" | "amber" | "emerald";
};

const accentMap = {
  blue: {
    icon: "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20",
    glow: "before:from-blue-500/10",
  },
  purple: {
    icon: "bg-purple-500/10 text-purple-500 dark:bg-purple-500/20",
    glow: "before:from-purple-500/10",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20",
    glow: "before:from-amber-500/10",
  },
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20",
    glow: "before:from-emerald-500/10",
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  change,
  icon,
  accent = "blue",
}: StatCardProps) {
  const colors = accentMap[accent];
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card className="stat-card relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-3">
          <p className="text-muted-foreground text-sm font-medium">{title}</p>
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              colors.icon,
            )}
          >
            {icon}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-muted-foreground mt-0.5 text-xs">{subtitle}</p>
            )}
          </div>

          {change !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                isPositive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/10 text-red-600 dark:text-red-400",
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="mt-1.5 h-3 w-16" />
      </CardContent>
    </Card>
  );
}
