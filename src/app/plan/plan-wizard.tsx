"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTripStore } from "@/lib/store";
import type { TripInput } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RateLimitModal } from "@/components/rate-limit-modal";
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  Home,
  Shuffle,
  Palmtree,
  Mountain,
  Building2,
  TreePine,
  Waves,
  Sun,
  Zap,
  Heart,
  Coffee,
  Music,
  Users,
  Banknote,
  Sparkles,
  Loader2,
} from "lucide-react";

const STEPS = [
  {
    key: "locationType" as keyof TripInput,
    question: "What's the scope of your exploration?",
    options: [
      { value: "domestic", label: "Domestic", icon: Home, desc: "Explore your homeland" },
      { value: "international", label: "International", icon: Globe, desc: "Cross borders" },
      { value: "surprise", label: "Surprise Me", icon: Shuffle, desc: "Let AI decide" },
    ],
  },
  {
    key: "placeType" as keyof TripInput,
    question: "What kind of place draws you in?",
    options: [
      { value: "beach", label: "Beach", icon: Palmtree, desc: "Sand & surf" },
      { value: "mountain", label: "Mountain", icon: Mountain, desc: "Peaks & trails" },
      { value: "city", label: "City", icon: Building2, desc: "Urban pulse" },
      { value: "countryside", label: "Countryside", icon: TreePine, desc: "Rural charm" },
      { value: "island", label: "Island", icon: Waves, desc: "Island escape" },
      { value: "desert", label: "Desert", icon: Sun, desc: "Golden sands" },
    ],
  },
  {
    key: "vibe" as keyof TripInput,
    question: "What's the energy of this trip?",
    options: [
      { value: "adventure", label: "Adventure", icon: Zap, desc: "Thrills & adrenaline" },
      { value: "relaxation", label: "Relaxation", icon: Coffee, desc: "Peace & calm" },
      { value: "cultural", label: "Cultural", icon: Building2, desc: "History & art" },
      { value: "romantic", label: "Romantic", icon: Heart, desc: "Love & sunset" },
      { value: "party", label: "Party", icon: Music, desc: "Nightlife & energy" },
      { value: "family", label: "Family", icon: Users, desc: "Fun for everyone" },
    ],
  },
  {
    key: "travelMonth" as keyof TripInput,
    question: "When are you planning to travel?",
    options: [
      { value: "spring", label: "Spring", icon: Sun, desc: "Mar - May" },
      { value: "summer", label: "Summer", icon: Zap, desc: "Jun - Aug" },
      { value: "autumn", label: "Autumn", icon: TreePine, desc: "Sep - Nov" },
      { value: "winter", label: "Winter", icon: Mountain, desc: "Dec - Feb" },
      { value: "flexible", label: "Flexible", icon: Shuffle, desc: "Any time works" },
    ],
  },
  {
    key: "days" as keyof TripInput,
    question: "How many days will you roam?",
    type: "slider" as const,
  },
  {
    key: "people" as keyof TripInput,
    question: "Who are you traveling with?",
    type: "counter" as const,
  },
  {
    key: "budget" as keyof TripInput,
    question: "What is your budget preference?",
    options: [
      { value: "budget", label: "Budget", icon: Banknote, desc: "Under $50/day" },
      { value: "moderate", label: "Moderate", icon: Banknote, desc: "$50-150/day" },
      { value: "luxury", label: "Luxury", icon: Banknote, desc: "$150+/day" },
    ],
  },
];

export function PlanWizard() {
  const router = useRouter();
  const {
    currentStep,
    tripInput,
    isGenerating,
    error,
    nextStep,
    prevStep,
    updateTripInput,
    setDestinations,
    setIsGenerating,
    setError,
    setStep,
  } = useTripStore();

  const [rateLimitOpen, setRateLimitOpen] = useState(false);
  const [rateLimitTier, setRateLimitTier] = useState<"guest" | "free">("guest");
  const [daysValue, setDaysValue] = useState(tripInput.days || 5);
  const [peopleValue, setPeopleValue] = useState(tripInput.people || 2);

  const step = STEPS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;
  const currentValue = tripInput[step.key];

  const canProceed = () => {
    if (step.type === "slider") return true;
    if (step.type === "counter") return true;
    return !!currentValue;
  };

  const handleOptionSelect = (value: string) => {
    updateTripInput(step.key, value as any);
    if (!isLastStep) {
      setTimeout(() => nextStep(), 200);
    }
  };

  const handleGenerate = async () => {
    // Set days and people if on those steps
    updateTripInput("days", daysValue);
    updateTripInput("people", peopleValue);

    const finalInput = {
      ...tripInput,
      days: daysValue,
      people: peopleValue,
    };

    setIsGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalInput),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setRateLimitTier(data.tier || "guest");
          setRateLimitOpen(true);
          return;
        }
        throw new Error(data.error || "Failed to generate trips");
      }

      setDestinations(data.destinations);
      router.push("/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen pt-20 pb-10 flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-16 left-0 right-0 z-40">
        <div className="h-1 bg-slate-200/60 dark:bg-slate-800/60">
          <div
            className="h-full bg-amber-500 transition-all duration-500 ease-out rounded-r-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-2xl">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors disabled:opacity-0"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <div className="w-16" />
          </div>

          {/* Question */}
          <Card className="glass-strong">
            <CardContent className="p-8 md:p-12 relative">
              <span className="step-number absolute top-6 right-8 text-8xl">
                {String(currentStep + 1).padStart(2, "0")}
              </span>

              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-50 mb-8 tracking-tight">
                {step.question}
              </h2>

              {/* Option grid */}
              {step.options && (
                <div className={`grid gap-4 ${step.options.length > 3 ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1 md:grid-cols-3"}`}>
                  {step.options.map((option) => {
                    const isSelected = currentValue === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleOptionSelect(option.value)}
                        className={`group relative p-5 rounded-xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                          isSelected
                            ? "border-amber-400 bg-amber-50 dark:bg-amber-950/50 shadow-amber"
                            : "border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/50 hover:border-slate-300 hover:shadow-glass"
                        }`}
                      >
                        <option.icon
                          className={`w-6 h-6 mb-3 transition-colors ${
                            isSelected ? "text-amber-500" : "text-slate-400 group-hover:text-slate-600 dark:text-slate-400"
                          }`}
                        />
                        <div className="font-medium text-sm text-slate-900 dark:text-slate-50">{option.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-light mt-0.5">{option.desc}</div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Days slider */}
              {step.type === "slider" && (
                <div className="space-y-8">
                  <div className="text-center">
                    <span className="text-6xl font-semibold text-slate-900 dark:text-slate-50">{daysValue}</span>
                    <span className="text-xl text-slate-400 font-light ml-2">days</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    value={daysValue}
                    onChange={(e) => {
                      setDaysValue(Number(e.target.value));
                      updateTripInput("days", Number(e.target.value));
                    }}
                    className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-amber-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>1 day</span>
                    <span>30 days</span>
                  </div>
                </div>
              )}

              {/* People counter */}
              {step.type === "counter" && (
                <div className="space-y-8">
                  <div className="text-center">
                    <span className="text-6xl font-semibold text-slate-900 dark:text-slate-50">{peopleValue}</span>
                    <span className="text-xl text-slate-400 font-light ml-2">
                      {peopleValue === 1 ? "person" : "people"}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-6">
                    <button
                      onClick={() => {
                        const v = Math.max(1, peopleValue - 1);
                        setPeopleValue(v);
                        updateTripInput("people", v);
                      }}
                      className="w-14 h-14 rounded-full border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center text-2xl text-slate-600 dark:text-slate-400 hover:border-slate-400 transition-colors"
                    >
                      −
                    </button>
                    <button
                      onClick={() => {
                        const v = Math.min(20, peopleValue + 1);
                        setPeopleValue(v);
                        updateTripInput("people", v);
                      }}
                      className="w-14 h-14 rounded-full border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center text-2xl text-slate-600 dark:text-slate-400 hover:border-slate-400 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Navigation */}
              <div className="mt-8 flex justify-end">
                {step.type === "slider" || step.type === "counter" ? (
                  isLastStep ? (
                    <Button
                      variant="amber"
                      size="lg"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="min-w-[200px]"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Trips
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="lg"
                      onClick={nextStep}
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )
                ) : isLastStep && currentValue ? (
                  <Button
                    variant="amber"
                    size="lg"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="min-w-[200px]"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Trips
                      </>
                    )}
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {/* Step dots */}
          <div className="flex justify-center gap-2 mt-8">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? "w-8 bg-amber-500"
                    : i < currentStep
                    ? "bg-slate-400"
                    : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <RateLimitModal
        open={rateLimitOpen}
        onOpenChange={setRateLimitOpen}
        tier={rateLimitTier}
        remaining={0}
        limit={rateLimitTier === "guest" ? 3 : 10}
      />
    </div>
  );
}
