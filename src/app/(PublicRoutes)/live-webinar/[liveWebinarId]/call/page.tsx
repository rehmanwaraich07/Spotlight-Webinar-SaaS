import { getAttendeeById } from "@/actions/attendance";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { AttendeeNotFoundError } from "./_components/AttendeeNotFoundError";
import { WebinarNotStartedError } from "./_components/WebinarNotStartedError";
import { WebinarConfigurationError } from "./_components/WebinarConfigurationError";
import { getWebinarById } from "@/actions/webinar";
import { CallStatusEnum, WebinarStatusEnum } from "@prisma/client";
import { WebinarWithPresenter } from "@/lib/type";
import AutoConnectCall from "./_components/AutoConnectCall";

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
    notFound();
  }

  const attendee = await getAttendeeById(attendeeId, liveWebinarId);

  if (!attendee.data) {
    return <AttendeeNotFoundError liveWebinarId={liveWebinarId} />;
  }

  const webinar = await getWebinarById(liveWebinarId);

  if (!webinar) {
    notFound();
  }

  if (
    webinar.webinarStatus === WebinarStatusEnum.WAITING_ROOM ||
    webinar.webinarStatus === WebinarStatusEnum.SCHEDULED
  ) {
    return (
      <WebinarNotStartedError
        liveWebinarId={liveWebinarId}
        webinarStatus={webinar.webinarStatus}
      />
    );
  }

  if (
    webinar.ctaType !== "BOOK_A_CALL" ||
    !webinar.aiAgentId ||
    !webinar.priceId
  ) {
    return <WebinarConfigurationError liveWebinarId={liveWebinarId} />;
  }

  if (attendee.data.callStatus === CallStatusEnum.COMPLETED) {
    redirect(`/live-webinar/${liveWebinarId}/`);
  }

  return (
    <>
      <AutoConnectCall
        userName={attendee.data.name}
        assistantId={webinar.aiAgentId}
        webinar={webinar as WebinarWithPresenter}
        userId={attendeeId}
      />
    </>
  );
};

export default page;
