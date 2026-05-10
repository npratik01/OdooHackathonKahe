import { Role } from "@prisma/client";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // ── Admin route guard ───────────────────────────────────────────────────
    // Any route under /app/admin requires ADMIN role.
    if (pathname.startsWith("/app/admin")) {
      if (token?.role !== Role.ADMIN) {
        return NextResponse.redirect(new URL("/app/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      /**
       * Return true to allow the request through to the middleware function.
       * Return false to redirect to the signIn page automatically.
       */
      authorized({ token }) {
        return !!token;
      },
    },
  },
);

export const config = {
  /**
   * Protect every route under /app/.
   * Auth routes (/login, /register, etc.) are left unprotected.
   * API routes and Next.js internals are excluded.
   */
  matcher: [
    "/app/:path*",
    // Add any other protected top-level routes here, e.g.:
    // "/settings/:path*",
  ],
};
