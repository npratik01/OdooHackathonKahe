import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

// ── Public helper ────────────────────────────────────────────────────────────

/**
 * Returns the current session user, or null if not authenticated.
 * Safe to call from any Server Component.
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

// ── Guards ───────────────────────────────────────────────────────────────────

/**
 * Requires authentication. Redirects to /login if no valid session.
 * Returns the session user.
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Requires the user to have one of the specified roles.
 * Redirects to /app/dashboard if authenticated but lacking the role.
 */
export async function requireRole(...roles: Role[]) {
  const user = await requireAuth();
  if (!roles.includes(user.role as Role)) {
    redirect("/app/dashboard");
  }
  return user;
}

/**
 * Convenience shorthand for admin-only routes.
 */
export async function requireAdmin() {
  return requireRole(Role.ADMIN);
}
