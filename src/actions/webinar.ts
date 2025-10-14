"use server";

import { WebinarFormState } from "@/store/useWebinarStore";
import { onAuthenticateUser } from "./auth";
import { revalidatePath } from "next/cache";
import { prismaClient } from "@/lib/prismaClient";
import { AttendedTypeEnum, WebinarStatusEnum } from "@prisma/client";

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

    const skipSubscriptionCheck =
      process.env.SKIP_SUBSCRIPTION_CHECK === "true";
    if (!skipSubscriptionCheck && !user.user?.subscription) {
      return {
        status: 403,
        message: "You need to have a subscription to create a webinar.",
      };
    }

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

export const getWebianrByPresenterId = async (
  presenterId: string,
  webinarStatus?: string
) => {
  try {
    let statusFilter: WebinarStatusEnum | undefined;

    switch (webinarStatus) {
      case "upcoming":
        statusFilter = WebinarStatusEnum.SCHEDULED;
        break;

      case "ended":
        statusFilter = WebinarStatusEnum.ENDED;
        break;
      default:
        statusFilter = undefined;
    }
    const webinars = await prismaClient.webinar.findMany({
      where: {
        presenterId,
        webinarStatus: statusFilter,
      },
      include: {
        presenter: {
          select: {
            name: true,
            stripeConnectId: true,
            id: true,
          },
        },
      },
    });
    return webinars;
  } catch (error) {
    console.error("Error fetching webinars:", error);
    return [];
  }
};

// TODO update on  frotend as well
export const getWebinarById = async (webinarId: string) => {
  try {
    const webinar = await prismaClient.webinar.findUnique({
      where: {
        id: webinarId,
      },
      include: {
        presenter: {
          select: {
            id: true,
            name: true,
            profileImage: true,
            stripeConnectId: true,
          },
        },
      },
    });
    return webinar;
  } catch (error) {
    console.log("Error in fetching the WebinarId", error);
    throw new Error("Failed to fetch the webianr");
  }
};

export const changeWebinarStatus = async (
  webinarId: string,
  status: WebinarStatusEnum
) => {
  try {
    const webinar = await prismaClient.webinar.update({
      where: {
        id: webinarId,
      },
      data: {
        webinarStatus: status,
      },
    });

    return {
      status: 200,
      success: true,
      message: "Webinar Status Updated Successfully",
      data: webinar,
    };
  } catch (error) {
    console.log("Error Updating the webinar status: ", error);
    return {
      status: 500,
      success: false,
      message: "Failed to update the Webinar Status in Database",
    };
  }
};

export const registerAttendee = async ({
  webinarId,
  email,
  name,
}: {
  webinarId: string;
  email: string;
  name: string;
}) => {
  try {
    if (!webinarId || !email) {
      return {
        success: false,
        status: 400,
        meessage: "Missing Required Parameters",
      };
    }

    const webinar = await prismaClient.webinar.findUnique({
      where: { id: webinarId },
    });

    if (!webinar) {
      return {
        success: false,
        status: 404,
        message: "Webinar not Found",
      };
    }

    let attendee = await prismaClient.attendee.findUnique({
      where: { email },
    });

    if (!attendee) {
      attendee = await prismaClient.attendee.create({
        data: { email, name },
      });
    }

    if (!attendee) {
      return {
        success: false,
        status: 500,
        message: "Failed to resolve attendee",
      };
    }

    // check for existing attendance

    const existingAttendance = await prismaClient.attendance.findFirst({
      where: {
        attendeeId: attendee?.id,
        webinarId: webinar.id,
      },
      include: {
        user: true,
      },
    });

    if (existingAttendance) {
      return {
        success: true,
        status: 200,
        data: existingAttendance,
        message: "You are already registered for this webinar",
      };
    }

    const attendance = await prismaClient.attendance.create({
      data: {
        attendedType: AttendedTypeEnum.REGISTERED,
        attendeeId: attendee.id,
        webinarId: webinarId,
      },
      include: {
        user: true,
      },
    });

    revalidatePath(`/${webinarId}`);

    return {
      success: true,
      status: 200,
      data: attendance,
      meessage: "Successfully Registered",
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      error: error,
      message: "Something went wrong",
    };
  }
};
