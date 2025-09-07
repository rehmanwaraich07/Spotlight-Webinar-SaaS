"use server";

import { Attendee, Webinar } from "@prisma/client";
import { getStreamClient } from "@/lib/stream/streamClient";
import { UserRequest } from "@stream-io/node-sdk";
import { prismaClient } from "@/lib/prismaClient";

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
    await getStreamClient.upsertUsers([newUser]);

    const validity = 60 * 60 * 60;
    const token = getStreamClient.generateUserToken({
      user_id: attendee?.id || "Guest",
      validity_in_seconds: validity,
    });

    return token;
  } catch (error) {
    console.error("Error in streamio.ts :", error);
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

    await getStreamClient.upsertUsers([newUser]);

    const validity = 60 * 60 * 60;
    const token = getStreamClient.generateUserToken({
      user_id: userId,
      validity_in_seconds: validity,
    });
    return token;
  } catch (error: any) {
    console.error("Failed to Generate the Token in GetTokenForHost");
    throw new Error("failed to generate the token: ", error);
  }
};

export const createAndStartStream = async (webinar: Webinar) => {
  try {
    const checkWebinar = await prismaClient.webinar.findMany({
      where: {
        presenterId: webinar.presenterId,
        webinarStatus: "LIVE",
      },
    });

    if (checkWebinar.length > 0) {
      throw new Error("You already have a Live Webinar Running");
    }

    const call = getStreamClient.video.call("livestream", webinar.id);
    await call.getOrCreate({
      data: {
        created_by_id: webinar.presenterId,
        members: [
          {
            user_id: webinar.presenterId,
            role: "host",
          },
        ],
      },
    });

    call.goLive({
      start_recording: true,
    });

    console.log("Stream Created and Started Successfully!");
  } catch (error: any) {
    console.error("Failed to Create and Start the stream: ", error);
  }
};
