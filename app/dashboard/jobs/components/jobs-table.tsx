import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export type Job = {
  id: string | number;
  enterprise: string;
  role: string;
  salary: number;
  type_salary: string;
  location: string;
  mode: string;
  status: string;
  last_update_at: string;
};

type JobsTableProps = {
  jobs: Job[];
};

const salaryFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const defaultStatusClass =
  "bg-[#F8FAFC] text-[#475569] ring-[#CBD5E1]";

const statusClasses: Record<string, string | undefined> = {
  "In progress": "bg-[#0F766E]/10 text-[#0F766E] ring-[#0F766E]/20",
  HR: "bg-[#0F172A]/10 text-[#0F172A] ring-[#0F172A]/20",
  Rejected: "bg-[#475569]/10 text-[#475569] ring-[#475569]/20",
  Cancelled: defaultStatusClass,
};

export function JobsTable({ jobs }: JobsTableProps) {
  return (
    <Table className="min-w-[960px] [&_th]:px-5 [&_td]:px-5 [&_td]:py-4">
      <TableCaption className="sr-only">
        Job applications: company, role, salary, work arrangement, location,
        status, and last updated.
      </TableCaption>

      <TableHeader>
        <TableRow className="border-[#0F172A] bg-[#0F172A] hover:bg-[#0F172A] [&_th]:h-12 [&_th]:text-xs [&_th]:font-bold [&_th]:text-white">
          <TableHead scope="col">Company / Role</TableHead>

          <TableHead scope="col" className="text-right">
            Salary
          </TableHead>

          <TableHead scope="col">Location</TableHead>
          <TableHead scope="col">Status</TableHead>
          <TableHead scope="col">Last updated</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {jobs.length === 0 ? (
          <TableRow className="bg-[#F0F6F5] hover:bg-[#E0EEEB]">
            <TableCell
              colSpan={5}
              className="h-40 text-center text-[#475569]"
            >
              You have no applications yet.
            </TableCell>
          </TableRow>
        ) : (
          jobs.map((job) => (
            <TableRow
              key={job.id}
              className="border-[#0F766E]/10 odd:bg-[#F0F6F5] even:bg-[#E7F0F0] hover:bg-[#D7E9E5]"
            >
              <TableCell className="min-w-32 max-w-48 whitespace-normal">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#0F766E] text-sm font-bold text-white shadow-sm"
                  >
                    {job.enterprise.trim().slice(0, 2).toUpperCase()}
                  </span>

                  <div className="min-w-0">
                    <p className="font-bold leading-snug">
                      {job.enterprise.trim()}
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-[#475569]">
                      {job.role.trim()}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-right tabular-nums">
                {job.salary > 0 ? (
                  <>
                    <p className="font-semibold">
                      ${salaryFormatter.format(job.salary)}
                    </p>

                    <p className="mt-1 text-xs text-[#475569]">
                      {job.type_salary === "NA"
                        ? "Pay period not specified"
                        : job.type_salary}
                    </p>
                  </>
                ) : (
                  <span className="text-xs text-[#475569]">
                    Not specified
                  </span>
                )}
              </TableCell>

              <TableCell className="text-[#475569]">
                <p className="font-bold leading-snug">
                  {job.location.trim()}
                </p>

                <p className="mt-1 text-xs leading-relaxed text-[#475569]">
                  {job.mode.trim()}
                </p>
              </TableCell>

              <TableCell>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                    statusClasses[job.status] ?? defaultStatusClass
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-current"
                  />
                  {job.status}
                </span>
              </TableCell>

              <TableCell className="text-xs text-[#475569] tabular-nums">
                <time dateTime={job.last_update_at}>
                  {dateFormatter.format(
                    new Date(`${job.last_update_at}T00:00:00Z`),
                  )}
                </time>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}