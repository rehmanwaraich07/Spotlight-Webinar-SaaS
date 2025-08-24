import { StreamChat } from "stream-chat";
import { WebinarWithPresenter } from "@/lib/type";
import { MessageSquare } from "lucide-react";
import { ParticipantView, useCallStateHooks } from "@stream-io/video-react-sdk";
import React, { useState } from "react";
import { HiUsers } from "react-icons/hi2";
import { AiFillMessage } from "react-icons/ai";
type Props = {
  showChat: boolean;
  setShowChat: (show: boolean) => void;
  webinar: WebinarWithPresenter;
  isHost?: boolean;
  username: string;
  userId: string;
  userToken: string;
};

const LiveWebinarView = ({
  showChat,
  setShowChat,
  webinar,
  isHost,
  username,
  userId,
  userToken,
}: Props) => {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { useParticipantCount, useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const viewerCount = useParticipantCount();
  const hostParticipant = participants.length > 0 ? participants[0] : null;
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

          <div className=""></div>
        </div>
      </div>
    </div>
  );
};

export default LiveWebinarView;
