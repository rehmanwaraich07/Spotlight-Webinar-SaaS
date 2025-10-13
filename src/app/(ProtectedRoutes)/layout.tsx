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
          assistants={assistants.data || []}
        />

        <div className="flex-1 py-10">{children}</div>
        {/* Footer credit across protected pages */}
        <footer className="pb-6 pt-2 text-center text-xs text-muted-foreground">
          Built with ♡ by
          <a
            href="https://instagram.com/rehman_waraich7"
            target="_blank"
            rel="noreferrer"
            className="ml-1 underline underline-offset-4 text-primary hover:text-primary/90"
          >
            M.Rehman
          </a>
        </footer>
      </div>
    </div>
  );
};

export default layout;
