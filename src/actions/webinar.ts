"use server";

import { WebinarFormState } from "@/store/useWebinarStore";
import { onAuthenticateUser } from "./auth";
import { revalidatePath } from "next/cache";
import { prismaClient } from "@/lib/prismaClient";

function combineDateTime(
  date: Date,
  timeStr: string,
  timeFormat: "AM" | "PM"
): Date {
  const [hoursStr, minutesStr] = timeStr.split(":");
  let hours = Number.parseInt(hoursStr, 10);
  const minutes = Number.parseInt(minutesStr || "0", 10);

  if (timeFormat === "PM" && hours < 12) {
    hours += 12;
  } else if (timeFormat === "AM" && hours === 12) {
    hours = 0;
  }

  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

export const createWebinar = async (formData: WebinarFormState) => {
  try {
    const user = await onAuthenticateUser();

    if (!user) {
      return {
        status: 401,
        message: "Unauthorized",
      };
    }

    // TODO: check if user have Subscription
    // if (!user.user?.subscription) {
    //   return {
    //     status: 403,
    //     message: "You need to have a subscription to create a webinar.",
    //   };
    // }

    const presenterId: string | undefined = user.user?.id;

    console.log("FormData: ", formData, presenterId);

    if (!formData.basicInfo.webinarName) {
      return {
        status: 404,
        message: "Webinar name is required.",
      };
    }

    if (!formData.basicInfo.date) {
      return {
        status: 404,
        message: "Webinar date is required.",
      };
    }

    if (!formData.basicInfo.time) {
      return {
        status: 404,
        message: "Webinar time is required.",
      };
    }

    const combinedDateTime = combineDateTime(
      formData.basicInfo.date,
      formData.basicInfo.time,
      formData.basicInfo.timeFormat || "AM"
    );

    const now = new Date();

    if (combinedDateTime < now) {
      return {
        status: 400,
        message: "Webinar date and time must be in the future.",
      };
    }

    const webinar = await prismaClient.webinar.create({
      data: {
        title: formData.basicInfo.webinarName,
        description: formData.basicInfo.description || "",
        startTime: combinedDateTime,
        tags: formData.cta.tags || [],
        ctaLabel: formData.cta.ctaLabel,
        ctaType: formData.cta.ctaType,
        aiAgentId: formData.cta.aiAgent || null,
        priceId: formData.cta.priceId || null,
        lockChat: formData.additionalInfo.lockChat || false,
        couponCode: formData.additionalInfo.couponEnabled
          ? formData.additionalInfo.couponCode
          : null,
        couponEnabled: formData.additionalInfo.couponEnabled || false,
        presenterId: presenterId!,
      },
    });

    revalidatePath("/");

    return {
      status: 200,
      message: "Webinar created successfully.",
      webinarId: webinar.id,
      webinarLink: `/webinar/${webinar.id}`,
    };
  } catch (error) {
    console.error("Error creating webinar:", error);
    return {
      status: 500,
      message: "An error occurred while creating the webinar.",
    };
  }
};
