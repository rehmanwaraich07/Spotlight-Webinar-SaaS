"use client";

import { changeCallStatus } from "@/actions/attendance";
import { createCheckoutLink } from "@/actions/stripe";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { WebinarWithPresenter } from "@/lib/type";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi/vapiclient";
import { CallStatusEnum } from "@prisma/client";
import { Bot, Clock, Loader, Mic, MicOff, PhoneOff } from "lucide-react";
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

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

    const onCallEnd = () => {
      console.log("Call Ended.");
      setCallStatus(CallStatus.FINISHED);
      cleanup();
    };

    const onSpeechStart = () => {
      setAssistantSpeaking(true);
    };

    const onSpeechEnd = () => {
      setAssistantSpeaking(false);
    };

    const onError = (error: Error) => {
      console.error("Vapi error:", error);
      setCallStatus(CallStatus.FINISHED);
      cleanup();
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, [userName, callTimeLimit]);

  const toggleMicMute = () => {
    if (refs.current.audioStream) {
      refs.current.audioStream.getAudioTracks().forEach((track) => {
        track.enabled = isMicMuted;
      });
    }
    setIsMicMuted(!isMicMuted);
  };

  const checkoutLink = async () => {
    try {
      if (!webinar.priceId || !webinar?.presenter?.stripeConnectId) {
        return toast.error("No priceId or Stripe Connected found");
      }

      const session = await createCheckoutLink(
        webinar.priceId,
        webinar.presenter.stripeConnectId,
        userId,
        webinar.id
      );

      if (!session.sessionUrl) {
        throw new Error("Session ID not found in response");
      }

      window.open(session.sessionUrl, "_blank");
    } catch (error) {
      console.error("Failed to create the stripe checkout link", error);
      toast.error("Failed to Create the Stripe Checkout Link");
    }
  };

  const startCall = async () => {
    try {
      setCallStatus(CallStatus.CONNECTING);
      await vapi.start(assistantId);
      const res = await changeCallStatus(userId, CallStatusEnum.InProgress);
      if (!res.success) {
        throw new Error("failed to update call status");
      }
      toast.success("Call started successfully!");
    } catch (error) {
      console.error("Failed to start call: ", error);
      toast.error("Failed to start call. Please try again.");
      setCallStatus(CallStatus.FINISHED);
    }
  };
  // vapi call useEffect

  // call startup and cleanup

  useEffect(() => {
    startCall();

    return () => {
      stopCall();
    };
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-background">
      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 relative">
        <div className="flex-1 bg-card rounded-xl overflow-hidden shadow-lg relative">
          <div className="absolute top-4 left-4 bg-black/40 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 z-10">
            <Mic
              className={cn("h-4 w-4", assistantSpeaking ? "text-accent" : "")}
            />
            <span>{assistantName}</span>
          </div>

          <div className="h-full flex items-center justify-center">
            <div className="relative">
              {/* speaking animation on rings */}

              {assistantSpeaking && (
                <>
                  <div
                    className="absolute inset-0 rounded-full border-4 border-accent animate-ping opacity-20"
                    style={{ margin: "-8px" }}
                  />
                  <div
                    className="absolute inset-0 rounded-full border-4 border-accent animate-ping opacity-10"
                    style={{ margin: "-16px", animationDelay: "0.5s" }}
                  />
                </>
              )}

              <div
                className={cn(
                  "flex justify-center items-center rounded-full overflow-hidden border-4 p-6",
                  assistantSpeaking
                    ? "border-accent"
                    : "border-accent-foreground/50"
                )}
              >
                <Bot className="w-[70px] h-[70px]" />
              </div>

              {assistantSpeaking && (
                <div className="absolute -bottom-2 bg-accent text-white p-2 rounded-full">
                  <Mic className="h-5 w-5" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 bg-card rounded-xl overflow-hidden shadow-lg relative">
          <div className="absolute top-4 left-4 bg-black/40 text-white px-3 py-1 rounded-full text-sm gap-2 z-10">
            {isMicMuted ? (
              <>
                <MicOff className="h-4 w-4 text-destructive" />
                <span>Muted</span>
              </>
            ) : (
              <>
                <Mic
                  className={cn("h-4 w-4", userIsSpeaking ? "text-accent" : "")}
                />
                <span>{userName}</span>
              </>
            )}
          </div>

          <div
            className="absolute top-4 right-4 bg-black/40 text-white px-3 py-3 rounded-full text-sm flex items-cen
           gap-2 z-10"
          >
            <Clock className="h-4 w-4" />
            <span>{formatTime(timeRemaining)}</span>
          </div>

          <div className="h-full flex justify-center items-center">
            <div className="relative">
              {userIsSpeaking && !isMicMuted && (
                <>
                  <div
                    className="absolute inset-0 rounded-full border-4 border-accent animate-ping opacity-20"
                    style={{ margin: "-8px" }}
                  />
                </>
              )}

              <div
                className={cn(
                  "flex justify-center items-center rounded-full overflow-hidden border-4",
                  isMicMuted
                    ? "border-destructive/50"
                    : userIsSpeaking
                    ? "border-accent-foreground"
                    : "border-accent/20"
                )}
              >
                <Avatar className="h-[100px] w-[100px]">
                  <AvatarImage src={"/user-avatar.png"} alt={userName} />
                  <AvatarFallback>{userName.split("")?.[0]}</AvatarFallback>
                </Avatar>
              </div>

              {isMicMuted && (
                <>
                  <div className="absolute -bottom-2 -right-2 bg-destructive text-white p-2 rounded-full">
                    <MicOff className="h-5 w-5" />
                  </div>
                </>
              )}

              {userIsSpeaking && !isMicMuted && (
                <>
                  <div className="absolute -bottom-2 -right-2 bg-accent text-white p-2 rounded-full">
                    <Mic className="h-5 w-5" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {callStatus === CallStatus.CONNECTING && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center flex-col gap-4 z-20">
            <Loader className="h-10 w-10 animate-spin text-accent" />
            <h3 className="text-xl font-medium ">Connecting...</h3>
          </div>
        )}

        {callStatus === CallStatus.FINISHED && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center flex-col gap-4 z-20">
            <h3 className="text-xl font-medium">Call Ended</h3>
            <p className="text-muted-foreground">Time Limit reached</p>
          </div>
        )}
      </div>

      <div className="bg-card border-t border-border p-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            {callStatus === CallStatus.ACTIVE && (
              <>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      timeRemaining < 30
                        ? "text-destructive animate-pulse"
                        : timeRemaining < 60
                        ? "text-amber-500"
                        : "text-muted-foreground"
                    )}
                  >
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleMicMute}
              className={cn(
                "p-3 rounded-full transition-all cursor-pointer",
                isMicMuted
                  ? "bg-destructive text-primary"
                  : "bg-secondary hover:bg-secondary/80 text-foreground"
              )}
              disabled={callStatus !== CallStatus.ACTIVE}
            >
              {isMicMuted ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </button>

            <button
              onClick={stopCall}
              className="p-3 rounded-full bg-destructive text-primary hover:bg-destructive/90 transition-all cursor-pointer"
              aria-label="End Call"
              disabled={callStatus !== CallStatus.ACTIVE}
            >
              <PhoneOff className="h-6 w-6" />
            </button>
          </div>

          {/* Buy Now Button to purchase the product  */}
          <div className="">
            <Button variant={"outline"} onClick={checkoutLink}>
              {" "}
              Buy Now
            </Button>

            <div className="hidden md:block">
              {callStatus === CallStatus.ACTIVE && timeRemaining < 30 && (
                <span className="text-destructive font-medium">
                  Call ending soon
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoConnectCall;
