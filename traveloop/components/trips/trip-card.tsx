"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, Globe2, Lock, MapPin, MoreVertical, Plane } from "lucide-react";
import { Trip } from "@prisma/client";
import { deleteTrip, duplicateTrip } from "@/actions/trips";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TripCardProps {
  trip: Trip;
}

const statusConfig = {
  DRAFT: { label: "Draft", className: "bg-white/20 text-white" },
  PLANNED: { label: "Planned", className: "bg-blue-500/80 text-white" },
  BOOKED: { label: "Booked", className: "bg-purple-500/80 text-white" },
  IN_PROGRESS: { label: "In progress", className: "bg-amber-500/80 text-white" },
  COMPLETED: { label: "Completed", className: "bg-emerald-500/80 text-white" },
  CANCELLED: { label: "Cancelled", className: "bg-red-500/80 text-white" },
};

export function TripCard({ trip }: TripCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const status = statusConfig[trip.status];
  const dateRange = `${format(new Date(trip.startDate), "MMM d")} – ${format(new Date(trip.endDate), "MMM d, yyyy")}`;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this trip?")) return;
    setIsDeleting(true);
    await deleteTrip(trip.id);
    setIsDeleting(false);
  };

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    await duplicateTrip(trip.id);
    setIsDuplicating(false);
  };

  return (
    <div className={cn("group relative h-[320px] w-full overflow-hidden rounded-3xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20", (isDeleting || isDuplicating) && "opacity-50 pointer-events-none")}>
      {/* Background Image */}
      {trip.coverImage ? (
        <Image
          src={trip.coverImage}
          alt={trip.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-accent flex justify-center items-center">
          <Plane className="h-24 w-24 text-white/20" />
        </div>
      )}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-50" />

      {/* Top Header Section */}
      <div className="absolute top-0 left-0 right-0 p-5 flex justify-between items-start z-10">
        <div className="flex gap-2">
          <Badge className={cn("backdrop-blur-md shadow-sm border-none font-medium", status.className)}>
            {status.label}
          </Badge>
          <Badge variant="secondary" className="bg-black/30 text-white backdrop-blur-md border-none font-medium shadow-sm">
            {trip.visibility === "PUBLIC" ? <Globe2 className="mr-1.5 h-3.5 w-3.5" /> : <Lock className="mr-1.5 h-3.5 w-3.5" />}
            {trip.visibility === "PUBLIC" ? "Public" : "Private"}
          </Badge>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="h-8 w-8 text-white hover:bg-white/20 hover:text-white backdrop-blur-md bg-black/20 rounded-full border border-white/10">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl">
            <DropdownMenuItem asChild className="rounded-lg">
              <Link href={`/app/trips/${trip.id}/edit`}>Edit details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDuplicate} className="rounded-lg">
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:bg-destructive/10 focus:text-destructive rounded-lg">
              Delete trip
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Bottom Content Section */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col justify-end">
        <Link href={`/app/trips/${trip.id}`} className="group/link block">
          <div className="flex items-center gap-2 mb-2 text-white/80 font-medium">
            <MapPin className="h-4 w-4 text-accent" />
            <span className="truncate text-sm">{trip.destination}</span>
          </div>
          <h3 className="line-clamp-2 text-2xl font-bold text-white tracking-tight leading-tight group-hover/link:underline decoration-white/50 underline-offset-4">
            {trip.name}
          </h3>
        </Link>
        
        {/* Progress bar / Avatar placeholder */}
        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-white/90 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <Calendar className="h-4 w-4 text-white/70" />
            <span>{dateRange}</span>
          </div>

          <div className="flex -space-x-2">
            <div className="h-8 w-8 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[10px] text-white font-bold shadow-sm z-20">PR</div>
            <div className="h-8 w-8 rounded-full border-2 border-background bg-accent flex items-center justify-center text-[10px] text-white font-bold shadow-sm z-10">+1</div>
          </div>
        </div>
      </div>
    </div>
  );
}
