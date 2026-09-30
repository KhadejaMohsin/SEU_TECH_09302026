import { IssuesBoard } from "@/components/issues/issues-board";
import { demoIssueRecords } from "@/lib/issues/demo-issue-data";

export default function IssuesPage() {
  return (
    <>
      <header className="mb-6 border-b border-brand-surface pb-5">
        <div className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-muted">
          <span>Demo workspace</span>
          <span className="size-1 rounded-full bg-brand-yellow" />
          <span>LunaTech Electronics</span>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-[26px] font-bold leading-tight text-brand-cream sm:text-[30px]">
              Issues
            </h1>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-brand-muted">
              Compare simulated AI claims with verified Fact Vault values and review suggested corrections.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded border border-brand-yellow/30 bg-brand-yellow/[0.06] px-3 py-2 font-mono text-[9px] font-medium uppercase tracking-[0.08em] text-brand-yellow">
            <span className="size-1.5 rounded-full bg-brand-yellow" />
            Demo data · Not live AI output
          </span>
        </div>
      </header>

      <IssuesBoard issues={demoIssueRecords} />
    </>
  );
}
