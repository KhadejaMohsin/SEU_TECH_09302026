import {
  ArrowDownRight,
  ArrowUpRight,
  ChartNoAxesCombined,
  CircleDollarSign,
  Compass,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import { impactDemoData } from "@/lib/dashboard/impact-mock-data";

const metricToneClasses: Record<string, string> = {
  blue: "border-l-brand-blue text-brand-sky",
  yellow: "border-l-brand-yellow text-brand-yellow",
  sky: "border-l-brand-sky text-brand-sky",
  red: "border-l-brand-red text-brand-red",
};

function ImpactPanel({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon: typeof ChartNoAxesCombined;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-md border border-brand-surface bg-brand-navy p-4 sm:p-5">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-brand-blue/20 text-brand-sky">
          <Icon size={16} />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-brand-cream">{title}</h2>
          {description && (
            <p className="mt-1 text-[10px] leading-4 text-brand-muted">{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

function ImpactMetrics() {
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-3 2xl:grid-cols-5" aria-label="Demo impact metrics">
      {impactDemoData.metrics.map((metric) => (
        <article
          key={metric.label}
          className={`min-w-0 rounded-md border border-brand-surface border-l-2 bg-brand-navy p-3.5 sm:p-4 ${metricToneClasses[metric.tone]}`}
        >
          <p className="min-h-9 text-[10px] leading-4 text-brand-muted">{metric.label}</p>
          <p className="mt-3 flex flex-wrap items-baseline gap-1.5">
            <span className="font-mono text-[24px] font-medium leading-none tabular-nums text-brand-cream sm:text-[27px]">
              {metric.value}
            </span>
            {metric.suffix && (
              <span className="font-mono text-[10px] text-brand-muted">{metric.suffix}</span>
            )}
          </p>
          <p className="mt-2 text-[9px] leading-4 text-brand-muted">{metric.note}</p>
        </article>
      ))}
    </section>
  );
}

function BeforeAfterComparison() {
  return (
    <ImpactPanel
      title="Before vs. after"
      description="Illustrative scenario if the recommended fixes are completed"
      icon={TrendingUp}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-left">
          <thead>
            <tr className="border-b border-brand-surface text-[9px] font-semibold uppercase tracking-[0.1em] text-brand-muted">
              <th className="pb-3 pr-3">Measure</th>
              <th className="pb-3 pr-3 text-right">Before</th>
              <th className="pb-3 text-right">Modeled after</th>
            </tr>
          </thead>
          <tbody>
            {impactDemoData.comparison.map((row) => (
              <tr className="border-b border-brand-surface/70 last:border-0" key={row.label}>
                <td className="py-3 pr-3 text-[10px] text-brand-cream/90">{row.label}</td>
                <td className="py-3 pr-3 text-right font-mono text-[11px] tabular-nums text-brand-muted">
                  {row.before}
                </td>
                <td className="py-3 text-right">
                  <span className="inline-flex items-center justify-end gap-1 font-mono text-[11px] font-medium tabular-nums text-brand-sky">
                    {row.direction === "down" ? (
                      <ArrowDownRight size={12} />
                    ) : (
                      <ArrowUpRight size={12} />
                    )}
                    {row.after}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ImpactPanel>
  );
}

function ModeledFunnel() {
  return (
    <ImpactPanel
      title="Modeled discovery funnel"
      description="Illustrative flow from AI shopping queries to estimated outcomes"
      icon={Compass}
    >
      <div className="mb-4 flex items-center gap-2 rounded border border-brand-yellow/30 bg-brand-yellow/[0.06] px-3 py-2 text-[9px] font-medium text-brand-yellow">
        <TriangleAlert size={12} />
        Modeled / illustrative demo data · not measured traffic or conversions
      </div>
      <div className="space-y-3" role="img" aria-label="Illustrative funnel from 1000 queries to 12 estimated conversions">
        {impactDemoData.funnel.map((stage, index) => (
          <div key={stage.stage}>
            <div className="mb-1 flex items-center justify-between gap-3 text-[10px]">
              <span className="text-brand-cream/90">{stage.stage}</span>
              <span className="font-mono tabular-nums text-brand-cream">
                {stage.value.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-center">
              <div
                className={`h-7 rounded-sm ${index === 0 ? "bg-brand-blue" : index < 3 ? "bg-brand-blue/75" : "bg-brand-sky/70"}`}
                style={{ width: `${stage.width}%` }}
              />
            </div>
            <p className="mt-1 text-center text-[8px] text-brand-muted">{stage.note}</p>
          </div>
        ))}
      </div>
    </ImpactPanel>
  );
}

function ImpactDrivers() {
  return (
    <ImpactPanel
      title="Impact drivers"
      description="Factors that may affect consideration and confidence"
      icon={ShieldAlert}
    >
      <div className="grid gap-2 sm:grid-cols-2">
        {impactDemoData.impactDrivers.map((driver, index) => (
          <article
            className="rounded border border-brand-surface bg-brand-ink/50 p-3"
            key={driver.title}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[10px] font-semibold leading-4 text-brand-cream">
                {driver.title}
              </h3>
              <span className="font-mono text-[8px] text-brand-muted">0{index + 1}</span>
            </div>
            <p className="mt-1 text-[9px] font-medium text-brand-sky">{driver.effect}</p>
            <p className="mt-1.5 text-[9px] leading-4 text-brand-muted">{driver.detail}</p>
            <span className="mt-2 inline-flex rounded border border-brand-blue/30 bg-brand-blue/10 px-1.5 py-0.5 text-[8px] uppercase tracking-[0.08em] text-brand-sky">
              {driver.signal}
            </span>
          </article>
        ))}
      </div>
    </ImpactPanel>
  );
}

function ExpectedBenefits() {
  return (
    <ImpactPanel
      title="Expected benefit after fixes"
      description="Modeled potential outcomes for planning—not a performance guarantee"
      icon={Sparkles}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {impactDemoData.expectedBenefits.map((benefit) => (
          <article className="border-l-2 border-brand-blue bg-brand-ink/40 py-2 pl-3" key={benefit.title}>
            <h3 className="text-[10px] font-semibold text-brand-cream">{benefit.title}</h3>
            <p className="mt-1 text-[9px] leading-4 text-brand-muted">{benefit.detail}</p>
            <p className="mt-2 inline-flex items-center gap-1 font-mono text-[9px] font-medium text-brand-sky">
              <CircleDollarSign size={11} />
              {benefit.indicator}
            </p>
          </article>
        ))}
      </div>
      <p className="mt-4 border-t border-brand-surface pt-3 text-[9px] text-brand-muted">
        These scenarios use illustrative demo assumptions. Actual visits, revenue, and conversions are not measured here.
      </p>
    </ImpactPanel>
  );
}

export function ImpactOverview() {
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
            Impact
          </h1>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-brand-muted">
            Explore modeled business impact from improved AI visibility and product accuracy.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded border border-brand-yellow/30 bg-brand-yellow/[0.06] px-3 py-2 font-mono text-[9px] font-medium uppercase tracking-[0.08em] text-brand-yellow">
          <span className="size-1.5 rounded-full bg-brand-yellow" />
          {impactDemoData.demoLabel}
        </span>
      </header>

      <div className="space-y-4">
        <ImpactMetrics />
        <section className="grid min-w-0 gap-4 xl:grid-cols-2" aria-label="Modeled performance and funnel">
          <BeforeAfterComparison />
          <ModeledFunnel />
        </section>
        <ImpactDrivers />
        <ExpectedBenefits />
      </div>
    </div>
  );
}
