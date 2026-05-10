import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Calendar, Globe2, Lock, MapPin } from "lucide-react";
import { getItinerary } from "@/actions/itinerary";
import { getTripById } from "@/actions/trips";
import { getExpenses } from "@/actions/finances";
import { getChecklistItems } from "@/actions/checklist";
import { getTravelNotes } from "@/actions/travel-notes";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItineraryBuilder } from "@/components/itinerary/itinerary-builder";
import { FinanceDashboard } from "@/components/finances/finance-dashboard";
import { ChecklistModule } from "@/components/checklist/checklist-module";
import { NotesModule } from "@/components/notes/notes-module";

export const metadata = {
  title: "Trip Details | Traveloop",
};

interface TripDetailsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function TripDetailsPage({ params, searchParams }: TripDetailsPageProps) {
  const { id } = await params;
  const { tab } = await searchParams;
  
  // Fetch trip details, itinerary data, expenses, checklist, and notes concurrently
  const [trip, initialStops, expenses, checklistItems, travelNotes] = await Promise.all([
    getTripById(id),
    getItinerary(id),
    getExpenses(id),
    getChecklistItems(id),
    getTravelNotes(id),
  ]);

  if (!trip) {
    notFound();
  }

  const dateRange = `${format(new Date(trip.startDate), "MMM d, yyyy")} – ${format(new Date(trip.endDate), "MMM d, yyyy")}`;

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="relative overflow-hidden rounded-2xl bg-muted/30 border p-6 sm:p-10">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <span className="text-9xl">🗺️</span>
        </div>
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-md">
              {trip.visibility === "PUBLIC" ? <Globe2 className="mr-1 h-3 w-3" /> : <Lock className="mr-1 h-3 w-3" />}
              {trip.visibility === "PUBLIC" ? "Public" : "Private"}
            </Badge>
            <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
              {trip.status}
            </Badge>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            {trip.name}
          </h1>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground font-medium">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{trip.destination}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>{dateRange}</span>
            </div>
          </div>
          
          {trip.description && (
            <p className="pt-2 text-muted-foreground max-w-2xl leading-relaxed">
              {trip.description}
            </p>
          )}
        </div>
      </div>

      <Tabs defaultValue={tab ?? "itinerary"} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 max-w-[600px] mb-8">
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="itinerary" className="mt-0">
          <ItineraryBuilder tripId={trip.id} initialStops={initialStops} />
        </TabsContent>
        
        <TabsContent value="finances" className="mt-0">
          <FinanceDashboard trip={trip} expenses={expenses} stops={initialStops} />
        </TabsContent>

        <TabsContent value="checklist" className="mt-0">
          <ChecklistModule
            tripId={trip.id}
            initialItems={checklistItems.map((item) => ({
              id: item.id,
              title: item.title,
              category: item.category as any, // type adjustment to match prisma client
              isDone: item.isDone,
            }))}
          />
        </TabsContent>

        <TabsContent value="notes" className="mt-0">
          <NotesModule
            tripId={trip.id}
            initialNotes={travelNotes.map((n) => ({
              id: n.id,
              title: n.title ?? null,
              content: n.content,
              createdAt: new Date(n.createdAt),
              updatedAt: new Date(n.updatedAt),
            }))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
