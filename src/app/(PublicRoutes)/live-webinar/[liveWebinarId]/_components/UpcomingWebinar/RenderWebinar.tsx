"use client";
import { User, Webinar, WebinarStatusEnum } from "@prisma/client";
import React, { useEffect } from "react";
import WebinarUpcomingState from "../WebinarUpcomingState";
import { usePathname, useRouter } from "next/navigation";
import { useAttendeeStore } from "@/store/useAttendeeStore";
import { toast } from "sonner";
import LiveStreamState from "../LiveWebinar/LiveStreamState";
import { WebinarWithPresenter } from "@/lib/type";

type Props = {
  apikey: string;
  token: string;
  callId: string;
  user: User | null;
  error: string | undefined;
  webinar: WebinarWithPresenter;
};

const RenderWebinar = ({
  apikey,
  callId,
  error,
  token,
  user,
  webinar,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const { attendee } = useAttendeeStore();

  useEffect(() => {
    if (error) {
      toast.error(error);
      router.push(pathname);
    }
  }, []);
  return (
    <React.Fragment>
      {webinar.webinarStatus === WebinarStatusEnum.SCHEDULED ? (
        <WebinarUpcomingState webinar={webinar} currentUser={user || null} />
      ) : webinar.webinarStatus === WebinarStatusEnum.WAITING_ROOM ? (
        <WebinarUpcomingState webinar={webinar} currentUser={user || null} />
      ) : webinar.webinarStatus === WebinarStatusEnum.LIVE ? (
        // "TODO: // Live Componenet"
        <React.Fragment>
          {user?.id === webinar.presenterId ? (
            <LiveStreamState
              apiKey={apikey}
              callId={callId}
              token={token}
              webinar={webinar}
              user={user}
            />
          ) : attendee ? (
            // <Participant apikey={apikey} token={token} callId={callId} /> // only show participant that have registered for the webinar
            "Live for participant"
          ) : (
            <WebinarUpcomingState webinar={webinar} currentUser={user} />
          )}
        </React.Fragment>
      ) : webinar.webinarStatus === WebinarStatusEnum.CANCELLED ? (
        <div className="flex justify-center items-center h-full w-full">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-semibold text-primary">
              {webinar?.title}
            </h3>
            <p className="text-muted-foreground text-xs">
              This webinar has been calncelled
            </p>
          </div>
        </div>
      ) : (
        <WebinarUpcomingState webinar={webinar} currentUser={user || null} />
      )}
    </React.Fragment>
  );
};

export default RenderWebinar;
