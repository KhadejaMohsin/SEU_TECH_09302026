import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

const pageSize = 1000;

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-7xl p-6">
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="mt-4 text-sm text-muted-foreground">Loading products...</p>
        </main>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

async function ProductsContent() {
  const supabase = await createClient();
  const products = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabase
      .from("products")
      .select(
        "id, name, category, current_price, currency, stock_status, processor, ram_gb, storage_gb, warranty_months",
      )
      .order("id")
      .range(offset, offset + pageSize - 1);

    if (error) {
      return (
        <main className="mx-auto w-full max-w-7xl p-6">
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="mt-4 text-sm text-destructive">
            Unable to load products: {error.message}
          </p>
        </main>
      );
    }

    products.push(...(data ?? []));

    if (!data || data.length < pageSize) {
      break;
    }

    offset += pageSize;
  }

  return (
    <main className="mx-auto w-full max-w-7xl p-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 text-right font-medium">Current price</th>
              <th className="px-4 py-3 font-medium">Stock status</th>
              <th className="px-4 py-3 font-medium">Processor</th>
              <th className="px-4 py-3 text-right font-medium">RAM (GB)</th>
              <th className="px-4 py-3 text-right font-medium">Storage (GB)</th>
              <th className="px-4 py-3 text-right font-medium">Warranty (months)</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-10 text-center text-muted-foreground"
                  colSpan={8}
                >
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr className="border-t" key={product.id}>
                  <td className="px-4 py-3 font-medium">{product.name ?? "-"}</td>
                  <td className="px-4 py-3">{product.category ?? "-"}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {product.current_price == null
                      ? "-"
                      : `${product.current_price} ${product.currency ?? ""}`.trim()}
                  </td>
                  <td className="px-4 py-3">{product.stock_status ?? "-"}</td>
                  <td className="px-4 py-3">{product.processor ?? "-"}</td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {product.ram_gb ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {product.storage_gb ?? "-"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {product.warranty_months ?? "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}