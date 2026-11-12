import { NextRequest, NextResponse } from "next/server";
import {
  createPendingPurchase,
  getPlanConfiguration,
  newPaymentReference,
  paystackRequest,
  type PurchasePlan,
} from "@/lib/payments";

export const runtime = "nodejs";

type InitializeResponse = {
  status: boolean;
  data?: { authorization_url?: string; reference?: string };
};

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Cross-origin checkout requests are not allowed." }, { status: 403 });
  }
  try {
    const body = await request.json() as { email?: unknown; plan?: unknown };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const plan = body.plan as PurchasePlan;
    if (!/^\S+@\S+\.\S+$/.test(email) || !["lifetime", "monthly", "yearly"].includes(plan)) {
      return NextResponse.json({ error: "Enter a valid email and choose a JARVIS plan." }, { status: 400 });
    }

    const config = getPlanConfiguration(plan);
    if (!config.configured) {
      return NextResponse.json({ error: "This plan is not ready for checkout yet. Please try again later." }, { status: 503 });
    }

    const reference = newPaymentReference();
    await createPendingPurchase({
      reference,
      email,
      plan,
      product_version: config.productVersion,
      status: "pending",
      amount: config.amount,
      currency: config.currency,
    });

    const callbackUrl = new URL("/api/paystack/verify", request.nextUrl.origin).toString();
    const payload: Record<string, unknown> = {
      email,
      currency: config.currency,
      reference,
      callback_url: callbackUrl,
      metadata: { product: "JARVIS Desktop", plan, product_version: config.productVersion, reference },
    };
    if (plan === "lifetime") payload.amount = config.amount;
    else payload.plan = config.planCode;

    const initialized = await paystackRequest<InitializeResponse>("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const authorizationUrl = initialized.data?.authorization_url;
    if (!authorizationUrl || !authorizationUrl.startsWith("https://checkout.paystack.com/")) {
      return NextResponse.json({ error: "The payment provider did not return a valid checkout link." }, { status: 502 });
    }
    return NextResponse.json({ authorizationUrl });
  } catch (error) {
    console.error("[checkout]", error);
    return NextResponse.json({ error: "We could not start checkout. Please try again." }, { status: 500 });
  }
}
