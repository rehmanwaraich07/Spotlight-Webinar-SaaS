"use server";

import { prismaClient } from "@/lib/prismaClient";

export type LeadItem = {
  id: string;
  name: string;
  email: string;
  tags: string[];
  createdAt: Date;
};

export const getAllLeads = async (): Promise<LeadItem[]> => {
  try {
    const attendees = await prismaClient.attendee.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        Attendance: {
          include: {
            webinar: {
              select: { tags: true },
            },
          },
        },
      },
    });

    return attendees.map((a) => ({
      id: a.id,
      name: a.name,
      email: a.email,
      createdAt: a.createdAt,
      tags: Array.from(
        new Set((a.Attendance || []).flatMap((att) => att.webinar?.tags || []))
      ),
    }));
  } catch (error) {
    console.error("Error fetching leads:", error);
    return [];
  }
};
