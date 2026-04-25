import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { unlockQuestions } from "@/services/payments/unlock";
import { verifyPayPalWebhook } from "@/services/payments/webhook-verifier";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const headers = Object.fromEntries(req.headers.entries());
  const isValid = await verifyPayPalWebhook({ headers, rawBody, webhookId: process.env.PAYPAL_WEBHOOK_ID ?? "" });
  if (!isValid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const event = JSON.parse(rawBody) as {
    id: string;
    event_type: string;
    resource: {
      id: string;
      supplementary_data?: { related_ids?: { order_id?: string } };
    };
  };
  if (await prisma.payment.findFirst({ where: { webhookEventId: event.id } })) return NextResponse.json({ received: true });

  const isOrderApproved = event.event_type === "CHECKOUT.ORDER.APPROVED";
  const isCaptureCompleted = event.event_type === "PAYMENT.CAPTURE.COMPLETED";
  const isCaptureDeclined = event.event_type === "PAYMENT.CAPTURE.DECLINED";
  if (!isOrderApproved && !isCaptureCompleted && !isCaptureDeclined) return NextResponse.json({ received: true });

  const orderId = isOrderApproved ? event.resource.id : event.resource.supplementary_data?.related_ids?.order_id;
  if (!orderId) return NextResponse.json({ received: true });

  const payment = await prisma.payment.findUnique({ where: { orderId } });
  if (!payment) return NextResponse.json({ received: true });

  if (isCaptureDeclined) {
    await prisma.payment.update({
      where: { requestId: payment.requestId },
      data: { status: "FAILED", webhookEventId: event.id },
    });
    return NextResponse.json({ received: true });
  }

  if (isOrderApproved) {
    // Do not overwrite final states when this event arrives out-of-order.
    if (payment.status === "CAPTURED" || payment.status === "FAILED") {
      return NextResponse.json({ received: true });
    }
    await prisma.payment.update({
      where: { requestId: payment.requestId },
      data: { status: "APPROVED", webhookEventId: event.id },
    });
    return NextResponse.json({ received: true });
  }

  if (payment.status === "CAPTURED") return NextResponse.json({ received: true });
  await unlockQuestions(payment.requestId, event.resource.id, event.id);
  return NextResponse.json({ received: true });
}
