"use client";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { ArrowLeft, Zap } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import PurpleIcon from "../PurpleIcon";
import CreateWebinarButton from "../CreateWebinarButton";
import Stripe from "stripe";
import { Assistant } from "@vapi-ai/server-sdk/api";

type Props = {
  user: User | null;
  stripeProducts: Stripe.Product[] | [];
  assistants: Assistant[] | [];
};

const Header = ({ user, stripeProducts, assistants }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="w-full px-4 pt-10 sticky top-0 z-10 flex justify-between items-center flex-wrap gap-4 bg-background py-4">
      {pathname.includes("pipeline") ? (
        <Button
          className="bg-primary/10 border border-border rounded-xl"
          variant={"outline"}
          onClick={() => router.push("/webinars")}
        >
          <ArrowLeft /> Back to Webinars
        </Button>
      ) : (
        <div className="px-4 py-2 flex justify-center font-bold items-center rounded-lg bg-background border border-border text-primary capitalize hover:bg-background/10">
          {pathname.split("/")[1]}
        </div>
      )}
      {/* TODO: build Stripe subscription and create webinar button */}
      <div className="flex gap-6 items-center flex-wrap">
        <PurpleIcon>
          <Zap className="cursor-pointer w-5 h-5" />
        </PurpleIcon>

        {/* Create webinar button - now available for all users */}
        <CreateWebinarButton
          stripeProducts={stripeProducts}
          assistants={assistants}
        />
      </div>
    </div>
  );
};

export default Header;
