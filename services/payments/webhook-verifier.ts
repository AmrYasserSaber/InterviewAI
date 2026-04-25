import { verifyPayPalSignature } from "@/services/payments/paypal";
export function verifyPayPalWebhook(params: { headers: Record<string, string>; rawBody: string; webhookId: string }) {
  return verifyPayPalSignature({
    auth_algo: params.headers["paypal-auth-algo"],
    cert_url: params.headers["paypal-cert-url"],
    transmission_id: params.headers["paypal-transmission-id"],
    transmission_sig: params.headers["paypal-transmission-sig"],
    transmission_time: params.headers["paypal-transmission-time"],
    webhook_id: params.webhookId,
    webhook_event: JSON.parse(params.rawBody),
  });
}
