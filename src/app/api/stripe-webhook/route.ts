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
  if (!stripe) {
    throw new Error("Stripe not configured");
  }

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
      console.log("Unhandled irrelevant event!", stripeEvent.type);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Handle connected account specific metadata (skip if flagged)
    const eventObject: any = stripeEvent.data.object as any;
    const baseMetadata = eventObject?.metadata || {};
    if (
      baseMetadata.connectAccountPayments ||
      baseMetadata.connectAccountSubscriptions
    ) {
      console.log("Skipping Connected Account subscription Event");
      // If attendee metadata exists on checkout session, mark converted
      if (
        stripeEvent.type === "checkout.session.completed" &&
        baseMetadata.attendeeId &&
        baseMetadata.webinarId
      ) {
        await changeAttendanceType(
          baseMetadata.attendeeId,
          baseMetadata.webinarId,
          "CONVERTED"
        );
      }
      return NextResponse.json(
        { message: "Skipping Connected Account Event" },
        { status: 200 }
      );
    }

    switch (stripeEvent.type) {
      case "checkout.session.completed": {
        if (!stripe) throw new Error("Stripe not configured");
        const session = stripeEvent.data.object as Stripe.Checkout.Session;
        const sessionId = session.id;
        // Retrieve full session with expanded subscription
        const fullSession = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ["subscription"],
        });
        let subscription: Stripe.Subscription | null = null;
        if (typeof fullSession.subscription === "string") {
          subscription = await stripe.subscriptions.retrieve(
            fullSession.subscription
          );
        } else {
          subscription = fullSession.subscription as Stripe.Subscription | null;
        }

        if (!subscription) {
          console.warn("No subscription found on checkout.session.completed", {
            sessionId,
          });
          return NextResponse.json({ received: true }, { status: 200 });
        }

        await updateSubscription(subscription);
        console.log("Subscription updated from checkout.session.completed", {
          subscriptionId: subscription.id,
        });
        return NextResponse.json({ received: true }, { status: 200 });
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        await updateSubscription(subscription);
        console.log("Subscription upserted from webhook", {
          subscriptionId: subscription.id,
          event: stripeEvent.type,
        });
        return NextResponse.json({ received: true }, { status: 200 });
      }

      default:
        console.log("Unhandled relevant event", stripeEvent.type);
        return NextResponse.json({ received: true }, { status: 200 });
    }
  } catch (error: any) {
    console.error("Webhook Processing Error: ", error);
    return new NextResponse(`Webhook Error: ${error.message}`, {
      status: error.statusCode || 500,
    });
  }
}
