import { NextRequest, NextResponse } from "next/server";
import {
  findPurchase,
  getEntitlement,
  grantEntitlement,
  paystackRequest,
  subscriptionExpiry,
  updatePurchase,
  verifyLegacyWebhookSignature,
  verifyTimestampedWebhookSignature,
  type PurchasePlan,
} from "@/lib/payments";

export const runtime = "nodejs";

type PaystackEvent = {
  event?: string;
  data?: {
    reference?: string;
    customer?: { email?: string };
    subscription?: { status?: string; next_payment_date?: string; plan?: { plan_code?: string } };
    plan?: { plan_code?: string };
  };
};

type VerifyResponse = {
  status: boolean;
  data?: {
    status?: string;
    reference?: string;
    amount?: number;
    currency?: string;
    customer?: { email?: string };
    subscription?: { next_payment_date?: string };
  };
};

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const legacy = request.headers.get("x-paystack-signature") ?? "";
  const modern = request.headers.get("paystack-signature") ?? "";
  if (!verifyTimestampedWebhookSignature(rawBody, modern) && !verifyLegacyWebhookSignature(rawBody, legacy)) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  try {
    const event = JSON.parse(rawBody) as PaystackEvent;
    const data = event.data;
    if (event.event === "charge.success" && data?.reference) {
      const purchase = await findPurchase(data.reference);
      if (purchase && purchase.status !== "success") {
        const verified = await paystackRequest<VerifyResponse>(`/transaction/verify/${encodeURIComponent(data.reference)}`);
        const payment = verified.data;
        if (verified.status && payment?.status === "success" &&
            payment.reference === purchase.reference &&
            payment.customer?.email?.toLowerCase() === purchase.email.toLowerCase() &&
            payment.currency === purchase.currency &&
            (purchase.plan !== "lifetime" || payment.amount === purchase.amount)) {
          const plan = purchase.plan as PurchasePlan;
          await grantEntitlement({
            email: purchase.email,
            plan,
            product_version: plan === "lifetime" ? "56.0.0" : "latest",
            status: "active",
            expires_at: plan === "lifetime" ? null : subscriptionExpiry(plan, payment.subscription?.next_payment_date),
          });
          await updatePurchase(purchase.reference, { status: "success" });
        }
      }
    }

    const email = data?.customer?.email?.toLowerCase();
    if (email && event.event === "invoice.payment_success") {
      const current = await getEntitlement(email);
      if (current && current.plan !== "lifetime") {
        await grantEntitlement({
          ...current,
          status: "active",
          expires_at: subscriptionExpiry(current.plan, data?.subscription?.next_payment_date),
        });
      }
    }
    if (email && ["subscription.disable", "subscription.not_renew"].includes(event.event ?? "")) {
      const current = await getEntitlement(email);
      if (current && current.plan !== "lifetime") {
        await grantEntitlement({
          ...current,
          status: event.event === "subscription.disable" ? "inactive" : "active",
        });
      }
    }
    if (email && event.event === "invoice.payment_failed") {
      const current = await getEntitlement(email);
      if (current && current.plan !== "lifetime") {
        await grantEntitlement({ ...current, status: "past_due" });
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Paystack webhook]", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
