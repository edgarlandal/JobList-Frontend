import { forwardApi } from "@/lib/server/api";

type JobRouteContext = { params: Promise<{ id: string }> };

async function forwardJob(request: Request, { params }: JobRouteContext) {
  const { id } = await params;
  return forwardApi(request, `jobs/${encodeURIComponent(id)}`);
}

export { forwardJob as PATCH, forwardJob as DELETE };
