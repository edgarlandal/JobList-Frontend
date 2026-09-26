"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { apiErrorMessage } from "@/lib/api-error";
import { listJobs } from "@/service/jobs";
import type { Job } from "@/types/job";
import CardDataJobs from "./components/card_data";
import { OverviewHeader } from "./components/overview_header";
import TableLast from "./components/table_last";

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [revision, setRevision] = useState(0);
  const [loadedRevision, setLoadedRevision] = useState(-1);
  const [error, setError] = useState("");
  const [unauthorized, setUnauthorized] = useState(false);
  const loading = revision !== loadedRevision;

  function reload() {
    setRevision((value) => value + 1);
  }

  useEffect(() => {
    const controller = new AbortController();

    async function loadOverview() {
      try {
        // Read every page so the summary includes all applications.
        const items: Job[] = [];
        let total = 0;
        do {
          const data = await listJobs(100, items.length, controller.signal);
          if (controller.signal.aborted) return;
          items.push(...data.items);
          total = data.total;
          if (data.items.length === 0) break;
        } while (items.length < total);
        setJobs(items);
        setError("");
        setUnauthorized(false);
      } catch (error: unknown) {
        if (controller.signal.aborted) return;
        setError(apiErrorMessage(error, "Unable to load your overview."));
        setUnauthorized(axios.isAxiosError(error) && error.response?.status === 401);
      } finally {
        if (!controller.signal.aborted) setLoadedRevision(revision);
      }
    }

    void loadOverview();
    return () => controller.abort();
  }, [revision]);

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - (weekStart.getDay() + 6) % 7);
  const cards = [
    { title: "Total applications", numsOfJobs: jobs.length, footer: "All time" },
    {
      title: "Active applications",
      numsOfJobs: jobs.filter((job) => ["Send", "RH", "In Process", "Technical Interview", "Job Offer"].includes(job.status)).length,
      footer: "Awaiting a response or in progress",
    },
    { title: "In HR stage", numsOfJobs: jobs.filter((job) => job.status === "RH").length, footer: "Active conversations" },
    {
      title: "Updated this week",
      numsOfJobs: jobs.filter((job) => {
        const updated = new Date(job.last_update_at);
        return updated >= weekStart && updated <= now;
      }).length,
      footer: "Since Monday",
    },
  ];
  const recentJobs = [...jobs]
    .sort((a, b) => (Date.parse(b.last_update_at) || 0) - (Date.parse(a.last_update_at) || 0))
    .slice(0, 5);

  return (
    <section className="min-w-0 space-y-5 text-[#0F172A]" aria-labelledby="overview-title">
      <OverviewHeader onCreated={reload} />
      <div aria-busy={loading}>
        {loading ? (
          <p role="status" className="p-8 text-center text-sm">Loading overview...</p>
        ) : error ? (
          <div className="space-y-3 rounded-xl border border-[#0F766E]/20 bg-[#F0F6F5] p-6">
            <p role="alert" className="whitespace-pre-line text-sm text-red-700">{error}</p>
            {unauthorized ? <Link href="/login" className="font-semibold text-teal-700 underline">Log in again</Link> : <Button variant="outline" onClick={reload}>Try again</Button>}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {cards.map((card) => <CardDataJobs key={card.title} {...card} />)}
            </div>
            <TableLast jobs={recentJobs} />
          </div>
        )}
      </div>
    </section>
  );
}
