import { getWebinarAttendance } from "@/actions/attendance";
import React from "react";
import PipelineBoard from "./_components/PipelineBoard";

type Props = {
  params: Promise<{
    webinarId: string;
  }>;
};

const PipelinePage = async ({ params }: Props) => {
  const { webinarId } = await params;
  const pipelineData = await getWebinarAttendance(webinarId);

  if (!pipelineData || !("success" in pipelineData)) {
    return (
      <div className="flex justify-center items-center text-3xl h-[400px]">
        No Pipelines Found
      </div>
    );
  }
  const boardData = pipelineData.success
    ? {
        data: (pipelineData as any).data ?? null,
        webinarTags: (pipelineData as any).webinarTags ?? null,
      }
    : { data: null, webinarTags: null };
  return <PipelineBoard pipelineData={boardData} />;
};

export default PipelinePage;
