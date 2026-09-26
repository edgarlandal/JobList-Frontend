import Link from "next/link";
import type { Job } from "@/types/job";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit", month: "short", year: "numeric", timeZone: "UTC",
});

export default function TableLast({ jobs }: { jobs: Job[] }) {
  return (
    <div>
      <Card className="min-w-0 bg-[#F0F6F5] ring-[#0F766E]/20">
        <CardHeader className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle><h2>Recently updated</h2></CardTitle>
            <CardDescription>Your five most recently updated applications.</CardDescription>
          </div>
          <Link href="/dashboard/jobs" className="text-sm font-semibold text-[#0F766E] underline underline-offset-4">
            View all applications
          </Link>
        </CardHeader>
        <CardContent>
          <div className=" overflow-hidden rounded-2xl  shadow-sm">
            <Table className="min-w-[600px] [&_th]:px-5 [&_td]:px-5 [&_td]:py-4">
              <TableCaption className=" sr-only">
                A list of your recent jobs
              </TableCaption>
              <TableHeader>
                <TableRow className=" border-[#0F766E] bg-[#0F766E] hover:bg-[#0F766E] [&_th]:text-white [&_th]:h-12 [&_th]:font-bold ">
                  <TableHead scope="col">Company / Role</TableHead>
                  <TableHead scope="col">Location</TableHead>
                  <TableHead scope="col">Status</TableHead>
                  <TableHead scope="col">Updated</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {jobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-40 text-center whitespace-normal text-[#475569]">
                      <p className="font-semibold">You have no applications yet.</p>
                      <p className="mt-1 text-sm">Add your first application to start tracking your job search.</p>
                    </TableCell>
                  </TableRow>
                ) : jobs.map((job) => (
                  <TableRow key={job.id} className="border-[#0F766E]/10 odd:bg-[#F0F6F5] even:bg-[#E7F0F0] hover:bg-[#D7E9E5]">
                    <TableCell className="max-w-72 whitespace-normal break-words">
                      <p className="font-semibold">{job.enterprise.trim()}</p>
                      <p className="mt-1 text-xs text-[#475569]">{job.role.trim()}</p>
                    </TableCell>
                    <TableCell className="max-w-60 whitespace-normal break-words">
                      <p>{job.location.trim()}</p>
                      <p className="mt-1 text-xs text-[#475569]">{job.mode}</p>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex rounded-full bg-[#0F766E]/10 px-2.5 py-1 text-xs font-semibold text-[#0F766E] ring-1 ring-inset ring-[#0F766E]/20">
                        {job.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-[#475569] tabular-nums">
                      {Number.isNaN(Date.parse(job.last_update_at)) ? "Not available" : (
                        <time dateTime={job.last_update_at}>{dateFormatter.format(new Date(job.last_update_at))}</time>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
