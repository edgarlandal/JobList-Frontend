import "server-only";

import { cookies } from "next/headers";
import type { User } from "@/types/auth";
import { backendFetch } from "./api";

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) return false;

  const data = value as Record<string, unknown>;

  return (
    (typeof data.id === "string" || typeof data.id === "number") &&
    typeof data.email === "string"
  );
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return null;

  const response = await backendFetch("users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) return null;

  if (!response.ok) throw new Error("The session could not be verified");

  const user: unknown = await response.json();

  if (!isUser(user))
    throw new Error("The user's response has an unexpected format.");

  return user;
}
