import { prisma } from "@/lib/db";
import { NotFoundError } from "@/lib/errors";

export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export async function getQuestionsForRequest(requestId: string, viewerUserId: string | null) {
  const request = await prisma.interviewRequest.findUnique({
    where: { id: requestId },
    include: { questions: { orderBy: { position: "asc" } }, payment: true },
  });
  if (!request) {
    throw new NotFoundError("Request not found");
  }

  // Ownership: requests attached to a user are viewable only by that user.
  // Anonymous requests (userId = null) remain viewable to anyone with the link.
  if (request.userId && request.userId !== viewerUserId) {
    throw new ForbiddenError();
  }

  const isPaid = request.payment?.status === "CAPTURED" && request.payment.capturedAt !== null;

  return {
    unlocked: isPaid,
    questions: request.questions
      .filter((q) => !q.isLocked || isPaid)
      .map((q) => ({ position: q.position, content: q.content })),
  };
}
