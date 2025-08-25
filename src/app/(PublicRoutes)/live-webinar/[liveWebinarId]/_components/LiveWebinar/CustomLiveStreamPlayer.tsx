"use client";
import {
  useStreamVideoClient,
  Call,
  StreamCall,
} from "@stream-io/video-react-sdk";
import { WebinarWithPresenter } from "@/lib/type";
import React, { useEffect, useState } from "react";
import LiveWebinarView from "../Common/LiveWebinarView";

type Props = {
  username: string;
  callId: string;
  callType: string;
  webinar: WebinarWithPresenter;
  token: string;
  userId: string;
};

const CustomLiveStreamPlayer = ({
  username,
  callId,
  callType,
  webinar,
  token,
  userId,
}: Props) => {
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call>();
  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    if (!client) return;
    const myCall = client.call(callType, callId);
    setCall(myCall);
    myCall.join().catch((e) => {
      console.log("Failed to Join the call ", e);
    });

    return () => {
      myCall.leave().catch((e) => {
        console.error("Failed to Leave Call ", e);
      });
      setCall(undefined);
    };
  }, [client, callId, callType]);
  if (!call) return null;
  return (
    <StreamCall call={call}>
      <LiveWebinarView
        showChat={showChat}
        setShowChat={setShowChat}
        isHost={true}
        username={username}
        userToken={token}
        webinar={webinar}
        userId={userId}
      />
    </StreamCall>
  );
};

export default CustomLiveStreamPlayer;
