"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ForgotPasswordInput,
  ForgotPasswordSchema,
} from "@/lib/validations/auth";

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    setServerError("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(
          json.error ?? "Something went wrong. Please try again.",
        );
      } else {
        setSuccessMessage(
          json.message ??
            "If that email exists, a reset link has been sent. Check your inbox.",
        );
      }
    } catch {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form
        id="forgot-password-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <div className="space-y-1.5">
          <label
            htmlFor="forgot-email"
            className="text-sm font-medium leading-none"
          >
            Email address
          </label>
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "forgot-email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p
              id="forgot-email-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <FormError message={serverError} />
        <FormSuccess message={successMessage} />

        <Button
          id="forgot-password-submit-btn"
          type="submit"
          className="w-full"
          disabled={isLoading || !!successMessage}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <span
                className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                aria-hidden="true"
              />
              Sending reset link…
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link
          href="/login"
          id="back-to-login-link"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
