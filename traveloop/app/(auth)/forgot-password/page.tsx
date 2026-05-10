import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Traveloop account password.",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="auth-card-header">
        <h2 className="auth-card-title">Forgot your password?</h2>
        <p className="auth-card-subtitle">
          No worries — we&apos;ll send you a reset link
        </p>
      </div>
      <ForgotPasswordForm />
    </>
  );
}
