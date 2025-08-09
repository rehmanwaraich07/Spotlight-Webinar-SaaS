"use server";

import { stripe } from "@/lib/stripe";
import { onAuthenticateUser } from "./auth";
import Stripe from "stripe";
import { prismaClient } from "@/lib/prismaClient";

export const getAllProductsFromStripe = async () => {
  try {
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

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: subscriptionPriceId }],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
        metadata: {
          userId: userId,
        },
      });
    }
  } catch (error) {}
};
