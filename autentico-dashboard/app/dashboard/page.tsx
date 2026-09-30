import { CalendarDays, Check, Radio, Sparkles } from "lucide-react";
import { Suspense } from "react";
import {
  DecisionsPanel,
  MetricCards,
  ProductsPanel,
  RecommendationsPanel,
  TrendPanel,
} from "@/components/dashboard/overview-panels";
import type { DashboardProduct } from "@/components/dashboard/overview-panels";
import { DevScanControl } from "@/components/dashboard/dev-scan-control";
import { dashboardMockData } from "@/lib/dashboard/mock-data";
import { createClient } from "@/lib/supabase/server";

const activeBusinessName = "LunaTech Electronics";
const productPageSize = 1000;

type DashboardData = {
  businessName: string | null;
  products: DashboardProduct[];
  error: string | null;
};

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-ink p-8 text-sm text-brand-cream/70">
          Loading your dashboard...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const supabase = await createClient();
  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("name", activeBusinessName)
    .limit(1)
    .maybeSingle();

  let dashboardData: DashboardData;

  if (businessError) {
    dashboardData = {
      businessName: null,
      products: [],
      error: `Unable to load the demo business: ${businessError.message}`,
    };
  } else if (!business) {
    dashboardData = {
      businessName: null,
      products: [],
      error: `Business "${activeBusinessName}" was not found.`,
    };
  } else {
    const products: DashboardProduct[] = [];
    let offset = 0;
    let productError: string | null = null;

    while (true) {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, sku, category, current_price, currency, stock_status")
        .eq("business_id", business.id)
        .order("id")
        .range(offset, offset + productPageSize - 1);

      if (error) {
        productError = `Unable to load products: ${error.message}`;
        break;
      }

      products.push(...(data ?? []));

      if (!data || data.length < productPageSize) {
        break;
      }

      offset += productPageSize;
    }

    dashboardData = {
      businessName: business.name,
      products: productError ? [] : products,
      error: productError,
    };
  }

  const businessName = dashboardData.businessName;

  return (
    <>
          <header className="mb-6 flex flex-col gap-4 border-b border-white/[0.07] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-brand-muted">
                <span>{dashboardMockData.workspaceLabel}</span>
                <span className="size-1 rounded-full bg-brand-yellow" />
                <span>Overview</span>
              </div>
              <h1 className="font-display text-[25px] font-bold leading-tight text-brand-cream sm:text-[29px]">
                Your AI visibility, at a glance.
              </h1>
              <p className="mt-2 text-xs text-brand-muted">
                {businessName
                  ? `See how AI platforms describe ${businessName}.`
                  : "Business details are unavailable."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-md border border-brand-surface bg-brand-navy px-3 py-2 text-[10px] text-brand-cream/80">
                <CalendarDays size={13} className="text-brand-sky" />
                Last 7 scans
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-brand-blue/50 bg-brand-blue/20 px-3 py-2 text-[10px] text-brand-sky">
                <Radio size={12} className="text-brand-sky" />
                Last scan {dashboardMockData.lastScan}
              </span>
            </div>
          </header>

          {process.env.NODE_ENV === "development" && (
            <div className="mb-4">
              <DevScanControl />
            </div>
          )}

          <section id="overview" aria-label="Key performance indicators">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-muted">
              <Sparkles size={12} className="text-brand-yellow" />
              Performance snapshot
            </div>
            <MetricCards />
          </section>

          <section
            className="mt-4 grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.75fr)_minmax(330px,0.9fr)]"
            aria-label="Visibility trends and recommendations"
          >
            <TrendPanel />
            <RecommendationsPanel />
          </section>

          <section
            className="mt-4 grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(380px,0.95fr)]"
            aria-label="Issues and product summary"
          >
            <DecisionsPanel />
            <ProductsPanel
              products={dashboardData.products}
              error={dashboardData.error}
            />
          </section>

          <footer className="mt-6 flex flex-col gap-2 border-t border-brand-surface pt-4 text-[9px] text-brand-muted sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-brand-yellow" />
              Metrics and recommendations are demo data; business and products are live.
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check size={11} />
              Workspace for {businessName ?? "Business unavailable"}
            </span>
          </footer>
    </>
  );
}