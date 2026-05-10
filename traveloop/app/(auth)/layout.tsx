import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

/**
 * Auth layout — wraps all pages in app/(auth)/.
 *
 * - Redirects already-authenticated users straight to the app.
 * - Renders a premium split-screen layout:
 *     left:  animated brand panel
 *     right: the auth form card
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Already signed in → skip auth pages
  const session = await getServerSession(authOptions);
  if (session) redirect("/app/dashboard");

  return (
    <div className="auth-layout">
      {/* ── Brand Panel ─────────────────────────────────────────────────────── */}
      <div className="auth-brand-panel" aria-hidden="true">
        <div className="auth-brand-content">
          {/* Logo */}
          <div className="auth-logo">
            <span className="auth-logo-icon">✈</span>
            <span className="auth-logo-text">Traveloop</span>
          </div>

          {/* Tagline */}
          <div className="auth-tagline">
            <h1 className="auth-tagline-headline">
              Plan smarter.
              <br />
              Travel better.
            </h1>
            <p className="auth-tagline-sub">
              Your complete travel operations platform — trips, expenses, notes,
              and more.
            </p>
          </div>

          {/* Decorative floating blobs */}
          <div className="auth-blob auth-blob-1" />
          <div className="auth-blob auth-blob-2" />
          <div className="auth-blob auth-blob-3" />

          {/* Stats strip */}
          <div className="auth-stats">
            <div className="auth-stat">
              <span className="auth-stat-value">50k+</span>
              <span className="auth-stat-label">Trips planned</span>
            </div>
            <div className="auth-stat-divider" />
            <div className="auth-stat">
              <span className="auth-stat-value">120+</span>
              <span className="auth-stat-label">Countries</span>
            </div>
            <div className="auth-stat-divider" />
            <div className="auth-stat">
              <span className="auth-stat-value">4.9★</span>
              <span className="auth-stat-label">User rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Form Panel ──────────────────────────────────────────────────────── */}
      <div className="auth-form-panel">
        <div className="auth-form-card">{children}</div>
      </div>
    </div>
  );
}
