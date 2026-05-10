"use server";

import { ActivityType } from "@prisma/client";
import { Destination, DiscoveredActivity, MOCK_ACTIVITIES, MOCK_DESTINATIONS } from "@/lib/data/mock-discovery";

// In a real application, these would be calls to Yelp, Google Places, or an internal DB.

export async function searchDestinations(
  query: string = "",
  country: string = ""
): Promise<Destination[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  let results = [...MOCK_DESTINATIONS];

  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(
      (d) =>
        d.name.toLowerCase().includes(lowerQuery) ||
        d.description.toLowerCase().includes(lowerQuery)
    );
  }

  if (country && country !== "all") {
    results = results.filter((d) => d.countryCode === country);
  }

  // Sort by popularity by default
  return results.sort((a, b) => b.popularityScore - a.popularityScore);
}

export async function getDestinationById(id: string): Promise<Destination | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_DESTINATIONS.find((d) => d.id === id) || null;
}

export async function getActivitiesByDestination(
  destinationId: string,
  category: string = "all"
): Promise<DiscoveredActivity[]> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  let results = MOCK_ACTIVITIES.filter((a) => a.destinationId === destinationId);

  if (category && category !== "all") {
    results = results.filter((a) => a.type === (category as ActivityType));
  }

  return results.sort((a, b) => b.rating - a.rating);
}

export async function getAvailableCountries(): Promise<{ name: string; code: string }[]> {
  const countries = new Map<string, string>();
  MOCK_DESTINATIONS.forEach((d) => {
    countries.set(d.countryCode, d.country);
  });
  return Array.from(countries.entries()).map(([code, name]) => ({ code, name }));
}
