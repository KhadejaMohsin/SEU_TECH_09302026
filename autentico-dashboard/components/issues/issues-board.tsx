"use client";

import { useState } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  CircleCheck,
  Filter,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import {
  type DemoIssue,
  type IssueSeverity,
  type IssueStatus,
} from "@/lib/issues/demo-issue-data";

type SeverityFilter = "All severities" | IssueSeverity;
type StatusFilter = "All statuses" | IssueStatus;

const severityClasses: Record<IssueSeverity, string> = {
  High: "border-brand-red/40 bg-brand-red/10 text-brand-red",
  Medium: "border-brand-yellow/40 bg-brand-yellow/10 text-brand-yellow",
  Low: "border-brand-blue/40 bg-brand-blue/15 text-brand-sky",
  None: "border-brand-surface bg-brand-surface/60 text-brand-muted",
};

const statusClasses: Record<IssueStatus, string> = {
  "Needs approval": "border-brand-yellow/40 bg-brand-yellow/10 text-brand-yellow",
  Open: "border-brand-blue/40 bg-brand-blue/15 text-brand-sky",
  Verified: "border-brand-blue/40 bg-brand-blue/15 text-brand-sky",
  Approved: "border-brand-blue/40 bg-brand-blue/20 text-brand-sky",
  Rejected: "border-brand-red/40 bg-brand-red/10 text-brand-red",
};

function IssueBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-[10px] font-semibold ${className}`}
    >
      {children}
    </span>
  );
}

function IssueCard({
  issue,
  onDecision,
}: {
  issue: DemoIssue;
  onDecision: (id: string, status: "Approved" | "Rejected") => void;
}) {
  const canReview = !issue.correct && (issue.status === "Open" || issue.status === "Needs approval");

  return (
    <article className="rounded-md border border-brand-surface bg-brand-navy p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] text-brand-muted">{issue.id}</span>
            <span className="text-brand-muted">/</span>
            <span className="text-[10px] text-brand-muted">{issue.category}</span>
          </div>
          <h2 className="mt-1 font-display text-base font-bold text-brand-cream">
            {issue.product}
          </h2>
          <p className="mt-1 text-xs text-brand-muted">{issue.issueType}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <IssueBadge className={severityClasses[issue.severity]}>
            {issue.severity === "High" && <AlertTriangle size={11} />}
            Severity: {issue.severity}
          </IssueBadge>
          <IssueBadge className={statusClasses[issue.status]}>
            {issue.status === "Verified" || issue.status === "Approved" ? (
              <CircleCheck size={11} />
            ) : null}
            {issue.status}
          </IssueBadge>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 overflow-hidden rounded border-y border-brand-surface">
        <div className="min-w-0 py-3 pr-3 sm:py-4 sm:pr-5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-muted">
            AI claimed value
          </p>
          <p className="mt-2 break-words font-mono text-sm font-medium text-brand-cream sm:text-base">
            {issue.aiClaimed}
          </p>
          <p className="mt-1 text-[9px] text-brand-muted">{issue.source}</p>
        </div>
        <div className="min-w-0 border-l border-brand-surface bg-brand-blue/[0.08] py-3 pl-3 sm:py-4 sm:pl-5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-sky">
            Verified Fact Vault value
          </p>
          <p className="mt-2 break-words font-mono text-sm font-medium text-brand-sky sm:text-base">
            {issue.factVaultValue}
          </p>
          <p className="mt-1 text-[9px] text-brand-muted">
            {issue.correct ? "Claim matches the verified fact" : "Source of truth"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-muted">
            Suggested fix
          </p>
          <p className="mt-1 text-xs leading-5 text-brand-cream/90">
            {issue.suggestedFix ?? "No change needed. The claim matches the Fact Vault."}
          </p>
        </div>
        {canReview ? (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => onDecision(issue.id, "Approved")}
              className="inline-flex min-h-9 items-center gap-1.5 rounded border border-brand-yellow/50 bg-brand-yellow px-3 py-2 text-[11px] font-semibold text-brand-ink transition hover:brightness-110"
            >
              <ThumbsUp size={13} />
              Approve
            </button>
            <button
              type="button"
              onClick={() => onDecision(issue.id, "Rejected")}
              className="inline-flex min-h-9 items-center gap-1.5 rounded border border-brand-red/50 bg-brand-red/10 px-3 py-2 text-[11px] font-semibold text-brand-red transition hover:bg-brand-red/20"
            >
              <ThumbsDown size={13} />
              Reject
            </button>
          </div>
        ) : (
          <span className="inline-flex shrink-0 items-center gap-1.5 text-[10px] text-brand-muted" role="status">
            <BadgeCheck size={13} className="text-brand-blue" />
            {issue.status === "Approved"
              ? "Approved locally for this demo"
              : issue.status === "Rejected"
                ? "Rejected locally for this demo"
                : "Verified demo claim"}
          </span>
        )}
      </div>
    </article>
  );
}

export function IssuesBoard({ issues }: { issues: DemoIssue[] }) {
  const [localIssues, setLocalIssues] = useState(issues);
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("All severities");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All statuses");

  const visibleIssues = localIssues.filter((issue) => {
    const matchesSeverity =
      severityFilter === "All severities" || issue.severity === severityFilter;
    const matchesStatus =
      statusFilter === "All statuses" || issue.status === statusFilter;
    return matchesSeverity && matchesStatus;
  });
  const discrepancies = localIssues.filter((issue) => !issue.correct).length;
  const needsApproval = localIssues.filter(
    (issue) => issue.status === "Needs approval",
  ).length;
  const verified = localIssues.filter((issue) => issue.status === "Verified").length;

  function updateDecision(id: string, status: "Approved" | "Rejected") {
    setLocalIssues((currentIssues) =>
      currentIssues.map((issue) =>
        issue.id === id ? { ...issue, status } : issue,
      ),
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2" aria-label="Issue summary">
        <span className="rounded border border-brand-surface bg-brand-navy px-3 py-2 text-[11px] text-brand-cream/80">
          <span className="font-mono text-brand-yellow">{discrepancies}</span> discrepancies
        </span>
        <span className="rounded border border-brand-surface bg-brand-navy px-3 py-2 text-[11px] text-brand-cream/80">
          <span className="font-mono text-brand-yellow">{needsApproval}</span> needs approval
        </span>
        <span className="rounded border border-brand-surface bg-brand-navy px-3 py-2 text-[11px] text-brand-cream/80">
          <span className="font-mono text-brand-sky">{verified}</span> verified
        </span>
      </div>

      <section className="rounded-md border border-brand-surface bg-brand-navy p-4" aria-label="Filter issues">
        <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-muted">
          <Filter size={13} className="text-brand-blue" />
          Filter issues
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5 text-[10px] text-brand-muted">
            Severity
            <select
              value={severityFilter}
              onChange={(event) => setSeverityFilter(event.target.value as SeverityFilter)}
              className="h-10 rounded border border-brand-surface bg-brand-ink px-3 text-xs text-brand-cream outline-none focus:border-brand-blue"
            >
              <option>All severities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
              <option>None</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-[10px] text-brand-muted">
            Status
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              className="h-10 rounded border border-brand-surface bg-brand-ink px-3 text-xs text-brand-cream outline-none focus:border-brand-blue"
            >
              <option>All statuses</option>
              <option>Needs approval</option>
              <option>Open</option>
              <option>Verified</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </label>
        </div>
      </section>

      <div className="space-y-3" aria-live="polite">
        {visibleIssues.length > 0 ? (
          visibleIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} onDecision={updateDecision} />
          ))
        ) : (
          <div className="rounded-md border border-brand-surface bg-brand-navy px-4 py-10 text-center text-sm text-brand-muted">
            No demo issues match these filters.
          </div>
        )}
      </div>

      <p className="text-[10px] text-brand-muted">
        Approve and Reject update local demo state only. No approval changes are saved to Supabase.
      </p>
    </div>
  );
}
