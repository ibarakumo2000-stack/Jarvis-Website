"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Download, ShieldCheck } from "lucide-react";

export default function PurchaseSuccessPage() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      // This is a real browser navigation so the endpoint can return a file redirect.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/api/download");
    }, 1100);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="inner-page purchase-success-page">
      <section className="purchase-success-card section-wrap">
        <span className="purchase-success-icon"><CheckCircle2 size={34}/></span>
        <div className="section-eyebrow"><span className="eyebrow-mark"/> PAYMENT CONFIRMED</div>
        <h1>You&apos;re all set.<br/><span>Welcome to JARVIS.</span></h1>
        <p>Your payment has been verified. We&apos;re preparing the correct JARVIS installer for your licence and device.</p>
        <div className="purchase-success-status"><ShieldCheck size={16}/> Secure download authorization active for 30 minutes</div>
        <a className="button button-primary" href="/api/download"><Download size={16}/> Start download now</a>
        <small>If your download does not begin automatically, use the button above. You can also return to the <Link href="/downloads">release centre</Link>.</small>
      </section>
    </main>
  );
}
