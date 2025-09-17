import { getAllVapiAssistants } from "@/actions/vapi";
import React from "react";
import AiAgentSidebar from "./_components/AiAgentSidebar";

type Props = {};

const page = async (props: Props) => {
  const allAgents = await getAllVapiAssistants();
  return (
    <div className="w-full flex h-[80vh] text-primary border border-border rounded-lg">
      <AiAgentSidebar aiAgents={allAgents?.data || []} />
      <div className="flex-1 flex flex-col">{/* <ModalSection /> */}</div>
    </div>
  );
};

export default page;
