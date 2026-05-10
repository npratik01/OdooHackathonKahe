import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Traveloop account.",
};

export default function LoginPage() {
  return (
    <>
      <div className="auth-card-header">
        <h2 className="auth-card-title">Welcome back</h2>
        <p className="auth-card-subtitle">Sign in to continue your journey</p>
      </div>
      <LoginForm />
    </>
  );
}
