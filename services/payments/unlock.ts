import { prisma } from "@/lib/db";
export async function unlockQuestions(requestId: string, captureId: string, webhookEventId?: string) {
  await prisma.$transaction([
    prisma.question.updateMany({ where: { requestId, isLocked: true }, data: { isLocked: false } }),
    prisma.payment.update({
      where: { requestId },
      data: {
        status: "CAPTURED",
        captureId,
        ...(webhookEventId ? { webhookEventId } : {}),
        capturedAt: new Date(),
      },
    }),
  ]);
}
