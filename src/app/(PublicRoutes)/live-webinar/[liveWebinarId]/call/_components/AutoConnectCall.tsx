"use client";

import { WebinarWithPresenter } from "@/lib/type";
import React from "react";

const callStatus = {
  CONNECTING: "CONNECTING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
};

type Props = {
  userName?: string;
  assistantId: string;
  assistantName?: string;
  callTimeLimit?: number;
  webinar: WebinarWithPresenter;
  userId: string;
};

const AutoConnectCall = ({
  assistantId,
  userId,
  webinar,
  assistantName = "Ai Assistant",
  callTimeLimit = 180,
  userName = "User",
}: Props) => {
  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-background"></div>
  );
};

export default AutoConnectCall;
