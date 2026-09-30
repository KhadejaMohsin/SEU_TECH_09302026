import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return new NextResponse(null, { status: 404 });
  }

  const supabase = await createClient();
  const { data, error: authError } = await supabase.auth.getClaims();

  if (authError || !data?.claims) {
    return NextResponse.json(
      {
        businessFound: false,
        businessId: null,
        activeQuestions: [],
        error: "An authenticated session is required.",
      },
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
        businessFound: false,
        businessId: null,
        activeQuestions: [],
        error: `Unable to query public.businesses: ${businessError.message}`,
        code: businessError.code,
      },
      { status: 500 },
    );
  }

  if (!business) {
    return NextResponse.json({
      businessFound: false,
      businessId: null,
      activeQuestions: [],
    });
  }

  const activeQuestions = [];
  let offset = 0;
  const pageSize = 1000;

  while (true) {
    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("id, question_text, persona, category, active, created_at")
      .eq("business_id", business.id)
      .eq("active", true)
      .order("id")
      .range(offset, offset + pageSize - 1);

    if (questionsError) {
      return NextResponse.json(
        {
          businessFound: true,
          businessId: business.id,
          activeQuestions: [],
          error: `Unable to query public.questions: ${questionsError.message}`,
          code: questionsError.code,
        },
        { status: 500 },
      );
    }

    activeQuestions.push(...(questions ?? []));

    if (!questions || questions.length < pageSize) {
      break;
    }

    offset += pageSize;
  }

  return NextResponse.json({
    businessFound: true,
    businessId: business.id,
    activeQuestions,
  });
}