"use client";

import { useEffect, useId, useState, type SubmitEvent, type ComponentProps } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { DiscardChangesDialog } from "@/components/discard-changes-dialog";
import { JobInputField, JobSelectField } from "./job-form-fields";
import { JOB_STATUSES, PAY_PERIODS } from "../constants";
import type { Job } from "@/types/job";
import { useIsMobile } from "@/hooks/use-mobile";
import { updateJob } from "@/service/jobs";
import { apiErrorMessage } from "@/lib/api-error";

type JobDetailsProps = {
  job: Job;
  mode?: "view" | "edit";
  onClose: () => void;
  onSave: (job: Job) => void;
};

type DrawerOpenChangeHandler = ComponentProps<typeof Drawer>["onOpenChange"];

export function JobDetails({ job, mode = "edit", onClose, onSave }: JobDetailsProps) {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(job.status);
  const [salary, setSalary] = useState(String(job.salary));
  const [payPeriod, setPayPeriod] = useState(job.type_salary);
  const [notes, setNotes] = useState(job.notes ?? "");
  const [confirmClose, setConfirmClose] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const hasChanges =
    status !== job.status ||
    Number(salary) !== job.salary ||
    payPeriod !== job.type_salary ||
    notes !== (job.notes ?? "");
  const isMobile = useIsMobile();

  useEffect(() => {
    // Open after mounting so the drawer animates like the create drawer.
    const frame = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleOpenChange: DrawerOpenChangeHandler = (nextOpen, details) => {
    if (!nextOpen && saving) {
      details.cancel();
      return;
    }
    if (!nextOpen && hasChanges) {
      details.cancel();
      setConfirmClose(true);
      return;
    }
    setOpen(nextOpen);
  };

  function discardChanges() {
    setConfirmClose(false);
    setOpen(false);
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    });
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || !hasChanges) return;
    const amount = Number(salary);
    if (!Number.isInteger(amount) || amount < 0) {
      setError("Enter a non-negative whole number for salary.");
      return;
    }
    if (payPeriod !== job.type_salary && !PAY_PERIODS.includes(payPeriod)) {
      setError("Select a valid pay period.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const updated = await updateJob(job.id, { status, salary: amount, type_salary: payPeriod, notes });
      onSave(updated);
      setOpen(false);
    } catch (error: unknown) {
      setError(apiErrorMessage(error, "Unable to save the application."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Drawer
      open={open}
      swipeDirection={isMobile ? "down" : "right"}
      onOpenChange={handleOpenChange}
      showSwipeHandle={isMobile}
      onOpenChangeComplete={(nextOpen) => {
        // Keep the drawer mounted until its exit animation finishes.
        if (!nextOpen) onClose();
      }}
    >
      <DrawerContent className="border-[#0F766E]/20 bg-[#F0F6F5] text-[#0F172A] [--drawer-bleed-background:#F0F6F5] [&>[data-slot=drawer-swipe-handle]]:after:bg-[#0F766E]/40 data-[swipe-axis=y]:[&>[data-slot=drawer-content]]:rounded-t-none data-[swipe-axis=x]:sm:[--drawer-content-width:30rem] data-[swipe-axis=y]:[--drawer-content-max-height:92dvh]">
        <DrawerHeader className="relative border-b border-[#0F766E]/20 p-6 pr-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#0F766E]">
            {mode === "view" ? "Application details" : "Edit application"}
          </p>
          <DrawerTitle className="text-xl font-bold text-[#0F172A]">
            {job.enterprise.trim()}
          </DrawerTitle>
          <DrawerDescription className="mt-1 text-[#475569]">
            {job.role.trim()}
          </DrawerDescription>
          <DrawerClose
            aria-label="Close application details"
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute top-3 right-3"
              />
            }
          >
            <X aria-hidden="true" />
          </DrawerClose>
        </DrawerHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-6">
          <dl className="mb-6 grid grid-cols-2 gap-4 rounded-xl border border-[#0F766E]/15 bg-white/50 p-4 text-sm">
            <div>
              <dt className="text-xs text-[#475569]">Location</dt>
              <dd className="mt-1 font-medium">
                {job.location || "Not specified"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[#475569]">Work arrangement</dt>
              <dd className="mt-1 font-medium">
                {job.mode || "Not specified"}
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs text-[#475569]">Last updated</dt>
              <dd className="mt-1">
                <time dateTime={job.last_update_at}>{formatDate(job.last_update_at)}</time>
              </dd>
            </div>
          </dl>

          {mode === "view" ? (
            <div className="space-y-5">
              <dl className="space-y-5 text-sm">
                <div>
                  <dt className="text-xs text-[#475569]">Status</dt>
                  <dd className="mt-1 font-medium">{job.status}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#475569]">Salary</dt>
                  <dd className="mt-1 font-medium">
                    {job.salary > 0 ? `$${job.salary.toLocaleString("en-US")}${job.type_salary === "NA" ? "" : ` / ${job.type_salary}`}` : "Not specified"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[#475569]">Notes</dt>
                  <dd className="mt-1 whitespace-pre-wrap break-words">{job.notes || "No notes yet."}</dd>
                </div>
              </dl>
              <DrawerClose render={<Button type="button" variant="outline" className="w-full" />}>
                Close
              </DrawerClose>
            </div>
          ) : <form
            id={formId}
            className="space-y-5"
            aria-busy={saving}
            onSubmit={handleSubmit}
          >
            <fieldset disabled={saving} className="space-y-5">
              <JobSelectField formId={formId} name="status" label="Status" items={JOB_STATUSES}
                value={status} onChange={(event) => setStatus(event.target.value)} />
              <div className="grid gap-5 sm:grid-cols-2">
                <JobInputField
                  formId={formId}
                  name="salary"
                  label="Salary"
                  type="number"
                  min="0"
                  step="1"
                  inputMode="decimal"
                  value={salary}
                  onChange={(event) => setSalary(event.target.value)}
                  hint="Leave blank if not specified."
                />
                <JobSelectField formId={formId} name="type_salary" label="Salary type" items={PAY_PERIODS}
                  value={payPeriod} onChange={(event) => setPayPeriod(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${formId}-notes`}>Notes</Label>
                <Textarea
                  id={`${formId}-notes`}
                  name="notes"
                  maxLength={255}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  className="min-h-40 border-[#0F766E]/25 bg-[#F8FAFC] focus-visible:border-[#0F766E] focus-visible:ring-[#0F766E]/20"
                  placeholder="Recruiter details, next steps, or anything worth remembering..."
                />
              </div>
              {error && (
                <p
                  role="alert"
                  className="whitespace-pre-line text-sm text-red-700"
                >
                  {error}
                </p>
              )}
              <div className="flex gap-3 border-t border-[#0F766E]/20 pt-5">
                <DrawerClose
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                    />
                  }
                >
                  Close
                </DrawerClose>
                <Button
                  type="submit"
                  disabled={!hasChanges || saving}
                  className="flex-1 bg-[#0F766E] text-white hover:bg-[#115E59]"
                >
                  {saving ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </fieldset>
          </form>}
        </div>

        <DiscardChangesDialog open={confirmClose} onOpenChange={setConfirmClose}
          onDiscard={discardChanges} restoreFocus={open} />
      </DrawerContent>
    </Drawer>
  );
}
