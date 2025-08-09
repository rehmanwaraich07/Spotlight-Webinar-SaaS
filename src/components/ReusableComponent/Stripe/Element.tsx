"use client";

import React, { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { useStripeElements } from "@/lib/stripe/stripe-client";
import type { Stripe } from "@stripe/stripe-js";
import Loading from "@/app/(auth)/callback/loading";

type Props = {
  children: React.ReactNode;
  connectedAccountId?: string;
};

export const StripeElements = ({ children, connectedAccountId }: Props) => {
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    const loadStripe = async () => {
      const { StripePromise } = await useStripeElements(connectedAccountId);
      setStripePromise(StripePromise());
    };

    loadStripe();
  }, [connectedAccountId]);

  if (!stripePromise) {
    return <Loading />;
  }

  return <Elements stripe={stripePromise}>{children}</Elements>;
};
