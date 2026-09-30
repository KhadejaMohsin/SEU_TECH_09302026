import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  ChartNoAxesCombined,
  Check,
  CircleDot,
  Clock3,
  Eye,
  ScanSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { dashboardMockData } from "@/lib/dashboard/mock-data";

const metricIcons: LucideIcon[] = [
  ScanSearch,
  ShieldCheck,
  Clock3,
  Eye,
  ChartNoAxesCombined,
  AlertTriangle,
];

const metricToneClasses: Record<string, string> = {
  lime: "text-brand-yellow bg-brand-yellow/10",
  teal: "text-brand-sky bg-brand-blue/20",
  amber: "text-brand-yellow bg-brand-yellow/10",
  coral: "text-brand-red bg-brand-red/10",
  blue: "text-brand-sky bg-brand-blue/20",
  rose: "text-brand-red bg-brand-red/10",
};

const recommendationToneClasses: Record<string, string> = {
  lime: "border-l-brand-yellow",
  teal: "border-l-brand-blue",
  coral: "border-l-brand-red",
};

export type DashboardProduct = {
  id: string;
  name: string | null;
  sku: string | null;
  category: string | null;
  current_price: number | string | null;
  currency: string | null;
  stock_status: string | null;
};

export function MetricCards() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {dashboardMockData.metrics.map((metric, index) => {
        const Icon = metricIcons[index];
        const negative = metric.change.startsWith("-");

        return (
          <article
            key={metric.label}
            className="min-w-0 rounded-md border border-brand-surface bg-brand-navy p-3.5 transition-colors hover:border-brand-blue/70 sm:p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="min-h-9 max-w-[130px] text-[11px] leading-4 text-brand-muted sm:text-xs">
                {metric.label}
              </p>
              <span
                className={`flex size-7 shrink-0 items-center justify-center rounded-md ${metricToneClasses[metric.tone]}`}
              >
                <Icon size={14} strokeWidth={1.9} />
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-mono text-[25px] font-medium leading-none tabular-nums text-brand-cream sm:text-[28px]">
                {metric.value}
              </span>
              <span
                className={`inline-flex items-center text-[10px] font-medium ${
                  metric.label === "Needs Approval"
                    ? "text-brand-red"
                    : negative
                      ? "text-brand-red"
                      : "text-brand-yellow"
                }`}
              >
                {metric.label === "Needs Approval" ? null : negative ? (
                  <ArrowDownRight className="mr-0.5" size={12} />
                ) : (
                  <ArrowUpRight className="mr-0.5" size={12} />
                )}
                {metric.change}
              </span>
            </div>
            <p className="mt-2 text-[10px] text-brand-muted">{metric.changeNote}</p>
          </article>
        );
      })}
    </div>
  );
}

function PanelHeading({
  title,
  description,
  trailing,
}: {
  title: string;
  description?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-[15px] font-semibold text-brand-cream">{title}</h2>
        {description && (
          <p className="mt-1 text-[11px] leading-4 text-brand-muted">
            {description}
          </p>
        )}
      </div>
      {trailing}
    </div>
  );
}

type TrendKey = "visibility" | "accuracy" | "mentions";

const trendSeries: { key: TrendKey; label: string; color: string }[] = [
  { key: "visibility", label: "AI Visibility", color: "#FFC821" },
  { key: "accuracy", label: "Accuracy", color: "#8BDCF1" },
  { key: "mentions", label: "Brand mentions", color: "#CF5C36" },
];

export function TrendPanel() {
  const points = dashboardMockData.trendByScan;
  const plotLeft = 48;
  const plotWidth = 660;
  const plotTop = 20;
  const plotHeight = 174;
  const xFor = (index: number) => plotLeft + (index * plotWidth) / (points.length - 1);
  const yFor = (value: number) => plotTop + ((100 - value) * plotHeight) / 100;

  return (
    <section
      id="trend"
      className="min-w-0 rounded-md border border-brand-surface bg-brand-navy p-4 sm:p-5"
      aria-labelledby="trend-heading"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-brand-yellow/10 text-brand-yellow">
              <ChartNoAxesCombined size={15} />
            </span>
            <h2 id="trend-heading" className="text-[15px] font-semibold text-brand-cream">
              Trend by scan
            </h2>
          </div>
          <p className="mt-2 text-[11px] text-brand-muted">
            Visibility signals across your latest scans
          </p>
        </div>
        <span className="rounded border border-brand-surface px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-muted">
          Last 7 scans
        </span>
      </div>

      <div className="mt-4 w-full overflow-hidden">
        <svg
          viewBox="0 0 740 238"
          className="h-auto w-full overflow-visible"
          role="img"
          aria-label="Weekly trend chart for visibility, accuracy, and brand mentions"
        >
          {[0, 25, 50, 75, 100].map((tick) => {
            const y = yFor(tick);
            return (
              <g key={tick}>
                <text
                  x="0"
                  y={y + 3}
                  fill="#8B98A7"
                  fontSize="9"
                  fontFamily="inherit"
                >
                  {tick}%
                </text>
                <line
                  x1={plotLeft}
                  x2={plotLeft + plotWidth}
                  y1={y}
                  y2={y}
                  stroke="rgba(255,248,232,0.1)"
                  strokeDasharray="3 6"
                />
              </g>
            );
          })}
          {points.map((point, index) => (
            <text
              key={point.week}
              x={xFor(index)}
              y="224"
              fill="#8B98A7"
              fontSize="9"
              fontFamily="inherit"
              textAnchor="middle"
            >
              {point.week}
            </text>
          ))}
          {trendSeries.map((series) => {
            const linePoints = points
              .map((point, index) => `${xFor(index)},${yFor(point[series.key])}`)
              .join(" ");

            return (
              <g key={series.key}>
                <polyline
                  points={linePoints}
                  fill="none"
                  stroke={series.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {points.map((point, index) => (
                  <circle
                    key={`${series.key}-${point.week}`}
                    cx={xFor(index)}
                    cy={yFor(point[series.key])}
                    r={index === points.length - 1 ? 3.5 : 2}
                    fill={series.color}
                    stroke="#111923"
                    strokeWidth="1.5"
                  />
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-1 flex flex-wrap gap-x-5 gap-y-2 border-t border-brand-surface pt-3">
        {trendSeries.map((series) => (
          <span
            key={series.key}
            className="inline-flex items-center gap-2 text-[10px] text-brand-cream/80"
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: series.color }}
            />
            {series.label}
          </span>
        ))}
      </div>
    </section>
  );
}

export function RecommendationsPanel() {
  return (
    <section
      id="recommendations"
      className="rounded-md border border-brand-surface bg-brand-navy p-4 sm:p-5"
      aria-labelledby="recommendations-heading"
    >
      <PanelHeading
        title="What to do next"
        description="Recommended actions to strengthen your presence"
        trailing={
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-brand-red/10 text-brand-red">
            <Sparkles size={14} />
          </span>
        }
      />
      <h2 id="recommendations-heading" className="sr-only">
        What to do next
      </h2>
      <div className="mt-4 divide-y divide-brand-surface">
        {dashboardMockData.recommendations.map((recommendation, index) => (
          <article
            key={recommendation.title}
            className={`border-l-2 py-3 first:pt-0 last:pb-0 ${recommendationToneClasses[recommendation.accent]}`}
          >
            <div className="flex items-start gap-3 pl-3">
              <span className="mt-0.5 text-[10px] font-semibold tabular-nums text-brand-muted">
                0{index + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-xs font-medium leading-5 text-brand-cream">
                  {recommendation.title}
                </h3>
                <p className="mt-1 text-[10px] leading-[1.55] text-brand-muted">
                  {recommendation.description}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-brand-sky">
                  {recommendation.impact}
                  <ArrowRight size={11} />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function DecisionsPanel() {
  return (
    <section
      id="decisions"
      className="min-w-0 rounded-md border border-brand-surface bg-brand-navy p-4 sm:p-5"
      aria-labelledby="decisions-heading"
    >
      <PanelHeading
        title="Needs your decision"
        description="Review issues before they affect customer answers"
        trailing={
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand-red/30 bg-brand-red/10 px-2.5 py-1 text-[10px] font-medium text-brand-red">
            <CircleDot size={11} />
            6 pending
          </span>
        }
      />
      <h2 id="decisions-heading" className="sr-only">
        Needs your decision
      </h2>
      <div className="mt-4 divide-y divide-brand-surface">
        {dashboardMockData.issues.map((issue) => (
          <article
            key={issue.id}
            className="flex flex-col gap-2 py-3 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-start gap-3">
              <span
                className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md ${
                  issue.priority === "High"
                    ? "bg-brand-red/10 text-brand-red"
                    : "bg-brand-yellow/10 text-brand-yellow"
                }`}
              >
                <AlertTriangle size={14} />
              </span>
              <div className="min-w-0">
                <h3 className="truncate text-xs font-medium text-brand-cream">
                  {issue.product}
                </h3>
                <p className="mt-1 text-[10px] leading-4 text-brand-cream/80">
                  {issue.issue}
                </p>
                <p className="mt-1.5 text-[9px] text-brand-muted">{issue.source}</p>
              </div>
            </div>
            <span
              className={`ml-10 inline-flex w-fit shrink-0 items-center gap-1.5 rounded border px-2 py-1 text-[9px] font-medium sm:ml-0 ${
                issue.priority === "High"
                  ? "border-brand-red/30 text-brand-red"
                  : "border-brand-yellow/30 text-brand-yellow"
              }`}
            >
              <span className="size-1 rounded-full bg-current" />
              {issue.priority} priority
            </span>
          </article>
        ))}
      </div>
      <Link
        href="#decisions"
        className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-medium text-brand-yellow hover:text-brand-cream"
      >
        Review all pending issues <ArrowRight size={12} />
      </Link>
    </section>
  );
}

export function ProductsPanel({
  products,
  error,
}: {
  products: DashboardProduct[];
  error: string | null;
}) {
  return (
    <section
      id="products"
      className="min-w-0 rounded-md border border-brand-surface bg-brand-navy p-4 sm:p-5"
      aria-labelledby="products-heading"
    >
      <PanelHeading
        title="Your products"
        description={
          error
            ? "Product feed unavailable"
            : `${products.length.toLocaleString()} products in your feed`
        }
        trailing={
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-brand-blue/20 text-brand-sky">
            <Boxes size={14} />
          </span>
        }
      />
      <h2 id="products-heading" className="sr-only">
        Your products
      </h2>
      <div className="mt-4 divide-y divide-brand-surface">
        {error ? (
          <p className="py-6 text-xs leading-5 text-brand-red">{error}</p>
        ) : products.length === 0 ? (
          <p className="py-6 text-xs text-brand-muted">No products found for this business.</p>
        ) : (
          products.map((product) => {
            const price =
              product.current_price == null
                ? null
                : `${product.current_price} ${product.currency ?? ""}`.trim();

            return (
              <article
                key={product.id}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-brand-surface bg-brand-surface text-brand-sky">
                  <Boxes size={15} strokeWidth={1.7} />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-xs font-medium text-brand-cream">
                    {product.name ?? "Unnamed product"}
                  </h3>
                  <p className="mt-1 truncate text-[9px] text-brand-muted">
                    {product.sku ?? "No SKU"} <span className="px-1 text-brand-muted">/</span>{" "}
                    {product.category ?? "Uncategorized"}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[10px] font-medium tabular-nums text-brand-cream">
                    {price ?? "Price unavailable"}
                  </div>
                  <span className="mt-1 block text-[9px] text-brand-sky">
                    {product.stock_status ?? "Stock unknown"}
                  </span>
                </div>
              </article>
            );
          })
        )}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-brand-surface pt-3">
        <span className="inline-flex items-center gap-1.5 text-[9px] text-brand-muted">
          <BadgeCheck size={12} className="text-brand-blue" />
          Live business feed
        </span>
        <Link
          href="#products"
          className="inline-flex items-center gap-1 text-[10px] font-medium text-brand-yellow hover:text-brand-cream"
        >
          View feed <ArrowRight size={12} />
        </Link>
      </div>
    </section>
  );
}