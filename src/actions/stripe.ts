"use server";

import { stripe } from "@/lib/stripe";
import { onAuthenticateUser } from "./auth";

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
