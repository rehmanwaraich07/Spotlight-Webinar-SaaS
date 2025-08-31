import { getStreamIoToken } from "@/actions/streamio";
import { Button } from "@/components/ui/button";
import { WebinarWithPresenter } from "@/lib/type";
import { useAttendeeStore } from "@/store/useAttendeeStore";
import { StreamVideoClient, type User, Call } from "@stream-io/video-react-sdk";
import { AlertCircle, Loader2, WifiOff } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  apikey: string;
  callId: string;
  webinar: WebinarWithPresenter;
};

const Participant = ({ apikey, callId, webinar }: Props) => {
  const { attendee } = useAttendeeStore();
  const [showChat, setShowChat] = useState<boolean>(true);
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    "Connecting" | "Failed" | "Reconneting" | "Connected"
  >("Connecting");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const clientInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (clientInitialized.current) return;

    const initClient = async () => {
      try {
        setConnectionStatus("Connecting");
        const user: User = {
          id: attendee?.id || "Guest",
          name: attendee?.name || "Guest",
          image: `https://api.dicebear.com/7.x/initials/svg?seed=${
            attendee?.name || "Guest"
          }`,
        };

        const userToken = await getStreamIoToken(attendee);
        setToken(userToken ?? null);

        const streamClient = new StreamVideoClient({
          apiKey: apikey,
          user,
          token: userToken ?? undefined,
        });
        streamClient.on("connection.changed", (event) => {
          if (event.online) {
            setConnectionStatus("Connected");
          } else {
            setConnectionStatus("Reconneting");
          }
        });

        await streamClient.connectUser(user, userToken);

        const streamCall = streamClient.call("livestream", callId);
        await streamCall.join({ create: true });

        setClient(streamClient);
        setCall(streamCall);
        setConnectionStatus("Connected");
        clientInitialized.current = true;
      } catch (error) {
        console.error("Error in joining the call");
        setConnectionStatus("Failed");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to connect to webinar"
        );
      }
    };

    initClient();

    return () => {
      const currentCall = call;
      const currentClient = client;

      if (currentCall && currentClient) {
        currentCall
          .leave()
          .then(() => {
            console.log("Left the Call");
            currentClient.disconnectUser();
            clientInitialized.current = false;
          })
          .catch((error) => {
            console.log("Error Leaving Call: ", error);
          });
      }
    };
  }, [apikey, callId, attendee, call, client]);

  if (!attendee) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="text-center max-w-md p-8 rounded-e-lg border border-border bg-card">
          <h2 className="text-2xl font-bold mt-4">
            Please Sign In to Join the Webinar
          </h2>
          <p className="text-muted-foreground mb-6">
            Sign in or register to participate in this webinar
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={() => (window.location.href = "/sign-in")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Sign In
            </Button>
            <Button
              onClick={() => (window.location.href = "/sign-up")}
              variant="outline"
              className="border-border hover:bg-accent"
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!client || !call || !token) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-foreground">
        <div className="text-center max-w-md p-8 rounded-lg border border-border bg-card">
          {connectionStatus === "Connecting" && (
            <>
              <div className="relative mx-auto h-24 w-24 mb-6">
                <div className="absolute inset-0 rounded-full border-t-2 border-accent animate-spin" />
                <div className="absolute inset-3 rounded-full bg-card flex items-center justify-center">
                  <Loader2 className="h-10 w-10 text-accent animate-spin" />
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">Joining Webinar</h2>
              <p className="text-muted-foreground">
                Connecting {webinar.title}...
              </p>
              <div className="mt-6 flex justify-center space-x-1">
                <span className="h-2 w-2 bg-accent rounded-full animate-bounce" />
                <span
                  className="h-2 w-2 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <span
                  className="h-2 w-2 bg-accent rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </>
          )}

          {connectionStatus === "Reconneting" && (
            <>
              <div className="mx-auto w-16 h-16 mb-4 text-amber-500">
                <WifiOff className="h-16 w-16 animate-pulse" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Reconnectin</h2>
              <p className="text-muted-foreground mb-4">
                Connection lost. Attempting to reconnect...
              </p>
              <div className="w-full bg-muted rounded-full h-2 mb-6">
                <div
                  className="bg-amber-500 h-2 rounded-full animate-pulse"
                  style={{ width: "60%" }}
                ></div>
              </div>
            </>
          )}

          {connectionStatus === "Failed" && (
            <>
              <div className="mx-auto w-16 h-16 mb-4 text-destructive">
                <AlertCircle className="h-16 w-16" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Connetion Failed</h2>
              <p className="text-muted-foreground mb-6">
                {errorMessage || "Unable to Connect to the webinar"}
              </p>
              <div className="flex space-4 justify-center">
                <Button
                  variant={"outline"}
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
                <Button
                  className="bg-accent hover:bg-accent/80 text-accent-foreground"
                  onClick={() => (window.location.href = "/")}
                >
                  Back to Home
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
};
export default Participant;
