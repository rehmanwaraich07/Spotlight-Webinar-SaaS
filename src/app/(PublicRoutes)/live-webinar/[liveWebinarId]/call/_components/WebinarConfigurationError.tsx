import { Settings, Home, RefreshCw, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WebinarConfigurationErrorProps {
  liveWebinarId: string;
  onRetry?: () => void;
}

export const WebinarConfigurationError = ({
  liveWebinarId,
  onRetry,
}: WebinarConfigurationErrorProps) => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center px-4">
      <div className="text-center space-y-6 max-w-md w-full">
        <div className="mx-auto w-16 h-16 mb-4 text-amber-500">
          <Settings className="h-16 w-16" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-primary">
            Webinar Configuration Error
          </h2>
          <p className="text-muted-foreground text-base">
            This webinar is not properly configured for call booking.
          </p>
        </div>

        <Alert variant="default" className="text-left">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Configuration Required</AlertTitle>
          <AlertDescription>
            This webinar is missing required configuration for call booking:
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Call-to-Action type must be set to "Book a Call"</li>
              <li>• AI Agent must be configured</li>
            </ul>
            <p className="mt-2 text-sm">
              Please contact the webinar organizer to complete the setup.
            </p>
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
