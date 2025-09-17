"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAiAgentStore } from "@/store/useAiAgentStore";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Assistant } from "@vapi-ai/server-sdk/api";
import { Plus, Search } from "lucide-react";
import React, { useState } from "react";
import CreateAssistantModal from "./CreateAssistantModal";

type Props = {
  aiAgents: Assistant[] | [];
};

const AiAgentSidebar = ({ aiAgents }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { assistant, setAssistant } = useAiAgentStore();
  return (
    <div className="w-[300px] border-r border-border flex flex-col">
      <div className="p-4">
        <Button
          className="w-full flex items-center gap-2 mb-4 hover:cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus /> Create Assistant
        </Button>
        <div className="relative">
          <Input
            placeholder="Search Assistants"
            className="bg-neutral-900 border-neutral-700 pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
        </div>
      </div>
      <ScrollArea className="mt-4 overflow-auto">
        {aiAgents.map((aiAssistant) => (
          <div
            className={`p-4 ${
              aiAssistant.id === assistant?.id ? "bg-background/10" : ""
            } hover:bg-primary/20 cursor-pointer`}
            key={aiAssistant.id}
            onClick={() => {
              setAssistant(aiAssistant);
            }}
          >
            <div className="font-medium">{aiAssistant.name}</div>
          </div>
        ))}
      </ScrollArea>

      <CreateAssistantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default AiAgentSidebar;
