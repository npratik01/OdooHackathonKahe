"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl flex-col justify-center gap-3 px-4">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="text-muted-foreground text-sm">
        Try again. If this persists, check logs and environment variables.
      </p>
      <Button onClick={() => reset()} className="w-fit">
        Retry
      </Button>
    </div>
  );
}
