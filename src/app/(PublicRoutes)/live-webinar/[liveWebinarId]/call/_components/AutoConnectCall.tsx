"use client";

import { changeCallStatus } from "@/actions/attendance";
import { WebinarWithPresenter } from "@/lib/type";
import { vapi } from "@/lib/vapi/vapiclient";
import { CallStatusEnum } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const CallStatus = {
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
  const [callStatus, setCallStatus] = useState(CallStatus.CONNECTING);
  const [assistantSpeaking, setAssistantSpeaking] = useState(false);
  const [userIsSpeaking, setUserIsSpeaking] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(callTimeLimit);

  const cleanup = () => {
    if (refs.current.countdownTimer) {
      clearInterval(refs.current.countdownTimer);
      refs.current.countdownTimer = undefined;
    }

    if (refs.current.userSpeakingTimeout) {
      clearInterval(refs.current.userSpeakingTimeout);
      refs.current.userSpeakingTimeout = undefined;
    }

    if (refs.current.audioStream) {
      refs.current.audioStream.getTracks().forEach((track) => track.stop());
      refs.current.audioStream = undefined;
    }
  };

  const refs = useRef({
    countdownTimer: undefined as NodeJS.Timeout | undefined,
    audioStream: undefined as MediaStream | undefined,
    userSpeakingTimeout: undefined as NodeJS.Timeout | undefined,
  });

  const setupAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      refs.current.audioStream = stream;

      // simple speech detection using AudioContext
      const audioContext = new (window.AudioContext || window.AudioContext)();
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 256;

      const microphone = audioContext.createMediaStreamSource(stream);
      microphone.connect(analyzer);

      // Monitor AUdio Levels

      const checkAudioLevel = () => {
        const dataArray = new Uint8Array(analyzer.frequencyBinCount);
        analyzer.getByteFrequencyData(dataArray);

        // Calculate average volume
        const average =
          dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        const normalizedVolume = average / 128;

        // Detect speech based on volume
        if (normalizedVolume > 0.15 && !assistantSpeaking && !isMicMuted) {
          setUserIsSpeaking(true);
        }

        // clear previous timeout
        if (refs.current.userSpeakingTimeout) {
          clearTimeout(refs.current.userSpeakingTimeout);
        }

        // Reset after short delay
        refs.current.userSpeakingTimeout = setTimeout(() => {
          setUserIsSpeaking(false);
        }, 500);
      };

      // continue monitoring
      requestAnimationFrame(checkAudioLevel);

      checkAudioLevel();
    } catch (error) {
      console.error("Failed to initialize audio:", error);
    }
  };

  const stopCall = async () => {
    try {
      vapi.stop();
      setCallStatus(CallStatus.FINISHED);
      cleanup();
      const res = await changeCallStatus(userId, CallStatusEnum.COMPLETED);
      if (!res.success) {
        throw new Error("Failed to update call status");
      }
      toast.success("Call ended sucessfully!");
    } catch (error) {
      console.error("Failed to stop call", error);
      toast.error("Failed to stop call. Please try again.");
    }
  };

  useEffect(() => {
    const onCallStart = async () => {
      console.log("Call Started");
      setCallStatus(CallStatus.ACTIVE);
      setupAudio();

      // Start countdown timer from 3 minutes
      setTimeRemaining(callTimeLimit);
      refs.current.countdownTimer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(refs.current.countdownTimer);
            stopCall();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };
  }, []);
  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-background"></div>
  );
};

export default AutoConnectCall;
