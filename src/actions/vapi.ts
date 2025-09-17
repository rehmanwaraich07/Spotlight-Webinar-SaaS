"use server";

import { aiAgentPrompt } from "@/lib/data";
import { vapiServer } from "@/lib/vapi/vapiServer";

export const getAllVapiAssistants = async () => {
  try {
    const getAllAgents = await vapiServer.assistants.list();
    return {
      success: true,
      status: 200,
      data: getAllAgents,
    };
  } catch (error) {
    console.error("Error fetching Vapi Assistants:", error);
    return {
      success: false,
      status: 500,
      error: "Internal Server Error",
    };
  }
};

export const createAsssitant = async (name: string) => {
  try {
    const createAssistant = await vapiServer.assistants.create({
      name,
      firstMessage: `Hi there, this is ${name} from customer support. How can i help you today?`,
      model: {
        model: "gpt-4o-mini",
        provider: "openai",
        messages: [
          {
            role: "assistant",
            content: aiAgentPrompt,
          },
        ],
        temperature: 0.5,
      },
    });
    return {
      success: true,
      status: 200,
      data: createAssistant,
    };
  } catch (error) {
    console.log("Error creating Assistant: ", error);
    return {
      success: false,
      status: 500,
      data: "Failed to create assistant",
    };
  }
};
