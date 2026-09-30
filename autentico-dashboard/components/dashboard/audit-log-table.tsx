"use client";

import { useMemo, useState } from "react";
import { Activity, Filter, ShieldCheck } from "lucide-react";
import {
  auditLogDemoData,
  type AuditSeverity,
  type DemoAuditEvent,
} from "@/lib/dashboard/audit-log-mock-data";

const severityClasses: Record<AuditSeverity, string> = {
  High: "border-brand-red/40 bg-brand-red/10 text-brand-red",
  Medium: "border-brand-yellow/40 bg-brand-yellow/10 text-brand-yellow",
  Low: "border-brand-blue/40 bg-brand-blue/15 text-brand-sky",
  Info: "border-brand-surface bg-brand-surface/60 text-brand-muted",
};

const actorClasses: Record<DemoAuditEvent["actor"], string> = {
  System: "border-brand-blue/30 bg-brand-blue/10 text-brand-sky",
  "FuenteLuz AI": "border-brand-yellow/30 bg-brand-yellow/[0.06] text-brand-yellow",
  "Demo Reviewer": "border-brand-red/30 bg-brand-red/[0.06] text-brand-red",
};

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid min-w-0 gap-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-brand-muted">
      {label}
      <select
        className="h-10 min-w-0 rounded border border-brand-surface bg-brand-ink px-3 text-[11px] font-normal normal-case tracking-normal text-brand-cream outline-none focus:border-brand-blue"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

export function AuditLogTable() {
  const [actor, setActor] = useState("All actors");
  const [category, setCategory] = useState("All categories");
  const [severity, setSeverity] = useState("All severities");
  const [product, setProduct] = useState("All products / scans");

  const actors = ["All actors", ...new Set(auditLogDemoData.events.map((event) => event.actor))];
  const categories = ["All categories", ...new Set(auditLogDemoData.events.map((event) => event.category))];
  const products = ["All products / scans", ...new Set(auditLogDemoData.events.map((event) => event.productOrScan))];
  const severities: string[] = ["All severities", "High", "Medium", "Low", "Info"];

  const filteredEvents = useMemo(
    () =>
      auditLogDemoData.events.filter(
        (event) =>
          (actor === "All actors" || event.actor === actor) &&
          (category === "All categories" || event.category === category) &&
          (severity === "All severities" || event.severity === severity) &&
          (product === "All products / scans" || event.productOrScan === product),
      ),
    [actor, category, severity, product],
  );

  return (
    <>
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4" aria-label="Audit summary">
        {auditLogDemoData.summary.map((metric, index) => (
          <article className="rounded-md border border-brand-surface bg-brand-navy p-4" key={metric.label}>
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10px] leading-4 text-brand-muted">{metric.label}</p>
              {index === 3 ? (
                <ShieldCheck className="text-brand-red" size={15} />
              ) : (
                <Activity className={index === 2 ? "text-brand-yellow" : "text-brand-sky"} size={15} />
              )}
            </div>
            <p className="mt-3 font-mono text-[26px] font-medium leading-none tabular-nums text-brand-cream">
              {metric.value}
            </p>
            <p className="mt-2 text-[9px] text-brand-muted">{metric.note}</p>
          </article>
        ))}
      </section>

      <section className="mt-4 rounded-md border border-brand-surface bg-brand-navy p-4 sm:p-5" aria-label="Filter audit events">
        <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-muted">
          <Filter className="text-brand-sky" size={13} />
          Filter events
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <FilterSelect label="Actor" value={actor} options={actors} onChange={setActor} />
          <FilterSelect label="Category" value={category} options={categories} onChange={setCategory} />
          <FilterSelect label="Severity" value={severity} options={severities} onChange={setSeverity} />
          <FilterSelect label="Product / scan" value={product} options={products} onChange={setProduct} />
        </div>
      </section>

      <section className="mt-4 overflow-hidden rounded-md border border-brand-surface bg-brand-navy" aria-label="Chronological audit events">
        <div className="flex items-center justify-between gap-3 border-b border-brand-surface px-4 py-3 sm:px-5">
          <div>
            <h2 className="text-sm font-semibold text-brand-cream">Event history</h2>
            <p className="mt-1 text-[9px] text-brand-muted">Newest events first · simulated demo log</p>
          </div>
          <span className="font-mono text-[10px] text-brand-sky">
            {filteredEvents.length} shown
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse text-left">
            <thead>
              <tr className="border-b border-brand-surface text-[9px] font-semibold uppercase tracking-[0.1em] text-brand-muted">
                <th className="px-4 py-3 sm:px-5">Timestamp</th>
                <th className="px-3 py-3">Actor</th>
                <th className="px-3 py-3">Action</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3">Product / scan</th>
                <th className="px-3 py-3">Outcome</th>
                <th className="px-4 py-3 sm:px-5">Severity</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <tr className="border-b border-brand-surface/70 last:border-0" key={event.id}>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-[9px] text-brand-muted sm:px-5">
                      {event.timestamp}
                      <span className="mt-1 block text-[8px] text-brand-blue">{event.id}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex whitespace-nowrap rounded border px-2 py-1 text-[9px] font-medium ${actorClasses[event.actor]}`}>
                        {event.actor}
                      </span>
                    </td>
                    <td className="max-w-[210px] px-3 py-3 text-[10px] font-medium text-brand-cream">
                      {event.action}
                    </td>
                    <td className="px-3 py-3 text-[9px] text-brand-muted">{event.category}</td>
                    <td className="max-w-[220px] px-3 py-3 text-[9px] leading-4 text-brand-cream/80">
                      {event.productOrScan}
                    </td>
                    <td className="max-w-[240px] px-3 py-3 text-[9px] leading-4 text-brand-muted">
                      {event.outcome}
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <span className={`inline-flex whitespace-nowrap rounded border px-2 py-1 text-[9px] font-semibold ${severityClasses[event.severity]}`}>
                        {event.severity}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-xs text-brand-muted">
                    No demo events match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="mt-3 text-[9px] text-brand-muted">
        Demo audit records are illustrative and do not represent persistent production activity.
      </p>
    </>
  );
}
