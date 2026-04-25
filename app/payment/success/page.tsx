import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Payment Successful — InterviewAI",
};

type SearchParams = Promise<{ requestId?: string; orderId?: string }>;

async function fetchPayment(params: { requestId?: string; orderId?: string }) {
  try {
    if (params.orderId) {
      return prisma.payment.findUnique({ where: { orderId: params.orderId } });
    }
    if (params.requestId) {
      return prisma.payment.findUnique({ where: { requestId: params.requestId } });
    }
  } catch {
    return null;
  }
  return null;
}

export default async function PaymentSuccessPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const payment = await fetchPayment(params);

  const amount = payment?.amountUSD ? `$${payment.amountUSD.toString()}` : "$5.00";
  const transactionId = payment?.captureId ?? params.orderId ?? "Pending";
  const date = payment?.capturedAt
    ? new Date(payment.capturedAt).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });

  return (
    <main className="flex-grow flex items-center justify-center p-gutter">
      <div className="w-full max-w-2xl bg-surface-container rounded-xl shadow-neumorphic p-card-padding border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-container to-transparent opacity-50" />

        <div className="text-center mb-8">
          <Icon
            name="check_circle"
            filled
            className="text-primary-container text-5xl mb-4 drop-shadow-[0_0_12px_rgba(0,245,255,0.6)]"
            size={48}
          />
          <h1 className="font-headline-md text-headline-md text-on-surface mb-2">Payment Successful</h1>
          <p className="font-body-base text-body-base text-on-surface-variant">
            Your transaction has been processed. Your questions are unlocked.
          </p>
        </div>

        <div className="bg-surface-container-low rounded-lg shadow-neumorphic-inset-soft p-6 mb-8 border border-white/5">
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-white/5">
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Amount Paid</span>
              <span className="font-headline-md text-headline-md text-primary-container">{amount}</span>
            </div>
            <div className="text-right">
              <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Date</span>
              <span className="font-body-base text-body-base text-on-surface">{date}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Transaction ID</span>
              <span className="font-body-base text-body-base text-on-surface font-mono bg-surface px-2 py-1 rounded">
                {transactionId}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Product</span>
              <span className="font-body-base text-body-base text-on-surface">
                Full Interview Question Set (10 Questions)
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Payment Method</span>
              <span className="font-body-base text-body-base text-on-surface flex items-center gap-2">
                <Icon name="payments" className="text-on-surface-variant text-sm" />
                PayPal
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {params.requestId ? (
            <Link href={`/results/${params.requestId}`}>
              <Button variant="neon">
                <Icon name="visibility" className="text-sm" />
                View Questions
              </Button>
            </Link>
          ) : null}
          <Link href="/dashboard">
            <Button variant="ghost">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
