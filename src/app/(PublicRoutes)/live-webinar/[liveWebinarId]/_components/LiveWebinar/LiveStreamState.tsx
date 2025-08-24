import {
  StreamVideo,
  StreamVideoClient,
  User as StreamUser,
} from "@stream-io/video-react-sdk";
import { WebinarWithPresenter } from "@/lib/type";
import { User } from "@prisma/client";
import React from "react";
import CustomLiveStreamPlayer from "./CustomLiveStreamPlayer";

type Props = {
  apiKey: string;
  token: string;
  callId: string;
  user: User;
  webinar: WebinarWithPresenter;
};

const hostUser: StreamUser = { id: process.env.NEXT_PUBLIC_STREAM_USER_ID! };

const LiveStreamState = ({ apiKey, token, callId, user, webinar }: Props) => {
  const client = new StreamVideoClient({ apiKey, user: hostUser, token });

  return (
    <StreamVideo client={client}>
      <CustomLiveStreamPlayer
        callId={callId}
        callType={"livestream"}
        webinar={webinar}
        username={user.name}
        token={token}
      />
    </StreamVideo>
  );
};

export default LiveStreamState;
