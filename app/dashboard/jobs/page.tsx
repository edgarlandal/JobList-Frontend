"use client";

import { useState } from "react";
import Link from "next/link";
import { DataPagination } from "@/components/data-pagination";
import { Button } from "@/components/ui/button";
import { useJobs } from "./use-jobs";
import type { Job } from "@/types/job";
import { JobsHeader } from "./components/jobs-header";
import { JobsTable } from "./components/jobs-table";
import { JobDetails } from "./components/job-details";

export default function JobsPage() {
  const [selection, setSelection] = useState<{ job: Job; mode: "view" | "edit" } | null>(null);
  const {
    jobs, total, page, pageSize, totalPages, loading, error, unauthorized,
    deleting, deleteError, notice, reload, deleteApplication, changePage, changePageSize,
  } = useJobs();

  return (
    <section className="min-w-0 space-y-5 text-[#0F172A]" aria-labelledby="applications-title">
      <JobsHeader total={total} onCreated={reload} />
      {notice && <p role="status" className="text-sm text-teal-700">{notice}</p>}
      {deleteError && <p role="alert" className="text-sm text-red-700">{deleteError}</p>}
      <div aria-busy={loading || deleting} className="overflow-hidden rounded-2xl border border-[#0F766E]/20 bg-[#F0F6F5] shadow-sm">
        {loading ? <p role="status" className="p-8 text-center text-sm">Loading applications...</p> : error ? (
          <div className="space-y-3 p-6">
            <p role="alert" className="whitespace-pre-line text-sm text-red-700">{error}</p>
            {unauthorized ? <Link href="/login" className="font-semibold text-teal-700 underline">Log in again</Link> : <Button variant="outline" onClick={reload}>Try again</Button>}
          </div>
        ) : (
          <>
            <JobsTable jobs={jobs} onSelect={(job) => setSelection({ job, mode: "view" })}
              onEdit={(job) => setSelection({ job, mode: "edit" })} onDelete={deleteApplication} disabled={deleting} />
            <DataPagination total={total} startIndex={(page - 1) * pageSize} pageSize={pageSize} currentPage={page} totalPages={totalPages}
              onPageChange={changePage}
              onPageSizeChange={changePageSize} disabled={deleting} />
          </>
        )}
      </div>
      {selection && <JobDetails key={`${selection.job.id}:${selection.mode}`} {...selection} onClose={() => setSelection(null)} onSave={reload} />}
    </section>
  );
}
