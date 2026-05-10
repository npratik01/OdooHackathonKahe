import type { ReactNode } from "react";

import { MarketingNavbar } from "@/components/layout/marketing-navbar";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-foreground min-h-dvh">
      <MarketingNavbar />
      <main className="flex-1">{children}</main>
      <footer className="border-t">
        <div className="text-muted-foreground mx-auto flex h-14 max-w-6xl items-center justify-between px-4 text-sm">
          <span>© {new Date().getFullYear()} Traveloop</span>
          <span>Built with Next.js + shadcn/ui</span>
        </div>
      </footer>
    </div>
  );
}
