import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a free Traveloop account and start planning your trips.",
};

export default function RegisterPage() {
  return (
    <>
      <div className="auth-card-header">
        <h2 className="auth-card-title">Create your account</h2>
        <p className="auth-card-subtitle">
          Start planning smarter trips today — it&apos;s free
        </p>
      </div>
      <RegisterForm />
    </>
  );
}
