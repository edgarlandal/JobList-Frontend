import { authCookieOptions } from "@/lib/server/cookies";
import { apiResponse, backendFetch, checkOrigin } from "@/lib/server/api";
import type { TokenResponse } from "@/types/auth";

function isTokenResponse(value: unknown): value is TokenResponse {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return (
    typeof data.access_token === "string" &&
    data.access_token.length > 0 &&
    typeof data.refresh_token === "string" &&
    data.refresh_token.length > 0
  );
}

export async function POST(request: Request) {
  const rejected = checkOrigin(request);
  if (rejected) return rejected;
  const body = await request.json().catch(() => null);
  if (
    !body ||
    typeof body.email !== "string" ||
    !body.email.trim() ||
    typeof body.password !== "string" ||
    !body.password
  ) {
    return apiResponse({ message: "Email and password are required." }, 400);
  }
  try {
    const upstream = await backendFetch("auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        username: body.email.trim(),
        password: body.password,
      }),
    });
    if (!upstream.ok) {
      if ([400, 401, 403].includes(upstream.status))
        return apiResponse({ message: "Invalid email or password." }, 401);
      if (upstream.status === 429)
        return apiResponse(
          { message: "Too many attempts. Please try again later." },
          429,
        );
      return apiResponse(
        { message: "The authentication service is unavailable." },
        502,
      );
    }
    const tokens: unknown = await upstream.json();
    if (!isTokenResponse(tokens))
      return apiResponse(
        { message: "Unexpected authentication response." },
        502,
      );
    const response = apiResponse({ success: true });
    response.cookies.set(
      "access_token",
      tokens.access_token,
      authCookieOptions,
    );
    response.cookies.set(
      "refresh_token",
      tokens.refresh_token,
      authCookieOptions,
    );
    return response;
  } catch {
    return apiResponse(
      { message: "Unable to connect to the authentication service." },
      502,
    );
  }
}
