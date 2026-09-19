import { NextResponse } from "next/server";
import { authCookieOptions } from "@/lib/server/cookies";
import type {
  ApiError,
  LoginRequest,
  LoginResponse,
  TokenResponse,
} from "@/types/auth";
import { error } from "node:console";

function isLoginRequest(value: unknown): value is LoginRequest {
  if (typeof value !== "object" || value === null) return false;

  const data = value as Record<string, unknown>;

  return (
    typeof data.email === "string" &&
    data.email.trim().length > 0 &&
    typeof data.password === "string" &&
    data.password.length > 0
  );
}

function isTokenResponse(value: unknown): value is TokenResponse {
  if (typeof value !== "object" || value === null) return false;

  const data = value as Record<string, unknown>;

  return (
    typeof data.access_token === "string" &&
    data.access_token.length > 0 &&
    typeof data.refresh_token === "string" &&
    data.refresh_token.length > 0
  );
}

function errorResponse(message: string, status: number) {
  return NextResponse.json<ApiError>(
    { message },
    {
      status,

      headers: { "Cache-Control": "no-store" },
    },
  );
}

export async function POST(request: Request) {
  const apiUrl = process.env.FASTAPI_URL;
  const appOrigin = process.env.APP_ORIGIN;

  if (!apiUrl || !appOrigin)
    return errorResponse("Configuration of server incomplete", 500);

  if (request.headers.get("origin") !== appOrigin)
    return errorResponse("Orign not permit ", 403);

  const body: unknown = await request.json().catch(() => null);

  if (!isLoginRequest(body))
    return errorResponse("Email and password is required", 400);

  try {
    const upstream = await fetch(`${apiUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });

    if (!upstream.ok) {
      if ([400, 401, 403].includes(upstream.status)) {
        return errorResponse("Login is failed for credentials", 401);
      }

      if (upstream.status === 429) {
        return errorResponse("Too long tries", 429);
      }

      return errorResponse(
        "The services of authetification is not available",
        502,
      );
    }

    const tokens: unknown = await upstream.json();

    if (!isTokenResponse(tokens)) {
      return errorResponse(
        "Response of authentifications is unexpectedly",
        502,
      );
    }

    const response = NextResponse.json<LoginResponse>(
      { success: true },
      { headers: { "Cache-Control": "no-store" } },
    );

    response.cookies.set(
      "access_token",
      tokens.access_token,
      authCookieOptions,
    );

    response.cookies.set(
      "refres_token",
      tokens.refresh_token,
      authCookieOptions,
    );

    return response;
  } catch (error) {
    return errorResponse(
      "It was not possible to connect to the authentication",
      502,
    );
  }
}
