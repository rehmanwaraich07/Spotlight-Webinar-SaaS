"use client";
import {
  useStreamVideoClient,
  Call,
  StreamCall,
} from "@stream-io/video-react-sdk";
import { WebinarWithPresenter } from "@/lib/type";
import React, { useEffect, useState } from "react";
import LiveWebinarView from "../Common/LiveWebinarView";
import { getStreamIoToken } from "@/actions/streamio";

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
  const [userToken, setUserToken] = useState<string>("");

  // Generate proper user token for chat
  useEffect(() => {
    const generateToken = async () => {
      try {
        // Create a mock attendee object for the host
        const hostAttendee = {
          id: userId,
          name: username,
        };
        const token = await getStreamIoToken(hostAttendee as any);
        setUserToken(token || "");
      } catch (error) {
        console.error("Failed to generate user token:", error);
      }
    };

    generateToken();
  }, [userId, username]);

  useEffect(() => {
    if (!client) return;
    // Use the webinar ID as the call ID for consistency
    const myCall = client.call(callType, webinar.id);
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
  if (!call || !userToken) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-muted-foreground">Initializing host controls...</p>
        </div>
      </div>
    );
  }
  return (
    <StreamCall call={call}>
      <LiveWebinarView
        showChat={showChat}
        setShowChat={setShowChat}
        isHost={true}
        username={username}
        userToken={userToken}
        webinar={webinar}
        userId={userId}
      />
    </StreamCall>
  );
};

export default CustomLiveStreamPlayer;
