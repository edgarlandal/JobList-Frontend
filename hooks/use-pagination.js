"use client";

import { useState } from "react";

export function usePagination(items, initialPageSize = 5) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;

  function changePage(nextPage) {
    setPage(Math.max(1, Math.min(nextPage, totalPages)));
  }

  function changePageSize(size) {
    setPageSize(size);
    setPage(1);
  }

  return {
    items: items.slice(startIndex, startIndex + pageSize),
    total, totalPages, currentPage, startIndex, pageSize,
    changePage, changePageSize,
  };
}
