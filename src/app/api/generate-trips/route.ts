import { NextResponse } from "next/server";
import { callAI, extractJSON } from "@/lib/ai-client";
import { tripInputSchema, destinationsResponseSchema } from "@/lib/schemas";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  checkGuestRateLimit,
  incrementGuestUsage,
  checkUserRateLimit,
} from "@/lib/rate-limiter";
import { headers } from "next/headers";

const SYSTEM_PROMPT = `You are RoamIO, an expert AI travel concierge. Given the user's travel preferences, suggest exactly 3 unique destination options.

Return ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "destinations": [
    {
      "name": "City Name",
      "country": "Country",
      "description": "A compelling 2-3 sentence description of why this destination matches their preferences.",
      "highlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
      "estimatedCosts": {
        "localCurrencyCode": "EUR",
        "amountLocal": 1100,
        "amountUSD": 1200,
        "amountEUR": 1100,
        "amountGBP": 950,
        "amountINR": 100000
      },
      "weatherTag": "Sunny & pleasant",
      "bestMonths": "April - June"
    }
  ]
}

Requirements:
- Propose exactly 3 unique destinations
- Provide estimated costs per person for the ENTIRE duration of the trip in multiple currencies
- DO NOT use markdown, code fences, or backticks
- Only output the raw JSON object
- Make destinations diverse (don't suggest 3 places in the same country)
- Cost estimates should be realistic for the trip duration and budget tier
- Descriptions should be vivid and exciting
- Highlights should be specific activities or attractions`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = tripInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const input = parsed.data;

    // ── Rate Limiting ──
    const headersList = headers();
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || 
               headersList.get("x-real-ip") || 
               "unknown";

    let userId: string | null = null;
    let userTier = "guest";

    try {
      const supabase = createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        userId = user.id;
        
        // Get user profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("tier")
          .eq("id", user.id)
          .single();
        
        userTier = profile?.tier || "free";

        // Check user rate limit
        const today = new Date().toISOString().split("T")[0];
        const { count } = await supabase
          .from("usage")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("created_at", `${today}T00:00:00`);

        const rateCheck = await checkUserRateLimit(user.id, userTier, count || 0);
        
        if (!rateCheck.allowed) {
          return NextResponse.json(
            { error: "Daily limit reached", tier: "free", remaining: 0, limit: rateCheck.limit },
            { status: 429 }
          );
        }
      }
    } catch {
      // Auth not configured — treat as guest
    }

    // Guest rate limiting
    if (!userId) {
      const guestCheck = await checkGuestRateLimit(ip);
      if (!guestCheck.allowed) {
        return NextResponse.json(
          { error: "Daily limit reached", tier: "guest", remaining: 0, limit: guestCheck.limit },
          { status: 429 }
        );
      }
    }

    // Infer location for Domestic trips
    const countryCode = headersList.get("x-vercel-ip-country") || "IN"; 
    const countryMap: Record<string, string> = { "US": "United States", "IN": "India", "UK": "United Kingdom" };
    const originCountry = countryMap[countryCode] || "India";

    // ── AI Generation ──
    const userPrompt = `Plan a trip with these preferences:
- Origin Country: ${originCountry} (If 'domestic' is selected, ONLY suggest places in this country)
- Scope: ${input.locationType}
- Place type: ${input.placeType}
- Vibe: ${input.vibe}
- Duration: ${input.days} days
- Group size: ${input.people} people
- Budget tier: ${input.budget}
${input.travelMonth ? `- Travel Season: ${input.travelMonth}` : ""}

Suggest 3 destinations. Ensure the 'weatherTag' reflects the weather during the preferred travel season if specified.`;

    const { content, provider } = await callAI(SYSTEM_PROMPT, userPrompt);
    console.log(`[generate-trips] Served by: ${provider}`);

    const jsonStr = extractJSON(content);
    const result = destinationsResponseSchema.parse(JSON.parse(jsonStr));

    // ── Record Usage ──
    if (userId) {
      try {
        const supabase = createServerSupabaseClient();
        // Save trip
        await supabase.from("trips").insert({
          user_id: userId,
          input: input,
          result: result,
          provider,
        });
        // Record usage
        await supabase.from("usage").insert({
          user_id: userId,
          action: "generate_trips",
          provider,
        });
      } catch (err) {
        console.warn("[generate-trips] Failed to record usage:", err);
      }
    } else {
      // Increment guest counter
      await incrementGuestUsage(ip);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[generate-trips] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate trips" },
      { status: 500 }
    );
  }
}
