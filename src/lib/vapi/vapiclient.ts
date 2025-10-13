import Vapi from "@vapi-ai/web";

class VapiClient {
  private static instance: VapiClient;
  private vapi: Vapi;
  private isStarting = false;
  private hasActiveCall = false;

  private constructor() {
    this.vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
  }

  public static getInstance(): VapiClient {
    if (!VapiClient.instance) {
      VapiClient.instance = new VapiClient();
    }
    return VapiClient.instance;
  }

  public getVapi(): Vapi {
    return this.vapi;
  }

  public async stop(): Promise<void> {
    try {
      // If a start is in-flight, wait for it to settle before stopping
      if (this.isStarting) {
        await new Promise((resolve) => setTimeout(resolve, 250));
      }
      await this.vapi.stop();
      this.hasActiveCall = false;
    } catch (error) {
      // Ignore errors if no call is active
      console.log("No active call to stop");
    }
  }

  public async start(assistantId: string): Promise<void> {
    if (!assistantId) {
      throw new Error("Assistant ID is required");
    }

    if (!process.env.NEXT_PUBLIC_VAPI_API_KEY) {
      throw new Error("VAPI API key is not configured");
    }

    if (this.isStarting || this.hasActiveCall) {
      console.log("VAPI Client: Start skipped, already starting/active");
      return;
    }

    console.log("VAPI Client: Starting call with assistant ID:", assistantId);
    this.isStarting = true;

    // Stop any existing call before starting a new one
    await this.stop();

    try {
      await this.vapi.start(assistantId);
      this.hasActiveCall = true;
      console.log("VAPI Client: Call started successfully");
    } catch (error) {
      console.error("VAPI Client: Failed to start call:", error);
      this.hasActiveCall = false;
      throw error;
    } finally {
      this.isStarting = false;
    }
  }
}

export const vapiClient = VapiClient.getInstance();
export const vapi = vapiClient.getVapi();
