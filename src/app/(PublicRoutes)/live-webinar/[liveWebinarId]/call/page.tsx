import { getAttendeeById } from "@/actions/attendance";
import { redirect } from "next/navigation";
import React from "react";
import { AttendeeNotFoundError } from "./_components/AttendeeNotFoundError";
import { WebinarNotStartedError } from "./_components/WebinarNotStartedError";
import { WebinarConfigurationError } from "./_components/WebinarConfigurationError";
import { getWebinarById } from "@/actions/webinar";
import { WebinarStatusEnum } from "@prisma/client";

type Props = {
  params: Promise<{
    liveWebinarId: string;
  }>;
  searchParams: Promise<{
    attendeeId: string;
  }>;
};

const page = async ({ params, searchParams }: Props) => {
  const { liveWebinarId } = await params;
  const { attendeeId } = await searchParams;

  if (!liveWebinarId || !attendeeId) {
    redirect("/404");
  }

  const attendee = await getAttendeeById(attendeeId, liveWebinarId);

  if (!attendee.data) {
    return <AttendeeNotFoundError liveWebinarId={liveWebinarId} />;
  }

  const webianr = await getWebinarById(liveWebinarId);

  if (!webianr) {
    redirect("/404");
  }

  if (
    webianr.webinarStatus === WebinarStatusEnum.WAITING_ROOM ||
    webianr.webinarStatus === WebinarStatusEnum.SCHEDULED
  ) {
    return (
      <WebinarNotStartedError
        liveWebinarId={liveWebinarId}
        webinarStatus={webianr.webinarStatus}
      />
    );
  }

  if (
    webianr.ctaType !== "BOOK_A_CALL" ||
    !webianr.aiAgentId ||
    !webianr.priceId
  ) {
    return <WebinarConfigurationError liveWebinarId={liveWebinarId} />;
  }
  return <div>page</div>;
};

export default page;
