"use client";

import { create } from "zustand";
import type { TripInput, Destination, ItineraryResponse } from "./schemas";

interface TripState {
  // Step wizard state
  currentStep: number;
  tripInput: Partial<TripInput>;

  // Results
  destinations: Destination[];
  selectedDestination: Destination | null;
  itinerary: ItineraryResponse | null;

  // Loading states
  isGenerating: boolean;
  isGeneratingItinerary: boolean;
  error: string | null;

  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateTripInput: (field: keyof TripInput, value: TripInput[keyof TripInput]) => void;
  setDestinations: (destinations: Destination[]) => void;
  selectDestination: (destination: Destination) => void;
  setItinerary: (itinerary: ItineraryResponse) => void;
  setIsGenerating: (loading: boolean) => void;
  setIsGeneratingItinerary: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  // Currency preference
  currency: "local" | "USD" | "EUR" | "GBP" | "INR";
  setCurrency: (currency: "local" | "USD" | "EUR" | "GBP" | "INR") => void;
}

const initialState = {
  currentStep: 0,
  tripInput: {},
  destinations: [],
  selectedDestination: null,
  itinerary: null,
  isGenerating: false,
  isGeneratingItinerary: false,
  error: null,
  currency: "local" as const,
};

export const useTripStore = create<TripState>((set) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 6) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),

  updateTripInput: (field, value) =>
    set((s) => ({ tripInput: { ...s.tripInput, [field]: value } })),

  setDestinations: (destinations) => set({ destinations }),
  selectDestination: (destination) => set({ selectedDestination: destination }),
  setItinerary: (itinerary) => set({ itinerary }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setIsGeneratingItinerary: (isGeneratingItinerary) => set({ isGeneratingItinerary }),
  setError: (error) => set({ error }),
  setCurrency: (currency) => set({ currency }),
  reset: () => set(initialState),
}));
