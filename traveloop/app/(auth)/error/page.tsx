import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthErrorContent } from "./error-content";

export const metadata: Metadata = {
  title: "Authentication Error",
  description: "An error occurred during authentication.",
};

export default function AuthErrorPage() {
  return (
    <>
      <div className="auth-card-header">
        <h2 className="auth-card-title">Authentication Error</h2>
        <p className="auth-card-subtitle">Something went wrong signing you in</p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-8">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        }
      >
        <AuthErrorContent />
      </Suspense>

      <div className="mt-6 flex flex-col gap-2">
        <Link
          href="/login"
          id="error-back-to-login"
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Back to sign in
        </Link>
        <Link
          href="/"
          id="error-back-to-home"
          className="inline-flex h-10 w-full items-center justify-center rounded-md border border-border bg-transparent px-4 text-sm font-medium transition-colors hover:bg-muted"
        >
          Go home
        </Link>
      </div>
    </>
  );
}
