import { User, Webinar } from "@prisma/client";
import React from "react";

type Props = {
  webinar: Webinar;
  currentUser: User | null;
};

const WebinarUpcomingState = ({ webinar, currentUser }: Props) => {
  return <div>WebinarUpcomingState</div>;
};

export default WebinarUpcomingState;
