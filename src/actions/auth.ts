"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prismaClient } from "@/lib/prismaClient";

export async function onAuthenticateUser() {
  try {
    const user = await currentUser();

    if (!user) {
      return {
        status: 403,
      };
    }

    const userExists = await prismaClient.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (userExists) {
      return {
        status: 200,
        user: userExists,
      };
    }

    const newUser = await prismaClient.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        name: user.firstName + " " + user.lastName,
        profileImage: user.imageUrl,
      },
    });

    if (!newUser) {
      return {
        status: 500,
        message: "Failed to create the User",
      };
    }
    return {
      status: 201,
      user: newUser,
    };
  } catch (error) {
    console.error("Error authenticating user:", error);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
}
