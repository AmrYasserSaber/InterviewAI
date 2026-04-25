import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { capturePayPalOrder } from "@/services/payments/paypal";
import { unlockQuestions } from "@/services/payments/unlock";
import { CapturePaymentSchema } from "@/utils/validators";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = CapturePaymentSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  let capture: { captureId: string; status: string };
  try {
    capture = await capturePayPalOrder(parsed.data.orderId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to capture PayPal payment";
    await prisma.payment.update({
      where: { orderId: parsed.data.orderId },
      data: { status: "FAILED" },
    }).catch(() => {
      // Best effort: preserve original capture error response even if DB update fails.
    });
    return NextResponse.json({ error: message }, { status: 502 });
  }

  if (capture.status !== "COMPLETED") {
    await prisma.payment.update({
      where: { orderId: parsed.data.orderId },
      data: { status: "FAILED", captureId: capture.captureId || undefined },
    });
    return NextResponse.json(
      { error: `PayPal payment status is ${capture.status}`, captureId: capture.captureId, status: capture.status },
      { status: 409 },
    );
  }

  await unlockQuestions(parsed.data.requestId, capture.captureId);
  return NextResponse.json({ success: true, captureId: capture.captureId, status: capture.status });
}
