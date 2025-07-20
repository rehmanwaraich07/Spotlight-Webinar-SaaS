import { getWebinarAttendance } from "@/actions/attendance";
import PageHeader from "@/components/ReusableComponent/PageHeader";
import { AttendedTypeEnum } from "@prisma/client";
import { HomeIcon } from "lucide-react";
import React from "react";
import { FaUserGroup } from "react-icons/fa6";
import { RiMenu3Line } from "react-icons/ri";
import PipelineLayout from "./_components/PipelineLayout";
import { formatColumnTitle } from "./_components/utils";

type Props = {
  params: Promise<{
    webinarId: string;
  }>;
};

const PipelinePage = async ({ params }: Props) => {
  const { webinarId } = await params;
  const pipelineData = await getWebinarAttendance(webinarId);

  if (!pipelineData) {
    return (
      <div className="flex justify-center items-center text-3xl h-[400px]">
        No Pipelines Found
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col gap-8">
      <PageHeader
        leftIcon={<FaUserGroup className="w-3 h-3 " />}
        mainIcon={<RiMenu3Line className="w-12 h-12" />}
        rightIcon={<HomeIcon className="w-4 h-4" />}
        heading="Keep track of all of your customers"
        placeholder="Search Name, Tag or Email"
      />
      <div className="flex overflow-x-auto pb-4 gap-4 md:gap-6">
        {Object.entries(pipelineData.data ?? {}).map(
          ([columnType, columnData]) => (
            <PipelineLayout
              key={columnType}
              title={formatColumnTitle(columnType as AttendedTypeEnum)}
              count={columnData.count}
              users={columnData.users}
              tags={pipelineData.webinarTags ?? []}
            />
          )
        )}
      </div>
    </div>
  );
};

export default PipelinePage;
