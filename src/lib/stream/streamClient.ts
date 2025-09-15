import { StreamClient } from "@stream-io/node-sdk";

export const getStreamClient = new StreamClient(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  process.env.STREAM_SECRET!,
  {
    timeout: 10000, // 10 seconds timeout instead of default 3 seconds
  }
);
