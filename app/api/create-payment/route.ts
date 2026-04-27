import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/db";
import { createPayPalOrder, getPayPalEnvironment } from "@/services/payments/paypal";
import { CreatePaymentSchema } from "@/utils/validators";

export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Sign in required to unlock questions." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = CreatePaymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Ensure the current user owns this request. If the request is anonymous,
  // claim it for the current user so payment history aligns.
  const request = await prisma.interviewRequest.findUnique({
    where: { id: parsed.data.requestId },
    select: { id: true, userId: true },
  });
  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }
  if (request.userId && request.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!request.userId) {
    await prisma.interviewRequest.update({
      where: { id: request.id },
      data: { userId },
    });
  }

  let order: { id: string; approveUrl: string };
  try {
    order = await createPayPalOrder(parsed.data.requestId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create PayPal order";
    return NextResponse.json({ error: message, paypalEnv: getPayPalEnvironment() }, { status: 502 });
  }
  await prisma.payment.upsert({
    where: { requestId: parsed.data.requestId },
    update: { orderId: order.id, status: "CREATED" },
    create: {
      requestId: parsed.data.requestId,
      orderId: order.id,
      amountUSD: new Prisma.Decimal(process.env.PRODUCT_PRICE_USD ?? "4.99"),
      currency: "USD",
      status: "CREATED",
    },
  });
  return NextResponse.json({ orderId: order.id, approveUrl: order.approveUrl });
}
