import { Assistant } from "@vapi-ai/server-sdk/api";
import { create } from "zustand";

type AiAgentStore = {
  assistant: Assistant | null;
  setAssistant: (assistant: Assistant) => void;
  clearAiAssistant: () => void;
};

export const useAiAgentStore = create<AiAgentStore>((set) => ({
  assistant: null,
  setAssistant: (assistant) => set({ assistant }),
  clearAiAssistant: () => set({ assistant: null }),
}));
