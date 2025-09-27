"use server";

import { prismaClient } from "@/lib/prismaClient";
import { AttendanceData } from "@/lib/type";
import { AttendedTypeEnum, CtaTypeEnum } from "@prisma/client";

export const getWebinarAttendance = async (
  webinarId: string,
  options: {
    includeUsers?: boolean;
    userLimit?: number;
  } = { includeUsers: true, userLimit: 100 }
) => {
  try {
    const webinar = await prismaClient.webinar.findUnique({
      where: { id: webinarId },
      select: {
        id: true,
        ctaType: true,
        tags: true,
        presenter: true,
        _count: {
          select: {
            attendances: true,
          },
        },
      },
    });

    if (!webinar) {
      return {
        success: false,
        status: 404,
        error: "Webinar not Found",
      };
    }

    const attendanceCounts = await prismaClient.attendance.groupBy({
      by: ["attendedType"],
      where: { webinarId },
      _count: {
        attendedType: true,
      },
    });

    const result: Record<AttendedTypeEnum, AttendanceData> = {} as Record<
      AttendedTypeEnum,
      AttendanceData
    >;

    for (const type of Object.values(AttendedTypeEnum)) {
      if (
        type === AttendedTypeEnum.ADDED_TO_CART &&
        webinar.ctaType === CtaTypeEnum.BOOK_A_CALL
      )
        continue;

      if (
        type === AttendedTypeEnum.ADDED_TO_CART &&
        webinar.ctaType !== CtaTypeEnum.BOOK_A_CALL
      )
        continue;

      const countItem = attendanceCounts.find((item) => {
        if (
          webinar.ctaType === CtaTypeEnum.BOOK_A_CALL &&
          type === AttendedTypeEnum.BREAKOUT_ROOM &&
          item.attendedType === AttendedTypeEnum.ADDED_TO_CART
        ) {
          return true;
        }
        return item.attendedType === type;
      });

      result[type] = {
        count: countItem ? countItem._count.attendedType : 0,
        users: [],
      };
    }

    if (options.includeUsers) {
      for (const type of Object.values(AttendedTypeEnum)) {
        if (
          (type === AttendedTypeEnum.ADDED_TO_CART &&
            webinar.ctaType === CtaTypeEnum.BOOK_A_CALL) ||
          (type === AttendedTypeEnum.BREAKOUT_ROOM &&
            webinar.ctaType !== CtaTypeEnum.BOOK_A_CALL)
        ) {
          continue;
        }

        const queryType =
          webinar.ctaType === CtaTypeEnum.BOOK_A_CALL &&
          type === AttendedTypeEnum.BREAKOUT_ROOM
            ? AttendedTypeEnum.ADDED_TO_CART
            : type;

        if (result[type].count > 0) {
          const attendances = await prismaClient.attendance.findMany({
            where: {
              webinarId,
              attendedType: queryType,
            },
            include: {
              user: true,
            },
            take: options.userLimit,
            orderBy: { joinedAt: "desc" },
          });

          result[type].users = attendances.map((attendance) => ({
            id: attendance.user.id,
            name: attendance.user.name,
            email: attendance.user.email,
            stripeConnectId: null,
            callStatus: attendance.user.callStatus,
            updatedAt: attendance.user.updatedAt,
            createdAt: attendance.user.createdAt,
          }));
        }
      }
    }

    return {
      success: true,
      data: result,
      ctaType: webinar.ctaType,
      webinarTags: webinar.tags || [],
      presenter: webinar.presenter,
    };
  } catch (error) {
    console.error("Error fetching webinar attendance:", error);
    return {
      success: false,
      status: 500,
      error: "Internal Server Error",
    };
  }
};

export const changeAttendanceType = async (
  attendeeId: string,
  webinarId: string,
  attendedType: AttendedTypeEnum
) => {
  try {
    const attendance = await prismaClient.attendance.update({
      where: {
        attendeeId_webinarId: {
          attendeeId,
          webinarId,
        },
      },
      data: {
        attendedType,
      },
    });

    return {
      success: true,
      status: 200,
      message: "Attendance type Updated Successfully",
      data: attendance,
    };
  } catch (error) {
    console.error("Error updating attendacne type: ", error);
    return {
      success: false,
      status: 500,
      message: "Failed to update the Attendance type",
      error,
    };
  }
};

export const getAttendeeById = async (id: string, webinarId: string) => {
  try {
    const attendee = await prismaClient.attendee.findUnique({
      where: {
        id,
      },
    });

    const attendance = await prismaClient.attendance.findFirst({
      where: {
        attendeeId: id,
        webinarId: webinarId,
      },
    });

    if (!attendance || !attendance) {
      return {
        success: false,
        status: 404,
        message: "Attendee not Found",
      };
    }

    return {
      status: 200,
      success: true,
      message: "Get Attendee details successfully!",
      data: attendee,
    };
  } catch (error) {
    console.error("Error: ", error);
    return {
      status: 500,
      success: false,
      message: "Something went wrong!",
    };
  }
};
