"use client";

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

export function DataPagination({ total, startIndex, pageSize, currentPage, totalPages, onPageChange, onPageSizeChange }) {
  return (
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
              onPageSizeChange(Number(event.target.value));
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
                onClick={() => onPageChange(currentPage - 1)}
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
                  onClick={() => onPageChange(number)}
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
                onClick={() => onPageChange(currentPage + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </footer>
  );
}
