import { createClient } from "@/lib/supabase/server";
import { probeQuestion } from "@/lib/ai/openai";
import { NextResponse } from "next/server";

const questionLimit = 5;

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

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown OpenAI error.";
}

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse(null, { status: 404 });
  }

  const supabase = await createClient();
  const { data, error: authError } = await supabase.auth.getClaims();

  if (authError || !data?.claims) {
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
      provider: "openai",
      started_at: new Date().toISOString(),
    })
    .select("id, business_id, status, provider, started_at, completed_at, created_at")
    .single();

  if (scanError) {
    const rlsInsertDenied =
      scanError.code === "42501" || /row-level security/i.test(scanError.message);

    return NextResponse.json(
      {
        error: scanError.message,
        code: scanError.code,
        table: "public.scans",
        operation: "INSERT",
        ...(rlsInsertDenied
          ? {
              missingPolicy:
                "An authenticated INSERT policy on public.scans with a WITH CHECK condition allowing this business_id.",
            }
          : {}),
      },
      { status: 500 },
    );
  }

  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("id, question_text")
    .eq("business_id", business.id)
    .eq("active", true)
    .order("id")
    .limit(questionLimit);

  if (questionsError) {
    const { data: failedScan, error: statusError } = await updateScanStatus(
      supabase,
      scan.id,
      "failed",
    );

    return NextResponse.json(
      {
        error: `Unable to query active questions: ${questionsError.message}`,
        code: questionsError.code,
        table: "public.questions",
        operation: "SELECT",
        scan: failedScan ?? scan,
        ...(statusError ? { statusUpdateError: statusError.message } : {}),
      },
      { status: 500 },
    );
  }

  if (!questions || questions.length !== questionLimit) {
    const { data: failedScan, error: statusError } = await updateScanStatus(
      supabase,
      scan.id,
      "failed",
    );

    return NextResponse.json(
      {
        error: `Expected ${questionLimit} active LunaTech questions, found ${questions?.length ?? 0}.`,
        scan: failedScan ?? scan,
        ...(statusError ? { statusUpdateError: statusError.message } : {}),
      },
      { status: 422 },
    );
  }

  let responsesSaved = 0;

  for (const question of questions) {
    let probe: Awaited<ReturnType<typeof probeQuestion>>;

    try {
      probe = await probeQuestion(question.question_text);
    } catch (error: unknown) {
      const { data: failedScan, error: statusError } = await updateScanStatus(
        supabase,
        scan.id,
        "failed",
      );

      return NextResponse.json(
        {
          error: `OpenAI failed for question ${question.id}: ${errorMessage(error)}`,
          scan: failedScan ?? scan,
          responsesSaved,
          ...(statusError ? { statusUpdateError: statusError.message } : {}),
        },
        { status: 502 },
      );
    }

    const { error: responseError } = await supabase.from("responses").insert({
      scan_id: scan.id,
      question_id: question.id,
      provider: probe.provider,
      model: probe.model,
      run_number: 1,
      response_text: probe.responseText,
    });

    if (responseError) {
      const { data: failedScan, error: statusError } = await updateScanStatus(
        supabase,
        scan.id,
        "failed",
      );
      const rlsInsertDenied =
        responseError.code === "42501" || /row-level security/i.test(responseError.message);

      return NextResponse.json(
        {
          error: `Unable to insert response for question ${question.id}: ${responseError.message}`,
          code: responseError.code,
          table: "public.responses",
          operation: "INSERT",
          ...(rlsInsertDenied
            ? {
                missingPolicy:
                  "An authenticated INSERT policy on public.responses with a WITH CHECK condition allowing this scan_id and question_id.",
              }
            : {}),
          scan: failedScan ?? scan,
          responsesSaved,
          ...(statusError ? { statusUpdateError: statusError.message } : {}),
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
    const rlsUpdateDenied =
      completionError.code === "42501" || /row-level security/i.test(completionError.message);

    return NextResponse.json(
      {
        error: `All ${responsesSaved} responses were saved, but the scan could not be marked completed: ${completionError.message}`,
        code: completionError.code,
        table: "public.scans",
        operation: "UPDATE",
        ...(rlsUpdateDenied
          ? {
              missingPolicy:
                "An authenticated UPDATE policy on public.scans with a USING condition and WITH CHECK condition allowing this scan.",
            }
          : {}),
        scan,
        responsesSaved,
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { scan: completedScan, responsesSaved },
    { status: 200 },
  );
}
