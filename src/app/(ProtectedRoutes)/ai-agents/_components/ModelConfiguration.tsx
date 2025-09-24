"use client";

import { useAiAgentStore } from "@/store/useAiAgentStore";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Bot, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateAssitant } from "@/actions/vapi";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Props = {};

const ModelConfiguration = (props: Props) => {
  const { assistant } = useAiAgentStore();
  const [firstMessage, setFirstMessage] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assistant) {
      setFirstMessage(assistant?.firstMessage || "");
      setSystemPrompt(assistant?.model?.messages?.[0]?.content || "");
    }
  }, [assistant]);

  const handleUpdateAssistant = async () => {
    setLoading(true);
    try {
      if (!assistant?.id) throw new Error("No assistant selected");
      const res = await updateAssitant(
        assistant.id,
        firstMessage,
        systemPrompt
      );
      if (!res.success) {
        throw Error(res.message);
      }

      toast.success("Assistant Updated Successfully!");
    } catch (error) {
      console.error("Error updating the Assistant", error);
      toast.error("Failed to update the Assistant");
    } finally {
      setLoading(false);
    }
  };

  if (!assistant) {
    return (
      <div className="flex justify-center items-center h-[500px] w-full">
        <Card className="w-full max-w-xl border border-border/80 bg-background/60 backdrop-blur-sm p-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Bot className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No assistant selected</h3>
          <p className="text-sm text-muted-foreground">
            Select an AI assistant from the sidebar to configure its model
            settings.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-xl p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Model</h2>
        <Button onClick={handleUpdateAssistant} disabled={loading}>
          {loading ? (
            <Loader2 className="animate-spin mr-2" />
          ) : (
            "Update Assistant"
          )}
        </Button>
      </div>
      <p className="text-neutral-400 mb-6">
        Configure the behavior of the Assistant
      </p>

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Label className="font-medium">First Message</Label>
          <Info className="h-4 w-4 text-neutral-500 ml-2" />
        </div>
        <Input
          value={firstMessage}
          onChange={(e) => setFirstMessage(e.target.value)}
          className="bg-neutral-900 border-neutral-700 placeholder:text-neutral-500 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/50"
        />
      </div>

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Label className="font-medium">System Prompt</Label>
          <Info className="h-4 w-4 text-neutral-500 ml-2" />
        </div>
        <Textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className="bg-neutral-900 border-neutral-700 placeholder:text-neutral-500 min-h-56 resize-y focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/50"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <ConfigFiled label="Provider">
          <DropDownSelect value={assistant.model?.provider || ""} />
        </ConfigFiled>

        <ConfigField label="Model" showInfo={true}>
          <DropDownSelect value={assistant.model?.model || ""} />
        </ConfigField>
      </div>
    </div>
  );
};

export default ModelConfiguration;
