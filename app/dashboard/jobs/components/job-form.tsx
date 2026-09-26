"use client";

import { Plus } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { createJob } from "@/service/jobs";
import { apiErrorMessage } from "@/lib/api-error";

import { Button } from "@/components/ui/button";
import { DrawerClose } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { JobInputField, JobComboboxField } from "./job-form-fields";
import { WORK_MODES, JOB_STATUSES, PAY_PERIODS } from "../constants";

type JobFormProps = {
  formId: string;
  markChanged: () => void;
  onCreated: () => void;
  onSavingChange: (saving: boolean) => void;
};

export function JobForm({
  formId,
  markChanged,
  onCreated,
  onSavingChange,
}: JobFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "").trim();
    const salary = Number(field("salary"));
    if (
      !field("enterprise") ||
      !field("role") ||
      !field("location") ||
      !WORK_MODES.includes(field("mode")) ||
      !JOB_STATUSES.includes(field("status")) ||
      !Number.isInteger(salary) ||
      salary < 0
    ) {
      setError(
        "Complete the required fields and enter a non-negative whole number for salary.",
      );
      return;
    }
    setError("");
    setSaving(true);
    onSavingChange(true);
    try {
      await createJob({
        enterprise: field("enterprise"),
        role: field("role"),
        salary,
        type_salary: field("type_salary"),
        mode: field("mode"),
        location: field("location"),
        status: field("status"),
        notes: field("notes"),
      });
      onCreated();
    } catch (error: unknown) {
      setError(apiErrorMessage(error, "Unable to create the application."));
    } finally {
      setSaving(false);
      onSavingChange(false);
    }
  }
  return (
    <form
      id={formId}
      onInputCapture={markChanged}
      onSubmit={handleSubmit}
      aria-busy={saving}
      className="space-y-5"
    >
      <fieldset disabled={saving} className="space-y-5">
        <p className="text-xs text-[#475569]">
          Fields marked with * are required.
        </p>

        <JobInputField
          formId={formId}
          name="enterprise"
          label="Company"
          placeholder="e.g. Acme Inc."
          required
          autoComplete="organization"
        />

        <JobInputField
          formId={formId}
          name="role"
          label="Role"
          placeholder="e.g. Software Engineer"
          required
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <JobInputField
            formId={formId}
            name="salary"
            label="Salary"
            hint="Leave blank if not specified."
            placeholder="e.g. 25000"
            type="number"
            min="0"
            step="1"
            inputMode="decimal"
          />

          <JobComboboxField
            formId={formId}
            name="type_salary"
            label="Pay period"
            items={PAY_PERIODS}
            placeholder="Select pay period"
            onValueChange={markChanged}
          />
        </div>

        <JobInputField
          formId={formId}
          name="location"
          label="Location"
          required
          placeholder="e.g. Tijuana, Mexico"
          autoComplete="address-level2"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <JobComboboxField
            formId={formId}
            name="mode"
            label="Work arrangement"
            required
            items={WORK_MODES}
            placeholder="Select a mode"
            onValueChange={markChanged}
          />

          <JobComboboxField
            formId={formId}
            name="status"
            label="Status"
            required
            items={JOB_STATUSES}
            placeholder="Select a status"
            onValueChange={markChanged}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor={`${formId}-notes`}
            className="text-sm font-semibold text-[#0F172A]"
          >
            Notes <span className="font-normal text-[#475569]">(optional)</span>
          </Label>

          <Textarea
            id={`${formId}-notes`}
            name="notes"
            maxLength={255}
            className="min-h-28 resize-y border-[#0F766E]/25 bg-[#F8FAFC] text-[#0F172A] focus-visible:border-[#0F766E] focus-visible:ring-[#0F766E]/20"
            placeholder="Recruiter details, next steps, or anything worth remembering..."
          />
        </div>

        {error && (
          <p role="alert" className="whitespace-pre-line text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="flex flex-col-reverse gap-3 border-t border-[#0F766E]/20 pt-5 sm:flex-row">
          <DrawerClose
            render={
              <Button
                type="button"
                variant="outline"
                className="h-11 border-[#0F766E]/25 bg-[#F0F6F5] text-[#475569] hover:bg-[#D7E9E5] hover:text-[#0F172A] sm:flex-1"
              />
            }
          >
            Cancel
          </DrawerClose>

          <Button
            type="submit"
            className="h-11 gap-2 bg-[#0F766E] font-semibold text-white hover:bg-[#115E59] focus-visible:ring-[#0F766E]/30 sm:flex-[2]"
          >
            <Plus className="size-4" aria-hidden="true" />
            {saving ? "Creating..." : "Create application"}
          </Button>
        </div>
      </fieldset>
    </form>
  );
}
