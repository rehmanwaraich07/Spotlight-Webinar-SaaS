import {
  StreamVideo,
  StreamVideoClient,
  User as StreamUser,
} from "@stream-io/video-react-sdk";
import { WebinarWithPresenter } from "@/lib/type";
import { User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import CustomLiveStreamPlayer from "./CustomLiveStreamPlayer";
import { getTokenForHost } from "@/actions/streamio";

type Props = {
  apiKey: string;
  token: string;
  callId: string;
  user: User;
  webinar: WebinarWithPresenter;
};

const LiveStreamState = ({ apiKey, token, callId, user, webinar }: Props) => {
  const streamUser: StreamUser = {
    id: user.id,
    name: user.name || "Unknown User",
    image: user.profileImage || undefined,
  };

  const client = new StreamVideoClient({ apiKey, user: streamUser, token });
  const [hostToken, setHostToken] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await getTokenForHost(
          webinar.presenterId,
          webinar.presenter.name,
          webinar.presenter.profileImage
        );

        const hostUser: StreamUser = {
          id: webinar.presenterId,
          name: webinar.presenter.name,
          image: webinar.presenter.profileImage,
        };
      } catch (error) {}
    };

    init();
  }, [apiKey, webinar]);

  return (
    <StreamVideo client={client}>
      <CustomLiveStreamPlayer
        callId={callId}
        callType={"livestream"}
        webinar={webinar}
        username={user.name || "Unknown User"}
        token={token}
        userId={user.id}
      />
    </StreamVideo>
  );
};

export default LiveStreamState;
