import { onAuthenticateUser } from "@/actions/auth";
import { getWebinarById } from "@/actions/webinar";
import { validateStreamEnvVars } from "@/lib/utils";
import React from "react";
import RenderWebinar from "./_components/UpcomingWebinar/RenderWebinar";

type Props = {
  params: Promise<{
    liveWebinarId: string;
  }>;
  searchParams: Promise<{
    error: string;
  }>;
};

const page = async ({ params, searchParams }: Props) => {
  const { liveWebinarId } = await params;
  const { error } = await searchParams;

  const webinarData = await getWebinarById(liveWebinarId);

  if (!webinarData) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-lg sm:text-4xl">
        No Webinar Found
      </div>
    );
  }

  const checkUser = await onAuthenticateUser();

  // Check if user authentication was successful
  if (checkUser.status !== 200 && checkUser.status !== 201) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-lg sm:text-4xl">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-semibold text-primary">
            Authentication Required
          </h3>
          <p className="text-muted-foreground">
            {checkUser.message || "Please sign in to access this webinar"}
          </p>
        </div>
      </div>
    );
  }

  // Ensure user object exists
  if (!checkUser.user) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-lg sm:text-4xl">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-semibold text-primary">
            User Not Found
          </h3>
          <p className="text-muted-foreground">
            Unable to retrieve user information
          </p>
        </div>
      </div>
    );
  }

  const apikey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;
  const token = process.env.STREAM_TOKEN as string;
  const callId = process.env.STREAM_CALL_ID as string;

  // Validate required environment variables
  if (!validateStreamEnvVars()) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-lg sm:text-4xl">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-semibold text-primary">
            Configuration Error
          </h3>
          <p className="text-muted-foreground">
            Missing required configuration for live streaming
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen mx-auto">
      <RenderWebinar
        apikey={apikey}
        token={token}
        callId={callId}
        user={checkUser.user}
        error={error}
        webinar={webinarData}
      />
    </div>
  );
};

export default page;
