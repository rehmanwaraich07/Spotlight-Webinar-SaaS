"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WebinarStatusEnum } from "@prisma/client";
import React, { useState } from "react";
import { registerAttendee } from "@/actions/webinar";
import { useAttendeeStore } from "@/store/useAttendeeStore";
import { toast } from "sonner";

type Props = {
  webinarId: string;
  webinarStatus: WebinarStatusEnum;
  onRegistered?: () => void;
};

const WaitListComponent = ({ webinarId, webinarStatus }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { setAttendee } = useAttendeeStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await registerAttendee({
        name,
        email,
        webinarId,
      });

      if (!res.success) {
        throw new Error(res.meessage || "Something went wrong");
      }

      if (res.data?.user) {
        setAttendee({
          id: res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          callStatus: "PENDING",
        });
      }

      toast.success(
        webinarStatus === WebinarStatusEnum.LIVE
          ? "Successfully joined the Webinar"
          : "Sucessfully registered for webinar"
      );

      setEmail("");
      setName("");
      setSubmitted(true);
    } catch (error) {}
  };

  const buttonText = () => {
    switch (webinarStatus) {
      case WebinarStatusEnum.SCHEDULED:
        return "Get Reminder";
      case WebinarStatusEnum.WAITING_ROOM:
        return "Get Reminder";
      case WebinarStatusEnum.LIVE:
        return "Join Webinar";
      case WebinarStatusEnum.ENDED:
        return "Request a new One";
      default:
        return "Register";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className={`${
            webinarStatus === WebinarStatusEnum.LIVE
              ? "bg-red-600 hover:bg-red-700"
              : "bg-primary hover:bg-primary/90"
          } rounded-md px-4 py-2 text-primary-foreground text-sm font-semibold`}
        >
          {webinarStatus === WebinarStatusEnum.LIVE && (
            <span className="mr-2 h-2 w-2  bg-white rounded-full animate-pulse"></span>
          )}
          {buttonText()}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="border-0 bg-transparent"
        showCloseButton={false}
      >
        <DialogHeader className="justify-center items-center border border-input rounded-xl p-4 bg-background">
          <DialogTitle className="text-center text-lg font-semibold mb-4">
            {webinarStatus === WebinarStatusEnum.LIVE
              ? "Join the Webinar"
              : "Join the Waitlist"}
          </DialogTitle>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-full"
          ></form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default WaitListComponent;
