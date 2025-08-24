"use client";
import { useStreamVideoClient, Call } from "@stream-io/video-react-sdk";
import { WebinarWithPresenter } from "@/lib/type";
import React, { useState } from "react";

type Props = {
  username: string;
  callId: string;
  callType: string;
  webinar: WebinarWithPresenter;
  token: string;
};

const CustomLiveStreamPlayer = ({
  username,
  callId,
  callType,
  webinar,
  token,
}: Props) => {
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call>();
  const [showChat, setShowChat] = useState(true);
  return <div>CustomLiveStreamPlayer</div>;
};

export default CustomLiveStreamPlayer;
