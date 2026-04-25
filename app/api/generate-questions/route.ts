import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { generateQuestions } from "@/services/ai/generate";
import { GenerateRequestSchema } from "@/utils/validators";
import { TOTAL_QUESTIONS } from "@/utils/constants";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = GenerateRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "unknown";
  const userId = await getCurrentUserId();

  const result = await generateQuestions({ ...parsed.data, ipAddress: ip, userId });
  return NextResponse.json({
    requestId: result.requestId,
    questions: result.questions.map((q) => ({ position: q.position, content: q.content })),
    totalQuestions: TOTAL_QUESTIONS,
    unlockedCount: result.questions.length,
    fromCache: result.fromCache,
  });
}
