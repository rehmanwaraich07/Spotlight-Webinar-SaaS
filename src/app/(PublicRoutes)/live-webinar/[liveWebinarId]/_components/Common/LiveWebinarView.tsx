import { Chat, Channel, MessageList, MessageInput } from "stream-chat-react";
import "stream-chat-react/css/v2/index.css";
import { StreamChat } from "stream-chat";
import { WebinarWithPresenter } from "@/lib/type";
import { CiStreamOn } from "react-icons/ci";
import {
  ParticipantView,
  useCallStateHooks,
  Call,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { HiUsers } from "react-icons/hi2";
import { AiFillMessage } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { CtaTypeEnum } from "@prisma/client";
import CTADialogBox from "./CTADialogBox";
import { Loader2 } from "lucide-react";
import { changeWebinarStatus } from "@/actions/webinar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ObsDialogBox from "./ObsDialogBox";

type Props = {
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  webinar: WebinarWithPresenter;
  isHost?: boolean;
  username: string;
  userId: string;
  userToken: string;
  call: Call;
};

const LiveWebinarView = ({
  showChat,
  setShowChat,
  webinar,
  isHost,
  username,
  userId,
  call,
  userToken,
}: Props) => {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [OBSDialogBox, setOBSDialogBox] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingLoading, setRecordingLoading] = useState(false);

  const router = useRouter();

  const { useParticipantCount, useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const viewerCount = useParticipantCount();
  const hostParticipant = participants.length > 0 ? participants[0] : null;

  const handleCTAButtonClick = async () => {
    if (isHost) {
      // For hosts, directly open the modal
      setDialogOpen(true);
    } else if (channel) {
      // For participants, send event to host
      console.log("CTA channel button clicked: ", channel);
      await channel.sendEvent({
        type: "open_cta_dialog",
      });
    } else {
      console.log("Channel not Found");
    }
  };

  useEffect(() => {
    const initChat = async () => {
      const client = StreamChat.getInstance(
        process.env.NEXT_PUBLIC_STREAM_API_KEY!
      );

      await client.connectUser(
        {
          id: userId,
          name: username,
        },
        userToken
      );

      const channel = client.channel("livestream", webinar.id, {
        name: webinar.title,
      });

      await channel.watch();

      setChatClient(client);
      setChannel(channel);
    };

    initChat();

    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, [userId, username, userToken, webinar.id, webinar.title]);

  useEffect(() => {
    if (chatClient && channel) {
      channel.on((event: any) => {
        if (event.type === "open_cta_dialog" && !isHost) {
          setDialogOpen(true);
        }
      });
    }
  }, [chatClient, channel, isHost]);

  useEffect(() => {
    call.on("call.rtmp_broadcast_started", () => {
      toast.success("Webinar Stream Started Successfully");
      router.refresh();
    });

    call.on("call.rtmp_broadcast_failed", () => {
      toast.error("Failed to Start the Webinar Stream");
    });

    call.on("call.recording_started", () => {
      setIsRecording(true);
      toast.success("Recording started");
    });
    call.on("call.recording_stopped", () => {
      setIsRecording(false);
      toast.success("Recording stopped");
    });
    call.on("call.recording_failed", () => {
      setIsRecording(false);
      toast.error("Recording failed");
    });
  }, [call]);

  useEffect(() => {
    //TODO: Start Recording Feature
  }, [call]);

  //   if (!chatClient || !channel) return null;

  const handleEndStream = async () => {
    setLoading(true);
    try {
      call.stopLive({
        continue_recording: false,
      });
      call.endCall();
      const res = await changeWebinarStatus(webinar.id, "ENDED");
      if (!res.success) {
        throw new Error(res.message);
      }
      router.push("/");
      toast.success("Webinar Ended Successfully");
    } catch (error) {
      toast.error("Failed to End the Stream");
      throw new Error("failed to end the stream");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRecording = async () => {
    if (!isHost) return;
    setRecordingLoading(true);
    try {
      if (isRecording) {
        await call.stopRecording();
      } else {
        await call.startRecording();
      }
    } catch (err) {
      toast.error("Unable to toggle recording");
    } finally {
      setRecordingLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen max-h-screen overflow-hidden bg-background text-primary">
      <div className="py-2 px-2 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-accent/10 text-primary px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive animate-pulse"></span>
            </span>
            LIVE
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-muted/50 px-3 py-1 rounded-full">
            <HiUsers size={16} />
            <span className="text-sm">{viewerCount}</span>
          </div>
          <button
            onClick={() => setShowChat(!showChat)}
            className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 cursor-pointer ${
              showChat ? "bg-accent text-primary-foreground" : "bg-accent/10"
            }`}
          >
            {" "}
            <AiFillMessage size={16} /> <span>Chat</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 p-2 gap-2 overflow-hidden">
        <div className="flex-1 rounded-lg overflow-hidden border border-border flex flex-col bg-card">
          <div className="flex-1 relative overflow-hidden">
            {hostParticipant ? (
              <div className="w-full h-full">
                <ParticipantView
                  participant={hostParticipant}
                  className="w-full h-full object-cover !max-w-full"
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground flex-col space-y-4">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                  <HiUsers size={40} className="text-muted-foreground" />
                </div>
                <p className="">Waiting for stream to start...</p>
              </div>
            )}

            {isHost ? (
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                Host
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="p-2 border-t border-border flex items-center justify-between py-2">
            <div className="flex items-center space-x-2">
              <div className="text-sm font-medium capitalize">
                {webinar.title}
              </div>
              {isRecording && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  REC
                </span>
              )}
            </div>

            {isHost && (
              <div className="flex items-center space-x-1">
                <Button
                  onClick={handleToggleRecording}
                  variant={isRecording ? "destructive" : "outline"}
                  disabled={recordingLoading}
                  className="cursor-pointer"
                >
                  {recordingLoading ? (
                    <Loader2 className="animate-spin mr-2" />
                  ) : null}
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
                <Button
                  onClick={() => setOBSDialogBox(true)}
                  className="mr-2 cursor-pointer"
                  variant={"outline"}
                >
                  <CiStreamOn />
                  OBS Keys
                </Button>
                <Button
                  onClick={handleEndStream}
                  disabled={loading}
                  className="cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 cursor-pointer" />
                    </>
                  ) : (
                    "End Stream"
                  )}
                </Button>
                <Button
                  onClick={handleCTAButtonClick}
                  className="cursor-pointer"
                >
                  {webinar.ctaType === CtaTypeEnum.BOOK_A_CALL
                    ? "Book a Call"
                    : "Buy Now"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {showChat && chatClient && (
          <div className="spotlight-chat">
            <Chat client={chatClient}>
              <Channel channel={channel}>
                <div className="w-80 bg-card border border-border rounded-xl overflow-hidden flex flex-col shadow-sm">
                  <div className="py-2 px-3 border-b border-border font-medium flex items-center justify-between">
                    <span>Chat</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        viewerCount > 0
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {viewerCount} viewers
                    </span>
                  </div>

                  <MessageList hideDeletedMessages={true} />

                  <div className="p-2 border-t border-border">
                    <MessageInput focus />
                  </div>
                </div>
              </Channel>
            </Chat>
          </div>
        )}
      </div>

      {dialogOpen && (
        <CTADialogBox
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          webinar={webinar}
          userId={userId}
        />
      )}

      {/* OBS Sutido Credientials Dialog Box */}

      {OBSDialogBox && (
        <>
          <ObsDialogBox
            open={OBSDialogBox}
            onOpenChange={setOBSDialogBox}
            rtmpURL={`rtmps://ingress.stream-io-video.com:443/${process.env.NEXT_PUBLIC_STREAM_API_KEY}.livestream.${webinar.id}`}
            streamKey={userToken}
          />
        </>
      )}
    </div>
  );
};

export default LiveWebinarView;
