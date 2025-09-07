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
  callId: string;
  user: User;
  webinar: WebinarWithPresenter;
};

const LiveStreamState = ({ apiKey, callId, user, webinar }: Props) => {
  const streamUser: StreamUser = {
    id: user.id,
    name: user.name || "Unknown User",
    image: user.profileImage || undefined,
  };

  const [hostToken, setHostToken] = useState<string | null>(null);
  const [client, setClient] = useState<StreamVideoClient | null>(null);

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

        const streamClient = new StreamVideoClient({
          apiKey,
          user: hostUser,
          token,
        });
        setHostToken(token);
        setClient(streamClient);
      } catch (error: any) {
        console.error("Error initializing Stream Client");
        throw new Error("Error Initializing the Stream Client: ", error);
      }
    };

    init();
  }, [apiKey, webinar]);

  if (!client || !hostToken) return null;

  return (
    <StreamVideo client={client}>
      <CustomLiveStreamPlayer
        callId={callId}
        callType={"livestream"}
        webinar={webinar}
        username={user.name || "Unknown User"}
        token={hostToken}
        userId={user.id}
      />
    </StreamVideo>
  );
};

export default LiveStreamState;
