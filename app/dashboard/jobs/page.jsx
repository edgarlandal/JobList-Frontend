"use client";

import { DataPagination } from "@/components/data-pagination";
import { usePagination } from "@/hooks/use-pagination";
import { JobsHeader } from "./components/jobs-header";
import { JobsTable } from "./components/jobs-table";
import { joblist } from "./data/jobs";

export default function JobsPage() {
  const pagination = usePagination(joblist);

  return (
    <section className="min-w-0 space-y-5 text-[#0F172A]" aria-labelledby="applications-title">
      <JobsHeader total={pagination.total} />
      <div className="overflow-hidden rounded-2xl border border-[#0F766E]/20 bg-[#F0F6F5] shadow-sm">
        <JobsTable jobs={pagination.items} />
        <DataPagination
          total={pagination.total}
          startIndex={pagination.startIndex}
          pageSize={pagination.pageSize}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.changePage}
          onPageSizeChange={pagination.changePageSize}
        />
      </div>
    </section>
  );
}
