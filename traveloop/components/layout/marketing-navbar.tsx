"use client";

import Link from "next/link";

import { ModeToggle } from "@/components/theme/mode-toggle";
import { Button } from "@/components/ui/button";

export function MarketingNavbar() {
  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="bg-primary text-primary-foreground inline-flex h-7 w-7 items-center justify-center rounded-md">
            T
          </span>
          <span>Traveloop</span>
        </Link>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button asChild>
            <Link href="/app">Open App</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
