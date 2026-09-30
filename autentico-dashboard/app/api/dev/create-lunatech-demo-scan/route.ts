import { createDemoResponse, type DemoProduct } from "@/lib/ai/demo-responses";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const questionLimit = 5;
const demoModel = "saved-demo-v1";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

async function updateScanStatus(
  supabase: SupabaseServerClient,
  scanId: string,
  status: "completed" | "failed",
) {
  return supabase
    .from("scans")
    .update({ status, completed_at: new Date().toISOString() })
    .eq("id", scanId)
    .select("id, business_id, status, provider, started_at, completed_at, created_at")
    .single();
}

function matchesQuestion(product: DemoProduct, questionText: string) {
  const normalizedQuestion = questionText.toLowerCase();
  return [product.name, product.sku].some(
    (value) => value && normalizedQuestion.includes(value.toLowerCase()),
  );
}

function hasScenarioFacts(product: DemoProduct, index: number) {
  if (index === 1 || index === 2) return product.current_price != null;
  if (index === 3) return product.ram_gb != null;
  if (index === 4) {
    return product.warranty_months != null && product.stock_status != null;
  }
  return true;
}

function chooseProduct(
  products: DemoProduct[],
  questionText: string,
  index: number,
) {
  const eligibleProducts = products.filter((product) =>
    hasScenarioFacts(product, index),
  );
  const candidates = eligibleProducts.length > 0 ? eligibleProducts : products;
  return (
    candidates.find((product) => matchesQuestion(product, questionText)) ??
    candidates[index % candidates.length]
  );
}

function isRlsError(error: { code?: string; message: string }) {
  return error.code === "42501" || /row-level security/i.test(error.message);
}

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse(null, { status: 404 });
  }

  const supabase = await createClient();
  const { data: claims, error: authError } = await supabase.auth.getClaims();

  if (authError || !claims?.claims) {
    return NextResponse.json(
      { error: "An authenticated session is required." },
      { status: 401 },
    );
  }

  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("name", "LunaTech Electronics")
    .limit(1)
    .maybeSingle();

  if (businessError) {
    return NextResponse.json(
      {
        error: `Unable to query public.businesses: ${businessError.message}`,
        code: businessError.code,
      },
      { status: 500 },
    );
  }

  if (!business) {
    return NextResponse.json(
      { error: 'Business "LunaTech Electronics" was not found.' },
      { status: 404 },
    );
  }

  const { data: scan, error: scanError } = await supabase
    .from("scans")
    .insert({
      business_id: business.id,
      status: "pending",
      provider: "demo",
      started_at: new Date().toISOString(),
    })
    .select("id, business_id, status, provider, started_at, completed_at, created_at")
    .single();

  if (scanError) {
    return NextResponse.json(
      {
        error: scanError.message,
        code: scanError.code,
        table: "public.scans",
        operation: "INSERT",
        ...(isRlsError(scanError)
          ? {
              missingPolicy:
                "An authenticated INSERT policy on public.scans with a WITH CHECK condition allowing this business_id.",
            }
          : {}),
      },
      { status: 500 },
    );
  }

  const failScan = async (message: string, statusCode: number) => {
    const { data: failedScan, error: updateError } = await updateScanStatus(
      supabase,
      scan.id,
      "failed",
    );
    return NextResponse.json(
      {
        error: message,
        scan: failedScan ?? scan,
        ...(updateError ? { statusUpdateError: updateError.message } : {}),
      },
      { status: statusCode },
    );
  };

  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("id, question_text")
    .eq("business_id", business.id)
    .eq("active", true)
    .order("id")
    .limit(questionLimit);

  if (questionsError) {
    return failScan(
      `Unable to query active questions: ${questionsError.message}`,
      500,
    );
  }

  if (!questions || questions.length !== questionLimit) {
    return failScan(
      `Expected ${questionLimit} active LunaTech questions, found ${questions?.length ?? 0}.`,
      422,
    );
  }

  const { data: productRows, error: productsError } = await supabase
    .from("products")
    .select(
      "id, name, sku, category, current_price, currency, stock_status, processor, ram_gb, storage_gb, warranty_months",
    )
    .eq("business_id", business.id)
    .order("id")
    .limit(1000);

  if (productsError) {
    return failScan(
      `Unable to query LunaTech products: ${productsError.message}`,
      500,
    );
  }

  const products = (productRows ?? []) as DemoProduct[];

  if (products.length === 0) {
    return failScan("No LunaTech products are available for demo responses.", 422);
  }

  for (let index = 1; index < questionLimit; index += 1) {
    if (!products.some((product) => hasScenarioFacts(product, index))) {
      return failScan(
        `Demo scenario ${index + 1} requires matching catalog facts that are missing from LunaTech products.`,
        422,
      );
    }
  }

  let responsesSaved = 0;

  for (let index = 0; index < questions.length; index += 1) {
    const question = questions[index];
    const product = chooseProduct(products, question.question_text, index);
    const responseText = createDemoResponse(
      question.question_text,
      product,
      index,
    );

    const { error: responseError } = await supabase.from("responses").insert({
      scan_id: scan.id,
      question_id: question.id,
      provider: "demo",
      model: demoModel,
      run_number: 1,
      response_text: responseText,
    });

    if (responseError) {
      const { data: failedScan, error: updateError } = await updateScanStatus(
        supabase,
        scan.id,
        "failed",
      );
      return NextResponse.json(
        {
          error: `Unable to save simulated response: ${responseError.message}`,
          code: responseError.code,
          table: "public.responses",
          operation: "INSERT",
          ...(isRlsError(responseError)
            ? {
                missingPolicy:
                  "An authenticated INSERT policy on public.responses with a WITH CHECK condition allowing this scan_id and question_id.",
              }
            : {}),
          scan: failedScan ?? scan,
          responsesSaved,
          ...(updateError ? { statusUpdateError: updateError.message } : {}),
        },
        { status: 500 },
      );
    }

    responsesSaved += 1;
  }

  const { data: completedScan, error: completionError } = await updateScanStatus(
    supabase,
    scan.id,
    "completed",
  );

  if (completionError) {
    return NextResponse.json(
      {
        error: `All ${responsesSaved} simulated responses were saved, but the scan could not be completed: ${completionError.message}`,
        code: completionError.code,
        table: "public.scans",
        operation: "UPDATE",
        scan,
        responsesSaved,
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { scan: completedScan, responsesSaved, simulated: true },
    { status: 200 },
  );
}
