import { ProductFeedView, type FeedStatus, type ProductFeedItem } from "@/components/dashboard/product-feed-view";
import { createClient } from "@/lib/supabase/server";

const activeBusinessName = "LunaTech Electronics";
const productPageSize = 1000;

type ProductRecord = {
  id: string;
  name: string | null;
  sku: string | null;
  current_price: number | string | null;
  currency: string | null;
  stock_status: string | null;
  processor: string | null;
  ram_gb: number | null;
  storage_gb: number | null;
  screen_size: number | string | null;
  warranty_months: number | null;
  return_days: number | null;
  last_verified: string | null;
};

type ScanClaim = {
  question: string;
  response: string;
};

function conflictClaims(product: ProductRecord, claims: ScanClaim[]) {
  const conflicts = new Set<string>();
  if (!product.name) return [];
  const productName = product.name.toLowerCase();
  const matchingClaims = claims.filter(
    (claim) =>
      claim.question.toLowerCase().includes(productName) ||
      claim.response.toLowerCase().includes(productName),
  );

  for (const claim of matchingClaims) {
    const answer = claim.response.includes("[SIMULATED DEMO RESPONSE")
      ? claim.response.split("\n").slice(2).join(" ")
      : claim.response;

    if (product.current_price != null) {
      const expectedPrice = Number(product.current_price);
      const mentionedPrices = Array.from(
        answer.matchAll(/\$\s*([\d,]+(?:\.\d{1,2})?)/g),
        (match) => Number(match[1].replace(/,/g, "")),
      );
      if (mentionedPrices.some((price) => Number.isFinite(price) && Math.abs(price - expectedPrice) > 0.01)) {
        conflicts.add("price claim differs from the current product price");
      }
    }

    if (product.ram_gb != null) {
      const ramClaims = Array.from(answer.matchAll(/\b(\d+)\s*GB\s*RAM\b/gi), (match) => Number(match[1]));
      if (ramClaims.some((ram) => ram !== product.ram_gb)) {
        conflicts.add("RAM claim differs from the product record");
      }
    }

    if (product.warranty_months != null) {
      const monthClaim = answer.match(/\b(\d+)\s*[- ]?months?\s+warranty\b/i);
      const dayClaim = answer.match(/\b(\d+)\s*[- ]?days?\s+warranty\b/i);
      const warrantyClaim = monthClaim
        ? Number(monthClaim[1])
        : dayClaim
          ? Number(dayClaim[1]) / 30
          : null;
      if (warrantyClaim != null && Math.abs(warrantyClaim - product.warranty_months) > 0.1) {
        conflicts.add("warranty claim differs from the product record");
      }
    }

    if (product.stock_status) {
      const stock = product.stock_status.toLowerCase().replace(/[_-]+/g, " ");
      const expectedOut = /out of stock|unavailable|sold out/.test(stock);
      const claimsOut = /out of stock|unavailable|sold out/.test(answer.toLowerCase());
      const claimsIn = /\bin stock\b|\bavailable\b/i.test(answer) && !claimsOut;
      if ((claimsOut && !expectedOut) || (claimsIn && expectedOut)) {
        conflicts.add("availability claim differs from the product record");
      }
    }
  }

  return Array.from(conflicts);
}

function isStale(lastVerified: string | null) {
  if (!lastVerified) return true;
  const verifiedAt = new Date(lastVerified).getTime();
  return !Number.isFinite(verifiedAt) || Date.now() - verifiedAt > 90 * 24 * 60 * 60 * 1000;
}

function toFeedItem(product: ProductRecord, conflicts: string[]): ProductFeedItem {
  const readiness = [
    { label: "Name", complete: Boolean(product.name?.trim()) },
    { label: "Price", complete: product.current_price != null && Boolean(product.currency?.trim()) },
    { label: "Availability", complete: Boolean(product.stock_status?.trim()) },
    {
      label: "Specifications",
      complete:
        Boolean(product.processor?.trim()) &&
        product.ram_gb != null &&
        product.storage_gb != null &&
        product.screen_size != null,
    },
    { label: "Warranty", complete: product.warranty_months != null },
    { label: "Return policy", complete: product.return_days != null },
  ];

  const status: FeedStatus = conflicts.length
    ? "Conflict detected"
    : readiness.some((field) => !field.complete)
      ? "Missing field"
      : isStale(product.last_verified)
        ? "Needs update"
        : "Healthy";

  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    currentPrice:
      product.current_price == null
        ? null
        : `${product.currency ?? ""} ${product.current_price}`.trim(),
    stock: product.stock_status,
    ram: product.ram_gb == null ? null : `${product.ram_gb} GB`,
    storage: product.storage_gb == null ? null : `${product.storage_gb} GB`,
    warranty: product.warranty_months == null ? null : `${product.warranty_months} months`,
    returnPeriod: product.return_days == null ? null : `${product.return_days} days`,
    lastVerified: product.last_verified,
    status,
    conflicts,
    readiness,
  };
}

export default async function ProductFeedPage() {
  const supabase = await createClient();
  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id")
    .eq("name", activeBusinessName)
    .limit(1)
    .maybeSingle();

  if (businessError) {
    return (
      <ProductFeedView
        products={[]}
        conflictsUnavailable
        error={`Unable to load LunaTech business: ${businessError.message}`}
      />
    );
  }

  if (!business) {
    return (
      <ProductFeedView
        products={[]}
        conflictsUnavailable
        error={`Business "${activeBusinessName}" was not found or is not visible to this account.`}
      />
    );
  }

  const products: ProductRecord[] = [];
  let offset = 0;
  let productError: string | null = null;

  while (true) {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, sku, current_price, currency, stock_status, processor, ram_gb, storage_gb, screen_size, warranty_months, return_days, last_verified")
      .eq("business_id", business.id)
      .order("id")
      .range(offset, offset + productPageSize - 1);

    if (error) {
      productError = `Unable to load LunaTech products: ${error.message}`;
      break;
    }

    products.push(...((data ?? []) as ProductRecord[]));
    if (!data || data.length < productPageSize) break;
    offset += productPageSize;
  }

  let conflictsUnavailable = false;
  let scanClaims: ScanClaim[] = [];
  const { data: latestScan, error: scanError } = await supabase
    .from("scans")
    .select("id")
    .eq("business_id", business.id)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (scanError || !latestScan) {
    conflictsUnavailable = true;
  } else {
    const { data: responses, error: responsesError } = await supabase
      .from("responses")
      .select("question_id, response_text")
      .eq("scan_id", latestScan.id);

    if (responsesError) {
      conflictsUnavailable = true;
    } else if (responses?.length) {
      const questionIds = [...new Set(responses.map((response) => response.question_id))];
      const { data: questions, error: questionsError } = await supabase
        .from("questions")
        .select("id, question_text")
        .in("id", questionIds);

      if (questionsError) {
        conflictsUnavailable = true;
      } else {
        const questionById = new Map((questions ?? []).map((question) => [question.id, question.question_text]));
        scanClaims = responses.map((response) => ({
          question: questionById.get(response.question_id) ?? "",
          response: response.response_text ?? "",
        }));
      }
    }
  }

  const feedItems = products.map((product) =>
    toFeedItem(product, conflictClaims(product, scanClaims)),
  );

  return (
    <ProductFeedView
      products={feedItems}
      conflictsUnavailable={conflictsUnavailable}
      error={productError}
    />
  );
}
