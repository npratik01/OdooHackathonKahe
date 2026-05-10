import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckSquare, NotebookText, ArrowLeft, MapPin } from "lucide-react";

import { getTripById } from "@/actions/trips";
import { cn } from "@/lib/utils";

interface TripLayoutProps {
  children: ReactNode;
  params: Promise<{ tripId: string }>;
}

interface NavTabProps {
  href: string;
  icon: React.ElementType;
  label: string;
  // We use a simple approach: active state determined client-side in children
}

// Tab link component — styled consistently
function TabLink({ href, icon: Icon, label }: NavTabProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
        "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

export default async function TripDetailLayout({
  children,
  params,
}: TripLayoutProps) {
  const { tripId } = await params;

  let trip;
  try {
    trip = await getTripById(tripId);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <Link
        href="/app/trips"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All Trips
      </Link>

      {/* Trip header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{trip.name}</h1>
        <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
          <MapPin className="h-3.5 w-3.5" />
          {trip.destination}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 border-b pb-1">
        <TabLink
          href={`/app/trips/${tripId}/checklist`}
          icon={CheckSquare}
          label="Packing Checklist"
        />
        <TabLink
          href={`/app/trips/${tripId}/notes`}
          icon={NotebookText}
          label="Travel Notes"
        />
      </div>

      {/* Page content */}
      <div>{children}</div>
    </div>
  );
}
