"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormError } from "@/components/auth/form-error";
import { OAuthButton } from "@/components/auth/oauth-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RegisterInput, RegisterSchema } from "@/lib/validations/auth";

export function RegisterForm() {
  const [serverError, setServerError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setServerError("");

    try {
      // 1. Create the account
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error ?? "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // 2. Auto sign-in after successful registration
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/app/dashboard",
        redirect: true,
      });

      // redirect: true means Next.js handles the redirect automatically
      if (signInResult?.error) {
        setServerError("Account created but login failed. Please sign in manually.");
      }
    } catch {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* OAuth */}
      <OAuthButton callbackUrl="/app/dashboard" />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">
            Or register with email
          </span>
        </div>
      </div>

      {/* Form */}
      <form
        id="register-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        {/* Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="register-name"
            className="text-sm font-medium leading-none"
          >
            Full name
          </label>
          <Input
            id="register-name"
            type="text"
            autoComplete="name"
            placeholder="Alex Johnson"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "register-name-error" : undefined}
            {...register("name")}
          />
          {errors.name && (
            <p
              id="register-name-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="register-email"
            className="text-sm font-medium leading-none"
          >
            Email
          </label>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "register-email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p
              id="register-email-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="register-password"
            className="text-sm font-medium leading-none"
          >
            Password
          </label>
          <Input
            id="register-password"
            type="password"
            autoComplete="new-password"
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password ? "register-password-error" : undefined
            }
            {...register("password")}
          />
          {errors.password && (
            <p
              id="register-password-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="register-confirm-password"
            className="text-sm font-medium leading-none"
          >
            Confirm password
          </label>
          <Input
            id="register-confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={
              errors.confirmPassword
                ? "register-confirm-password-error"
                : undefined
            }
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p
              id="register-confirm-password-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <FormError message={serverError} />

        <Button
          id="register-submit-btn"
          type="submit"
          className="w-full"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <span
                className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                aria-hidden="true"
              />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          id="go-to-login-link"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
