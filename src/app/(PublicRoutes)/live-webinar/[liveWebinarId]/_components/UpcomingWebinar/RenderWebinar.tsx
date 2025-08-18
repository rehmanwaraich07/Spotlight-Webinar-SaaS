import { User, Webinar, WebinarStatusEnum } from "@prisma/client";
import React from "react";
import WebinarUpcomingState from "../WebinarUpcomingState";

type Props = {
  apikey: string;
  token: string;
  callId: string;
  user: User | null;
  error: string | undefined;
  webinar: Webinar;
};

const RenderWebinar = ({
  apikey,
  callId,
  error,
  token,
  user,
  webinar,
}: Props) => {
  return (
    <React.Fragment>
      {webinar.webinarStatus === WebinarStatusEnum.SCHEDULED ? (
        <WebinarUpcomingState webinar={webinar} currentUser={user || null} />
      ) : (
        "Webiar is Ended"
      )}
    </React.Fragment>
  );
};

export default RenderWebinar;
