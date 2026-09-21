import { CreateJobDrawer } from "./create-job-drawer";

type JobsHeaderProps = {
  total: number;
  onCreated: () => void;
};

export function JobsHeader({ total, onCreated }: JobsHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#0F766E]/30 bg-[linear-gradient(115deg,#0F172A_0%,#0F766E_100%)] p-6 shadow-sm md:p-8">
      <div>
        <div className="flex flex-row gap-6">
          <h1
            id="applications-title"
            className="text-2xl font-extrabold tracking-tight text-white"
          >
            My applications
          </h1>

          <span className="rounded-full border border-white/30 bg-[#0F172A]/35 px-4 py-2 text-xs font-semibold text-white">
            {total} applications
          </span>
        </div>

        <p className="mt-2 text-sm text-[#F8FAFC]">
          All your opportunities in one place.
        </p>
      </div>

      <CreateJobDrawer onCreated={onCreated} />
    </div>
  );
}
