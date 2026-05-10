import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar, MapPin, Navigation, NotebookText, Globe2, Plane, Compass } from "lucide-react";
import { getPublicTrip } from "@/actions/share";
import { CopyTripButton } from "@/components/trips/copy-trip-button";
import { Badge } from "@/components/ui/badge";

type PublicTrip = NonNullable<Awaited<ReturnType<typeof getPublicTrip>>>;

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
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden pb-24">
      {/* Cinematic Blurred Background Glow from cover image */}
      <div className="absolute inset-0 z-0 h-[600px] pointer-events-none overflow-hidden">
        {trip.coverImage ? (
          <Image
            src={trip.coverImage}
            alt=""
            fill
            className="object-cover blur-3xl opacity-[0.15] scale-125"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
        {/* ── Header Card (Cinematic Layout) ─────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-[32px] border border-border/50 bg-background/40 backdrop-blur-xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
          <div className="space-y-6 text-center md:text-left max-w-xl">
            <div className="flex justify-center md:justify-start">
              <Badge className="bg-primary/10 text-primary border-none hover:bg-primary/20 transition-colors py-1.5 px-3.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Globe2 className="h-3.5 w-3.5" />
                Public Shared Itinerary
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-tight drop-shadow-sm">
                {trip.name}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 pt-2 text-muted-foreground font-medium text-base sm:text-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-accent shrink-0" />
                  <span>{trip.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-accent shrink-0" />
                  <span>{dateRange}</span>
                </div>
              </div>
            </div>
            
            {trip.description && (
              <p className="text-muted-foreground leading-relaxed text-base sm:text-lg border-l-2 border-primary/20 pl-4 py-1">
                {trip.description}
              </p>
            )}

            {trip.user?.name && (
              <div className="flex items-center justify-center md:justify-start gap-3 pt-2 text-sm text-muted-foreground">
                {trip.user.image ? (
                  <Image
                    src={trip.user.image}
                    alt={trip.user.name}
                    width={28}
                    height={28}
                    className="rounded-full border border-border"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white">
                    {trip.user.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span>Curated by <strong className="text-foreground font-semibold">{trip.user.name}</strong></span>
              </div>
            )}
          </div>

          {/* Duplication button */}
          <div className="shrink-0 pt-2">
            <CopyTripButton slug={slug} />
          </div>
        </div>

        {/* ── Itinerary Stops ─────────────────────────────────────────────────── */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 border-b border-border/40 pb-5">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <Navigation className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">The Itinerary</h2>
              <p className="text-muted-foreground text-sm">Follow the day-by-day travel breakdown.</p>
            </div>
          </div>

          {trip.stops.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-border/60 bg-muted/20 p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
              <Compass className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <h4 className="font-semibold text-lg text-foreground mb-1">No stops planned</h4>
              <p className="text-sm max-w-xs">This trip currently has no itinerary stops planned by the creator.</p>
            </div>
          ) : (
            <div className="space-y-10 relative pl-4 sm:pl-8">
              {/* Vertical timeline connector */}
              <div className="absolute left-6 sm:left-[39px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-primary via-accent to-border/20 z-0" />

              {trip.stops.map((stop: PublicTrip["stops"][number], index: number) => (
                <div key={stop.id} className="relative z-10">
                  {/* Timeline Node Icon (Plane or MapPin) */}
                  <div className="absolute left-[-22px] sm:left-[-25px] top-4 h-10 w-10 rounded-full border-4 border-background bg-card shadow-lg flex items-center justify-center ring-1 ring-border/40 z-20 group-hover:scale-110 transition-transform">
                    {index === 0 ? (
                      <Plane className="h-4 w-4 text-primary" />
                    ) : (
                      <MapPin className="h-4 w-4 text-accent" />
                    )}
                  </div>
                  
                  <div className="rounded-[24px] border border-border/50 bg-background/50 backdrop-blur-md p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/30 pb-4 mb-6">
                      <div>
                        <span className="text-xs font-bold text-accent uppercase tracking-wider">Day {index + 1}</span>
                        <h3 className="text-2xl font-bold text-foreground mt-0.5">
                          {stop.name}
                          {stop.city && <span className="text-muted-foreground font-normal text-lg">, {stop.city}</span>}
                        </h3>
                      </div>
                      {(stop.startDate || stop.endDate) && (
                        <Badge className="bg-primary/10 text-primary border-none w-fit text-sm py-1 px-3 rounded-full font-medium shadow-sm">
                          {stop.startDate && format(new Date(stop.startDate), "MMM d")} 
                          {stop.endDate && ` - ${format(new Date(stop.endDate), "MMM d")}`}
                        </Badge>
                      )}
                    </div>

                    {stop.activities.length > 0 ? (
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Scheduled Activities</h4>
                        <ul className="space-y-3">
                          {stop.activities.map((act: PublicTrip["stops"][number]["activities"][number]) => (
                            <li key={act.id} className="flex items-start justify-between gap-4 rounded-2xl border border-border/30 bg-muted/20 p-4 hover:bg-muted/40 transition-colors">
                              <div className="space-y-1">
                                <p className="font-semibold text-foreground text-base">{act.title}</p>
                                {act.location && (
                                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 font-medium">
                                    <MapPin className="h-3.5 w-3.5 text-accent shrink-0" /> {act.location}
                                  </p>
                                )}
                              </div>
                              {act.startsAt && (
                                <div className="text-xs font-semibold text-muted-foreground whitespace-nowrap bg-background border border-border/50 px-2.5 py-1.5 rounded-xl shadow-sm">
                                  {format(new Date(act.startsAt), "h:mm a")}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic pl-2 border-l border-border/30">No specific activities planned for this stop yet.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Shared Travel Notes ─────────────────────────────────────────────── */}
        {trip.travelNotes.length > 0 && (
          <div className="space-y-8 pt-8 border-t border-border/40">
            <div className="flex items-center gap-3 pb-2">
              <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <NotebookText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight">Traveler Notes</h2>
                <p className="text-muted-foreground text-sm">Crucial reminders, recommendations, and local insights.</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {trip.travelNotes.map((note: PublicTrip["travelNotes"][number]) => (
                <div key={note.id} className="rounded-[24px] border border-border/50 bg-background/50 backdrop-blur-md p-6 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-300">
                  <div className="space-y-3">
                    {note.title && <h3 className="font-bold text-lg text-foreground">{note.title}</h3>}
                    <div 
                      className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed line-clamp-6"
                      dangerouslySetInnerHTML={{ __html: note.content }}
                    />
                  </div>
                  <div className="pt-4 border-t border-border/30 mt-6 text-xs text-muted-foreground font-medium flex justify-between items-center">
                    <span>Public Note</span>
                    <span>{format(new Date(note.createdAt), "MMM d, yyyy")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
