"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormError } from "@/components/auth/form-error";
import { OAuthButton } from "@/components/auth/oauth-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginInput, LoginSchema } from "@/lib/validations/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/app/dashboard";

  const [serverError, setServerError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setServerError("");

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
      callbackUrl,
    });

    setIsLoading(false);

    if (!result) {
      setServerError("An unexpected error occurred. Please try again.");
      return;
    }

    if (result.error) {
      setServerError("Invalid email or password. Please try again.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* OAuth */}
      <OAuthButton callbackUrl={callbackUrl} />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Credentials Form */}
      <form
        id="login-form"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <div className="space-y-1.5">
          <label
            htmlFor="login-email"
            className="text-sm font-medium leading-none"
          >
            Email
          </label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p
              id="login-email-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="text-sm font-medium leading-none"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              id="forgot-password-link"
              className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            aria-describedby={
              errors.password ? "login-password-error" : undefined
            }
            {...register("password")}
          />
          {errors.password && (
            <p
              id="login-password-error"
              className="text-xs text-destructive"
              role="alert"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        <FormError message={serverError} />

        <Button
          id="login-submit-btn"
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
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          id="go-to-register-link"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
