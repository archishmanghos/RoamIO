import { z } from "zod";

// ── Trip Planning Input ──────────────────────────
export const tripInputSchema = z.object({
  locationType: z.enum(["domestic", "international", "surprise"]),
  placeType: z.enum(["beach", "mountain", "city", "countryside", "island", "desert"]),
  vibe: z.enum(["adventure", "relaxation", "cultural", "romantic", "party", "family"]),
  days: z.number().min(1).max(30),
  people: z.number().min(1).max(20),
  budget: z.enum(["budget", "moderate", "luxury"]),
  travelMonth: z.string().optional(),
});

export type TripInput = z.infer<typeof tripInputSchema>;

// ── AI Response: Destinations ────────────────────
export const destinationSchema = z.object({
  name: z.string(),
  country: z.string(),
  description: z.string(),
  highlights: z.array(z.string()),
  estimatedCosts: z.object({
    localCurrencyCode: z.string(),
    amountLocal: z.number(),
    amountUSD: z.number(),
    amountEUR: z.number(),
    amountGBP: z.number(),
    amountINR: z.number(),
  }),
  weatherTag: z.string(),
  bestMonths: z.string(),
});

export const destinationsResponseSchema = z.object({
  destinations: z.array(destinationSchema).min(1).max(5),
});

export type Destination = z.infer<typeof destinationSchema>;
export type DestinationsResponse = z.infer<typeof destinationsResponseSchema>;

// ── AI Response: Itinerary ───────────────────────
export const activitySchema = z.object({
  activity: z.string(),
  description: z.string().optional(),
  duration: z.string(),
  cost: z.string(),
  time: z.string().optional(),
});

export const gettingThereSchema = z.object({
  nearestAirport: z.string().describe("IATA code of the nearest major commercial airport, e.g., TRV for Varkala"),
  airportName: z.string(),
  transportToDestination: z.string().describe("Brief guide on how to get from the airport to the destination"),
  trainRoute: z.string().optional().describe("Nearest railway station and route to destination, if applicable"),
  roadRoute: z.string().optional().describe("Bus or road route from major nearby cities, if applicable"),
});

export const itineraryDaySchema = z.object({
  day: z.number(),
  title: z.string(),
  morning: activitySchema,
  afternoon: activitySchema,
  evening: activitySchema,
});

export const itineraryResponseSchema = z.object({
  days: z.array(itineraryDaySchema),
  totalEstimatedCost: z.string().optional(),
  tips: z.array(z.string()).optional(),
  gettingThere: gettingThereSchema.optional(),
});

export type ItineraryDay = z.infer<typeof itineraryDaySchema>;
export type ItineraryResponse = z.infer<typeof itineraryResponseSchema>;
