"use client";
import {
  useStreamVideoClient,
  Call,
  StreamCall,
} from "@stream-io/video-react-sdk";
import { WebinarWithPresenter } from "@/lib/type";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
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
    myCall.join({ create: true }).then(
      () => setCall(myCall),
      () => console.error("Failed to Join Call ")
    );

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
        <div className="text-center max-w-md p-8 rounded-lg border border-border bg-card shadow-sm">
          <div className="relative mx-auto h-24 w-24 mb-6">
            <div className="absolute inset-0 rounded-full border-t-2 border-accent animate-spin" />
            <div className="absolute inset-3 rounded-full bg-card flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-accent animate-spin" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Initializing Controls</h2>
          <p className="text-muted-foreground">Preparing host environment...</p>
          <div className="mt-6 flex justify-center space-x-1">
            <span className="h-2 w-2 bg-accent rounded-full animate-bounce" />
            <span
              className="h-2 w-2 bg-accent rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
            <span
              className="h-2 w-2 bg-accent rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
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
        call={call}
      />
    </StreamCall>
  );
};

export default CustomLiveStreamPlayer;
