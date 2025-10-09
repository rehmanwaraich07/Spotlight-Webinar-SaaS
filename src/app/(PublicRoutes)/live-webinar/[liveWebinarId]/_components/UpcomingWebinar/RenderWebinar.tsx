"use client";
import { User, WebinarStatusEnum } from "@prisma/client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { VideoOff, CalendarX2, PlayCircle, Download } from "lucide-react";
import WebinarUpcomingState from "../WebinarUpcomingState";
import { usePathname, useRouter } from "next/navigation";
import { useAttendeeStore } from "@/store/useAttendeeStore";
import { toast } from "sonner";
import LiveStreamState from "../LiveWebinar/LiveStreamState";
import { StreamCallRecording, WebinarWithPresenter } from "@/lib/type";
import Participant from "../Participant/participant";

type Props = {
  apikey: string;
  user: User | null;
  error: string | undefined;
  webinar: WebinarWithPresenter;
  recording: StreamCallRecording | null;
};

const RenderWebinar = ({ apikey, error, user, webinar, recording }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const { attendee } = useAttendeeStore();

  useEffect(() => {
    if (error) {
      toast.error(error);
      router.push(pathname);
    }
  }, []);
  return (
    <React.Fragment>
      {webinar.webinarStatus === "LIVE" ? (
        <React.Fragment>
          {user?.id === webinar.presenterId ? (
            <LiveStreamState
              apiKey={apikey}
              webinar={webinar}
              callId={webinar.id}
              user={user}
            />
          ) : attendee ? (
            <Participant
              apikey={apikey}
              callId={webinar.id}
              webinar={webinar}
            />
          ) : (
            <WebinarUpcomingState
              currentUser={user || null}
              webinar={webinar}
            />
          )}
        </React.Fragment>
      ) : webinar.webinarStatus === WebinarStatusEnum.CANCELLED ? (
        <div className="flex items-center justify-center h-[70vh] px-4">
          <div className="bg-card border border-border rounded-xl shadow-sm max-w-lg w-full p-8 text-center space-y-4">
            <div className="mx-auto h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center">
              <CalendarX2 className="h-7 w-7 text-destructive" />
            </div>
            <h3 className="text-2xl font-semibold">
              This webinar was cancelled
            </h3>
            <p className="text-muted-foreground">{webinar?.title}</p>
            <div className="pt-2">
              <Button
                className="cursor-pointer"
                onClick={() => router.push("/")}
              >
                Back to home
              </Button>
            </div>
          </div>
        </div>
      ) : webinar.webinarStatus === WebinarStatusEnum.ENDED ? (
        <div className="flex items-center justify-center h-[70vh] px-4">
          <div className="bg-card border border-border rounded-xl shadow-sm max-w-xl w-full p-8 text-center space-y-5">
            {recording?.url ? (
              <>
                <div className="mx-auto h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <PlayCircle className="h-7 w-7 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-semibold">
                  Webinar recording is available
                </h3>
                <p className="text-muted-foreground">
                  You can watch or download the recording below.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <a href={recording.url} target="_blank" rel="noreferrer">
                    <Button className="cursor-pointer">Watch Recording</Button>
                  </a>
                  <a href={recording.url} download>
                    <Button variant="outline" className="cursor-pointer">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </a>
                </div>
              </>
            ) : (
              <>
                <div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                  <VideoOff className="h-7 w-7 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold">
                  The webinar has ended
                </h3>
                <p className="text-muted-foreground">
                  No recording is available for this session.
                </p>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => router.push("/")}
                  >
                    Back to Home
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default RenderWebinar;
