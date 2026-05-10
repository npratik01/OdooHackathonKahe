"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { copyTrip } from "@/actions/copy-trip";

interface CopyTripButtonProps {
  slug: string;
}

export function CopyTripButton({ slug }: CopyTripButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleCopy() {
    startTransition(async () => {
      try {
        setError(null);
        const newTrip = await copyTrip(slug);
        router.push(`/app/trips/${newTrip.id}`);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to copy trip. Please make sure you are logged in.");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button onClick={handleCopy} disabled={isPending} className="gap-2 shadow-lg">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
        {isPending ? "Copying..." : "Save to My Trips"}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
