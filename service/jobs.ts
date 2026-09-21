import api from "@/lib/api";
import type { ApiJob, Job, JobInput, JobPage, JobUpdate } from "@/types/job";

function toJob(job: ApiJob): Job {
  return {
    ...job,
    status: job.status_job,
    salary: job.salary ?? 0,
    // The current backend enum spells Monthly as Mounthly.
    type_salary:
      job.type_salary === "Mounthly" ? "Monthly" : (job.type_salary ?? "NA"),
    notes: job.notes ?? "",
  };
}

function toPayload(input: JobInput | JobUpdate) {
  const { status, type_salary, ...rest } = input;
  return {
    ...rest,
    status_job: status,
    type_salary:
      type_salary === "Monthly"
        ? "Mounthly"
        : type_salary === "NA"
          ? null
          : type_salary,
    last_update_at: new Date().toISOString(),
  };
}

export async function listJobs(
  limit: number,
  offset: number,
  signal?: AbortSignal,
) {
  const { data } = await api.get<JobPage>("jobs", {
    params: { limit, offset },
    signal,
  });
  return { ...data, items: data.items.map(toJob) };
}

export async function createJob(input: JobInput): Promise<Job> {
  const { data } = await api.post<ApiJob>("jobs", toPayload(input));
  return toJob(data);
}

export async function updateJob(id: string, input: JobUpdate): Promise<Job> {
  const { data } = await api.patch<ApiJob>(
    `jobs/${encodeURIComponent(id)}`,
    toPayload(input),
  );
  return toJob(data);
}

export async function deleteJob(id: string): Promise<void> {
  await api.delete(`jobs/${encodeURIComponent(id)}`);
}
