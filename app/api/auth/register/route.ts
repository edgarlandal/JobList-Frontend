import { forwardApi } from "@/lib/server/api";

export function POST(request: Request) {
  return forwardApi(request, "auth/register", false);
}
