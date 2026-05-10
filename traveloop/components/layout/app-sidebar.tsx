"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LineChart,
  Map,
  Settings,
  Ticket,
} from "lucide-react";

import type { NavItem } from "@/types/navigation";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const navItems: NavItem[] = [
  { title: "Overview", href: "/app", icon: LayoutDashboard },
  { title: "Trips", href: "/app/trips", icon: Map },
  { title: "Bookings", href: "/app/bookings", icon: Ticket, badge: "Soon" },
  {
    title: "Analytics",
    href: "/app/analytics",
    icon: LineChart,
    badge: "Soon",
  },
  { title: "Settings", href: "/app/settings", icon: Settings, badge: "Soon" },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center px-4">
        <Link href="/app" className="flex items-center gap-2 font-semibold">
          <span className="bg-sidebar-primary text-sidebar-primary-foreground inline-flex h-7 w-7 items-center justify-center rounded-md">
            T
          </span>
          <span>Traveloop</span>
        </Link>
      </div>
      <Separator />

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;

          return (
            <Button
              key={item.href}
              variant={active ? "secondary" : "ghost"}
              className={cn("w-full justify-start", active && "font-medium")}
              asChild
              onClick={onNavigate}
            >
              <Link href={item.href}>
                {Icon ? <Icon className="mr-2 h-4 w-4" /> : null}
                <span className="flex-1 truncate">{item.title}</span>
                {item.badge ? (
                  <Badge variant="secondary" className="ml-2">
                    {item.badge}
                  </Badge>
                ) : null}
              </Link>
            </Button>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="bg-card text-muted-foreground rounded-lg border p-3 text-sm">
          Connect PostgreSQL + run Prisma migrations to unlock real data.
        </div>
      </div>
    </div>
  );
}

export function AppSidebarDesktop() {
  return (
    <aside className="bg-sidebar text-sidebar-foreground hidden w-72 border-r md:flex md:flex-col">
      <SidebarContent />
    </aside>
  );
}

export function AppSidebarMobile() {
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUiStore((s) => s.setSidebarOpen);

  return (
    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent
        side="left"
        className="bg-sidebar text-sidebar-foreground w-72 p-0"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <SidebarContent onNavigate={() => setSidebarOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
