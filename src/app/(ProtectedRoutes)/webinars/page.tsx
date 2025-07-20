import { onAuthenticateUser } from "@/actions/auth";
import { getWebianrByPresenterId } from "@/actions/webinar";
import PageHeader from "@/components/ReusableComponent/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Webinar } from "@prisma/client";
import { HomeIcon, Webcam } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import { FaUserGroup } from "react-icons/fa6";
import WebinarCard from "./_components/WebinarCard";

const Page = async () => {
  const checkUser = await onAuthenticateUser();
  if (!checkUser) {
    redirect("/");
  }

  const webinars = await getWebianrByPresenterId(checkUser.user?.id!);

  const now = new Date();

  const upcomingWebinars = webinars.filter(
    (webinar) => new Date(webinar.startTime) > now
  );

  return (
    <Tabs defaultValue="all" className="w-full flex flex-col gap-8">
      <PageHeader
        leftIcon={<HomeIcon className="w-3 h-3 " />}
        mainIcon={<Webcam className="w-12 h-12" />}
        rightIcon={<FaUserGroup className="w-4 h-4" />}
        heading="The home to all your webinars"
        placeholder="Search Webinars..."
      >
        <TabsList className="bg-transparent space-x-3">
          <TabsTrigger
            value="all"
            className="bg-secondary opacity-50 data-[state=active]:opacity-100 px-8 py-4 cursor-pointer"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="upcoming"
            className="px-8 py-4 bg-secondary cursor-pointer"
          >
            Upcoming
          </TabsTrigger>
        </TabsList>
      </PageHeader>

      <TabsContent
        value="all"
        className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 place-items-center place-content-start gap-x-6
        gap-y-10"
      >
        {webinars.length > 0 ? (
          webinars.map((webinar: Webinar, index) => (
            <WebinarCard key={index} webinar={webinar} />
          ))
        ) : (
          <div className="w-full h-[200px] flex justify-center items-center text-primary font-semibold text-2xl col-span-12">
            No Webinar Found
          </div>
        )}
      </TabsContent>

      <TabsContent
        value="upcoming"
        className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 place-items-center place-content-start gap-x-6
        gap-y-10"
      >
        {upcomingWebinars.length > 0 ? (
          upcomingWebinars.map((webinar, index) => (
            <WebinarCard key={index} webinar={webinar} />
          ))
        ) : (
          <div className="w-full h-[200px] flex justify-center items-center text-primary font-semibold text-2xl col-span-12">
            No Upcoming Webinars
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default Page;
