import { onAuthenticateUser } from "@/actions/auth";
import { getWebianrByPresenterId } from "@/actions/webinar";
import { Webinar, WebinarStatusEnum } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import WebinarsBoard from "./_components/WebinarsBoard";

type Props = {
  searchParams: Promise<{
    Webinarstatus: string;
  }>;
};

const Page = async ({ searchParams }: Props) => {
  const { Webinarstatus } = await searchParams;
  const checkUser = await onAuthenticateUser();
  if (!checkUser) {
    redirect("/");
  }

  const webinars = await getWebianrByPresenterId(
    checkUser.user?.id!,
    Webinarstatus as WebinarStatusEnum
  );

  return <WebinarsBoard webinars={webinars as Webinar[]} />;
};

export default Page;
