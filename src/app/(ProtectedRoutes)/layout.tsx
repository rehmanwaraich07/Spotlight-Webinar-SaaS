import { onAuthenticateUser } from "@/actions/auth";
import React from "react";
import { redirect } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

const layout = async ({ children }: Props) => {
  const uesrExists = await onAuthenticateUser();
  if (!uesrExists.user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex w-full min-h-screen">
      {/* Side Bar */}
      <div className="flex flex-col w-full h-screen overflow-auto px-4 scrollbar-hide container mx-auto">
        {/* Header */}

        {children}
      </div>
    </div>
  );
};

export default layout;
