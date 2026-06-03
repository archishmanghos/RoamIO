import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MapPin,
  Calendar,
  Crown,
  ArrowRight,
  Sparkles,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "Dashboard | RoamIO",
  description: "Your saved trips and account overview.",
};

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirect=/dashboard");

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch trips
  const { data: trips } = await supabase
    .from("trips")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  // Today's usage
  const today = new Date().toISOString().split("T")[0];
  const { count: todayUsage } = await supabase
    .from("usage")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", `${today}T00:00:00`);

  const tier = profile?.tier || "free";
  const limit = tier === "pro" ? "∞" : "10";

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-1">
              Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-light">
              {tier === "pro" ? (
                <span className="inline-flex items-center gap-1">
                  <Crown className="w-4 h-4 text-amber-500" /> Pro Member
                </span>
              ) : (
                "Free Account"
              )}
              {" · "}
              {todayUsage || 0}/{limit} generations today
            </p>
          </div>
          <div className="flex gap-3">
            {tier !== "pro" && (
              <Link href="/pricing">
                <Button variant="amber" size="sm">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </Link>
            )}
            <Link href="/plan">
              <Button variant="default" size="sm">
                <Sparkles className="w-4 h-4 mr-2" />
                New Trip
              </Button>
            </Link>
          </div>
        </div>

        {/* Trips grid */}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-6">Saved Trips</h2>

        {!trips || trips.length === 0 ? (
          <Card className="glass p-12 text-center">
            <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
              No trips yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 font-light mb-6">
              Start planning to see your trip history here.
            </p>
            <Link href="/plan">
              <Button variant="amber">
                Plan your first trip
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {trips.map((trip: any) => {
              const destinations = trip.result?.destinations || [];
              const input = trip.input || {};
              return (
                <Card
                  key={trip.id}
                  className="glass hover:shadow-float hover:-translate-y-1 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                          {destinations[0]?.name || "Trip"}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-light">
                          <MapPin className="w-3 h-3" />
                          {destinations[0]?.country || input.placeType}
                        </div>
                      </div>
                      <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full text-slate-500 dark:text-slate-400">
                        {input.vibe}
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 dark:text-slate-400 font-light line-clamp-2 mb-3">
                      {destinations[0]?.description || "AI-generated trip plan"}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {input.days} days
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(trip.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
