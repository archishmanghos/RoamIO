import type { Metadata } from "next";
import { PlanWizard } from "@/app/plan/plan-wizard";

export const metadata: Metadata = {
  title: "Plan Your Trip | RoamIO",
  description: "Tell us your travel style and let AI create your perfect itinerary in seconds.",
};

export default function PlanPage() {
  return <PlanWizard />;
}
