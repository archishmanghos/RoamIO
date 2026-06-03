/**
 * Multi-provider AI abstraction with automatic fallback waterfall.
 * 1. Anthropic Claude (haiku for cost, sonnet for quality)
 * 2. Google Gemini Flash (free tier)
 * 3. DeepSeek Chat (ultra cheap fallback)
 */

export type AIProvider = "anthropic" | "gemini" | "deepseek";

interface AIResponse {
  content: string;
  provider: AIProvider;
}

async function callAnthropic(systemPrompt: string, userPrompt: string): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(`Anthropic ${res.status}: ${JSON.stringify(error)}`);
  }

  const data = await res.json();
  return data.content[0].text;
}

async function callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: { maxOutputTokens: 4096, temperature: 0.7, responseMimeType: "application/json" },
      }),
    }
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(`Gemini ${res.status}: ${JSON.stringify(error)}`);
  }

  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

async function callDeepSeek(systemPrompt: string, userPrompt: string): Promise<string> {
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 4096,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(`DeepSeek ${res.status}: ${JSON.stringify(error)}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

/**
 * Calls AI providers in a waterfall pattern.
 * On 429 (rate limit) from one provider, falls through to the next.
 */
export async function callAI(
  systemPrompt: string,
  userPrompt: string
): Promise<AIResponse> {
  const providers: { name: AIProvider; fn: typeof callAnthropic }[] = [
    { name: "anthropic", fn: callAnthropic },
    { name: "gemini", fn: callGemini },
    { name: "deepseek", fn: callDeepSeek },
  ];

  for (const { name, fn } of providers) {
    try {
      // Skip if API key not configured
      const keyMap: Record<AIProvider, string | undefined> = {
        anthropic: process.env.ANTHROPIC_API_KEY,
        gemini: process.env.GEMINI_API_KEY,
        deepseek: process.env.DEEPSEEK_API_KEY,
      };

      if (!keyMap[name]) {
        console.log(`[AI] Skipping ${name} — no API key configured`);
        continue;
      }

      console.log(`[AI] Trying ${name}...`);
      const content = await fn(systemPrompt, userPrompt);
      console.log(`[AI] ✓ ${name} served the request`);
      return { content, provider: name };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const isRateLimit = message.includes("429") || message.includes("quota");
      console.warn(`[AI] ${name} failed${isRateLimit ? " (rate limited)" : ""}: ${message}`);

      if (!isRateLimit) {
        // Non-rate-limit errors still fall through to next provider
        console.warn(`[AI] Falling through to next provider...`);
      }
    }
  }

  throw new Error("All AI providers failed. Please try again later.");
}

/**
 * Extract JSON from an AI response that may contain markdown code fences.
 */
export function extractJSON(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) return match[1].trim();
  
  // Try to find raw JSON
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) return jsonMatch[0];
  
  return text;
}
