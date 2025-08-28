"use client";

import React from "react";
import PageHeader from "@/components/ReusableComponent/PageHeader";
import { HomeIcon, Webcam } from "lucide-react";
import { FaUserGroup } from "react-icons/fa6";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Webinar } from "@prisma/client";
import WebinarCard from "./WebinarCard";

type Props = {
  webinars: Webinar[];
};

const WebinarsBoard = ({ webinars }: Props) => {
  const [query, setQuery] = React.useState("");

  const now = React.useMemo(() => new Date(), []);

  const upcomingWebinars = React.useMemo(
    () => webinars.filter((w) => new Date(w.startTime) > now),
    [webinars, now]
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filterByTitle = (items: Webinar[]) => {
    if (!normalizedQuery) return items;
    return items.filter((w) =>
      w.title?.toLowerCase().includes(normalizedQuery)
    );
  };

  const filteredAll = filterByTitle(webinars);
  const filteredUpcoming = filterByTitle(upcomingWebinars);

  return (
    <Tabs defaultValue="all" className="w-full flex flex-col gap-8">
      <PageHeader
        leftIcon={<HomeIcon className="w-3 h-3 " />}
        mainIcon={<Webcam className="w-12 h-12" />}
        rightIcon={<FaUserGroup className="w-4 h-4" />}
        heading="The home to all your webinars"
        placeholder="Search Webinars..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
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
        className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 place-items-center place-content-start gap-x-6 gap-y-10"
      >
        {filteredAll.length > 0 ? (
          filteredAll.map((webinar, index) => (
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
        className="w-full grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 place-items-center place-content-start gap-x-6 gap-y-10"
      >
        {filteredUpcoming.length > 0 ? (
          filteredUpcoming.map((webinar, index) => (
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

export default WebinarsBoard;
