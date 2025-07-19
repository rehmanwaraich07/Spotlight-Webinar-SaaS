import { onAuthenticateUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import React from "react";

export const dynamic = "force-dynamic";

const AuthCallbackPage = async () => {
  const auth = await onAuthenticateUser();
  if (auth.status === 200 || auth.status === 201) {
    redirect("/home");
  } else if (
    auth.status === 400 ||
    auth.status === 403 ||
    auth.status === 500
  ) {
    redirect("/");
  }
  return <div className="bg-black h-[100%] w-[100%]">AuthCallbackPage</div>;
};

export default AuthCallbackPage;
