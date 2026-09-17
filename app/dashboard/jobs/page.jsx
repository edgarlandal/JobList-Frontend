"use client";

import { useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { ModalCreateJob } from "./components/modal";

const joblist = [
  {
    id: "f02fdf38-743b-4c8b-98b6-d3a11ac7e625",
    enterprise: "Outset Medical, Inc.",
    role: "Senior Test Automation Engineer",
    salary: 0.0,
    type_salary: "NA",
    mode: "On-Site",
    location: "Tijuana B.C.",
    status: "Cancelled",
    last_update_at: "2026-04-20",
    notes: "I did not respond",
  },
  {
    id: "a43b892d-59ed-42ad-bf06-9bb681ead429",
    enterprise: "Qualcomm",
    role: " System Level Test Engineer",
    salary: 0.0,
    type_salary: "NA",
    mode: "On-Site",
    location: "Tijuana B.C.",
    status: "Rejected",
    last_update_at: "2026-07-17",
    notes: "Work priority",
  },
  {
    id: "367c814a-d8a2-4aa7-86da-72815109f35c",
    enterprise: "Turbotec",
    role: "Software Engineer",
    salary: 0.0,
    type_salary: "NA",
    mode: "On-Site",
    location: "Tijuana B.C.",
    status: "Cancelled",
    last_update_at: "2026-07-16",
    notes: "I went on vacation",
  },
  {
    id: "9ae70c16-287f-4ce9-a89f-31d7c9c406b2",
    enterprise: "Castelec Internacional",
    role: "Desarrollador software",
    salary: 25000.0,
    type_salary: "Monthly",
    mode: "Remote",
    location: "Monterrey, N.L.",
    status: "Rejected",
    last_update_at: "2026-07-16",
    notes: "Complete the survey",
  },
  {
    id: "60f236d9-7291-47f3-bcb2-a319187ec548",
    enterprise: "Crunchyroll",
    role: "Android Crunchyroll Application",
    salary: 0.0,
    type_salary: "NA",
    mode: "Hybrid",
    location: "Mexico City",
    status: "Rejected",
    last_update_at: "2026-07-02",
    notes: "I did not meet the requirements",
  },
  {
    id: "c730168b-d4a6-4e21-9f7d-652845b9ec03",
    enterprise: "Vinoc",
    role: "Full Stack Developer",
    salary: 0.0,
    type_salary: "NA",
    mode: "Remote",
    location: "Queretaro",
    status: "HR",
    last_update_at: "2026-07-10",
    notes: "They have not replied",
  },
  {
    id: "812d64a9-f561-4bf0-8db6-041b7c593e2a",
    enterprise: "Ivemsa",
    role: "V-Software Engineer",
    salary: 0.0,
    type_salary: "NA",
    mode: "On-Site",
    location: "Tijuana B.C.",
    status: "HR",
    last_update_at: "2026-07-15",
    notes: "Wait for their call",
  },
  {
    id: "d98ce2f4-1b35-4619-a87c-2c03b49f075e",
    enterprise: "Phinder",
    role: "Programador(a) C++",
    salary: 38000.0,
    type_salary: "Monthly",
    mode: "On-Site",
    location: "Mexico City",
    status: "Cancelled",
    last_update_at: "2026-07-16",
    notes: "Waiting for a response",
  },
  {
    id: "29b65a08-e7c3-40d2-b5f9-862d917c34ea",
    enterprise: "EPAM",
    role: "C++ Developer",
    salary: 0.0,
    type_salary: "NA",
    mode: "Remote",
    location: "Tijuana B.C.",
    status: "Rejected",
    last_update_at: "2026-07-15",
    notes: "I did not meet the requirements",
  },
  {
    id: "be761a2c-53f8-4d04-923b-c580e62fa197",
    enterprise: "Global Logic",
    role: "C++ Developer",
    salary: 0.0,
    type_salary: "NA",
    mode: "Remote",
    location: "Guadalajara Jalisco",
    status: "Cancelled",
    last_update_at: "2026-04-15",
    notes: "The position was cancelled",
  },
  {
    id: "4fd70c63-b182-49a5-8ec7-7bd0351926fa",
    enterprise: "Solar Turbines",
    role: "Software Engineer",
    salary: 0.0,
    type_salary: "NA",
    mode: "On-Site",
    location: "Tijuana B.C.",
    status: "Rejected",
    last_update_at: "2026-07-16",
    notes: "I could not attend the interview",
  },
  {
    id: "751e392b-8a06-4cfd-af15-e263907b4d58",
    enterprise: "apimarket.mx",
    role: "Software Engineer",
    salary: 30000.0,
    type_salary: "Monthly",
    mode: "Hybrid",
    location: "Tijuana B.C.",
    status: "Rejected",
    last_update_at: "2026-07-10",
    notes: "Expect a call in a few days",
  },
  {
    id: "e263b890-16d7-4a5f-93c2-584fb1e079ad",
    enterprise: "HITSS",
    role: "Ingeniero de Soporte NOC ",
    salary: 25000.0,
    type_salary: "Monthly",
    mode: "On-Site",
    location: "Tijuana B.C.",
    status: "Cancelled",
    last_update_at: "2026-07-16",
    notes: "I need to have a call",
  },
  {
    id: "08bd7691-c25f-438a-b764-f9a1375e602c",
    enterprise: "Softek",
    role: "C++ Developer",
    salary: 25000.0,
    type_salary: "Monthly",
    mode: "Remote",
    location: "Mexico City",
    status: "Cancelled",
    last_update_at: "2026-05-27",
    notes: "They never replied",
  },
  {
    id: "9352ad6e-7f40-48b9-86e1-d21c50fa7348",
    enterprise: "Banco Azteca",
    role: "C++ Developer",
    salary: 38000.0,
    type_salary: "Monthly",
    mode: "On-Site",
    location: "Mexico City",
    status: "Cancelled",
    last_update_at: "2026-06-02",
    notes: "They never replied",
  },
  {
    id: "6c104b83-a9e2-4f67-a35d-87e92601bc54",
    enterprise: "sagaon",
    role: "Desarrollador Backend",
    salary: 19000.0,
    type_salary: "Monthly",
    mode: "Remote",
    location: "Queretaro",
    status: "Rejected",
    last_update_at: "2026-08-18",
    notes: "They moved forward with another candidate",
  },
  {
    id: "b1f6d045-3a8c-42e7-9db0-c548761f209a",
    enterprise: "Google",
    role: "Software Engineer",
    salary: 80000.0,
    type_salary: "Monthly",
    mode: "Hybrid",
    location: "Mexico City",
    status: "Rejected",
    last_update_at: "2026-08-10",
    notes: "I did not meet the requirements",
  },
  {
    id: "3ea708d2-615b-4c90-bf24-098d7a13e6c5",
    enterprise: "Qualcomm",
    role: "Python Developer",
    salary: 0.0,
    type_salary: "NA",
    mode: "On-Site",
    location: "Tijuana B.C.",
    status: "Cancelled",
    last_update_at: "2026-08-02",
    notes: "I did not meet the requirements",
  },
  {
    id: "f8b9216c-0d73-45ae-8739-1e6c4b520adf",
    enterprise: "Toyota",
    role: "Desarrollador de Software JR",
    salary: 24000.0,
    type_salary: "Monthly",
    mode: "On-Site",
    location: "Tijuana B.C.",
    status: "Cancelled",
    last_update_at: "2026-08-06",
    notes: "I did not attend the interview",
  },
  {
    id: "52d6ef17-b8c0-49a3-a164-7f093ce285bd",
    enterprise: "aqusagtechnologies",
    role: "Remote Open Source Contributor",
    salary: 50.0,
    type_salary: "Daily",
    mode: "Remote",
    location: "Tijuana B.C.",
    status: "Cancelled",
    last_update_at: "2026-07-23",
    notes: "No response",
  },
  {
    id: "ca87103e-294f-46d8-92b5-e138f70a6c49",
    enterprise: "Global Logic",
    role: "Automotive Developer",
    salary: 0.0,
    type_salary: "NA",
    mode: "Remote",
    location: "Guadalajara Jalisco",
    status: "Rejected",
    last_update_at: "2026-08-14",
    notes: "I did not meet the requirements",
  },
  {
    id: "174ce9b5-f260-4a83-b7d1-65f0482c39ae",
    enterprise: "Tecna ",
    role: "IT Software Developer Engineer",
    salary: 0.0,
    type_salary: "NA",
    mode: "On-Site",
    location: "Tijuana B.C.",
    status: "HR",
    last_update_at: "2026-09-07",
    notes: "Waiting for a response",
  },
  {
    id: "8d509c72-3e61-47bf-8a24-b96e017d5f30",
    enterprise: "KodeIT",
    role: "C++ Developer",
    salary: 28000.0,
    type_salary: "Monthly",
    mode: "On-Site",
    location: "Mexico City",
    status: "In progress",
    last_update_at: "2026-09-10",
    notes: "Relocation to Mexico City",
  },
  {
    id: "e097f4a1-6b28-43d5-af90-325c7e81b649",
    enterprise: "Hyspan",
    role: "Desarrollador de PowerApps",
    salary: 0.0,
    type_salary: "NA",
    mode: "On-Site",
    location: "Tijuana B.C.",
    status: "HR",
    last_update_at: "2026-09-14",
    notes: "A bit far away",
  },
  {
    id: "46ab125f-907c-4e38-95d6-f071c2b8a349",
    enterprise: "SISU",
    role: "Desarrollador de Fullstack",
    salary: 0.0,
    type_salary: "NA",
    mode: "Remote",
    location: "Mexico City",
    status: "In progress",
    last_update_at: "2026-09-04",
    notes: "Waiting for an interview",
  },
  {
    id: "bc2547d9-a168-40fe-bc73-809e6f1254ad",
    enterprise: "Recrew ",
    role: "Desarrollador de Software",
    salary: 30400.0,
    type_salary: "Monthly",
    mode: "On-Site",
    location: "Tijuana B.C.",
    status: "HR",
    last_update_at: "2026-09-15",
    notes: "First interview",
  },
  {
    id: "703f8ca4-2bd9-4651-8e07-da953b16c842",
    enterprise: "Solo Talento",
    role: "Desarrollador ",
    salary: 36000.0,
    type_salary: "Monthly",
    mode: "Remote",
    location: "Mexico City",
    status: "HR",
    last_update_at: "2026-09-17",
    notes: "First interview",
  },
  {
    id: "d62591be-784a-4f03-a6c8-41b709de253f",
    enterprise: "Agencia aduanal Jorde Díaz.",
    role: "Analista Programador",
    salary: 25000.0,
    type_salary: "Monthly",
    mode: "On-Site",
    location: "Tijuana B.C.",
    status: "HR",
    last_update_at: "2026-09-15",
    notes: "First interview",
  },
];

const salaryFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const statusClasses = {
  "In progress": "bg-[#0F766E]/10 text-[#0F766E] ring-[#0F766E]/20",
  HR: "bg-[#0F172A]/10 text-[#0F172A] ring-[#0F172A]/20",
  Rejected: "bg-[#475569]/10 text-[#475569] ring-[#475569]/20",
  Cancelled: "bg-[#F8FAFC] text-[#475569] ring-[#CBD5E1]",
};

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const total = joblist.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleJobs = joblist.slice(startIndex, startIndex + pageSize);

  function changePage(nextPage) {
    setPage(Math.max(1, Math.min(nextPage, totalPages)));
  }

  return (
    <section
      className="min-w-0 space-y-5 text-[#0F172A]"
      aria-labelledby="applications-title"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#0F766E]/30 bg-[linear-gradient(115deg,#0F172A_0%,#0F766E_100%)] p-6 shadow-sm md:p-8">
        <div>
          <div className=" flex flex-row gap-6">
            <h1
              id="applications-title"
              className="text-2xl font-extrabold tracking-tight text-white"
            >
              My applications
            </h1>

            <span className="rounded-full border border-white/30 bg-[#0F172A]/35 px-4 py-2 text-xs font-semibold text-white">
              {total} applications
            </span>
          </div>
          <p className="mt-2 text-sm text-[#F8FAFC]">
            All your opportunities in one place.
          </p>
        </div>

        <ModalCreateJob />
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#0F766E]/20 bg-[#F0F6F5] shadow-sm">
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
            {visibleJobs.length === 0 ? (
              <TableRow className="bg-[#F0F6F5] hover:bg-[#E0EEEB]">
                <TableCell
                  colSpan={6}
                  className="h-40 text-center text-[#475569]"
                >
                  You have no applications yet.
                </TableCell>
              </TableRow>
            ) : (
              visibleJobs.map((job) => (
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
                      className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusClasses[job.status] ?? statusClasses.Cancelled}`}
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

        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[#0F766E]/20 bg-[#DCEBE9] px-5 py-4">
          <p
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="text-xs text-[#475569]"
          >
            Showing{" "}
            <span className="font-semibold text-[#0F172A]">
              {total === 0 ? 0 : startIndex + 1}–
              {Math.min(startIndex + pageSize, total)}
            </span>{" "}
            of {total}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-[#475569]">
              Rows per page
              <select
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="h-10 rounded-lg border border-[#0F766E]/30 bg-[#F0F6F5] px-2 text-sm text-[#0F172A] outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E]"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <Pagination aria-label="Application pages" className="mx-0 w-auto">
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    text="Previous"
                    aria-label="Previous page"
                    disabled={currentPage === 1}
                    onClick={() => changePage(currentPage - 1)}
                  />
                </PaginationItem>
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((number) => (
                  <PaginationItem key={number}>
                    <PaginationLink
                      isActive={currentPage === number}
                      aria-label={`Page ${number}`}
                      onClick={() => changePage(number)}
                    >
                      {number}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    text="Next"
                    aria-label="Next page"
                    disabled={currentPage === totalPages}
                    onClick={() => changePage(currentPage + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </footer>
      </div>
    </section>
  );
}
