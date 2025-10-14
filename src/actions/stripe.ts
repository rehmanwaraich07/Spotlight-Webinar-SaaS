"use server";

import { stripe } from "@/lib/stripe";
import { onAuthenticateUser } from "./auth";
import Stripe from "stripe";
import { prismaClient } from "@/lib/prismaClient";
import { changeAttendanceType } from "./attendance";
import { toast } from "sonner";

export const getAllProductsFromStripe = async () => {
  try {
    if (!stripe) {
      return {
        error: "Stripe not configured",
        status: 500,
        success: false,
      };
    }

    const currentUser = await onAuthenticateUser();

    if (!currentUser) {
      return {
        error: "User not Authenticated",
        status: 401,
        success: false,
      };
    }

    if (!currentUser.user?.stripeConnectId) {
      return {
        error: "User not Connected to Stripe",
        status: 401,
        success: false,
      };
    }

    const products = await stripe.products.list(
      {},
      {
        stripeAccount: currentUser.user.stripeConnectId,
      }
    );

    return {
      products: products.data,
      status: 200,
      success: true,
    };
  } catch (error) {
    console.log("Error in getting the Products from Stripe", error);
    return {
      error: "Error in getting Products from stripe",
      status: 500,
      success: false,
    };
  }
};

export const onGetStripeClientSecret = async (
  email: string,
  userId: string
) => {
  try {
    if (!stripe) {
      return { status: 500, message: "Stripe not configured" };
    }

    // Read the price id at request time to avoid stale build-time values
    const subscriptionPriceId =
      process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID || "";
    if (!subscriptionPriceId) {
      return { status: 500, message: "Missing subscription price id" };
    }

    let customer: Stripe.Customer;
    const existingCustomers = await stripe.customers.list({ email: email });
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      // Create a new Customer

      customer = await stripe.customers.create({
        email: email,
        metadata: {
          userId: userId,
        },
      });

      await prismaClient.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId: customer.id,
        },
      });

      // Validate the price exists in the current Stripe mode (test/live)
      try {
        await stripe.prices.retrieve(subscriptionPriceId);
      } catch (e) {
        return {
          status: 400,
          message: "Invalid Stripe price id for current mode",
        };
      }

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: subscriptionPriceId }],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
        metadata: {
          userId: userId,
        },
      });

      const paymentIntent = (subscription.latest_invoice as Stripe.Invoice)
        .payment_intent as Stripe.PaymentIntent;

      return {
        status: 200,
        secret: paymentIntent.client_secret,
        customerId: customer.id,
      };
    }
  } catch (error) {
    console.error("Subscription creation error: ", error);
    return { status: 400, mssage: "Failed to create subscription" };
  }
};

export const updateSubscription = async (subscription: Stripe.Subscription) => {
  try {
    const userId = subscription.metadata.userId;

    await prismaClient.user.update({
      where: { id: userId },
      data: {
        subscription: subscription.status === "active" ? true : false,
      },
    });
  } catch (error) {
    console.log("Error in updating the Subscription: ", error);
  }
};

export const createCheckoutLink = async (
  priceId: string,
  stripeId: string,
  attendeeId: string,
  webinarId: string,
  bookCall: boolean = false
) => {
  try {
    if (!stripe) {
      return {
        error: "Stripe not configured",
        status: 500,
        success: false,
      };
    }

    const session = await stripe.checkout.sessions.create(
      {
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
        metadata: {
          attendeeId: attendeeId,
          webinarId: webinarId,
        },
      },
      {
        stripeAccount: stripeId,
      }
    );

    if (bookCall) {
      await changeAttendanceType(attendeeId, webinarId, "ADDED_TO_CART");
    }

    return {
      sessionUrl: session.url,
      success: true,
      status: 200,
    };
  } catch (error) {
    toast.error("Error in creating Checkout Link");
    console.error("Error creating chcekout link: ", error);
    return {
      error: "Error creating the checkout link",
      status: 500,
      success: false,
    };
  }
};
