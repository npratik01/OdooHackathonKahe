import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Calendar, MapPin, Navigation, NotebookText, Globe2 } from "lucide-react";
import { getPublicTrip } from "@/actions/share";
import { CopyTripButton } from "@/components/trips/copy-trip-button";
import { Badge } from "@/components/ui/badge";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getPublicTrip(slug);

  if (!trip) {
    return { title: "Trip Not Found | Traveloop" };
  }

  const title = `${trip.name} - Travel Itinerary | Traveloop`;
  const description = trip.description || `Check out this itinerary for ${trip.destination} from ${format(new Date(trip.startDate), "MMM d")} to ${format(new Date(trip.endDate), "MMM d, yyyy")}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: trip.coverImage ? [trip.coverImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: trip.coverImage ? [trip.coverImage] : [],
    },
  };
}

export default async function PublicTripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getPublicTrip(slug);

  if (!trip) {
    notFound();
  }

  const dateRange = `${format(new Date(trip.startDate), "MMM d, yyyy")} – ${format(new Date(trip.endDate), "MMM d, yyyy")}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="relative mb-12 overflow-hidden rounded-3xl bg-muted/30 border p-8 sm:p-12">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <span className="text-9xl">🗺️</span>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="max-w-2xl space-y-4">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <Globe2 className="mr-1.5 h-3.5 w-3.5" />
              Public Itinerary
            </Badge>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground">
              {trip.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-muted-foreground font-medium text-lg">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                <span>{trip.destination}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 shrink-0 text-primary" />
                <span>{dateRange}</span>
              </div>
            </div>
            
            {trip.description && (
              <p className="pt-4 text-muted-foreground leading-relaxed text-lg">
                {trip.description}
              </p>
            )}

            {trip.user?.name && (
              <div className="pt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <span>Curated by <strong className="text-foreground">{trip.user.name}</strong></span>
              </div>
            )}
          </div>

          {/* Copy Action */}
          <div className="shrink-0">
            <CopyTripButton slug={slug} />
          </div>
        </div>
      </div>

      {/* Itinerary */}
      <div className="space-y-10">
        <div className="flex items-center gap-3 border-b pb-4">
          <Navigation className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">Itinerary</h2>
        </div>

        {trip.stops.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
            This trip currently has no itinerary stops planned.
          </div>
        ) : (
          <div className="space-y-8">
            {trip.stops.map((stop, index) => (
              <div key={stop.id} className="relative pl-8 sm:pl-10">
                {/* Timeline Line */}
                {index !== trip.stops.length - 1 && (
                  <div className="absolute left-3.5 sm:left-4 top-10 bottom-[-2rem] w-px bg-border" />
                )}
                
                {/* Timeline Node */}
                <div className="absolute left-1.5 sm:left-2 top-2 h-4 w-4 rounded-full border-2 border-primary bg-background shadow-sm ring-4 ring-background" />
                
                <div className="rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {stop.name}
                        {stop.city && <span className="text-muted-foreground font-normal">, {stop.city}</span>}
                      </h3>
                    </div>
                    {(stop.startDate || stop.endDate) && (
                      <Badge variant="secondary" className="w-fit text-sm">
                        {stop.startDate && format(new Date(stop.startDate), "MMM d")} 
                        {stop.endDate && ` - ${format(new Date(stop.endDate), "MMM d")}`}
                      </Badge>
                    )}
                  </div>

                  {stop.activities.length > 0 ? (
                    <div className="mt-6 space-y-4">
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Activities</h4>
                      <ul className="space-y-3">
                        {stop.activities.map(act => (
                          <li key={act.id} className="flex items-start gap-3 rounded-lg bg-muted/40 p-3">
                            <div className="flex-1">
                              <p className="font-medium">{act.title}</p>
                              {act.location && (
                                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                  <MapPin className="h-3 w-3" /> {act.location}
                                </p>
                              )}
                            </div>
                            {act.startsAt && (
                              <div className="text-sm text-muted-foreground whitespace-nowrap bg-background px-2 py-1 rounded-md border">
                                {format(new Date(act.startsAt), "h:mm a")}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-muted-foreground italic">No specific activities planned for this stop yet.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Public Notes */}
        {trip.travelNotes.length > 0 && (
          <div className="mt-16 space-y-6">
             <div className="flex items-center gap-3 border-b pb-4">
              <NotebookText className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold tracking-tight">Travel Notes</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {trip.travelNotes.map(note => (
                <div key={note.id} className="rounded-xl border bg-card p-5 shadow-sm">
                  {note.title && <h3 className="font-semibold mb-2">{note.title}</h3>}
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none line-clamp-6 text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: note.content }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
