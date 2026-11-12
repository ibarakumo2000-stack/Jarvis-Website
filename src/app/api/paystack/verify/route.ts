import { NextRequest, NextResponse } from "next/server";
import {
  createDownloadToken,
  findPurchase,
  grantEntitlement,
  paystackRequest,
  subscriptionExpiry,
  updatePurchase,
  type PurchasePlan,
} from "@/lib/payments";

export const runtime = "nodejs";

type VerifyResponse = {
  status: boolean;
  data?: {
    status?: string;
    reference?: string;
    amount?: number;
    currency?: string;
    customer?: { email?: string };
    plan_object?: { plan_code?: string };
    plan?: { plan_code?: string };
    subscription?: { next_payment_date?: string };
  };
};

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference") ?? "";
  if (!/^[A-Za-z0-9.=\-_]{8,100}$/.test(reference)) {
    return NextResponse.redirect(new URL("/pricing?payment=invalid", request.url));
  }

  try {
    const purchase = await findPurchase(reference);
    if (!purchase) return NextResponse.redirect(new URL("/pricing?payment=not-found", request.url));

    const verified = await paystackRequest<VerifyResponse>(`/transaction/verify/${encodeURIComponent(reference)}`);
    const payment = verified.data;
    if (!verified.status || payment?.status !== "success" || payment.reference !== reference) {
      await updatePurchase(reference, { status: "failed" });
      return NextResponse.redirect(new URL("/pricing?payment=failed", request.url));
    }

    const paidEmail = payment.customer?.email?.toLowerCase();
    if (!paidEmail || paidEmail !== purchase.email.toLowerCase() || payment.currency !== purchase.currency) {
      await updatePurchase(reference, { status: "review" });
      return NextResponse.redirect(new URL("/pricing?payment=review", request.url));
    }

    if (payment.amount !== purchase.amount) {
      await updatePurchase(reference, { status: "review" });
      return NextResponse.redirect(new URL("/pricing?payment=review", request.url));
    }

    const plan = purchase.plan as PurchasePlan;
    const expiresAt = plan === "lifetime"
      ? null
      : subscriptionExpiry(plan, payment.subscription?.next_payment_date);
    await grantEntitlement({
      email: purchase.email,
      plan,
      product_version: plan === "lifetime" ? "56.0.0" : "latest",
      status: "active",
      expires_at: expiresAt,
    });
    await updatePurchase(reference, { status: "success" });

    const response = NextResponse.redirect(new URL("/purchase/success", request.url));
    response.cookies.set("jarvis_download_token", createDownloadToken(purchase.email, reference), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/download",
      maxAge: 30 * 60,
    });
    return response;
  } catch (error) {
    console.error("[payment verification]", error);
    return NextResponse.redirect(new URL("/pricing?payment=verification-error", request.url));
  }
}
