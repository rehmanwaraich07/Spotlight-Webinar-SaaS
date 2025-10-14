import Stripe from "stripe";

// Only initialize Stripe if the secret key is available
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
      appInfo: {
          name: "Leadboard Saas",
          version: "0.1.0"
      }
  })
  : null;
