import { onAuthenticateUser } from "@/actions/auth";

import { redirect } from "next/navigation";
import Sidebar from "@/components/ReusableComponent/LayoutComponnets/Sidebar";
import Header from "@/components/ReusableComponent/LayoutComponnets/Header";

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
      <Sidebar />
      <div className="flex flex-col w-full h-screen overflow-auto px-4 scrollbar-hide container mx-auto">
        {/* Header */}
        <Header user={uesrExists.user} />

        {children}
      </div>
    </div>
  );
};

export default layout;
