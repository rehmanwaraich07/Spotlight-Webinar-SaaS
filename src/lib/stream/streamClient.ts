import { StreamClient } from "@stream-io/node-sdk";

export const getStreamClient = new StreamClient(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  process.env.STREAM_SECRET!
);
