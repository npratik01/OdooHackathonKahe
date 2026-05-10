import type { ReactNode } from "react";

import { AppHeader } from "@/components/layout/app-header";
import {
  AppSidebarDesktop,
  AppSidebarMobile,
} from "@/components/layout/app-sidebar";
import { SessionProvider } from "@/components/providers/session-provider";
import { requireAuth } from "@/lib/auth-utils";

export default async function AppLayout({ children }: { children: ReactNode }) {
  // Server-side guard — redirects to /login if no valid session
  await requireAuth();

  return (
    <SessionProvider>
      <div className="bg-background text-foreground min-h-dvh relative overflow-hidden">
        {/* Soft immersive background glow for the entire app */}
        <div className="pointer-events-none absolute fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" />
        
        <AppSidebarMobile />
        <div className="flex min-h-dvh relative z-10">
          <AppSidebarDesktop />
          <div className="flex min-w-0 flex-1 flex-col">
            <AppHeader />
            <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
          </div>
        </div>
      </div>
    </SessionProvider>
  );
}
