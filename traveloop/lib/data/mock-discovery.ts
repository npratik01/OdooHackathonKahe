import { ActivityType } from "@prisma/client";

export interface Destination {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  popularityScore: number; // 0-100
  coverImage: string;
  description: string;
}

export interface DiscoveredActivity {
  id: string;
  destinationId: string;
  title: string;
  type: ActivityType;
  rating: number; // 0-5
  reviews: number;
  priceLevel: 1 | 2 | 3 | 4; // $ to $$$$
  description: string;
  imageUrl: string;
  location: string;
  linkUrl?: string;
}

export const MOCK_DESTINATIONS: Destination[] = [
  {
    id: "dest_paris",
    name: "Paris",
    country: "France",
    countryCode: "FR",
    popularityScore: 98,
    coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
    description: "The city of light, famous for its cafe culture, Eiffel Tower, and the Louvre museum.",
  },
  {
    id: "dest_tokyo",
    name: "Tokyo",
    country: "Japan",
    countryCode: "JP",
    popularityScore: 96,
    coverImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1994&auto=format&fit=crop",
    description: "A bustling metropolis that seamlessly blends the ultramodern with traditional temples.",
  },
  {
    id: "dest_rome",
    name: "Rome",
    country: "Italy",
    countryCode: "IT",
    popularityScore: 95,
    coverImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop",
    description: "The Eternal City, home to ancient ruins like the Colosseum and the Roman Forum.",
  },
  {
    id: "dest_bali",
    name: "Bali",
    country: "Indonesia",
    countryCode: "ID",
    popularityScore: 92,
    coverImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1938&auto=format&fit=crop",
    description: "An Indonesian island known for its forested volcanic mountains, iconic rice paddies, and coral reefs.",
  },
  {
    id: "dest_newyork",
    name: "New York City",
    country: "United States",
    countryCode: "US",
    popularityScore: 97,
    coverImage: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop",
    description: "The Big Apple, featuring Central Park, Broadway, and iconic skyscrapers.",
  },
];

export const MOCK_ACTIVITIES: DiscoveredActivity[] = [
  // Paris Activities
  {
    id: "act_louvre",
    destinationId: "dest_paris",
    title: "Louvre Museum Tour",
    type: ActivityType.TOUR,
    rating: 4.8,
    reviews: 12450,
    priceLevel: 2,
    description: "Skip the line and explore the world's largest art museum, home to the Mona Lisa.",
    imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop",
    location: "Rue de Rivoli, 75001 Paris",
    linkUrl: "https://louvre.fr",
  },
  {
    id: "act_eiffel_dinner",
    destinationId: "dest_paris",
    title: "Dinner at Jules Verne (Eiffel Tower)",
    type: ActivityType.FOOD,
    rating: 4.9,
    reviews: 3200,
    priceLevel: 4,
    description: "A Michelin-starred dining experience located on the second floor of the Eiffel Tower.",
    imageUrl: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop",
    location: "Eiffel Tower, Paris",
  },
  {
    id: "act_seine_cruise",
    destinationId: "dest_paris",
    title: "Seine River Evening Cruise",
    type: ActivityType.TOUR,
    rating: 4.7,
    reviews: 8900,
    priceLevel: 1,
    description: "See Paris illuminated at night from a glass-canopied boat sailing down the Seine.",
    imageUrl: "https://images.unsplash.com/photo-1549144490-21a719bbce2a?q=80&w=2072&auto=format&fit=crop",
    location: "Port de la Bourdonnais",
  },
  
  // Tokyo Activities
  {
    id: "act_tsukiji",
    destinationId: "dest_tokyo",
    title: "Tsukiji Outer Market Food Tour",
    type: ActivityType.FOOD,
    rating: 4.8,
    reviews: 4500,
    priceLevel: 2,
    description: "Taste fresh sushi, tamagoyaki, and street food in Tokyo's famous market.",
    imageUrl: "https://images.unsplash.com/photo-1546447147-3bfc38de9cbd?q=80&w=2070&auto=format&fit=crop",
    location: "Tsukiji, Chuo City, Tokyo",
  },
  {
    id: "act_shinkansen",
    destinationId: "dest_tokyo",
    title: "Bullet Train to Kyoto (Transport)",
    type: ActivityType.TRANSPORT,
    rating: 4.9,
    reviews: 12000,
    priceLevel: 3,
    description: "High-speed rail experience traveling across Japan at 320 km/h.",
    imageUrl: "https://images.unsplash.com/photo-1542055990-272e612ebf11?q=80&w=1925&auto=format&fit=crop",
    location: "Tokyo Station",
  },
  
  // Rome Activities
  {
    id: "act_colosseum",
    destinationId: "dest_rome",
    title: "Colosseum Underground & Ancient Rome Tour",
    type: ActivityType.TOUR,
    rating: 4.8,
    reviews: 15600,
    priceLevel: 2,
    description: "Explore the restricted underground levels of the Colosseum and the Roman Forum.",
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1996&auto=format&fit=crop",
    location: "Piazza del Colosseo, 1, Rome",
  },
  {
    id: "act_pasta_class",
    destinationId: "dest_rome",
    title: "Authentic Pasta Making Class",
    type: ActivityType.OTHER,
    rating: 4.9,
    reviews: 2100,
    priceLevel: 2,
    description: "Learn to make fresh fettuccine and ravioli from scratch with a local chef.",
    imageUrl: "https://images.unsplash.com/photo-1556761223-4c4282c73f77?q=80&w=1965&auto=format&fit=crop",
    location: "Trastevere, Rome",
  }
];
