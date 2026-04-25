"use client";

import { useState } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type Props = {
  requestId: string;
  onPaymentStarted: () => void;
};

export function PayPalButton({ requestId, onPaymentStarted }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRedirectFallback, setShowRedirectFallback] = useState(false);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "";

  if (!clientId) {
    return (
      <div className="rounded-lg border border-outline-variant bg-surface-dim/80 p-4 text-center text-body-sm text-on-surface-variant">
        PayPal client ID is not configured. Set <code className="text-primary-fixed-dim">NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> to
        enable checkout.
      </div>
    );
  }

  async function createPaymentSession() {
    setIsLoading(true);
    setError(null);

    const res = await fetch("/api/create-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId }),
    });
    const data = (await res.json()) as { orderId?: string; approveUrl?: string; error?: string };
    if (!res.ok || !data.orderId) {
      setIsLoading(false);
      throw new Error(data.error || "Failed to initialize PayPal checkout");
    }

    return { orderId: data.orderId, approveUrl: data.approveUrl ?? "" };
  }

  async function createOrder() {
    const session = await createPaymentSession();
    return session.orderId;
  }

  async function fallbackRedirectCheckout() {
    const session = await createPaymentSession();
    if (!session.approveUrl) {
      throw new Error("PayPal did not return an approval URL");
    }
    window.location.assign(session.approveUrl);
  }

  async function onApprove(orderId: string) {
    const res = await fetch("/api/capture-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, requestId }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string; status?: string } | null;
      throw new Error(data?.error ?? data?.status ?? "Failed to capture PayPal payment");
    }
    onPaymentStarted();
    setIsLoading(false);
  }

  async function onPaymentError(err: unknown) {
    setIsLoading(false);
    const message = err instanceof Error ? err.message : "Payment failed. Please try again.";
    const isDelegateIssue =
      message.includes("zoid_delegate_paypal_checkout") ||
      message.includes("Unable to delegate rendering") ||
      message.includes("No ack for postMessage");

    if (isDelegateIssue) {
      setShowRedirectFallback(true);
      setError("PayPal popup failed to open. Please allow popups, then try again.");
      return;
    }

    setError(message);
  }

  return (
    <div className="flex flex-col gap-3">
      <PayPalScriptProvider options={{ clientId, currency: "USD", intent: "capture", components: "buttons" }}>
        <div className="flex flex-col gap-3">
          <PayPalButtons
            fundingSource="paypal"
            style={{ layout: "vertical", shape: "pill", label: "paypal" }}
            createOrder={createOrder}
            onApprove={(data) => onApprove(data.orderID)}
            onError={(err) => {
              void onPaymentError(err);
            }}
          />
          <PayPalButtons
            fundingSource="card"
            style={{ layout: "vertical", shape: "pill", label: "pay" }}
            createOrder={createOrder}
            onApprove={(data) => onApprove(data.orderID)}
            onError={(err) => {
              void onPaymentError(err);
            }}
          />
        </div>
      </PayPalScriptProvider>
      {isLoading ? (
        <Button variant="neumorphic" block disabled>
          <Icon name="hourglass_top" />
          Processing payment...
        </Button>
      ) : null}
      {error ? (
        <p className="text-body-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
      {showRedirectFallback ? (
        <Button
          variant="ghost"
          block
          onClick={() => {
            void fallbackRedirectCheckout();
          }}
        >
          <Icon name="open_in_new" />
          Continue in full-page checkout
        </Button>
      ) : null}
    </div>
  );
}
