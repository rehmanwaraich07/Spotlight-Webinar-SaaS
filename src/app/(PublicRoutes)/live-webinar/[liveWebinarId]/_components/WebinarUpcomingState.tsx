"use client";
import { User, Webinar, WebinarStatusEnum } from "@prisma/client";
import React, { useState } from "react";
import CountdownTimer from "./UpcomingWebinar/CountdownTimer";
import Image from "next/image";
import WaitListComponent from "./WaitListComponent";

type Props = {
  webinar: Webinar;
  currentUser: User | null;
};

const WebinarUpcomingState = ({ webinar, currentUser }: Props) => {
  const [loading, setLoading] = useState(false);
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
          ""
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default WebinarUpcomingState;
