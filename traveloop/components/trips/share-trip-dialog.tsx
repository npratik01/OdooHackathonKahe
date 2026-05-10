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
          <div className="space-y-4 pt-4">
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

            {/* Social Share Group */}
            <div className="pt-4 border-t border-border/50 space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Share on Social Media</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl h-10 gap-2 border-border/50 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                  onClick={() => {
                    const encodedUrl = encodeURIComponent(publicUrl);
                    const encodedText = encodeURIComponent("Check out my travel itinerary on Traveloop! ✈️🌍");
                    window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`, "_blank");
                  }}
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>X / Twitter</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl h-10 gap-2 border-border/50 hover:bg-[#1877F2]/10 hover:text-[#1877F2] hover:border-[#1877F2]/30 transition-all"
                  onClick={() => {
                    const encodedUrl = encodeURIComponent(publicUrl);
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank");
                  }}
                >
                  <svg className="h-4 w-4 fill-current text-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                  </svg>
                  <span>Facebook</span>
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl h-10 gap-2 border-border/50 hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]/30 transition-all"
                  onClick={() => {
                    const encodedUrl = encodeURIComponent(publicUrl);
                    const encodedText = encodeURIComponent("Check out my travel itinerary on Traveloop! ✈️🌍");
                    window.open(`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`, "_blank");
                  }}
                >
                  <svg className="h-4 w-4 fill-current text-[#25D366]" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.456h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>WhatsApp</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl h-10 gap-2 border-border/50 hover:bg-[#0088cc]/10 hover:text-[#0088cc] hover:border-[#0088cc]/30 transition-all"
                  onClick={() => {
                    const encodedUrl = encodeURIComponent(publicUrl);
                    const encodedText = encodeURIComponent("Check out my travel itinerary on Traveloop! ✈️🌍");
                    window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, "_blank");
                  }}
                >
                  <svg className="h-4 w-4 fill-current text-[#0088cc]" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.51-.46-.01-1.35-.26-2.01-.48-.81-.27-1.46-.42-1.4-.88.03-.24.37-.49 1.02-.74 4-1.74 6.67-2.88 8-3.43 3.82-1.58 4.61-1.85 5.13-1.86.11 0 .37.03.54.17.14.11.18.27.2.42-.01.06 0 .12-.01.18z" />
                  </svg>
                  <span>Telegram</span>
                </Button>
              </div>
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
