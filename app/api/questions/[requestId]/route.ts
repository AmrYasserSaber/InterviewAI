import { NextResponse } from "next/server";
import { NotFoundError } from "@/lib/errors";
import { getCurrentUserId } from "@/lib/current-user";
import { ForbiddenError, getQuestionsForRequest } from "@/services/questions/gate";

export async function GET(_: Request, { params }: { params: Promise<{ requestId: string }> }) {
  const { requestId } = await params;
  try {
    const viewerUserId = await getCurrentUserId();
    const data = await getQuestionsForRequest(requestId, viewerUserId);
    return NextResponse.json(
      { requestId, unlocked: data.unlocked, questions: data.questions },
      { headers: { "Cache-Control": "private, max-age=0, must-revalidate" } },
    );
  } catch (error) {
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (error instanceof ForbiddenError) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}
