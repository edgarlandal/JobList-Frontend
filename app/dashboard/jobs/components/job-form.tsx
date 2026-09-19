"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DrawerClose } from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { JobInputField, JobComboboxField } from "./job-form-fields";
import { WORK_MODES, JOB_STATUSES, PAY_PERIODS } from "../constants";

type JobFormProps = {
  formId: string;
  markChanged: () => void;
};

export function JobForm({ formId, markChanged }: JobFormProps) {
  return (
    <form
      id={formId}
      onInputCapture={markChanged}
      onSubmit={(event) => event.preventDefault()}
      className="space-y-5"
    >
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
          step="0.01"
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
        placeholder="e.g. Tijuana, Mexico"
        autoComplete="address-level2"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <JobComboboxField
          formId={formId}
          name="mode"
          label="Work arrangement"
          items={WORK_MODES}
          placeholder="Select a mode"
          onValueChange={markChanged}
        />

        <JobComboboxField
          formId={formId}
          name="status"
          label="Status"
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
          Notes{" "}
          <span className="font-normal text-[#475569]">(optional)</span>
        </Label>

        <Textarea
          id={`${formId}-notes`}
          name="notes"
          className="min-h-28 resize-y border-[#0F766E]/25 bg-[#F8FAFC] text-[#0F172A] focus-visible:border-[#0F766E] focus-visible:ring-[#0F766E]/20"
          placeholder="Recruiter details, next steps, or anything worth remembering..."
        />
      </div>

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
          Create application
        </Button>
      </div>
    </form>
  );
}