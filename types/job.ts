export type Job = {
  id: string;
  enterprise: string;
  role: string;
  salary: number;
  type_salary: string;
  location: string;
  mode: string;
  status: string;
  last_update_at: string;
  notes: string;
};

export type JobInput = Omit<Job, "id" | "last_update_at">;
export type JobUpdate = Pick<JobInput, "status" | "salary" | "type_salary" | "notes">;
export type ApiJob = Omit<Job, "status" | "salary" | "type_salary" | "notes"> & {
  status_job: string;
  salary: number | null;
  type_salary: string | null;
  notes: string | null;
};
export type JobPage = { items: ApiJob[]; total: number; limit: number; offset: number };
