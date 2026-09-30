import { IBM_Plex_Mono, Inter, Sora } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Suspense } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { createClient } from "@/lib/supabase/server";

const bodyFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
const displayFont = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});
const monoFont = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

async function DashboardShell({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: business } = await supabase
    .from("businesses")
    .select("name")
    .eq("name", "LunaTech Electronics")
    .limit(1)
    .maybeSingle();

  return (
    <div
      className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable} min-h-screen bg-brand-ink font-sans text-brand-cream`}
    >
      <DashboardSidebar businessName={business?.name ?? null} />
      <main className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_rgba(0,110,144,0.14),_transparent_42%)] lg:pl-[252px]">
        <div className="mx-auto max-w-[1600px] px-4 pb-10 pt-5 sm:px-6 sm:pt-7 xl:px-9">
          <header className="mb-5 flex items-center justify-between gap-4 border-b border-brand-surface pb-3">
            <div className="min-w-0">
              <p className="font-mono text-[8px] font-medium uppercase tracking-[0.1em] text-brand-yellow">
                FuenteLuz workspace
              </p>
              <p className="mt-1 truncate text-[10px] text-brand-muted">
                {business?.name ?? "LunaTech Electronics"}
              </p>
            </div>
            <Link
              href="/dashboard/consulting"
              className="inline-flex shrink-0 items-center gap-2 rounded-md border border-brand-blue/50 bg-brand-navy px-2.5 py-2 text-brand-cream transition-colors hover:border-brand-sky/60 hover:bg-brand-blue/20 sm:gap-3 sm:px-3"
            >
              <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded bg-brand-cream p-0.5 sm:size-9">
                <Image
                  src="/brand/Claro%20Consulting%20Watermark.png"
                  alt=""
                  fill
                  sizes="36px"
                  className="object-contain"
                />
              </span>
              <span className="text-left">
                <span className="block text-[10px] font-semibold sm:text-[11px]">
                  Talk to Claro Consulting
                </span>
                <span className="mt-0.5 hidden text-[8px] text-brand-muted sm:block">
                  Human advisory
                </span>
              </span>
              <ArrowUpRight className="text-brand-sky" size={14} />
            </Link>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-brand-ink p-8 text-sm text-brand-cream/70">
          Loading dashboard...
        </div>
      }
    >
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
