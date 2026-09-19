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
import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

import { BriefcaseBusiness, Plus, X } from "lucide-react";
import { JobForm } from "./job-form";

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
          <JobForm key={formVersion} formId={formId} markChanged={markChanged} />
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
