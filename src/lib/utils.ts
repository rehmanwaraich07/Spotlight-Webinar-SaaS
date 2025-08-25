import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validateStreamEnvVars() {
  const requiredVars = [
    "NEXT_PUBLIC_STREAM_API_KEY",
    "STREAM_TOKEN",
    "STREAM_CALL_ID",
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error("Missing required environment variables:", missingVars);
    return false;
  }

  return true;
}
