"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Calendar, Globe2, Lock, MapPin, MoreVertical } from "lucide-react";
import { Trip } from "@prisma/client";
import { deleteTrip, duplicateTrip } from "@/actions/trips";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  DRAFT: { label: "Draft", className: "bg-muted text-muted-foreground" },
  PLANNED: { label: "Planned", className: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  BOOKED: { label: "Booked", className: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  IN_PROGRESS: { label: "In progress", className: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  COMPLETED: { label: "Completed", className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  CANCELLED: { label: "Cancelled", className: "bg-red-500/10 text-red-500" },
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
    <Card className={cn("group flex flex-col overflow-hidden transition-all duration-300 hover:shadow-md", (isDeleting || isDuplicating) && "opacity-50 pointer-events-none")}>
      <div className="relative aspect-video w-full bg-muted/50">
        {trip.coverImage ? (
          <Image
            src={trip.coverImage}
            alt={trip.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <span className="text-4xl">✈️</span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge className={cn("backdrop-blur-md", status.className)}>
            {status.label}
          </Badge>
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-md">
            {trip.visibility === "PUBLIC" ? <Globe2 className="mr-1 h-3 w-3" /> : <Lock className="mr-1 h-3 w-3" />}
            {trip.visibility === "PUBLIC" ? "Public" : "Private"}
          </Badge>
        </div>
        <div className="absolute right-3 top-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon-sm" className="h-8 w-8 bg-background/80 backdrop-blur-md hover:bg-background">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/app/trips/${trip.id}/edit`}>Edit details</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                Delete trip
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <CardContent className="flex flex-1 flex-col p-4">
        <Link href={`/app/trips/${trip.id}`} className="hover:underline">
          <h3 className="line-clamp-1 font-semibold">{trip.name}</h3>
        </Link>
        <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{trip.destination}</span>
        </div>
        
        {trip.description && (
          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
            {trip.description}
          </p>
        )}
        
        <div className="mt-auto pt-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>{dateRange}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
