import { AuditLogTable } from "@/components/dashboard/audit-log-table";

export default function AuditLogPage() {
  return (
    <div>
      <header className="mb-5 flex flex-col gap-3 border-b border-brand-surface pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-muted">
            <span>Demo workspace</span>
            <span className="size-1 rounded-full bg-brand-yellow" />
            <span>LunaTech Electronics</span>
          </div>
          <h1 className="font-display text-[26px] font-bold leading-tight text-brand-cream sm:text-[30px]">
            Audit Log
          </h1>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-brand-muted">
            A chronological record of automated activity and human decisions.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded border border-brand-yellow/30 bg-brand-yellow/[0.06] px-3 py-2 font-mono text-[9px] font-medium uppercase tracking-[0.08em] text-brand-yellow">
          <span className="size-1.5 rounded-full bg-brand-yellow" />
          Simulated demo log
        </span>
      </header>
      <AuditLogTable />
    </div>
  );
}
