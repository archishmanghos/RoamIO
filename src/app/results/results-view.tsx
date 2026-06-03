"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTripStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Banknote,
  Sun,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
} from "lucide-react";

const GRADIENTS = [
  "from-blue-400 to-cyan-300",
  "from-emerald-400 to-teal-500",
  "from-rose-400 to-pink-500",
];

export function ResultsView() {
  const router = useRouter();
  const {
    destinations,
    tripInput,
    selectDestination,
    setItinerary,
    isGeneratingItinerary,
    setIsGeneratingItinerary,
    setError,
    currency,
    setCurrency,
  } = useTripStore();

  if (destinations.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-2">No destinations yet</h2>
          <p className="text-slate-500 dark:text-slate-400 font-light mb-6">Start by planning your trip first.</p>
          <Button variant="amber" onClick={() => router.push("/plan")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Plan a Trip
          </Button>
        </div>
      </div>
    );
  }

  const handleSelectDestination = async (index: number) => {
    const destination = destinations[index];
    selectDestination(destination);
    setIsGeneratingItinerary(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          days: tripInput.days || 5,
          people: tripInput.people || 2,
          budget: tripInput.budget || "moderate",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate itinerary");
      }

      const data = await res.json();
      setItinerary(data);
      router.push("/itinerary");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate itinerary");
    } finally {
      setIsGeneratingItinerary(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => router.push("/plan")}
            className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to planning
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-3">
                Recommended Destinations
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-light text-lg">
                Based on your preferences for {tripInput.vibe} {tripInput.placeType} trips.
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 shadow-sm">
              <span className="text-slate-500 dark:text-slate-400 pl-2 font-medium">Currency:</span>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value as any)}
                className="bg-transparent border-none outline-none text-slate-900 dark:text-slate-50 font-semibold cursor-pointer py-1 pr-2"
              >
                <option value="local">Local</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading overlay */}
        {isGeneratingItinerary && (
          <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Crafting your itinerary...
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-light">
                Our AI is building a detailed day-by-day plan
              </p>
            </div>
          </div>
        )}

        {/* Destination cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {destinations.map((dest, i) => (
            <Card
              key={i}
              className="group overflow-hidden hover:shadow-float hover:-translate-y-2 transition-all duration-300 cursor-pointer"
              onClick={() => handleSelectDestination(i)}
            >
              {/* Image header */}
              <div className={`h-48 bg-slate-200 relative overflow-hidden flex items-end p-6`}>
                {/* Fallback gradient / Image overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10`} />
                <img 
                  src={`https://loremflickr.com/600/400/${encodeURIComponent(dest.name)},travel/all`} 
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to gradient if image fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                    const gradientClasses = GRADIENTS[i % GRADIENTS.length].split(' ');
                    (e.target as HTMLImageElement).parentElement!.classList.add(`bg-gradient-to-br`, ...gradientClasses);
                  }}
                />
                <div className="absolute top-4 right-4 z-20 bg-white dark:bg-slate-900/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <Sun className="w-3 h-3 inline mr-1" />
                  {dest.weatherTag}
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{dest.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 font-light">
                      <MapPin className="w-3.5 h-3.5" />
                      {dest.country}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 font-light leading-relaxed mb-4">
                  {dest.description}
                </p>

                {/* Highlights */}
                <div className="space-y-2 mb-5">
                  {dest.highlights.map((h, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span className="text-slate-600 dark:text-slate-400 font-light">{h}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1 text-sm">
                    <Banknote className="w-4 h-4 text-slate-400" />
                    <span className="font-medium text-slate-900 dark:text-slate-50">
                      {dest.estimatedCosts ? (
                        currency === "USD" ? `$${dest.estimatedCosts.amountUSD.toLocaleString()}` :
                        currency === "EUR" ? `€${dest.estimatedCosts.amountEUR.toLocaleString()}` :
                        currency === "GBP" ? `£${dest.estimatedCosts.amountGBP.toLocaleString()}` :
                        currency === "INR" ? `₹${dest.estimatedCosts.amountINR.toLocaleString()}` :
                        `${dest.estimatedCosts.amountLocal.toLocaleString()} ${dest.estimatedCosts.localCurrencyCode}`
                      ) : (
                        `$${(dest as any).estimatedCostPerPerson?.toLocaleString() || "N/A"}`
                      )}
                    </span>
                    <span className="text-slate-400 font-light">/person</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {dest.bestMonths}
                  </div>
                </div>

                <Button
                  variant="default"
                  className="w-full mt-4 group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors"
                >
                  View Itinerary
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Card className="glass-strong p-8 md:p-12 max-w-2xl mx-auto">
            <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
              Need a tailor-made itinerary?
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-light mb-6">
              Our concierge AI can refine these results based on your specific
              travel dates and group size.
            </p>
            <Button variant="amber" onClick={() => router.push("/plan")}>
              Refine your search
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
