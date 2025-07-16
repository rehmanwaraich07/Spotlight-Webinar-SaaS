import PageHeader from "@/components/ReusableComponent/PageHeader";
import { Tabs } from "@/components/ui/tabs";
import { HomeIcon, Webcam } from "lucide-react";
import React from "react";
import { FaUserGroup } from "react-icons/fa6";

type Props = {};

const Page = (props: Props) => {
  return (
    <Tabs defaultValue="all" className="w-full flex flex-col gap-8">
      <PageHeader
        leftIcon={<HomeIcon className="w-3 h-3 " />}
        mainIcon={<Webcam className="w-12 h-12" />}
        rightIcon={<FaUserGroup className="w-4 h-4" />}
        heading="The home to all your webinars"
        placeholder="Search option..."
      ></PageHeader>
    </Tabs>
  );
};

export default Page;
