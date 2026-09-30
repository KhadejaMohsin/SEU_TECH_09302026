"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Activity,
  BookOpen,
  Building2,
  CircleHelp,
  ClipboardCheck,
  Code2,
  Database,
  Eye,
  FileClock,
  FileText,
  Gauge,
  Lightbulb,
  Package,
  ShieldCheck,
} from "lucide-react";
 
import type { LucideIcon } from "lucide-react";

const primaryLinks: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Overview", href: "/dashboard", icon: Gauge },
  { label: "Visibility", href: "/dashboard/visibility", icon: Eye },
  { label: "Issues", href: "/dashboard/issues", icon: Activity },
  { label: "Impact", href: "/dashboard/impact", icon: Lightbulb },
  { label: "Product Feed", href: "/dashboard/product-feed", icon: Package },
  { label: "Audit Log", href: "/dashboard/audit-log", icon: FileClock },
  { label: "Fact Vault", href: "/dashboard/fact-vault", icon: Database },
];

const helpLinks: { label: string; icon: LucideIcon }[] = [
  { label: "Claro Consulting", icon: Building2 },
  { label: "Resources", icon: BookOpen },
  { label: "Governance", icon: ShieldCheck },
  { label: "Auténtico API", icon: Code2 },
  { label: "How it works", icon: CircleHelp },
];

export function DashboardSidebar({
  businessName,
}: {
  businessName: string | null;
}) {
  const pathname = usePathname();
  const initials = businessName
    ?.split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <aside className="border-b border-brand-surface bg-brand-ink lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-[252px] lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-4 py-4 lg:block lg:px-5 lg:pb-5 lg:pt-6">
        <Link href="/dashboard" className="flex w-fit flex-col items-start gap-1.5">
          <span className="relative block h-[55px] w-[165px] sm:h-[68px] sm:w-[204px]">
            <Image
              src="/brand/authentico%20api%20dark%20logo.png"
              alt="Authentico API"
              fill
              sizes="(min-width: 640px) 204px, 165px"
              priority
              className="object-contain object-left"
            />
          </span>
          <span className="whitespace-nowrap pl-0.5 text-[13px] font-semibold leading-4 tracking-[0.04em] text-brand-muted">
            AI visibility, uncovered and understood
          </span>
        </Link>
        <div className="flex items-center gap-2 rounded-full border border-brand-surface bg-brand-navy px-2.5 py-1.5 text-[10px] font-medium text-brand-cream/80 lg:hidden">
          <Building2 size={12} />
              {businessName ?? "Business unavailable"}
        </div>
      </div>

      <nav
        aria-label="Main navigation"
        className="flex gap-1 overflow-x-auto px-3 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-col lg:overflow-visible lg:px-3 lg:pb-0"
      >
        {primaryLinks.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`group flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-[13px] font-medium transition-colors ${
                active
                  ? "bg-brand-yellow text-brand-ink"
                  : "text-brand-muted hover:bg-brand-navy hover:text-brand-cream"
              }`}
            >
              <Icon size={16} strokeWidth={active ? 2.1 : 1.8} />
              {item.label}
              {item.label === "Issues" && (
                <span className="ml-auto hidden rounded-full bg-[#ed986f]/15 px-1.5 py-0.5 text-[10px] text-[#f4a884] lg:inline-flex">
                  6
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="hidden px-5 pb-2 pt-8 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-muted lg:block">
        <span id="help-about">Help &amp; About</span>
      </div>
      <nav
        aria-label="Help and about"
        className="hidden gap-1 px-3 lg:flex lg:flex-col"
      >
        {helpLinks.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href="#help-about"
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-[12px] text-brand-muted transition-colors hover:bg-brand-navy hover:text-brand-cream"
            >
              <Icon size={15} strokeWidth={1.8} />
              {item.label}
              {item.label === "Auténtico API" && (
                <FileText className="ml-auto text-brand-muted" size={13} />
              )}
            </a>
          );
        })}
      </nav>

      <div className="hidden flex-1 lg:block" />
      <div className="hidden border-t border-white/[0.08] p-4 lg:block">
        <div className="flex items-center gap-3 rounded-md border border-brand-surface bg-brand-navy p-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-brand-blue/25 text-xs font-semibold text-brand-sky">
            {initials || "?"}
          </span>
          <span className="min-w-0">
            <span className="block text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-muted">
              Current demo business
            </span>
            <span className="mt-1 block truncate text-xs font-medium text-brand-cream">
              {businessName ?? "Business unavailable"}
            </span>
          </span>
          <ClipboardCheck className="ml-auto shrink-0 text-brand-sky" size={15} />
        </div>
        <div className="mt-3 flex items-center justify-between px-1 text-[10px] text-brand-muted">
          <span>FuenteLuz demo</span>
          <span>v0.9</span>
        </div>
      </div>
    </aside>
  );
}