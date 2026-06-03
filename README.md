# RoamIO — AI-Powered Travel Planner

A premium travel planning web application that uses AI to generate personalized itineraries based on your travel style.

![RoamIO](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui-inspired components |
| Auth | Supabase Auth (Email + Google OAuth) |
| Database | Supabase (PostgreSQL) |
| AI | Multi-provider: Anthropic → Gemini → DeepSeek |
| Maps | Leaflet.js + OpenStreetMap |
| Rate Limiting | Upstash Redis |
| Payments | Stripe (subscription) |
| Hosting | Vercel |

## Quick Start

### 1. Clone & Install

```bash
cd RoamIO
npm install --legacy-peer-deps
```

### 2. Environment Variables

Copy `.env.local` and fill in your keys:

```env
# AI Providers (at least one required)
ANTHROPIC_API_KEY=sk-ant-...
GEMINI_API_KEY=AIza...
DEEPSEEK_API_KEY=sk-...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...

# Upstash Redis (optional for dev)
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AX...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run `supabase/schema.sql`
3. Enable Google OAuth in Authentication → Providers
4. Copy your project URL and keys to `.env.local`

### 4. Stripe Setup

1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard → Developers
3. Set up webhook endpoint: `https://your-domain.com/api/stripe-webhook`
4. Listen for `checkout.session.completed` and `customer.subscription.deleted`

### 5. Upstash Redis Setup

1. Create a database at [upstash.com](https://upstash.com)
2. Copy REST URL and token to `.env.local`
3. Used for guest rate limiting (3 AI generations/day per IP)

### 6. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Architecture

### AI Provider Waterfall (`/lib/ai-client.ts`)

```
Request → Anthropic Claude (haiku) 
       → [429?] → Google Gemini Flash
       → [429?] → DeepSeek Chat
       → [all fail?] → Error
```

### Rate Limiting

| Tier | Limit | Tracking |
|------|-------|----------|
| Guest | 3/day | Upstash Redis (IP-based, 24hr TTL) |
| Free | 10/day | Supabase `usage` table |
| Pro | Unlimited | — |

### Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/plan` | 6-step trip planning wizard |
| `/results` | AI-generated destination cards |
| `/itinerary` | Day-by-day itinerary with map |
| `/pricing` | Pricing tiers |
| `/auth/login` | Sign in |
| `/auth/signup` | Create account |
| `/dashboard` | Saved trips history |

### API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate-trips` | POST | AI destination generation |
| `/api/generate-itinerary` | POST | Day-by-day itinerary |
| `/api/create-checkout` | POST | Stripe checkout session |
| `/api/stripe-webhook` | POST | Stripe payment webhook |

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Set all environment variables in Vercel dashboard → Settings → Environment Variables.

## License

MIT
