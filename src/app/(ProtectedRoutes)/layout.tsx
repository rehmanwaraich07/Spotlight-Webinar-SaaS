import { onAuthenticateUser } from "@/actions/auth";

import { redirect } from "next/navigation";
import Sidebar from "@/components/ReusableComponent/LayoutComponnets/Sidebar";
import Header from "@/components/ReusableComponent/LayoutComponnets/Header";
import { getAllProductsFromStripe } from "@/actions/stripe";
import { getAllVapiAssistants } from "@/actions/vapi";

type Props = {
  children: React.ReactNode;
};

const layout = async ({ children }: Props) => {
  const uesrExists = await onAuthenticateUser();
  if (!uesrExists.user) {
    redirect("/sign-in");
  }

  const stripeProducts = await getAllProductsFromStripe();
  const assistants = await getAllVapiAssistants();
  return (
    <div className="flex w-full min-h-screen">
      {/* Side Bar */}
      <Sidebar />
      <div className="flex flex-col w-full h-screen overflow-auto px-4 scrollbar-hide container mx-auto">
        {/* Header */}
        <Header
          key={uesrExists?.user.id}
          user={uesrExists?.user}
          stripeProducts={stripeProducts.products || []}
        />

        <div className="flex-1 py-10">{children}</div>
      </div>
    </div>
  );
};

export default layout;
