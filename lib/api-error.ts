import axios from "axios";

export function apiErrorMessage(error: unknown, fallback: string): string {
  if (!axios.isAxiosError(error)) return fallback;
  if (!error.response) return "Unable to connect. Please try again.";
  if (error.response.status === 429) return "Too many attempts. Please try again later.";
  const data = error.response.data;
  if (!data || typeof data !== "object") return fallback;
  if (typeof data.message === "string") return data.message;
  if (typeof data.detail === "string") return data.detail;
  const details: unknown = data.details ?? data.detail;
  if (Array.isArray(details)) {
    const messages = details.flatMap((item: unknown) => {
      if (!item || typeof item !== "object") return [];
      const entry = item as Record<string, unknown>;
      const message = entry.message ?? entry.msg;
      return typeof message === "string" ? [message] : [];
    });
    if (messages.length) return messages.join("\n");
  }
  return fallback;
}
