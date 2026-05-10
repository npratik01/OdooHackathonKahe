"use client";

import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification:
    "The verification token has expired or has already been used.",
  OAuthAccountNotLinked:
    "This email is already associated with a different sign-in method. Please use the original method to log in.",
  OAuthSignin: "Could not start the Google sign-in process. Please try again.",
  OAuthCallback:
    "An error occurred during the Google sign-in callback. Please try again.",
  CredentialsSignin: "Invalid email or password. Please try again.",
  SessionRequired: "You must be signed in to access this page.",
  Default: "An unexpected authentication error occurred. Please try again.",
};

export function AuthErrorContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error") ?? "Default";
  const message = ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.Default;

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-4 text-sm text-destructive"
    >
      <AlertCircle
        className="mt-0.5 h-5 w-5 shrink-0"
        aria-hidden="true"
      />
      <div>
        <p className="font-semibold">
          {errorCode !== "Default" ? `Error: ${errorCode}` : "Error"}
        </p>
        <p className="mt-1 opacity-90">{message}</p>
      </div>
    </div>
  );
}
