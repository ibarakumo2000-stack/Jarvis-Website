import { NextRequest, NextResponse } from "next/server";
import {
  findPurchase,
  getEntitlement,
  grantEntitlement,
  paystackRequest,
  subscriptionExpiry,
  updatePurchase,
  verifyLegacyWebhookSignature,
  type PurchasePlan,
} from "@/lib/payments";

export const runtime = "nodejs";

type PaystackEvent = {
  event?: string;
  data?: {
    reference?: string;
    amount?: number;
    paid?: boolean | number;
    status?: string;
    customer?: { email?: string };
    subscription?: {
      status?: string;
      next_payment_date?: string;
      amount?: number;
      plan?: { plan_code?: string; interval?: string };
    };
    plan?: { plan_code?: string };
    transaction?: { reference?: string; status?: string; amount?: number; currency?: string };
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

function configuredPlan(planCode?: string): "monthly" | "yearly" | null {
  if (!planCode) return null;
  if (planCode === process.env.PAYSTACK_MONTHLY_PLAN_CODE?.trim()) return "monthly";
  if (planCode === process.env.PAYSTACK_YEARLY_PLAN_CODE?.trim()) return "yearly";
  return null;
}

function expectedAmount(plan: "monthly" | "yearly") {
  return plan === "monthly" ? 150_000 : 200_000;
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature") ?? "";
  if (!verifyLegacyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
  }

  try {
    const event = JSON.parse(rawBody) as PaystackEvent;
    const data = event.data;

    // First successful charge: tie the Paystack transaction back to the
    // server-created pending purchase and verify it with Paystack's API.
    if (event.event === "charge.success" && data?.reference) {
      const purchase = await findPurchase(data.reference);
      if (purchase && purchase.status !== "success") {
        const verified = await paystackRequest<VerifyResponse>(
          `/transaction/verify/${encodeURIComponent(data.reference)}`,
        );
        const payment = verified.data;
        if (
          verified.status &&
          payment?.status === "success" &&
          payment.reference === purchase.reference &&
          payment.customer?.email?.toLowerCase() === purchase.email.toLowerCase() &&
          payment.currency === purchase.currency &&
          payment.amount === purchase.amount
        ) {
          const plan = purchase.plan as PurchasePlan;
          await grantEntitlement({
            email: purchase.email,
            plan,
            product_version: plan === "lifetime" ? "56.0.0" : "latest",
            status: "active",
            expires_at:
              plan === "lifetime"
                ? null
                : subscriptionExpiry(plan, payment.subscription?.next_payment_date),
          });
          await updatePurchase(purchase.reference, { status: "success" });
        }
      }
    }

    // Paystack sends invoice.update after each recurring billing attempt.
    // Do not rely on invoice.payment_success: that is not a Paystack event.
    if (event.event === "invoice.update" && data?.customer?.email) {
      const plan = configuredPlan(data.subscription?.plan?.plan_code);
      const amount = data.amount ?? data.subscription?.amount;
      const invoicePaid = data.paid === true || data.paid === 1 || data.status === "success";
      if (plan && invoicePaid && amount === expectedAmount(plan)) {
        const email = data.customer.email.toLowerCase();
        const current = await getEntitlement(email);
        if (current && current.plan !== "lifetime") {
          await grantEntitlement({
            ...current,
            plan,
            product_version: "latest",
            status: "active",
            expires_at: subscriptionExpiry(plan, data.subscription?.next_payment_date),
          });
        }
      }
    }

    const email = data?.customer?.email?.toLowerCase();
    if (email && event.event === "invoice.payment_failed") {
      const current = await getEntitlement(email);
      if (current && current.plan !== "lifetime") {
        await grantEntitlement({ ...current, status: "past_due" });
      }
    }

    if (email && event.event === "subscription.not_renew") {
      const current = await getEntitlement(email);
      if (current && current.plan !== "lifetime") {
        await grantEntitlement({
          ...current,
          status: "active",
          expires_at: data?.subscription?.next_payment_date ?? current.expires_at,
        });
      }
    }

    if (email && event.event === "subscription.disable") {
      const current = await getEntitlement(email);
      if (current && current.plan !== "lifetime") {
        await grantEntitlement({ ...current, status: "inactive" });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Paystack webhook]", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
