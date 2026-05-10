"use client";

import { BarChart3, BookOpen, Map, Plus, Settings, Ticket } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type QuickAction = {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  accent: string;
};

const actions: QuickAction[] = [
  {
    id: "new-trip",
    label: "New Trip",
    description: "Start planning",
    href: "/app/trips",
    icon: <Plus className="h-5 w-5" />,
    accent: "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20",
  },
  {
    id: "view-trips",
    label: "My Trips",
    description: "Manage trips",
    href: "/app/trips",
    icon: <Map className="h-5 w-5" />,
    accent: "bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20",
  },
  {
    id: "bookings",
    label: "Bookings",
    description: "View bookings",
    href: "/app/bookings",
    icon: <Ticket className="h-5 w-5" />,
    accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20",
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "See insights",
    href: "/app/analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20",
  },
  {
    id: "notes",
    label: "Notes",
    description: "Travel journal",
    href: "/app/trips",
    icon: <BookOpen className="h-5 w-5" />,
    accent: "bg-pink-500/10 text-pink-600 dark:text-pink-400 hover:bg-pink-500/20",
  },
  {
    id: "settings",
    label: "Settings",
    description: "Account prefs",
    href: "/app/settings",
    icon: <Settings className="h-5 w-5" />,
    accent: "bg-slate-500/10 text-slate-600 dark:text-slate-400 hover:bg-slate-500/20",
  },
];

export function QuickActionsCard() {
  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {actions.map((action) => (
            <Link
              key={action.id}
              id={`quick-action-${action.id}`}
              href={action.href}
              className={cn(
                "group flex flex-col items-center gap-2 rounded-xl p-3 text-center transition-all duration-200 hover:-translate-y-0.5",
                action.accent,
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center">
                {action.icon}
              </div>
              <div>
                <p className="text-xs font-semibold leading-tight">{action.label}</p>
                <p className="mt-0.5 text-[10px] opacity-70">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
