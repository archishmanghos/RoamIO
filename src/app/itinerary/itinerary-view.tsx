"use client";

import { useRouter } from "next/navigation";
import { useTripStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DestinationMap } from "@/components/map/destination-map";
import {
  ArrowLeft,
  Plane,
  Hotel,
  Download,
  Sun,
  Sunset,
  Moon,
  MapPin,
  Clock,
  DollarSign,
  Lightbulb,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export function ItineraryView() {
  const router = useRouter();
  const { selectedDestination, itinerary, tripInput, currency, setCurrency } = useTripStore();

  if (!selectedDestination || !itinerary) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-2">No itinerary yet</h2>
          <p className="text-slate-500 dark:text-slate-400 font-light mb-6">
            Choose a destination first to generate your itinerary.
          </p>
          <Button variant="amber" onClick={() => router.push("/plan")}>
            Plan a Trip
          </Button>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(`${selectedDestination.name}, ${selectedDestination.country}`, pageWidth / 2, y, { align: "center" });
    y += 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`${tripInput.days || itinerary.days.length} Days • ${tripInput.people || 2} People`, pageWidth / 2, y, { align: "center" });
    y += 15;

    // Days
    for (const day of itinerary.days) {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`Day ${day.day}: ${day.title}`, 15, y);
      y += 8;

      const periods = [
        { label: "Morning", data: day.morning },
        { label: "Afternoon", data: day.afternoon },
        { label: "Evening", data: day.evening },
      ];

      for (const period of periods) {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`  ${period.label}`, 15, y);
        y += 5;
        doc.setFont("helvetica", "normal");
        doc.text(`    ${period.data.activity} — ${period.data.duration} — ${period.data.cost}`, 15, y);
        y += 4;
        if (period.data.description) {
          const lines = doc.splitTextToSize(`    ${period.data.description}`, pageWidth - 40);
          doc.text(lines, 15, y);
          y += lines.length * 4;
        }
        y += 3;
      }
      y += 5;
    }

    // Tips
    if (itinerary.tips && itinerary.tips.length > 0) {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Travel Tips", 15, y);
      y += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      for (const tip of itinerary.tips) {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
        const lines = doc.splitTextToSize(`• ${tip}`, pageWidth - 30);
        doc.text(lines, 15, y);
        y += lines.length * 5;
      }
    }

    doc.save(`RoamIO-${selectedDestination.name}-Itinerary.pdf`);
  };

  const affiliateLinks = (itinerary as any).affiliateLinks;

  const TimeIcon = ({ period }: { period: string }) => {
    switch (period) {
      case "morning": return <Sun className="w-4 h-4 text-amber-400" />;
      case "afternoon": return <Sunset className="w-4 h-4 text-orange-400" />;
      case "evening": return <Moon className="w-4 h-4 text-indigo-400" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/results")}
            className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to destinations
          </button>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 mb-2">
                {selectedDestination.name} Escape
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-light text-lg flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {itinerary.days.length} Days in {selectedDestination.country}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
              <Button variant="outline" onClick={handleDownloadPDF}>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Getting There */}
        {itinerary.gettingThere && (
          <Card className="mb-10 glass-strong border-blue-100/50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
                <Plane className="w-5 h-5 text-blue-500" />
                Getting There
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-slate-400 uppercase font-medium tracking-wider mb-1">Nearest Airport</div>
                  <div className="font-medium text-slate-900 dark:text-slate-50 text-lg">
                    {itinerary.gettingThere.airportName} 
                    <span className="text-slate-400 font-normal ml-2">({itinerary.gettingThere.nearestAirport})</span>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-light leading-relaxed mt-2">
                    {itinerary.gettingThere.transportToDestination}
                  </div>
                </div>
                {(itinerary.gettingThere.trainRoute || itinerary.gettingThere.roadRoute) && (
                  <div className="space-y-4">
                    {itinerary.gettingThere.trainRoute && (
                      <div>
                        <div className="text-xs text-slate-400 uppercase font-medium tracking-wider mb-1">By Train</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                          {itinerary.gettingThere.trainRoute}
                        </div>
                      </div>
                    )}
                    {itinerary.gettingThere.roadRoute && (
                      <div>
                        <div className="text-xs text-slate-400 uppercase font-medium tracking-wider mb-1">By Road</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 font-light leading-relaxed">
                          {itinerary.gettingThere.roadRoute}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Map */}
        <div className="mb-10">
          <DestinationMap destination={selectedDestination.name} />
        </div>

        {/* Itinerary */}
        <Accordion type="single" collapsible defaultValue="day-1" className="space-y-4">
          {itinerary.days.map((day) => (
            <AccordionItem
              key={`day-${day.day}`}
              value={`day-${day.day}`}
              className="glass rounded-2xl px-6 border-0"
            >
              <AccordionTrigger className="hover:no-underline py-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-sm font-semibold">
                    {day.day}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-slate-900 dark:text-slate-50">{day.title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-light">Day {day.day}</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 pb-2">
                  {(["morning", "afternoon", "evening"] as const).map((period) => {
                    const activity = day[period];
                    return (
                      <div
                        key={period}
                        className="flex gap-4 p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/60"
                      >
                        <div className="flex flex-col items-center gap-1 pt-1">
                          <TimeIcon period={period} />
                          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                            {period}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-slate-900 dark:text-slate-50 mb-1">{activity.activity}</h4>
                          {activity.description && (
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-light mb-2">
                              {activity.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            {activity.time && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {activity.time}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {activity.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" /> {activity.cost}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Tips */}
        {itinerary.tips && itinerary.tips.length > 0 && (
          <Card className="mt-8 glass">
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-4 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Travel Tips
              </h3>
              <ul className="space-y-2">
                {itinerary.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 font-light">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Total cost */}
        {selectedDestination.estimatedCosts ? (
          <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400 font-light">
            Estimated total: <span className="font-medium text-slate-900 dark:text-slate-50">
              {currency === "USD" ? `$${selectedDestination.estimatedCosts.amountUSD.toLocaleString()}` :
               currency === "EUR" ? `€${selectedDestination.estimatedCosts.amountEUR.toLocaleString()}` :
               currency === "GBP" ? `£${selectedDestination.estimatedCosts.amountGBP.toLocaleString()}` :
               currency === "INR" ? `₹${selectedDestination.estimatedCosts.amountINR.toLocaleString()}` :
               `${selectedDestination.estimatedCosts.amountLocal.toLocaleString()} ${selectedDestination.estimatedCosts.localCurrencyCode}`}
            </span> per person
          </div>
        ) : itinerary.totalEstimatedCost && (
          <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400 font-light">
            Estimated total: <span className="font-medium text-slate-900 dark:text-slate-50">{itinerary.totalEstimatedCost}</span>
          </div>
        )}
      </div>

      {/* ── Sticky Bottom Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800/80 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] py-2">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-col sm:flex-row">
          <div className="text-base text-slate-700 dark:text-slate-300 font-medium">
            Ready to book? Find the best deals:
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {affiliateLinks?.googleFlights && (
              <a href={affiliateLinks.googleFlights} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                <Button variant="default" size="lg" className="w-full text-base">
                  <Plane className="w-5 h-5 mr-2" />
                  Find Flights
                  <ExternalLink className="w-4 h-4 ml-2 opacity-50" />
                </Button>
              </a>
            )}
            {affiliateLinks?.booking && (
              <a href={affiliateLinks.booking} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                <Button variant="amber" size="lg" className="w-full text-base">
                  <Hotel className="w-5 h-5 mr-2" />
                  Find Hotels
                  <ExternalLink className="w-4 h-4 ml-2 opacity-50" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
