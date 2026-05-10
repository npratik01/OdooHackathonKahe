"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Map,
  BookOpen,
  Wallet,
  Settings,
  LogOut,
  Plane
} from "lucide-react";
import { signOut } from "next-auth/react";

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
  { title: "Explore", href: "/app/discover", icon: Compass },
  { title: "My Trips", href: "/app/trips", icon: Map },
  { title: "Journal", href: "/app/journal", icon: BookOpen, badge: "New" },
  { title: "Budget", href: "/app/budget", icon: Wallet },
  { title: "Settings", href: "/app/settings", icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col backdrop-blur-xl bg-background/60">
      <div className="flex h-16 items-center px-6">
        <Link href="/app" className="flex items-center gap-3 font-bold text-xl tracking-tight text-primary drop-shadow-sm transition-transform hover:scale-105">
          <div className="bg-gradient-to-br from-primary to-accent text-white p-1.5 rounded-xl shadow-lg shadow-primary/30">
            <Plane className="h-5 w-5" />
          </div>
          <span>Traveloop</span>
        </Link>
      </div>
      
      <div className="px-4 py-2">
        <Separator className="bg-border/50" />
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          // If pathname starts with href, mark active
          const active = pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Button
              key={item.href}
              variant={active ? "default" : "ghost"}
              className={cn(
                "w-full justify-start h-11 px-4 transition-all duration-300 rounded-xl",
                active 
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 font-semibold" 
                  : "hover:bg-primary/10 hover:text-primary font-medium text-muted-foreground"
              )}
              asChild
              onClick={onNavigate}
            >
              <Link href={item.href}>
                {Icon ? <Icon className={cn("mr-3 h-5 w-5", active ? "text-primary-foreground" : "text-muted-foreground")} /> : null}
                <span className="flex-1 truncate text-base">{item.title}</span>
                {item.badge ? (
                  <Badge variant="secondary" className={cn("ml-2", active ? "bg-white/20 text-white hover:bg-white/30" : "")}>
                    {item.badge}
                  </Badge>
                ) : null}
              </Link>
            </Button>
          );
        })}
      </nav>

      <div className="p-4 space-y-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:bg-destructive/10 hover:text-destructive h-11 px-4 rounded-xl font-medium transition-colors"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Log out
        </Button>
      </div>
    </div>
  );
}

export function AppSidebarDesktop() {
  return (
    <aside className="hidden w-72 md:flex md:flex-col border-r border-border/40 shadow-sm relative z-20">
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
        className="w-72 p-0 border-r-0 bg-transparent"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <SidebarContent onNavigate={() => setSidebarOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
