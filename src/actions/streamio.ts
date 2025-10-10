"use server";

import { Attendee, Webinar } from "@prisma/client";
import { getStreamClient } from "@/lib/stream/streamClient";
import { UserRequest } from "@stream-io/node-sdk";
import { prismaClient } from "@/lib/prismaClient";
import { StreamCallRecording } from "@/lib/type";

// Utility function to check Stream.io connectivity
export const checkStreamConnectivity = async (): Promise<boolean> => {
  try {
    // Try a simple operation to test connectivity
    await getStreamClient.getApp();
    return true;
  } catch (error) {
    console.error("Stream.io connectivity check failed:", error);
    return false;
  }
};

export const getStreamIoToken = async (attendee: Attendee | null) => {
  try {
    const newUser: UserRequest = {
      id: attendee?.id || "Guest",
      role: "user",
      name: attendee?.name || "Guest",
      image: `https://api.dicebear.com/7.x/initials/svg?seed=${
        attendee?.name || "Guest"
      }`,
    };

    // Try to upsert user with retry logic
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        await getStreamClient.upsertUsers([newUser]);
        break; // Success, exit retry loop
      } catch (upsertError: any) {
        retryCount++;
        console.warn(
          `Upsert user attempt ${retryCount} failed:`,
          upsertError.message
        );

        if (retryCount >= maxRetries) {
          // If upsert fails after retries, we can still generate a token
          console.warn(
            "Failed to upsert user after retries, generating token anyway"
          );
          break;
        }

        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
      }
    }

    const validity = 60 * 60 * 60;
    const token = getStreamClient.generateUserToken({
      user_id: attendee?.id || "Guest",
      validity_in_seconds: validity,
    });

    return token;
  } catch (error: any) {
    console.error("Error in getStreamIoToken:", error);
    // Return a fallback token even if there's an error
    try {
      const fallbackToken = getStreamClient.generateUserToken({
        user_id: attendee?.id || "Guest",
        validity_in_seconds: 60 * 60 * 60,
      });
      return fallbackToken;
    } catch (fallbackError) {
      console.error("Failed to generate fallback token:", fallbackError);
      throw new Error(`Failed to generate Stream token: ${error.message}`);
    }
  }
};

export const getTokenForHost = async (
  userId: string,
  username: string,
  profilePic: string
) => {
  try {
    const newUser: UserRequest = {
      id: userId,
      role: "user",
      name: username || "Guest",
      image:
        profilePic ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${username}`,
    };

    // Try to upsert user with retry logic
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        await getStreamClient.upsertUsers([newUser]);
        break; // Success, exit retry loop
      } catch (upsertError: any) {
        retryCount++;
        console.warn(
          `Host upsert user attempt ${retryCount} failed:`,
          upsertError.message
        );

        if (retryCount >= maxRetries) {
          // If upsert fails after retries, we can still generate a token
          console.warn(
            "Failed to upsert host user after retries, generating token anyway"
          );
          break;
        }

        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount));
      }
    }

    const validity = 60 * 60 * 60;
    const token = getStreamClient.generateUserToken({
      user_id: userId,
      validity_in_seconds: validity,
    });
    return token;
  } catch (error: any) {
    console.error("Failed to Generate the Token in GetTokenForHost:", error);
    // Return a fallback token even if there's an error
    try {
      const fallbackToken = getStreamClient.generateUserToken({
        user_id: userId,
        validity_in_seconds: 60 * 60 * 60,
      });
      return fallbackToken;
    } catch (fallbackError) {
      console.error("Failed to generate fallback host token:", fallbackError);
      throw new Error(
        `Failed to generate Stream token for host: ${error.message}`
      );
    }
  }
};

export const createAndStartStream = async (
  webinarId: string,
  presenterId: string
) => {
  try {
    const checkWebinar = await prismaClient.webinar.findMany({
      where: {
        presenterId: presenterId,
        webinarStatus: "LIVE",
      },
    });

    if (checkWebinar.length > 0) {
      throw new Error("You already have a Live Webinar Running");
    }

    const call = getStreamClient.video.call("livestream", webinarId);
    await call.getOrCreate({
      data: {
        created_by_id: presenterId,
        members: [
          {
            user_id: presenterId,
            role: "host",
          },
        ],
      },
    });

    // Wait for the goLive operation to complete
    await call.goLive({
      start_recording: true,
    });

    console.log("Stream Created and Started Successfully!");
    // Return only serializable data to the client to avoid RSC serialization errors
    return { success: true };
  } catch (error: any) {
    console.error("Failed to Create and Start the stream: ", error);
    throw new Error(`Failed to start stream: ${error.message}`);
  }
};

export const getStreamRecording = async (
  webinarId: string
): Promise<StreamCallRecording | null> => {
  try {
    const call = getStreamClient.video.call("livestream", webinarId);
    const result = await call.listRecordings();

    const first = (result as any)?.recordings?.[0];
    if (!first) return null;

    return {
      filename: first.filename,
      url: first.url,
      start_time: new Date(first.start_time),
      end_time: new Date(first.end_time),
      session_id: first.session_id,
    };
  } catch (error) {
    console.error("Failed to fetch stream recording:", error);
    return null;
  }
};
