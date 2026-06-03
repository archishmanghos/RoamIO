import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check,
  X,
  Crown,
  Zap,
  Globe,
  Sparkles,
  ArrowRight,
  Wifi,
  BarChart3,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing | RoamIO",
  description: "Choose the plan that matches your exploration frequency. From free to unlimited Pro.",
};

const plans = [
  {
    name: "Guest",
    description: "Try the waters before diving in.",
    price: "Free",
    period: "",
    cta: "Start Exploring",
    href: "/plan",
    variant: "outline" as const,
    features: [
      { text: "3 AI generations per day", included: true },
      { text: "Basic trip planning", included: true },
      { text: "No account required", included: true },
      { text: "Trip history", included: false },
      { text: "Priority support", included: false },
      { text: "Offline access", included: false },
    ],
  },
  {
    name: "Free Account",
    description: "For the frequent weekend traveler.",
    price: "$0",
    period: "/forever",
    cta: "Create Account",
    href: "/auth/signup",
    variant: "default" as const,
    features: [
      { text: "10 AI generations per day", included: true },
      { text: "Full trip planning", included: true },
      { text: "Trip history & saved trips", included: true },
      { text: "PDF itinerary export", included: true },
      { text: "Priority support", included: false },
      { text: "Offline access", included: false },
    ],
  },
  {
    name: "Pro",
    description: "Limitless horizons for explorers.",
    price: "$9",
    period: "/month",
    cta: "Upgrade to Pro",
    href: "/api/create-checkout",
    variant: "amber" as const,
    badge: true,
    features: [
      { text: "Unlimited AI generations", included: true },
      { text: "Advanced AI insights", included: true },
      { text: "Group collaboration", included: true },
      { text: "Priority concierge support", included: true },
      { text: "Offline sync & access", included: true },
      { text: "Real-time weather & crowd data", included: true },
    ],
  },
];

const whyPro = [
  {
    icon: Globe,
    title: "Global Connectivity",
    description: "Access your data even in the remote reaches of the Amazon or the high Alps with offline syncing.",
  },
  {
    icon: BarChart3,
    title: "Advanced AI Insights",
    description: "Our Pro engine processes real-time weather, crowd data, and historical trends to perfect your path.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950 border border-amber-200/60 text-amber-700 dark:text-amber-500 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Simple, transparent pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-4">
            Choose your exploration speed
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-light max-w-xl mx-auto">
            From spontaneous local outings to global expeditions. Find the plan
            that scales with your wanderlust.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          {plans.map((plan, i) => (
            <Card
              key={i}
              className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-float ${
                plan.badge ? "border-amber-300 bg-amber-50 dark:bg-amber-950/20" : ""
              }`}
            >
              {plan.badge && (
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl">
                  MOST POPULAR
                </div>
              )}
              <CardContent className="p-8">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-light mb-6">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-slate-900 dark:text-slate-50">{plan.price}</span>
                  <span className="text-slate-400 font-light">{plan.period}</span>
                </div>

                <Link href={plan.href}>
                  <Button variant={plan.variant} className="w-full mb-6" size="lg">
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      {f.included ? (
                        <Check className={`w-4 h-4 ${plan.badge ? "text-amber-500" : "text-emerald-500"}`} />
                      ) : (
                        <X className="w-4 h-4 text-slate-300" />
                      )}
                      <span className={f.included ? "text-slate-600 dark:text-slate-400 font-light" : "text-slate-400 font-light"}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Why Pro */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 text-center mb-12">
            Why RoamIO Pro?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {whyPro.map((item, i) => (
              <Card key={i} className="glass hover:shadow-float transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
