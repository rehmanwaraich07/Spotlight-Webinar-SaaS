"use server";

import { Attendee } from "@prisma/client";
import { UserRequest } from "@stream-io/video-react-sdk";
import { getStreamClient } from "@/lib/stream/streamClient";

export const getStreamIoToken = async (attendee: Attendee | null) => {
  try {
    const newUser: UserRequest = {
      id: attendee?.id || "Guest",
      name: attendee?.name || "Guest",
      image: `https://api.dicebear.com/7.x/initials/svg?seed=${
        attendee?.name || "Guest"
      }`,
      role: "user",
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
