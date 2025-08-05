import { onAuthenticateUser } from "@/actions/auth";
import { getStripeOAuthLink } from "@/lib/stripe/utils";
import {
  LucideAlertCircle,
  LucideArrowRight,
  LucideCheckCircle2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

const SettingsPage = async (props: Props) => {
  const userExist = await onAuthenticateUser();
  if (!userExist) {
    redirect("/sign-in");
  }

  const isConnected = !!userExist?.user?.stripeConnectId;

  const stripeLink = getStripeOAuthLink(
    "api/stripe-connect",
    userExist.user!.id
  );
  return (
    <div className="w-full mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Payment Integration</h1>
      <div className="w-full p-6 border border-input rounded-lg bg-background shadow-sm">
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center mr-4">
            <Image
              src={"/stripe.svg"}
              alt="stripe"
              width={20}
              height={20}
              className="shrink-0"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-primary">
              Stripe Connect
            </h2>
            <p className="text-sm text-muted-foreground">
              Connect your Stripe account to start accepting payments
            </p>
          </div>
        </div>
        <div className="my-6 p-4 bg-muted rounded-lg">
          <div className="flex items-start">
            {isConnected ? (
              <LucideCheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
            ) : (
              <LucideAlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
            )}
            <div>
              <p className="font-medium">
                {isConnected
                  ? "Your Stripe account is connected"
                  : "Your Stripe account is not connected yet"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {isConnected
                  ? "You can now accept payments through your account"
                  : "Connect your Stripe account to start processing payments and managing subscriptions"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-muted-foreground text-sm">
            {isConnected
              ? "You can reconnect everytime if needed"
              : "You'will be redirected to Stripe to complete the connection"}
          </div>
          {/* Connect Stripe */}
          <Link
            href={stripeLink}
            className={`px-5 py-2.5 rounded-md font-medium text-sm flex items-center gap-2 transition-colors  ${
              isConnected
                ? "bg-muted hover:bg-muted/80 text-foreground"
                : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            }`}
          >
            {isConnected ? "Reconnect" : "Connect Stripe"}{" "}
            <LucideArrowRight size={16} />
          </Link>
        </div>
        {!isConnected && (
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-medium mb-2">
              Why Connect with Stripe?
            </h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                </div>
                Prcoess payments securely from customers worldwide
              </li>
              <li className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                </div>
                Manage subscriptions and recuring bills
              </li>
              <li className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-green-100 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                </div>
                Access detailed financial reporting and anayltics
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
