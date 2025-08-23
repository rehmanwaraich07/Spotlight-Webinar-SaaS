"use client";
import { User, Webinar, WebinarStatusEnum } from "@prisma/client";
import React, { useState } from "react";
import CountdownTimer from "./UpcomingWebinar/CountdownTimer";
import Image from "next/image";
import WaitListComponent from "./WaitListComponent";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { changeWebinarStatus } from "@/actions/webinar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  webinar: Webinar;
  currentUser: User | null;
};

const WebinarUpcomingState = ({ webinar, currentUser }: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleStartWebinar = async () => {
    setLoading(true);
    try {
      const res = await changeWebinarStatus(webinar.id, "LIVE");
      if (!res.success) {
        throw new Error(res.message);
      }

      toast.success("Webinar started successfully!");
      router.refresh();
    } catch (error) {
      console.log("Error: ", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full min-h-screen mx-auto max-w-[400px] flex flex-col justify-center items-center gap-8 py-20">
      <div className="space-y-6">
        <p className="text-3xl font-semibold text-primary text-center">
          Seems Like you are a little early
        </p>
        <CountdownTimer
          targetDate={new Date(webinar.startTime)}
          className="text-center"
          webinarId={webinar.id}
          webinarStatus={webinar.webinarStatus}
        />
      </div>
      <div className="space-y-6 w-full flex  h-full justify-center items-center flex-col">
        <div className="w-full max-w-md aspect-[4/3] relative rounded-4xl overflow-hidden mb-6">
          <Image
            src={"/darkthumbnail.png"}
            fill
            alt={webinar.title}
            priority
            className="object-cover"
          />
        </div>
        {webinar.webinarStatus === WebinarStatusEnum.SCHEDULED ? (
          <WaitListComponent webinarId={webinar.id} webinarStatus="SCHEDULED" />
        ) : webinar?.webinarStatus === WebinarStatusEnum.WAITING_ROOM ? (
          <>
            {currentUser?.id === webinar?.presenterId ? (
              <Button
                className="w-full max-w-[300px] font-semibold"
                onClick={handleStartWebinar}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Starting...
                  </>
                ) : (
                  "Start Webinar"
                )}
              </Button>
            ) : (
              <WaitListComponent
                webinarId={webinar.id}
                webinarStatus={"WAITING_ROOM"}
              />
            )}
          </>
        ) : webinar.webinarStatus === WebinarStatusEnum.LIVE ? (
          <WaitListComponent webinarId={webinar.id} webinarStatus={"LIVE"} />
        ) : webinar.webinarStatus === WebinarStatusEnum.CANCELLED ? (
          <p className="text-xl text-foreground text-center font-semibold">
            Webinar is Cancelled
          </p>
        ) : (
          <Button>Ended</Button>
        )}
      </div>

      {/* Description */}

      <div className="text-center space-y-4">
        <h3 className="text-2xl font-semibold text-primary">
          {webinar?.title}
        </h3>
        <p className="text-muted-foreground text-xs"></p>
      </div>
    </div>
  );
};

export default WebinarUpcomingState;
