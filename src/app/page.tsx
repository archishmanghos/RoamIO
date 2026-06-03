import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Compass,
  Sparkles,
  CreditCard,
  MapPin,
  ArrowRight,
  Check,
  X,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Define your vibe",
    description:
      "Tell us your destination and style — whether it's high-octane adventure or sunset relaxation.",
    icon: Compass,
  },
  {
    number: "02",
    title: "AI Curation",
    description:
      "Our concierge engine scans thousands of local gems to build a fluid, logical itinerary in seconds.",
    icon: Sparkles,
  },
  {
    number: "03",
    title: "One-tap booking",
    description:
      "Confirm your hotels, flights, and tables in a single transaction. Seamless, secured, and ready.",
    icon: CreditCard,
  },
];

const collections = [
  {
    title: "The Aegean Solace",
    location: "Santorini, Greece",
    gradient: "from-blue-400 to-cyan-300",
    emoji: "🏛️",
  },
  {
    title: "Zen Echoes",
    location: "Kyoto, Japan",
    gradient: "from-pink-300 to-rose-400",
    emoji: "🎋",
  },
  {
    title: "Urban Noir",
    location: "Paris, France",
    gradient: "from-slate-600 to-slate-800",
    emoji: "🗼",
  },
  {
    title: "Alpine Peaks",
    location: "Zermatt, Switzerland",
    gradient: "from-emerald-400 to-teal-500",
    emoji: "⛰️",
  },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* ───── Hero Section ───── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-amber-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800/30" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-amber-100/40 dark:bg-amber-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-slate-100/60 dark:bg-slate-800/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950 border border-amber-200/60 text-amber-700 dark:text-amber-500 text-xs font-medium mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            AI-powered travel planning
          </div>

          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 leading-[1.1] mb-6 animate-slide-up">
            Your next escape,
            <br />
            <span className="text-gradient">planned in seconds</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-light max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
            Discover tailored itineraries designed by AI to match your unique
            travel style. No clutter, no stress, just pure exploration.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link href="/plan">
              <Button variant="amber" size="xl" className="group">
                Start Planning
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/#how-it-works">
              <Button variant="outline" size="xl">
                How it works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ───── How It Works ───── */}
      <section id="how-it-works" className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-4">
              Effortless three-step logistics
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-light max-w-lg mx-auto">
              From dream to departure in minutes, not hours.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <Card
                key={i}
                className="group hover:shadow-float hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                <CardContent className="p-8 pt-8">
                  <span className="step-number absolute top-4 right-6">
                    {step.number}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors duration-300">
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Trending Collections ───── */}
      <section className="py-20 md:py-32 bg-slate-50 dark:bg-slate-950/50 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-4">
              Trending Collections
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-light max-w-lg mx-auto">
              Curated worlds designed for every type of traveler. From Alpine
              heights to urban hidden alleys.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.map((item, i) => (
              <Card
                key={i}
                className="group cursor-pointer hover:shadow-float hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                <div
                  className={`h-48 bg-gradient-to-br ${item.gradient} flex items-center justify-center text-5xl`}
                >
                  {item.emoji}
                </div>
                <CardContent className="p-5">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 font-light">
                    <MapPin className="w-3.5 h-3.5" />
                    {item.location}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Pricing Preview ───── */}
      <section id="pricing" className="py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-4">
              Transparent Pricing
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-light max-w-lg mx-auto">
              No hidden fees. Choose the tier that matches your exploration
              frequency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 max-w-2xl mx-auto gap-8">
            <Card className="p-8">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Free</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-400 font-light">AI Planning (10/day)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-400 font-light">Mobile App Access</span>
                </li>
                <li className="flex items-center gap-2">
                  <X className="w-4 h-4 text-slate-300" />
                  <span className="text-slate-400 font-light">Priority Support</span>
                </li>
              </ul>
            </Card>

            <Card className="p-8 border-amber-200 bg-amber-50 dark:bg-amber-950/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                PRO
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Pro</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-500" />
                  <span className="text-slate-600 dark:text-slate-400 font-light">Unlimited Planning</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-500" />
                  <span className="text-slate-600 dark:text-slate-400 font-light">Group Collaboration</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-500" />
                  <span className="text-slate-600 dark:text-slate-400 font-light">Priority Concierge</span>
                </li>
              </ul>
            </Card>
          </div>

          <div className="text-center mt-10">
            <Link href="/pricing">
              <Button variant="outline" size="lg">
                View full pricing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-20 md:py-32 relative">
        <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center">
          <div className="glass-strong rounded-3xl p-12 md:p-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-4">
              Ready to explore?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-light max-w-md mx-auto mb-8">
              Join thousands of travelers who plan smarter with AI-powered
              itineraries.
            </p>
            <Link href="/plan">
              <Button variant="amber" size="xl" className="group">
                Plan your trip now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
