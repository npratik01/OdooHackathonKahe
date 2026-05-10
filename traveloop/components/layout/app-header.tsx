"use client";

import { Menu } from "lucide-react";

import { useUiStore } from "@/store/ui-store";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export function AppHeader() {
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 border-b backdrop-blur">
      <div className="flex h-14 items-center gap-3 px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex flex-1 items-center gap-3">
          <div className="hidden w-full max-w-md md:block">
            <Input placeholder="Search trips, bookings, destinations…" />
          </div>
        </div>

        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 w-9 p-0"
              aria-label="User menu"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>TL</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Demo Workspace</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Profile (coming soon)</DropdownMenuItem>
            <DropdownMenuItem disabled>Billing (coming soon)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
