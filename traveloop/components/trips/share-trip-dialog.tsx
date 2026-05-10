"use client";

import { useState, useTransition, useEffect } from "react";
import { Share2, Globe, Lock, Copy, Check } from "lucide-react";
import { publishTrip, unpublishTrip } from "@/actions/share";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ShareTripDialogProps {
  tripId: string;
  initialVisibility: "PUBLIC" | "PRIVATE";
  initialSlug: string | null;
}

export function ShareTripDialog({
  tripId,
  initialVisibility,
  initialSlug,
}: ShareTripDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [visibility, setVisibility] = useState(initialVisibility);
  const [slug, setSlug] = useState(initialSlug);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const publicUrl = slug ? `${origin}/t/${slug}` : "";

  function handleToggle(checked: boolean) {
    const newVisibility = checked ? "PUBLIC" : "PRIVATE";
    setVisibility(newVisibility); // optimistic
    
    startTransition(async () => {
      try {
        if (checked) {
          const updated = await publishTrip(tripId);
          setSlug(updated.slug);
        } else {
          await unpublishTrip(tripId);
        }
      } catch {
        // revert on error
        setVisibility(initialVisibility);
        setSlug(initialSlug);
      }
    });
  }

  function handleCopy() {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Trip</DialogTitle>
          <DialogDescription>
            Control who can view this trip itinerary.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-4 rounded-lg border p-4 mt-4">
          <div className="flex-1 space-y-1">
            <Label htmlFor="public-toggle" className="text-base font-semibold">
              Public Link
            </Label>
            <p className="text-sm text-muted-foreground leading-snug">
              Anyone with the link can view your itinerary, stops, and shared notes.
            </p>
          </div>
          <Switch
            id="public-toggle"
            checked={visibility === "PUBLIC"}
            onCheckedChange={handleToggle}
            disabled={isPending}
          />
        </div>

        {visibility === "PUBLIC" && slug && (
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-500">
              <Globe className="h-4 w-4" />
              This trip is public
            </div>
            <div className="flex items-center space-x-2">
              <Input
                readOnly
                value={publicUrl}
                className="bg-muted text-muted-foreground font-mono text-xs"
              />
              <Button size="icon" className="shrink-0" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}

        {visibility === "PRIVATE" && (
          <div className="flex items-center gap-2 pt-4 text-sm font-medium text-muted-foreground">
            <Lock className="h-4 w-4" />
            This trip is private and only visible to you.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
