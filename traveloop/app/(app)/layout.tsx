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
      <div className="bg-background text-foreground min-h-dvh">
        <AppSidebarMobile />
        <div className="flex min-h-dvh">
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
