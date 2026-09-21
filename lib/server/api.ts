import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function apiResponse(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export function checkOrigin(request: Request) {
  const origin = process.env.APP_ORIGIN;
  if (!origin) return apiResponse({ message: "APP_ORIGIN is not configured." }, 500);
  if (request.headers.get("origin") !== origin.replace(/\/$/, "")) {
    return apiResponse({ message: "Request origin is not allowed." }, 403);
  }
  return null;
}

export function backendFetch(path: string, init: RequestInit = {}) {
  const base = process.env.FASTAPI_URL?.trim().replace(/\/+$/, "");
  if (!base) throw new Error("FASTAPI_URL is not configured.");
  return fetch(`${base}/${path.replace(/^\/+/, "")}`, {
    ...init, cache: "no-store", signal: AbortSignal.timeout(10_000),
  });
}

export async function forwardApi(request: Request, path: string, authenticated = true) {
  if (request.method !== "GET") {
    const rejected = checkOrigin(request);
    if (rejected) return rejected;
  }
  const headers = new Headers();
  if (authenticated) {
    const token = (await cookies()).get("access_token")?.value;
    if (!token) return apiResponse({ message: "Please log in to continue." }, 401);
    headers.set("Authorization", `Bearer ${token}`);
  }
  let body: string | undefined;
  if (request.method !== "GET" && request.method !== "DELETE") {
    const input: unknown = await request.json().catch(() => null);
    if (!input || typeof input !== "object" || Array.isArray(input)) {
      return apiResponse({ message: "A JSON object is required." }, 400);
    }
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(input);
  }
  try {
    const response = await backendFetch(path, { method: request.method, headers, body });
    if (response.status >= 500) return apiResponse({ message: "The API is currently unavailable. Please try again." }, 502);
    if (response.status === 204) {
      return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
    }
    const data: unknown = await response.json();
    return apiResponse(data, response.status);
  } catch {
    return apiResponse({ message: "Unable to connect to the API. Check the backend connection." }, 502);
  }
}
