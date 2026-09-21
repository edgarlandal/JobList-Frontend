"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { apiErrorMessage } from "@/lib/api-error";
import { deleteJob, listJobs } from "@/service/jobs";
import type { Job } from "@/types/job";

export function useJobs() {
  const [result, setResult] = useState<{ items: Job[]; total: number }>({
    items: [],
    total: 0,
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [revision, setRevision] = useState(0);
  const [loadedKey, setLoadedKey] = useState("");
  const [error, setError] = useState("");
  const [unauthorized, setUnauthorized] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [notice, setNotice] = useState("");
  const requestKey = `${page}:${pageSize}:${revision}`;
  const loading = loadedKey !== requestKey;
  const totalPages = Math.max(1, Math.ceil(result.total / pageSize));

  useEffect(() => {
    const controller = new AbortController();
    listJobs(pageSize, (page - 1) * pageSize, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        const lastPage = Math.max(1, Math.ceil(data.total / pageSize));
        if (page > lastPage) {
          setPage(lastPage);
          return;
        }
        setResult(data);
        setError("");
        setUnauthorized(false);
        setLoadedKey(requestKey);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setError(apiErrorMessage(error, "Unable to load applications."));
        setUnauthorized(
          axios.isAxiosError(error) && error.response?.status === 401,
        );
        setLoadedKey(requestKey);
      });
    return () => controller.abort();
  }, [page, pageSize, requestKey]);

  function reload() {
    setRevision((value) => value + 1);
  }

  async function handleDelete(job: Job) {
    if (deleting) return;
    setDeleting(true);
    setDeleteError("");
    setNotice("");
    try {
      await deleteJob(job.id);
      setResult((current) => ({
        items: current.items.filter((item) => item.id !== job.id),
        total: Math.max(0, current.total - 1),
      }));
      setNotice(`Application at ${job.enterprise.trim()} deleted.`);
      reload();
    } catch (error: unknown) {
      setDeleteError(
        apiErrorMessage(
          error,
          "Unable to delete the application. Please try again.",
        ),
      );
    } finally {
      setDeleting(false);
    }
  }

  function changePage(next: number) {
    if (!deleting) setPage(Math.max(1, Math.min(next, totalPages)));
  }

  function changePageSize(size: number) {
    if (deleting) return;
    setPageSize(size);
    setPage(1);
  }

  return {
    jobs: result.items,
    total: result.total,
    page,
    pageSize,
    totalPages,
    loading,
    error,
    unauthorized,
    deleting,
    deleteError,
    notice,
    reload,
    deleteApplication: handleDelete,
    changePage,
    changePageSize,
  };
}
