import { redirect } from "next/navigation";

/**
 * /app/dashboard redirects to the canonical dashboard at /app
 * (the (app) route group's index page).
 * This route exists so links like "callbackUrl=/app/dashboard" work correctly.
 */
export default function DashboardRedirect() {
  redirect("/app");
}
