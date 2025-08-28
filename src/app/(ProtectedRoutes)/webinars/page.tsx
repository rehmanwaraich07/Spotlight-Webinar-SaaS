import { onAuthenticateUser } from "@/actions/auth";
import { getWebianrByPresenterId } from "@/actions/webinar";
import { Webinar } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import WebinarsBoard from "./_components/WebinarsBoard";

const Page = async () => {
  const checkUser = await onAuthenticateUser();
  if (!checkUser) {
    redirect("/");
  }

  const webinars = await getWebianrByPresenterId(checkUser.user?.id!);

  return <WebinarsBoard webinars={webinars as Webinar[]} />;
};

export default Page;
