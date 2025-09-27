import { Clock, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WebinarStatusEnum } from "@prisma/client";

interface WebinarNotStartedErrorProps {
  liveWebinarId: string;
  webinarStatus: WebinarStatusEnum;
  onRetry?: () => void;
}

export const WebinarNotStartedError = ({
  liveWebinarId,
  webinarStatus,
  onRetry,
}: WebinarNotStartedErrorProps) => {
  const isWaitingRoom = webinarStatus === WebinarStatusEnum.WAITING_ROOM;
  const isScheduled = webinarStatus === WebinarStatusEnum.SCHEDULED;

  const getStatusInfo = () => {
    if (isWaitingRoom) {
      return {
        title: "Webinar Not Yet Started",
        description:
          "The webinar is currently in the waiting room. Please wait for the host to start the session.",
        icon: <Clock className="h-16 w-16" />,
        alertTitle: "Waiting for Host",
        alertDescription:
          "The webinar host hasn't started the session yet. You'll be automatically redirected when the webinar begins.",
      };
    }

    if (isScheduled) {
      return {
        title: "Webinar Not Started",
        description:
          "This webinar hasn't started yet. Please check the scheduled time and come back later.",
        icon: <Clock className="h-16 w-16" />,
        alertTitle: "Scheduled Webinar",
        alertDescription:
          "The webinar is scheduled but hasn't begun. Please wait for the scheduled start time.",
      };
    }

    return {
      title: "Webinar Not Available",
      description: "This webinar is not currently available for joining.",
      icon: <Clock className="h-16 w-16" />,
      alertTitle: "Webinar Unavailable",
      alertDescription:
        "The webinar is not in a state that allows joining at this time.",
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="w-full min-h-screen flex justify-center items-center px-4">
      <div className="text-center space-y-6 max-w-md w-full">
        <div className="mx-auto w-16 h-16 mb-4 text-amber-500">
          {statusInfo.icon}
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-primary">
            {statusInfo.title}
          </h2>
          <p className="text-muted-foreground text-base">
            {statusInfo.description}
          </p>
        </div>

        <Alert variant="default" className="text-left">
          <Clock className="h-4 w-4" />
          <AlertTitle>{statusInfo.alertTitle}</AlertTitle>
          <AlertDescription>
            {statusInfo.alertDescription}
            {isWaitingRoom && (
              <div className="mt-2 text-sm">
                <p>You can:</p>
                <ul className="mt-1 space-y-1">
                  <li>• Wait on this page for automatic redirection</li>
                  <li>• Refresh the page to check for updates</li>
                  <li>• Return to the main webinar page</li>
                </ul>
              </div>
            )}
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          {onRetry && (
            <Button
              variant="outline"
              onClick={onRetry}
              className="cursor-pointer"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
          <Link href={`/live-webinar/${liveWebinarId}`}>
            <Button variant="outline" className="cursor-pointer">
              Back to Webinar
            </Button>
          </Link>
          <Link href="/">
            <Button className="cursor-pointer">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
