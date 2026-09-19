"use client";

import type { ComponentProps, ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

type JobFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
};

type JobInputFieldProps = Omit<
  ComponentProps<typeof Input>,
  "id" | "name"
> & {
  formId: string;
  name: string;
  label: string;
  hint?: string;
};

type JobComboboxFieldProps = {
  formId: string;
  name: string;
  label: string;
  items: string[];
  placeholder?: string;
  onValueChange?: (value: string | null) => void;
};

function JobField({
  id,
  label,
  required,
  hint,
  children,
}: JobFieldProps) {
  return (
    <div className="min-w-0 space-y-2">
      <Label
        htmlFor={id}
        className="text-sm font-semibold text-[#0F172A]"
      >
        {label}
        {required && " *"}
      </Label>

      {children}

      {hint && (
        <p id={`${id}-hint`} className="text-xs text-[#475569]">
          {hint}
        </p>
      )}
    </div>
  );
}

export function JobInputField({
  formId,
  name,
  label,
  hint,
  required,
  ...props
}: JobInputFieldProps) {
  const id = `${formId}-${name}`;

  return (
    <JobField id={id} label={label} required={required} hint={hint}>
      <Input
        {...props}
        id={id}
        name={name}
        required={required}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className="h-11 border-[#0F766E]/25 bg-[#F8FAFC] text-[#0F172A] placeholder:text-[#475569]/75 focus-visible:border-[#0F766E] focus-visible:ring-[#0F766E]/20"
      />
    </JobField>
  );
}

export function JobComboboxField({
  formId,
  name,
  label,
  items,
  placeholder,
  onValueChange,
}: JobComboboxFieldProps) {
  const id = `${formId}-${name}`;

  return (
    <JobField id={id} label={label}>
      <Combobox
        items={items}
        name={name}
        onValueChange={onValueChange}
      >
        <ComboboxInput
          id={id}
          className="h-11 w-full border-[#0F766E]/25 bg-[#F8FAFC] text-[#0F172A] focus-within:border-[#0F766E] focus-within:ring-2 focus-within:ring-[#0F766E]/20"
          placeholder={placeholder}
        />

        <ComboboxContent className="border border-[#0F766E]/20 bg-[#F0F6F5] text-[#0F172A] [--accent:#D7E9E5] [--accent-foreground:#0F172A]">
          <ComboboxEmpty>No items found</ComboboxEmpty>

          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </JobField>
  );
}