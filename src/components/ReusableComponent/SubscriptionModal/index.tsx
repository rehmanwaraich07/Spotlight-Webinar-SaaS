import { onGetStripeClientSecret } from "@/actions/stripe";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@prisma/client";
import { DialogClose } from "@radix-ui/react-dialog";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { Loader2, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

type Props = {
  user: User;
};

const SubscriptionModal = ({ user }: Props) => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      if (!stripe || !elements) {
        return toast.error("Stripe not Initialized");
      }

      const intent = await onGetStripeClientSecret(user.email, user.id);
    } catch (error) {}
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <button className="rounded-xl flex gap-2 items-center hover:cursor-pointer px-4 py-2 border border-border bg-primary/10 backdrop-blur-sm text-sm font-normal text-primary hover:bg-primary/20">
            <PlusIcon /> Create Webinar
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Spotlight Suscription</DialogTitle>
          </DialogHeader>
          <DialogFooter className="gap-4 items-center">
            <DialogClose
              className="w-full sm:w-auto border border-border rounded-md px-3 py-2"
              disabled={loading}
            >
              Cancel
            </DialogClose>
            <Button
              type="submit"
              className="w-full sm:w-auto"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  loading...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubscriptionModal;
