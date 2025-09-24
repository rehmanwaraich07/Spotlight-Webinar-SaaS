"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAiAgentStore } from "@/store/useAiAgentStore";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Assistant } from "@vapi-ai/server-sdk/api";
import { Plus, Search } from "lucide-react";
import React, { useMemo, useState } from "react";
import CreateAssistantModal from "./CreateAssistantModal";

type Props = {
  aiAgents: Assistant[] | [];
};

const AiAgentSidebar = ({ aiAgents }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { assistant, setAssistant } = useAiAgentStore();

  const filteredAgents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return aiAgents;
    return aiAgents.filter((a) => a.name?.toLowerCase().includes(q));
  }, [aiAgents, searchQuery]);
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
            placeholder="Search assistants"
            className="bg-neutral-900 border-neutral-700 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search assistants"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
        </div>
      </div>
      <ScrollArea className="mt-4 overflow-auto">
        {filteredAgents.length === 0 && (
          <div className="px-4 py-8 text-sm text-neutral-400">
            No assistants found
          </div>
        )}
        {filteredAgents.map((aiAssistant) => {
          const isSelected = aiAssistant.id === assistant?.id;
          return (
            <div
              className={`p-4 rounded-md transition-colors border cursor-pointer ${
                isSelected
                  ? "bg-primary/15 border-primary/50"
                  : "border-transparent hover:bg-primary/10"
              }`}
              key={aiAssistant.id}
              onClick={() => {
                setAssistant(aiAssistant);
              }}
              aria-selected={isSelected}
              role="button"
            >
              <div
                className={`font-medium ${isSelected ? "text-primary" : ""}`}
              >
                {aiAssistant.name}
              </div>
            </div>
          );
        })}
      </ScrollArea>

      <CreateAssistantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default AiAgentSidebar;
