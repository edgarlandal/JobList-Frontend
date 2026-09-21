"use client";

import { useId, useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PasswordFieldProps = Omit<ComponentProps<typeof Input>, "type"> & { hint?: string };

export function PasswordField({ hint, disabled, ...props }: PasswordFieldProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-slate-700">Password</Label>
      <div className="relative">
        <Input name="password" required {...props} id={id} disabled={disabled}
          type={visible ? "text" : "password"} aria-describedby={hint ? `${id}-hint` : undefined}
          className="h-11 rounded-lg border-slate-200 bg-slate-50 pl-3 pr-12 placeholder:text-slate-400 focus-visible:border-teal-600 focus-visible:ring-teal-600/15" />
        <button type="button" disabled={disabled} onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Hide password" : "Show password"} aria-pressed={visible}
          className="absolute right-0 top-0 flex size-11 items-center justify-center rounded-lg text-slate-400 hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-teal-600 disabled:opacity-50">
          <Icon aria-hidden="true" className="size-4" />
        </button>
      </div>
      {hint && <p id={`${id}-hint`} className="text-xs leading-5 text-slate-500">{hint}</p>}
    </div>
  );
}
