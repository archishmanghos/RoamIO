import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Mock Stripe checkout if keys are missing (perfect for testing Pro features without Stripe)
    if (!process.env.STRIPE_SECRET_KEY) {
      console.log("[create-checkout] Mocking Stripe upgrade for user:", user.id);
      const serviceRoleSupabase = createServiceRoleClient();
      await serviceRoleSupabase
        .from("profiles")
        .update({ tier: "pro", stripe_customer_id: "mock_customer_" + user.id })
        .eq("id", user.id);

      return NextResponse.json({ url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?session_id=mock_session` });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      apiVersion: "2024-06-20" as any,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: user.email,
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: "RoamIO Pro", description: "Unlimited AI trip planning" },
          recurring: { interval: "month" },
          unit_amount: 900,
        },
        quantity: 1,
      }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing`,
      metadata: { user_id: user.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[create-checkout]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
