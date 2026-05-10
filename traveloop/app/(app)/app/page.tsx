import { Suspense } from "react";
import type { Metadata } from "next";
import {
  DollarSign,
  Globe,
  Map,
  CalendarCheck,
} from "lucide-react";
import {
  getBudgetByCategory,
  getDashboardStats,
  getMonthlyExpenses,
  getRecentTrips,
  getUpcomingTrips,
} from "@/actions/dashboard";
import { BudgetSummaryCard, BudgetSummaryCardSkeleton } from "@/components/dashboard/budget-summary-card";
import { QuickActionsCard } from "@/components/dashboard/quick-actions-card";
import { RecentTripsCard, RecentTripsCardSkeleton } from "@/components/dashboard/recent-trips-card";
import { RecommendedDestinationsCard } from "@/components/dashboard/recommended-destinations-card";
import { SpendingChart, SpendingChartSkeleton } from "@/components/dashboard/spending-chart";
import { StatCard, StatCardSkeleton } from "@/components/dashboard/stat-card";
import { UpcomingTripsCard, UpcomingTripsCardSkeleton } from "@/components/dashboard/upcoming-trips-card";
import { WelcomeSection } from "@/components/dashboard/welcome-section";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Traveloop travel operations overview.",
};

// ── Async sections (fetching happens server-side) ─────────────────────────────

async function StatsSection() {
  const stats = await getDashboardStats();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Trips"
        value={stats.totalTrips}
        subtitle="All time"
        change={stats.tripsChange}
        icon={<Map className="h-4 w-4" />}
        accent="blue"
      />
      <StatCard
        title="Upcoming"
        value={stats.upcomingTrips}
        subtitle="Planned trips"
        icon={<CalendarCheck className="h-4 w-4" />}
        accent="purple"
      />
      <StatCard
        title="Total Spent"
        value={`$${stats.totalExpenses >= 1000 ? `${(stats.totalExpenses / 1000).toFixed(1)}k` : stats.totalExpenses.toFixed(0)}`}
        subtitle="Across all trips"
        change={stats.expensesChange}
        icon={<DollarSign className="h-4 w-4" />}
        accent="amber"
      />
      <StatCard
        title="Saved Destinations"
        value={stats.savedDestinations}
        subtitle="Wishlist"
        icon={<Globe className="h-4 w-4" />}
        accent="emerald"
      />
    </div>
  );
}

async function RecentTripsSection() {
  const trips = await getRecentTrips();
  return <RecentTripsCard trips={trips} />;
}

async function UpcomingTripsSection() {
  const trips = await getUpcomingTrips();
  return <UpcomingTripsCard trips={trips} />;
}

async function SpendingSection() {
  const data = await getMonthlyExpenses();
  return <SpendingChart data={data} />;
}

async function BudgetSection() {
  const data = await getBudgetByCategory();
  return <BudgetSummaryCard data={data} />;
}

// ── Skeleton rows ─────────────────────────────────────────────────────────────

function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <WelcomeSection />

      {/* Stat cards */}
      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection />
      </Suspense>

      {/* Quick actions */}
      <QuickActionsCard />

      {/* Main 2-column grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent trips */}
        <Suspense fallback={<RecentTripsCardSkeleton />}>
          <RecentTripsSection />
        </Suspense>

        {/* Upcoming trips */}
        <Suspense fallback={<UpcomingTripsCardSkeleton />}>
          <UpcomingTripsSection />
        </Suspense>
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<SpendingChartSkeleton />}>
          <SpendingSection />
        </Suspense>

        <Suspense fallback={<BudgetSummaryCardSkeleton />}>
          <BudgetSection />
        </Suspense>
      </div>

      {/* Recommended destinations — full width */}
      <RecommendedDestinationsCard />
    </div>
  );
}
