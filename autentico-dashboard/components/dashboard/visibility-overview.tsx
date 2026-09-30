import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  ChartNoAxesCombined,
  CircleHelp,
  Lightbulb,
  Minus,
  Radio,
  SearchCheck,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { visibilityDemoData } from "@/lib/dashboard/visibility-mock-data";

const assistantToneClasses: Record<string, string> = {
  yellow: "text-brand-yellow",
  sky: "text-brand-sky",
  blue: "text-brand-blue",
  red: "text-brand-red",
};

const severityToneClasses: Record<string, string> = {
  High: "border-brand-red/40 bg-brand-red/10 text-brand-red",
  Medium: "border-brand-yellow/40 bg-brand-yellow/10 text-brand-yellow",
  Low: "border-brand-blue/40 bg-brand-blue/15 text-brand-sky",
};

function Panel({
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

function MetricCards() {
  return (
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4" aria-label="Visibility metrics">
      {visibilityDemoData.metrics.map((metric, index) => (
        <article
          className="rounded-md border border-brand-surface bg-brand-navy p-4"
          key={metric.label}
        >
          <p className="min-h-8 text-[10px] leading-4 text-brand-muted">{metric.label}</p>
          <p className="mt-3 flex items-baseline gap-1.5">
            <span className="font-mono text-[27px] font-medium leading-none tabular-nums text-brand-cream">
              {metric.value}
            </span>
            {metric.suffix && (
              <span className="font-mono text-xs text-brand-muted">{metric.suffix}</span>
            )}
          </p>
          <p className={`mt-2 text-[9px] ${index === 0 ? "text-brand-yellow" : "text-brand-muted"}`}>
            {metric.note}
          </p>
        </article>
      ))}
    </section>
  );
}

function AssistantVisibility() {
  return (
    <Panel
      title="Visibility by AI assistant"
      description="Mention rate across this simulated scan set"
      icon={Radio}
    >
      <div className="space-y-4" role="img" aria-label="AI assistant mention rates">
        {visibilityDemoData.assistants.map((assistant) => (
          <div key={assistant.name}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-[11px]">
              <span className="text-brand-cream/90">{assistant.name}</span>
              <span className={`font-mono tabular-nums ${assistantToneClasses[assistant.tone]}`}>
                {assistant.rate}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-brand-ink">
              <div
                className="h-full rounded-full"
                style={{ width: `${assistant.rate}%`, backgroundColor: assistant.color }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 border-t border-brand-surface pt-3 text-[9px] text-brand-muted">
        Answers mention LunaTech products; rates are demo values, not live platform measurements.
      </p>
    </Panel>
  );
}

function ShareOfVoice() {
  return (
    <Panel
      title="Share of voice"
      description="Simulated share of product mentions across the comparison set"
      icon={ChartNoAxesCombined}
    >
      <div className="space-y-3" role="img" aria-label="Share of voice by brand">
        {visibilityDemoData.shareOfVoice.map((brand, index) => (
          <div className="flex items-center gap-3" key={brand.name}>
            <span className="w-5 shrink-0 text-right font-mono text-[9px] text-brand-muted">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between gap-2 text-[10px]">
                <span className={brand.brand ? "font-semibold text-brand-yellow" : "text-brand-cream/80"}>
                  {brand.name}
                </span>
                <span className="font-mono tabular-nums text-brand-cream/80">{brand.share}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-brand-ink">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${brand.share}%`, backgroundColor: brand.color }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-brand-surface pt-3 text-[9px] text-brand-muted">
        <span className="size-2 rounded-full bg-brand-yellow" /> LunaTech
        <span className="ml-auto">4-brand demo comparison</span>
      </div>
    </Panel>
  );
}

function trendIcon(direction: string) {
  if (direction === "up") return <ArrowUpRight size={12} />;
  if (direction === "down") return <ArrowDownRight size={12} />;
  if (direction === "new") return <Sparkles size={11} />;
  return <Minus size={11} />;
}

function PromptPerformance() {
  return (
    <Panel
      title="Prompt performance"
      description="Strong and weak shopping prompts from the simulated scan"
      icon={SearchCheck}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-brand-surface text-[9px] font-semibold uppercase tracking-[0.1em] text-brand-muted">
              <th className="pb-3 pr-4">Prompt</th>
              <th className="pb-3 pr-4">Mention</th>
              <th className="pb-3 pr-4 text-right">Rank</th>
              <th className="pb-3 pr-4">Assistant</th>
              <th className="pb-3">Trend</th>
            </tr>
          </thead>
          <tbody>
            {visibilityDemoData.prompts.map((prompt) => (
              <tr className="border-b border-brand-surface/70 last:border-0" key={prompt.id}>
                <td className="max-w-[390px] py-3 pr-4">
                  <p className="text-[10px] leading-4 text-brand-cream/90">{prompt.prompt}</p>
                  <span className="mt-1 block font-mono text-[8px] text-brand-muted">{prompt.id}</span>
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`inline-flex items-center rounded border px-2 py-1 text-[9px] font-medium ${
                      prompt.mention === "Mentioned"
                        ? "border-brand-blue/40 bg-brand-blue/15 text-brand-sky"
                        : "border-brand-red/40 bg-brand-red/10 text-brand-red"
                    }`}
                  >
                    {prompt.mention}
                  </span>
                </td>
                <td className="py-3 pr-4 text-right font-mono text-[10px] tabular-nums text-brand-cream">
                  {prompt.rank ? `#${prompt.rank}` : "—"}
                </td>
                <td className="py-3 pr-4 text-[10px] text-brand-cream/80">{prompt.assistant}</td>
                <td className="py-3">
                  <span
                    className={`inline-flex items-center gap-1 text-[9px] ${
                      prompt.trendDirection === "down"
                        ? "text-brand-red"
                        : prompt.trendDirection === "up"
                          ? "text-brand-sky"
                          : "text-brand-muted"
                    }`}
                  >
                    {trendIcon(prompt.trendDirection)}
                    {prompt.trend}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function SourceRepresentation() {
  return (
    <Panel
      title="Source representation"
      description="Sources shown alongside simulated answers"
      icon={Radio}
    >
      <div className="mb-4 flex h-3 overflow-hidden rounded-full bg-brand-ink" role="img" aria-label="Source representation distribution">
        {visibilityDemoData.sources.map((source) => (
          <span
            key={source.name}
            className="h-full"
            style={{ width: `${source.share}%`, backgroundColor: source.color }}
            title={`${source.name}: ${source.share}%`}
          />
        ))}
      </div>
      <ul className="space-y-3">
        {visibilityDemoData.sources.map((source) => (
          <li className="flex items-center gap-2 text-[10px]" key={source.name}>
            <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: source.color }} />
            <span className="min-w-0 flex-1 text-brand-cream/80">{source.name}</span>
            <span className="font-mono tabular-nums text-brand-cream">{source.share}%</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function VisibilityDiagnostics() {
  return (
    <Panel
      title="Why you may not be showing up"
      description="Potential visibility barriers from the demo analysis"
      icon={ShieldAlert}
    >
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        {visibilityDemoData.diagnostics.map((diagnostic) => (
          <article
            className="rounded border border-brand-surface bg-brand-ink/50 p-3"
            key={diagnostic.title}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[10px] font-semibold leading-4 text-brand-cream">
                {diagnostic.title}
              </h3>
              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded border px-1.5 py-0.5 text-[8px] font-semibold ${severityToneClasses[diagnostic.severity]}`}
              >
                {diagnostic.severity === "High" && <AlertTriangle size={9} />}
                {diagnostic.severity}
              </span>
            </div>
            <p className="mt-1.5 text-[9px] leading-4 text-brand-muted">{diagnostic.detail}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-[8px] uppercase tracking-[0.08em] text-brand-sky">
              <CircleHelp size={10} /> {diagnostic.signal}
            </span>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function RecommendedActions() {
  return (
    <Panel
      title="Recommended actions"
      description="Practical ways to improve prompt coverage and answer confidence"
      icon={Lightbulb}
    >
      <ol className="divide-y divide-brand-surface">
        {visibilityDemoData.recommendedActions.map((action) => (
          <li className="flex gap-3 py-3 first:pt-0 last:pb-0" key={action.priority}>
            <span className="font-mono text-[10px] text-brand-yellow">{action.priority}</span>
            <div className="min-w-0 flex-1">
              <h3 className="text-[10px] font-semibold leading-4 text-brand-cream">{action.title}</h3>
              <p className="mt-1 text-[9px] leading-4 text-brand-muted">{action.detail}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-brand-sky">
                {action.impact} <ArrowRight size={10} />
              </span>
            </div>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

export function VisibilityOverview() {
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
            Visibility
          </h1>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-brand-muted">
            Understand where LunaTech appears in AI shopping answers, which prompts help or hurt, and what to improve.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded border border-brand-yellow/30 bg-brand-yellow/[0.06] px-3 py-2 font-mono text-[9px] font-medium uppercase tracking-[0.08em] text-brand-yellow">
          <span className="size-1.5 rounded-full bg-brand-yellow" />
          {visibilityDemoData.scanLabel}
        </span>
      </header>

      <div className="space-y-4">
        <MetricCards />
        <section className="grid min-w-0 gap-4 xl:grid-cols-2" aria-label="Assistant and competitor visibility">
          <AssistantVisibility />
          <ShareOfVoice />
        </section>
        <PromptPerformance />
        <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]" aria-label="Sources and visibility diagnostics">
          <SourceRepresentation />
          <VisibilityDiagnostics />
        </section>
        <RecommendedActions />
        <p className="text-[9px] text-brand-muted">
          Prototype only. All metrics, prompts, sources, and diagnoses are simulated demo data, not live AI output.
        </p>
      </div>
    </div>
  );
}
