import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/prismaClient";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const webinar = await prismaClient.webinar.findUnique({
      where: { id },
      select: {
        id: true,
        webinarStatus: true,
        startTime: true,
      },
    });

    if (!webinar) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: webinar.id,
      status: webinar.webinarStatus,
      startTime: webinar.startTime,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch status" },
      { status: 500 }
    );
  }
}
