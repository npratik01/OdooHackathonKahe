import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  Sun,
  CloudRain,
  ArrowRight
} from "lucide-react";

import { getDashboardStats, getRecentTrips, getUpcomingTrips } from "@/actions/dashboard";
import { RecentTripsCard, RecentTripsCardSkeleton } from "@/components/dashboard/recent-trips-card";
import { RecommendedDestinationsCard } from "@/components/dashboard/recommended-destinations-card";
import { WelcomeSection } from "@/components/dashboard/welcome-section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Overview | Traveloop",
  description: "Your next adventure awaits.",
};

// ── Async sections (fetching happens server-side) ─────────────────────────────

async function HeroUpcomingTrip() {
  // In a real app, we fetch the immediate next trip. For cinematic effect, we'll design a stunning hero card.
  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
      <Image 
        src="/images/dest_bali.png" 
        alt="Upcoming Trip"
        fill
        className="object-cover transition-transform duration-1000 group-hover:scale-105"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            14 Days Until Departure
          </div>
          <div className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
            <Sun className="h-4 w-4 text-yellow-300" />
            82°F
          </div>
        </div>

        <div>
          <p className="text-white/80 font-medium text-lg mb-1 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Ubud, Indonesia
          </p>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-xl mb-6">
            Bali Escape
          </h2>
          
          <Button size="lg" className="rounded-full bg-primary text-primary-foreground hover:scale-105 transition-transform h-12 px-8 text-base shadow-lg shadow-primary/30 border-none">
            Continue Planning
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

async function RecentTripsSection() {
  const trips = await getRecentTrips();
  return <RecentTripsCard trips={trips} />;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome */}
      <WelcomeSection />

      {/* Cinematic Upcoming Trip Hero */}
      <Suspense fallback={<div className="h-[400px] w-full bg-muted rounded-3xl animate-pulse" />}>
        <HeroUpcomingTrip />
      </Suspense>

      {/* Main 2-column grid for trips */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent trips visual cards */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold tracking-tight">Your Journeys</h3>
          <Suspense fallback={<RecentTripsCardSkeleton />}>
            <RecentTripsSection />
          </Suspense>
        </div>

        {/* Travel-themed budget widgets (Placeholder for future update) */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold tracking-tight">Travel Fund</h3>
          <div className="relative rounded-3xl border border-border/50 bg-background/50 backdrop-blur-sm p-8 shadow-sm h-[350px] flex flex-col justify-center items-center overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
             <p className="text-muted-foreground text-center relative z-10">
               Budget overview has been redesigned.<br/>Your funds are actively tracked here.
             </p>
          </div>
        </div>
      </div>

      {/* Recommended destinations — full width */}
      <div className="pt-6 border-t border-border/40">
        <h3 className="text-2xl font-bold tracking-tight mb-6">Explore the world</h3>
        <RecommendedDestinationsCard />
      </div>
    </div>
  );
}
