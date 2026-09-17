"use client";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useIsMobile } from "@/hooks/use-mobile";
import { Textarea } from "@/components/ui/textarea";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

import { BriefcaseBusiness, Plus, X } from "lucide-react";
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

const Modes = ["On-Site", "Remote", "Hybrid"];

const status = [
  "Send",
  "RH",
  "In Process",
  "Technical Interview",
  "Job Offer",
  "Rejection",
  "Cancelled",
];

const type_salarys = ["Daily", "Weekly", "Monthly", "Yearly"];

export function ModalCreateJob() {
  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const [formVersion, setFormVersion] = useState(0);
  const hasChanges = useRef(false);
  const keepEditingRef = useRef(null);
  const formId = useId();
  const isMobile = useIsMobile();

  function markChanged() {
    hasChanges.current = true;
  }

  function handleOpenChange(nextOpen, eventDetails) {
    if (!nextOpen && hasChanges.current) {
      eventDetails.cancel();
      setAlertOpen(true);
      return;
    }

    if (!nextOpen) {
      hasChanges.current = false;
      setFormVersion((version) => version + 1);
    }
    setOpen(nextOpen);
  }

  function discardApplication() {
    hasChanges.current = false;
    setFormVersion((version) => version + 1);
    setAlertOpen(false);
    setOpen(false);
  }

  return (
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      showSwipeHandle={isMobile}
      swipeDirection={isMobile ? "down" : "right"}
    >
      <DrawerTrigger
        render={
          <Button className="h-11 gap-2 rounded-xl bg-[#0F766E] px-4 font-semibold text-white shadow-sm hover:bg-[#115E59] focus-visible:ring-[#0F766E]/30">
            <Plus className="size-4" aria-hidden="true" />
            <span>Add application</span>
          </Button>
        }
      />
      <DrawerContent className="border-[#0F766E]/20 bg-[linear-gradient(115deg,#0F172A_0%,#0F766E_100%)] text-[#0F172A] shadow-2xl [--drawer-bleed-background:#E7F0F0] [&>[data-slot=drawer-swipe-handle]]:after:bg-white/40 data-[swipe-axis=y]:[&>[data-slot=drawer-content]]:rounded-t-none data-[swipe-axis=x]:sm:[--drawer-content-width:30rem] data-[swipe-axis=y]:[--drawer-content-max-height:92dvh]">
        <DrawerHeader className="relative items-start gap-2 border-b border-[#0F766E]/30 p-6 pb-6 text-left">
          <div className="mb-2 flex size-11 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white">
            <BriefcaseBusiness className="size-5" aria-hidden="true" />
          </div>
          <DrawerTitle className="pr-10 text-2xl font-extrabold tracking-tight text-white">
            Add an application
          </DrawerTitle>
          <DrawerDescription className="max-w-sm text-sm leading-relaxed text-[#F8FAFC]">
            Create a new job
          </DrawerDescription>
          <DrawerClose
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 size-10 text-white hover:bg-white/15 hover:text-white focus-visible:ring-white/50"
              />
            }
            aria-label="Close application form"
          >
            <X className="size-4" aria-hidden="true" />
          </DrawerClose>
        </DrawerHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[#E7F0F0] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:p-6">
          <form
            key={formVersion}
            id={formId}
            onInputCapture={markChanged}
            onSubmit={(event) => event.preventDefault()}
            className="space-y-5"
          >
            <p className="text-xs text-[#475569]">
              Fields marked with * are required.
            </p>
            <div className="space-y-2">
              <Label
                htmlFor={`${formId}-enterprise`}
                className="text-sm font-semibold text-[#0F172A]"
              >
                Company *
              </Label>
              <Input
                id={`${formId}-enterprise`}
                name="enterprise"
                className="h-11 border-[#0F766E]/25 bg-[#F8FAFC] text-[#0F172A] placeholder:text-[#475569]/75 focus-visible:border-[#0F766E] focus-visible:ring-[#0F766E]/20"
                placeholder="e.g. Acme Inc."
                required
                autoComplete="organization"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`${formId}-role`}
                className="text-sm font-semibold text-[#0F172A]"
              >
                Role *
              </Label>
              <Input
                id={`${formId}-role`}
                name="role"
                className="h-11 border-[#0F766E]/25 bg-[#F8FAFC] text-[#0F172A] placeholder:text-[#475569]/75 focus-visible:border-[#0F766E] focus-visible:ring-[#0F766E]/20"
                placeholder="e.g. Software Engineer"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="min-w-0 space-y-2">
                <Label
                  htmlFor={`${formId}-salary`}
                  className="text-sm font-semibold text-[#0F172A]"
                >
                  Salary
                </Label>
                <Input
                  id={`${formId}-salary`}
                  name="salary"
                  className="h-11 border-[#0F766E]/25 bg-[#F8FAFC] text-[#0F172A] placeholder:text-[#475569]/75 focus-visible:border-[#0F766E] focus-visible:ring-[#0F766E]/20"
                  placeholder="e.g. 25000"
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  aria-describedby={`${formId}-salary-hint`}
                />
                <p
                  id={`${formId}-salary-hint`}
                  className="text-xs text-[#475569]"
                >
                  Leave blank if not specified.
                </p>
              </div>

              <div className="min-w-0 space-y-2">
                <Label
                  htmlFor={`${formId}-type_salary`}
                  className="text-sm font-semibold text-[#0F172A]"
                >
                  Pay period
                </Label>
                <Combobox
                  items={type_salarys}
                  name="type_salary"
                  onValueChange={markChanged}
                >
                  <ComboboxInput
                    id={`${formId}-type_salary`}
                    className="h-11 w-full border-[#0F766E]/25 bg-[#F8FAFC] text-[#0F172A] focus-within:border-[#0F766E] focus-within:ring-2 focus-within:ring-[#0F766E]/20"
                    placeholder="Select pay period"
                  />
                  <ComboboxContent className="border border-[#0F766E]/20 bg-[#F0F6F5] text-[#0F172A] [--accent:#D7E9E5] [--accent-foreground:#0F172A]">
                    <ComboboxEmpty>No items found</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor={`${formId}-location`}
                className="text-sm font-semibold text-[#0F172A]"
              >
                Location
              </Label>
              <Input
                id={`${formId}-location`}
                name="location"
                className="h-11 border-[#0F766E]/25 bg-[#F8FAFC] text-[#0F172A] placeholder:text-[#475569]/75 focus-visible:border-[#0F766E] focus-visible:ring-[#0F766E]/20"
                placeholder="e.g. Tijuana, Mexico"
                autoComplete="address-level2"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="min-w-0 space-y-2">
                <Label
                  htmlFor={`${formId}-mode`}
                  className="text-sm font-semibold text-[#0F172A]"
                >
                  Work arrangement
                </Label>
                <Combobox items={Modes} name="mode" onValueChange={markChanged}>
                  <ComboboxInput
                    id={`${formId}-mode`}
                    className="h-11 w-full border-[#0F766E]/25 bg-[#F8FAFC] text-[#0F172A] focus-within:border-[#0F766E] focus-within:ring-2 focus-within:ring-[#0F766E]/20"
                    placeholder="Select a mode"
                  />
                  <ComboboxContent className="border border-[#0F766E]/20 bg-[#F0F6F5] text-[#0F172A] [--accent:#D7E9E5] [--accent-foreground:#0F172A]">
                    <ComboboxEmpty>No items found</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>

              <div className="min-w-0 space-y-2">
                <Label
                  htmlFor={`${formId}-status`}
                  className="text-sm font-semibold text-[#0F172A]"
                >
                  Status
                </Label>
                <Combobox
                  items={status}
                  name="status"
                  onValueChange={markChanged}
                >
                  <ComboboxInput
                    id={`${formId}-status`}
                    className="h-11 w-full border-[#0F766E]/25 bg-[#F8FAFC] text-[#0F172A] focus-within:border-[#0F766E] focus-within:ring-2 focus-within:ring-[#0F766E]/20"
                    placeholder="Select a status"
                  />
                  <ComboboxContent className="border border-[#0F766E]/20 bg-[#F0F6F5] text-[#0F172A] [--accent:#D7E9E5] [--accent-foreground:#0F172A]">
                    <ComboboxEmpty>No items found</ComboboxEmpty>
                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item} value={item}>
                          {item}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>
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
        </div>
        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogContent
            initialFocus={keepEditingRef}
            finalFocus={open}
            className="w-[calc(100%-2rem)] border border-[#0F766E]/20 bg-[#E7F0F0] text-[#0F172A]"
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-bold">
                Discard this application?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[#475569]">
                All entered information will be lost. Are you sure you want to leave?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="border-[#0F766E]/20 bg-[#DCEBE9]">
              <AlertDialogCancel
                ref={keepEditingRef}
                className="h-11 border-[#0F766E]/25 bg-[#F0F6F5] text-[#0F172A] hover:bg-[#D7E9E5]"
              >
                Keep editing
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={discardApplication}
                className="h-11 bg-[#0F766E] text-white hover:bg-[#115E59]"
              >
                Discard application
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DrawerContent>
    </Drawer>
  );
}
