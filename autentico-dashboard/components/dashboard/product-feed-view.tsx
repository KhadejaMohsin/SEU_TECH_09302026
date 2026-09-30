import {
  AlertTriangle,
  BadgeCheck,
  Boxes,
  CircleCheck,
  CircleDashed,
  Clock3,
  Database,
  ShieldAlert,
} from "lucide-react";
import { productFeedMockScores } from "@/lib/dashboard/product-feed-mock-data";

export type FeedStatus = "Healthy" | "Needs update" | "Missing field" | "Conflict detected";
export type ReadinessField = {
  label: string;
  complete: boolean;
};

export type ProductFeedItem = {
  id: string;
  name: string | null;
  sku: string | null;
  currentPrice: string | null;
  stock: string | null;
  ram: string | null;
  storage: string | null;
  warranty: string | null;
  returnPeriod: string | null;
  lastVerified: string | null;
  status: FeedStatus;
  conflicts: string[];
  readiness: ReadinessField[];
};

const statusClasses: Record<FeedStatus, string> = {
  Healthy: "border-brand-blue/40 bg-brand-blue/15 text-brand-sky",
  "Needs update": "border-brand-yellow/40 bg-brand-yellow/10 text-brand-yellow",
  "Missing field": "border-brand-red/40 bg-brand-red/10 text-brand-red",
  "Conflict detected": "border-brand-red/50 bg-brand-red/15 text-brand-red",
};

function StatusBadge({ status }: { status: FeedStatus }) {
  const Icon =
    status === "Healthy"
      ? CircleCheck
      : status === "Needs update"
        ? Clock3
        : status === "Conflict detected"
          ? AlertTriangle
          : CircleDashed;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-1 text-[9px] font-semibold ${statusClasses[status]}`}>
      <Icon size={11} />
      {status}
    </span>
  );
}

function formatDate(value: string | null) {
  if (!value) return "Not verified";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function KpiCards({
  products,
  conflictCount,
  missingFieldCount,
  conflictUnavailable,
}: {
  products: ProductFeedItem[];
  conflictCount: number;
  missingFieldCount: number;
  conflictUnavailable: boolean;
}) {
  const cards = [
    {
      label: "Feed Health",
      value: `${productFeedMockScores.feedHealth}%`,
      note: "Illustrative readiness score",
      icon: ShieldAlert,
      tone: "text-brand-yellow",
    },
    {
      label: "Freshness",
      value: `${productFeedMockScores.freshness}%`,
      note: "Illustrative freshness score",
      icon: Clock3,
      tone: "text-brand-sky",
    },
    {
      label: "Products Synced",
      value: `${products.length}/${products.length}`,
      note: "Loaded from LunaTech catalog",
      icon: Boxes,
      tone: "text-brand-blue",
    },
    {
      label: "Conflicts",
      value: conflictUnavailable ? "—" : String(conflictCount),
      note: conflictUnavailable ? "No completed scan available" : "From latest completed scan",
      icon: AlertTriangle,
      tone: conflictUnavailable ? "text-brand-muted" : "text-brand-red",
    },
    {
      label: "Missing Fields",
      value: String(missingFieldCount),
      note: "Required feed values absent",
      icon: Database,
      tone: missingFieldCount ? "text-brand-red" : "text-brand-sky",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5" aria-label="Product feed KPIs">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <article className="min-w-0 rounded-md border border-brand-surface bg-brand-navy p-3.5 sm:p-4" key={card.label}>
            <div className="flex items-start justify-between gap-2">
              <p className="min-h-8 text-[10px] leading-4 text-brand-muted">{card.label}</p>
              <Icon className={card.tone} size={15} />
            </div>
            <p className="mt-3 font-mono text-[25px] font-medium leading-none tabular-nums text-brand-cream">
              {card.value}
            </p>
            <p className="mt-2 text-[8px] leading-4 text-brand-muted">{card.note}</p>
          </article>
        );
      })}
    </section>
  );
}

function ProductFacts({ product }: { product: ProductFeedItem }) {
  const facts = [
    { label: "SKU", value: product.sku },
    { label: "Current price", value: product.currentPrice },
    { label: "Stock", value: product.stock },
    { label: "RAM", value: product.ram },
    { label: "Storage", value: product.storage },
    { label: "Warranty", value: product.warranty },
    { label: "Return period", value: product.returnPeriod },
    { label: "Last verified", value: formatDate(product.lastVerified) },
  ];

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4 xl:grid-cols-8">
      {facts.map((fact) => (
        <div className="min-w-0" key={fact.label}>
          <p className="text-[8px] font-semibold uppercase tracking-[0.09em] text-brand-muted">{fact.label}</p>
          <p className="mt-1 truncate text-[10px] font-medium text-brand-cream/90" title={fact.value ?? undefined}>
            {fact.value ?? "Missing"}
          </p>
        </div>
      ))}
    </div>
  );
}

function ProductRows({ products }: { products: ProductFeedItem[] }) {
  return (
    <section className="rounded-md border border-brand-surface bg-brand-navy p-4 sm:p-5" aria-labelledby="feed-products-heading">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-brand-cream" id="feed-products-heading">Verified product feed</h2>
          <p className="mt-1 text-[10px] text-brand-muted">Current LunaTech product facts available to downstream systems</p>
        </div>
        <span className="hidden items-center gap-1.5 rounded border border-brand-blue/30 bg-brand-blue/10 px-2 py-1 text-[9px] text-brand-sky sm:inline-flex">
          <BadgeCheck size={11} /> Supabase product records
        </span>
      </div>

      {products.length === 0 ? (
        <p className="py-8 text-center text-xs text-brand-muted">No LunaTech products are visible in the product feed.</p>
      ) : (
        <div className="divide-y divide-brand-surface">
          {products.map((product) => (
            <article className="py-4 first:pt-0 last:pb-0" key={product.id}>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-display text-sm font-bold text-brand-cream">
                  {product.name ?? "Unnamed product"}
                </h3>
                <StatusBadge status={product.status} />
              </div>
              <ProductFacts product={product} />
              {product.conflicts.length > 0 && (
                <p className="mt-3 flex items-start gap-1.5 text-[9px] leading-4 text-brand-red">
                  <AlertTriangle className="mt-0.5 shrink-0" size={11} />
                  Conflict with latest scan: {product.conflicts.join("; ")}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function ReadinessCell({ complete }: { complete: boolean }) {
  return complete ? (
    <span className="inline-flex items-center gap-1 text-[9px] text-brand-sky">
      <CircleCheck size={11} /> Complete
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-[9px] text-brand-red">
      <CircleDashed size={11} /> Missing
    </span>
  );
}

function StructuredReadiness({ products }: { products: ProductFeedItem[] }) {
  return (
    <section className="rounded-md border border-brand-surface bg-brand-navy p-4 sm:p-5" aria-labelledby="readiness-heading">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-brand-cream" id="readiness-heading">Structured Data Readiness</h2>
        <p className="mt-1 text-[10px] text-brand-muted">Field completeness is derived from each Supabase product row.</p>
      </div>
      {products.length === 0 ? (
        <p className="py-6 text-center text-xs text-brand-muted">No product readiness data available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] border-collapse text-left">
            <thead>
              <tr className="border-b border-brand-surface text-[9px] font-semibold uppercase tracking-[0.08em] text-brand-muted">
                <th className="pb-3 pr-3">Product</th>
                {products[0].readiness.map((field) => (
                  <th className="pb-3 px-2" key={field.label}>{field.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr className="border-b border-brand-surface/70 last:border-0" key={product.id}>
                  <td className="py-3 pr-3 text-[10px] font-medium text-brand-cream">{product.name ?? "Unnamed product"}</td>
                  {product.readiness.map((field) => (
                    <td className="px-2 py-3" key={field.label}>
                      <ReadinessCell complete={field.complete} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function ProductFeedView({
  products,
  conflictsUnavailable,
  error,
}: {
  products: ProductFeedItem[];
  conflictsUnavailable: boolean;
  error: string | null;
}) {
  const conflictCount = products.reduce((sum, product) => sum + product.conflicts.length, 0);
  const missingFieldCount = products.reduce(
    (sum, product) => sum + product.readiness.filter((field) => !field.complete).length,
    0,
  );

  return (
    <div className="space-y-4">
      <header className="mb-5 flex flex-col gap-3 border-b border-brand-surface pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-muted">
            <span>Demo workspace</span>
            <span className="size-1 rounded-full bg-brand-yellow" />
            <span>LunaTech Electronics</span>
          </div>
          <h1 className="font-display text-[26px] font-bold leading-tight text-brand-cream sm:text-[30px]">Product Feed</h1>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-brand-muted">
            Verified product information shared with downstream AI and search systems.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded border border-brand-blue/30 bg-brand-blue/10 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.08em] text-brand-sky">
          <Database size={12} /> Live Supabase product fields
        </span>
      </header>

      {error && (
        <div className="rounded-md border border-brand-red/40 bg-brand-red/10 px-4 py-3 text-xs leading-5 text-brand-red" role="alert">
          {error}
        </div>
      )}
      {conflictsUnavailable && !error && (
        <div className="rounded-md border border-brand-yellow/30 bg-brand-yellow/[0.06] px-4 py-3 text-[10px] leading-5 text-brand-yellow">
          Conflict detection requires a visible completed scan. Product values and readiness below still come from Supabase.
        </div>
      )}

      <KpiCards
        products={products}
        conflictCount={conflictCount}
        missingFieldCount={missingFieldCount}
        conflictUnavailable={conflictsUnavailable}
      />
      <ProductRows products={products} />
      <StructuredReadiness products={products} />
    </div>
  );
}
