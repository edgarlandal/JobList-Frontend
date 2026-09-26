import { CreateJobDrawer } from "../jobs/components/create-job-drawer";

export function OverviewHeader({ onCreated }: { onCreated: () => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#0F766E]/30 bg-[linear-gradient(115deg,#0F172A_0%,#0F766E_100%)] p-6 shadow-sm md:p-8">
      <div>
        <div className=" flex flex-row gap-6">
          <h1
            id="overview-title"
            className="  text-2xl font-extrabold tracking-tight text-white"
          >
            Dashboard
          </h1>
        </div>
        <p className="mt-2 text-sm text-[#F8FAFC]">
          Your job search, at a glance.
        </p>
      </div>
      <CreateJobDrawer onCreated={onCreated} />
    </div>
  );
}
