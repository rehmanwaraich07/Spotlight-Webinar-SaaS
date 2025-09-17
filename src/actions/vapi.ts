"use server";

import { vapiServer } from "@/lib/vapi/vapiServer";

export const getAllVapiAssistants = async () => {
  try {
    const getAllAgents = await vapiServer.assistants.list();
    return {
      success: true,
      status: 200,
      assistants: getAllAgents,
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
