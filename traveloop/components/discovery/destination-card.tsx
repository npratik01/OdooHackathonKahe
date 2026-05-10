import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, TrendingUp } from "lucide-react";
import { Destination } from "@/lib/data/mock-discovery";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface DestinationCardProps {
  destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <Link href={`/app/discover/${destination.id}`} className="group block">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={destination.coverImage}
            alt={destination.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-xl font-bold text-white drop-shadow-sm">{destination.name}</h3>
            <div className="flex items-center gap-1.5 text-white/90 text-sm mt-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{destination.country}</span>
            </div>
          </div>
          <Badge className="absolute top-4 right-4 bg-background/80 backdrop-blur-md text-foreground hover:bg-background/90">
            <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
            {destination.popularityScore}
          </Badge>
        </div>
        <CardContent className="p-4 flex flex-col flex-1">
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {destination.description}
          </p>
          <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
            Explore activities <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
