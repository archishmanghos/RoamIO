import { NextResponse } from "next/server";
import { callAI, extractJSON } from "@/lib/ai-client";
import { itineraryResponseSchema } from "@/lib/schemas";
import { buildAffiliateLinks } from "@/lib/affiliates";

const SYSTEM_PROMPT = `You are RoamIO, an expert AI travel concierge. Given a destination and trip parameters, create a detailed day-by-day itinerary.

Return ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "days": [
    {
      "day": 1,
      "title": "Arrival in [City]",
      "morning": {
        "activity": "Activity name",
        "description": "Brief description",
        "duration": "2 hours",
        "cost": "$50",
        "time": "09:00 AM"
      },
      "afternoon": {
        "activity": "Activity name",
        "description": "Brief description",
        "duration": "3 hours",
        "cost": "$30",
        "time": "02:00 PM"
      },
      "evening": {
        "activity": "Activity name",
        "description": "Brief description",
        "duration": "2 hours",
        "cost": "$80",
        "time": "07:00 PM"
      }
    }
  ],
  "totalEstimatedCost": "$1,200 per person",
  "tips": ["Tip 1", "Tip 2", "Tip 3"],
  "gettingThere": {
    "nearestAirport": "TRV",
    "airportName": "Trivandrum International Airport",
    "transportToDestination": "Take a pre-paid taxi from the airport to Varkala cliff (approx 1.5 hours, $20).",
    "trainRoute": "The nearest railway station is Varkala Sivagiri (VAK). You can take a train from Trivandrum or Kochi.",
    "roadRoute": "You can take a KSRTC bus from Trivandrum bus stand to Varkala (approx 2 hours)."
  }
}

Requirements:
- Create an entry for each day of the trip
- For gettingThere, provide the 3-letter IATA code of the nearest major airport for flights
- For gettingThere, also include trainRoute and roadRoute if those are viable alternative options
- Activities should be specific and real (use actual restaurant names, landmarks, etc.)
- Include realistic costs in USD
- Mix free and paid activities
- Include local food recommendations
- Consider logical geographic flow (don't bounce between distant areas)`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { destination, days, people, budget, startDate, origin } = body;

    if (!destination || !days) {
      return NextResponse.json({ error: "Missing destination or days" }, { status: 400 });
    }

    const userPrompt = `Create a ${days}-day itinerary for ${destination.name}, ${destination.country}.

Trip details:
- Duration: ${days} days
- Group size: ${people} people
- Budget: ${budget}
- Destination highlights: ${destination.highlights?.join(", ")}

Make it detailed and exciting!`;

    const { content, provider } = await callAI(SYSTEM_PROMPT, userPrompt);
    console.log(`[generate-itinerary] Served by: ${provider}`);

    const jsonStr = extractJSON(content);
    const result = itineraryResponseSchema.parse(JSON.parse(jsonStr));

    // Build affiliate links
    const affiliateLinks = buildAffiliateLinks({
      destination: `${destination.name}, ${destination.country}`,
      origin,
      startDate,
      guests: people,
      nearestAirport: result.gettingThere?.nearestAirport,
    });

    return NextResponse.json({
      ...result,
      affiliateLinks,
      provider,
    });
  } catch (error) {
    console.error("[generate-itinerary] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate itinerary" },
      { status: 500 }
    );
  }
}
