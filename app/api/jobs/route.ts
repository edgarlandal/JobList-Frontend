import { apiResponse, forwardApi } from "@/lib/server/api";

export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const limit = Number(params.get("limit") ?? 20);
  const offset = Number(params.get("offset") ?? 0);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100 || !Number.isInteger(offset) || offset < 0) {
    return apiResponse({ message: "Invalid pagination parameters." }, 400);
  }
  return forwardApi(request, `jobs?limit=${limit}&offset=${offset}`);
}
export function POST(request: Request) {
  return forwardApi(request, "jobs");
}
