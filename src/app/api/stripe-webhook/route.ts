import { changeAttendanceType } from "@/actions/attendance";
import { updateSubscription } from "@/actions/stripe";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_SUBSCRIPTION_EVENTS = new Set([
  "invoice.created",
  "invoice.finalized",
  "invoice.paid",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

const getStripeEvent = async (
  body: string,
  sig: string | null
): Promise<Stripe.Event> => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !webhookSecret) {
    throw new Error("Stripe Signature or webhook secret missing");
  }

  return stripe.webhooks.constructEvent(body, sig, webhookSecret);
};

export async function POST(req: NextRequest) {
  console.log("Received Stripe Webhook Event");
  const body = await req.text();

  const signature = (await headers()).get("Stripe-Signature");

  try {
    const stripeEvent = await getStripeEvent(body, signature);
    if (!STRIPE_SUBSCRIPTION_EVENTS.has(stripeEvent.type)) {
      console.log("Unhandled irrelevent event!", stripeEvent.type);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const event = stripeEvent.data.object as Stripe.Subscription;
    const metadata = event.metadata;

    if (
      metadata.connectAccountPayments ||
      metadata.connectAccountSubscriptions
    ) {
      console.log("Skipping Connected Account subscription Event");

      if (event.metadata && event.metadata.attendeeId) {
        switch (stripeEvent.type) {
          case "checkout.session.completed":
            await changeAttendanceType(
              event?.metadata?.attendeeId,
              event?.metadata?.webinarId,
              "CONVERTED"
            );
        }
      }
      return NextResponse.json(
        { message: "Skipping Connected Account Event" },
        { status: 200 }
      );
    }

    switch (stripeEvent.type) {
      case "checkout.session.completed":
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await updateSubscription(event);
        console.log("Created from webhook 💳", event);
        return NextResponse.json({ received: true }, { status: 200 });
      default:
        console.log("unhandled irrelevent event", stripeEvent.type);
        return NextResponse.json({ received: true }, { status: 200 });
    }
  } catch (error: any) {
    console.error("Webhook Processing Error: ", error);
    return new NextResponse(`Webhook Error: ${error.message}`, {
      status: error.statusCode || 500,
    });
  }
}
