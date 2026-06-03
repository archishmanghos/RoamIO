import type { Metadata } from "next";
import { ResultsView } from "@/app/results/results-view";

export const metadata: Metadata = {
  title: "Your Destinations | RoamIO",
  description: "AI-curated destination recommendations based on your travel preferences.",
};

export default function ResultsPage() {
  return <ResultsView />;
}
