// Deterministic fact-check fixtures only; these are not live model responses.
export type DemoProduct = {
  id: string;
  name: string | null;
  sku: string | null;
  category: string | null;
  current_price: number | string | null;
  currency: string | null;
  stock_status: string | null;
  processor: string | null;
  ram_gb: number | null;
  storage_gb: number | null;
  warranty_months: number | null;
};

const simulatedLabel =
  "[SIMULATED DEMO RESPONSE - NOT LIVE AI OUTPUT]";

function formatPrice(amount: number, currency: string | null) {
  return `${currency ?? "USD"} ${amount.toFixed(2)}`;
}

function knownFacts(
  product: DemoProduct,
  exclude: Array<"price" | "stock" | "processor" | "ram" | "storage" | "warranty"> = [],
) {
  const include = (field: (typeof exclude)[number]) => !exclude.includes(field);

  return [
    product.category && `category: ${product.category}`,
    include("price") && product.current_price != null &&
      `listed price: ${formatPrice(Number(product.current_price), product.currency)}`,
    include("stock") && product.stock_status && `stock status: ${product.stock_status}`,
    include("processor") && product.processor && `processor: ${product.processor}`,
    include("ram") && product.ram_gb != null && `memory: ${product.ram_gb} GB RAM`,
    include("storage") && product.storage_gb != null && `storage: ${product.storage_gb} GB`,
    include("warranty") && product.warranty_months != null &&
      `warranty: ${product.warranty_months} months`,
  ].filter(Boolean);
}

function oppositeStockStatus(stockStatus: string | null) {
  const currentStatus = stockStatus?.toLowerCase() ?? "";
  return /out|unavailable|sold/.test(currentStatus) ? "in stock" : "out of stock";
}

export function createDemoResponse(
  question: string,
  product: DemoProduct,
  index: number,
) {
  const name = product.name ?? "this LunaTech product";
  const facts = knownFacts(product);
  const contextExcept = (
    exclude: Array<"price" | "stock" | "processor" | "ram" | "storage" | "warranty">,
  ) => {
    const contextFacts = knownFacts(product, exclude);
    return contextFacts.length
      ? `Other catalog details: ${contextFacts.join("; ")}.`
      : "The product details are limited in the current catalog.";
  };
  const actualPrice = Number(product.current_price);
  const actualRam = product.ram_gb;
  const actualWarranty = product.warranty_months;

  let answer: string;

  switch (index) {
    case 0:
      answer = `For ${name}, the catalog lists ${facts.join(", ") || "limited product details"}.`;
      break;
    case 1:
      answer =
        product.current_price != null
          ? `${name} is currently priced at ${formatPrice(actualPrice * 1.18, product.currency)}. ${contextExcept(["price"])}`
          : `${name} is available in the ${product.category ?? "LunaTech"} range. ${contextExcept([])}`;
      break;
    case 2:
      answer =
        product.current_price != null
          ? `${name} is currently listed at ${formatPrice(actualPrice * 0.82, product.currency)}. This is an older price and does not reflect the current listing. ${contextExcept(["price"])}`
          : `${name} is a ${product.category ?? "LunaTech"} product, and availability should be checked against the current catalog.`;
      break;
    case 3:
      answer =
        actualRam != null
          ? `${name} comes with ${actualRam + 8} GB RAM. ${contextExcept(["ram"])}`
          : `${name} is a ${product.category ?? "LunaTech"} product. ${contextExcept([])}`;
      break;
    default: {
      const claims = [
        actualWarranty != null && `a ${actualWarranty + 12}-month warranty`,
        product.stock_status && `a stock status of ${oppositeStockStatus(product.stock_status)}`,
      ].filter(Boolean);
      answer = `${name} is listed with ${claims.join(" and ") || "standard product coverage and availability"}. ${contextExcept(["warranty", "stock"])}`;
    }
  }

  return `${simulatedLabel}\nQuestion: ${question}\n${answer}`;
}
