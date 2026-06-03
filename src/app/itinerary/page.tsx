import type { Metadata } from "next";
import { ItineraryView } from "./itinerary-view";

export const metadata: Metadata = {
  title: "Your Itinerary | RoamIO",
  description: "Your personalized day-by-day travel itinerary with activities, costs, and booking links.",
};

export default function ItineraryPage() {
  return <ItineraryView />;
}
