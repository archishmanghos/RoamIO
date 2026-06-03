/**
 * Rate limiting logic:
 * - Guest (no login): 3 AI generations/day per IP via Upstash Redis
 * - Free account: 10 generations/day via Supabase usage table
 * - Pro account: unlimited
 */

import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    return redis;
  }
  return null;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  tier: "guest" | "free" | "pro";
}

/**
 * Check rate limit for guest users (by IP address).
 * Uses Upstash Redis with 24hr TTL.
 */
export async function checkGuestRateLimit(ip: string): Promise<RateLimitResult> {
  const GUEST_LIMIT = 3;
  const redisClient = getRedis();

  if (!redisClient) {
    // If Redis not configured, allow (dev mode)
    return { allowed: true, remaining: GUEST_LIMIT, limit: GUEST_LIMIT, tier: "guest" };
  }

  const key = `ratelimit:guest:${ip}`;
  const current = await redisClient.get<number>(key);
  const count = current || 0;

  if (count >= GUEST_LIMIT) {
    return { allowed: false, remaining: 0, limit: GUEST_LIMIT, tier: "guest" };
  }

  return { allowed: true, remaining: GUEST_LIMIT - count, limit: GUEST_LIMIT, tier: "guest" };
}

/**
 * Increment the guest rate limit counter.
 */
export async function incrementGuestUsage(ip: string): Promise<void> {
  const redisClient = getRedis();
  if (!redisClient) return;

  const key = `ratelimit:guest:${ip}`;
  const exists = await redisClient.exists(key);
  await redisClient.incr(key);

  if (!exists) {
    // Set TTL of 24 hours on first use
    await redisClient.expire(key, 86400);
  }
}

/**
 * Check rate limit for authenticated users.
 * Uses Supabase usage table.
 */
export async function checkUserRateLimit(
  userId: string,
  tier: string,
  todayCount: number
): Promise<RateLimitResult> {
  if (tier === "pro") {
    return { allowed: true, remaining: Infinity, limit: Infinity, tier: "pro" };
  }

  const FREE_LIMIT = 10;
  const remaining = Math.max(0, FREE_LIMIT - todayCount);

  return {
    allowed: todayCount < FREE_LIMIT,
    remaining,
    limit: FREE_LIMIT,
    tier: "free",
  };
}
