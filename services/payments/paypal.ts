const BASE_URL = process.env.NODE_ENV === "production" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
async function token() {
  const credentials = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}
export async function createPayPalOrder(requestId: string) {
  const t = await token();
  const paypalRequestId = `${requestId}-${crypto.randomUUID()}`;
  const res = await fetch(`${BASE_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json", "PayPal-Request-Id": paypalRequestId },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: requestId,
          amount: { currency_code: "USD", value: process.env.PRODUCT_PRICE_USD ?? "4.99" },
          description: "Interview Questions Unlock",
        },
      ],
      application_context: {
        brand_name: "InterviewAI",
        user_action: "PAY_NOW",
      },
    }),
  });
  const order = (await res.json()) as { id?: string; message?: string; links?: Array<{ rel: string; href: string }> };
  if (!res.ok || !order.id) {
    throw new Error(order.message ?? "PayPal order creation failed");
  }
  const approveUrl = order.links?.find((l) => l.rel === "approve")?.href ?? "";
  if (!approveUrl) {
    throw new Error("PayPal did not return an approval URL");
  }
  return { id: order.id, approveUrl };
}
export async function capturePayPalOrder(orderId: string) {
  const t = await token();
  // PayPal requires Content-Type: application/json and a JSON body (use {} for default capture)
  const res = await fetch(`${BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${t}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({}),
  });
  const data = (await res.json()) as {
    status?: string;
    message?: string;
    details?: Array<{ issue?: string; description?: string }>;
    purchase_units?: Array<{ payments?: { captures?: Array<{ id: string }> } }>;
  };
  if (!res.ok) {
    const issue = data.details?.[0]?.issue;
    if (issue === "ORDER_ALREADY_CAPTURED") {
      const orderRes = await fetch(`${BASE_URL}/v2/checkout/orders/${orderId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${t}` },
      });
      const orderData = (await orderRes.json()) as {
        status?: string;
        purchase_units?: Array<{ payments?: { captures?: Array<{ id: string }> } }>;
      };
      if (orderRes.ok) {
        return {
          captureId: orderData.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? "",
          status: orderData.status ?? "COMPLETED",
        };
      }
    }
    const description = data.details?.[0]?.description;
    throw new Error(description ?? data.message ?? issue ?? "PayPal capture request failed");
  }
  return { captureId: data.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? "", status: data.status ?? "UNKNOWN" };
}
export async function verifyPayPalSignature(payload: Record<string, unknown>) {
  const t = await token();
  const res = await fetch(`${BASE_URL}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as { verification_status: string };
  return data.verification_status === "SUCCESS";
}
