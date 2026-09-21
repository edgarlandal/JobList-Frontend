"use client";

import { Menu } from "@base-ui/react/menu";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Job } from "@/types/job";

type JobActionsProps = {
  job: Job;
  onView: (job: Job) => void;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
  disabled?: boolean;
};

export function JobActions({
  job,
  onView,
  onEdit,
  onDelete,
  disabled,
}: JobActionsProps) {
  return (
    <Menu.Root>
      <Menu.Trigger
        disabled={disabled}
        aria-label={`Actions for ${job.enterprise.trim()}, ${job.role.trim()}`}
        className="inline-flex size-8 items-center justify-center rounded-lg border border-teal-700/15 bg-white/60 text-slate-500 hover:bg-white focus-visible:outline-2 focus-visible:outline-teal-700 data-popup-open:bg-white"
      >
        <MoreHorizontal className="size-4" aria-hidden="true" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align="end" sideOffset={6} className="z-50">
          <Menu.Popup className="min-w-40 rounded-xl border border-slate-200 bg-white p-1.5 text-sm text-slate-700 shadow-lg outline-none">
            <Menu.Item
              onClick={() => onView(job)}
              className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 outline-none data-highlighted:bg-slate-100"
            >
              <Eye className="size-4" aria-hidden="true" /> View details
            </Menu.Item>
            <Menu.Item
              onClick={() => onEdit(job)}
              className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 outline-none data-highlighted:bg-slate-100"
            >
              <Pencil className="size-4" aria-hidden="true" /> Edit
            </Menu.Item>
            <div role="separator" className="my-1 border-t border-slate-100" />
            <Menu.Item
              onClick={() => onDelete(job)}
              className="flex cursor-pointer items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-red-600 outline-none data-highlighted:bg-red-100"
            >
              <Trash2 className="size-4" aria-hidden="true" /> Delete
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
