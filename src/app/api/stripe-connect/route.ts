import { prismaClient } from "@/lib/prismaClient";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Check if Stripe is properly configured
    if (!stripe) {
      console.log("Stripe not configured - missing STRIPE_SECRET_KEY");
      return NextResponse.redirect(
        new URL(
          `/settings?success=false&message=Stripe+not+configured`,
          request.url
        )
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code && !state) {
      console.log("Missing required Parameters: ", { code, state });
      return NextResponse.redirect(
        new URL(
          `/settings?success=false&message=Missing+required+parameters`,
          request.url
        )
      );
    }

    console.log("Processing Stripe Connect callback: ", {
      code,
      stateId: state,
    });

    try {
      const response = await stripe.oauth.token({
        grant_type: "authorization_code",
        code: code!,
      });

      if (!response.stripe_user_id) {
        throw new Error("Stripe user id not found");
      }

      // Validate state parameter before database operation
      if (!state || typeof state !== "string") {
        throw new Error("Invalid state parameter");
      }

      try {
        await prismaClient.user.update({
          where: {
            id: state,
          },
          data: {
            stripeConnectId: response.stripe_user_id,
          },
        });
      } catch (dbError) {
        console.error("Database error during Stripe Connect:", dbError);
        throw new Error("Failed to update user with Stripe Connect ID");
      }

      console.log("Stripe Account Connected successfully", {
        userId: state,
        stripeConnectId: response.stripe_user_id,
      });

      return NextResponse.redirect(
        new URL(
          `/settings?success=true&message=Stripe+account+connected+successfully`,
          request.url
        )
      );
    } catch (stripeError) {
      console.log("Stripe Connection Error: ", stripeError);
      return NextResponse.redirect(
        new URL(
          `/settings?success=false&message=${encodeURIComponent(
            (stripeError as Error).message
          )}`,
          request.url
        )
      );
    }
  } catch (error) {
    console.log("UnExpected error in stripe callback handler:", error);

    return NextResponse.redirect(
      new URL(`/settings?success=false&message=An+unexpected+error+occured`)
    );
  }
}
