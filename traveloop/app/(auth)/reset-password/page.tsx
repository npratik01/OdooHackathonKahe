import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Choose a new password for your Traveloop account.",
};

export default function ResetPasswordPage() {
  return (
    <>
      <div className="auth-card-header">
        <h2 className="auth-card-title">Choose a new password</h2>
        <p className="auth-card-subtitle">
          Make it strong and memorable
        </p>
      </div>
      {/* Suspense required because useSearchParams is used inside the form */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-8">
            <span
              className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"
              aria-label="Loading…"
            />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </>
  );
}
