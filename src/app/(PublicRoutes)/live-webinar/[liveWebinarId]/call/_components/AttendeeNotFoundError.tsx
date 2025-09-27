import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AttendeeNotFoundErrorProps {
  liveWebinarId: string;
  onRetry?: () => void;
}

export const AttendeeNotFoundError = ({
  liveWebinarId,
  onRetry,
}: AttendeeNotFoundErrorProps) => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center px-4">
      <div className="text-center space-y-6 max-w-md w-full">
        <div className="mx-auto w-16 h-16 mb-4 text-destructive">
          <AlertCircle className="h-16 w-16" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-primary">
            Attendee Not Found
          </h2>
          <p className="text-muted-foreground text-base">
            We couldn't find your attendee information for this webinar.
          </p>
        </div>

        <Alert variant="destructive" className="text-left">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            This could happen if:
            <ul className="mt-2 space-y-1 text-sm">
              <li>• The attendee ID is invalid or expired</li>
              <li>• You haven't registered for this webinar</li>
              <li>• The webinar has ended or been cancelled</li>
            </ul>
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
              Try Again
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
