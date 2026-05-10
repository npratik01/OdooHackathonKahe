"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ResetPasswordInput,
  ResetPasswordSchema,
} from "@/lib/validations/auth";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [serverError, setServerError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // No token in URL
  if (!token) {
    return (
      <FormError message="Invalid reset link. Please request a new password reset." />
    );
  }

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    setServerError("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(
          json.error ?? "Something went wrong. Please try again.",
        );
      } else {
        setSuccessMessage(
          json.message ?? "Password reset successfully! Redirecting to login…",
        );
        setTimeout(() => router.push("/login"), 2500);
      }
    } catch {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      id="reset-password-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      noValidate
    >
      {/* New Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="reset-password"
          className="text-sm font-medium leading-none"
        >
          New password
        </label>
        <Input
          id="reset-password"
          type="password"
          autoComplete="new-password"
          placeholder="Min 8 chars, 1 uppercase, 1 number"
          aria-invalid={!!errors.password}
          aria-describedby={
            errors.password ? "reset-password-error" : undefined
          }
          {...register("password")}
        />
        {errors.password && (
          <p
            id="reset-password-error"
            className="text-xs text-destructive"
            role="alert"
          >
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Confirm New Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="reset-confirm-password"
          className="text-sm font-medium leading-none"
        >
          Confirm new password
        </label>
        <Input
          id="reset-confirm-password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={
            errors.confirmPassword
              ? "reset-confirm-password-error"
              : undefined
          }
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p
            id="reset-confirm-password-error"
            className="text-xs text-destructive"
            role="alert"
          >
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <FormError message={serverError} />
      <FormSuccess message={successMessage} />

      <Button
        id="reset-password-submit-btn"
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
            Resetting password…
          </>
        ) : (
          "Reset password"
        )}
      </Button>
    </form>
  );
}
