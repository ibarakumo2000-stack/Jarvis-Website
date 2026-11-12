import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Crown, Infinity as InfinityIcon, ShieldCheck, Sparkles } from "lucide-react";
import Reveal from "@/components/reveal";
import CheckoutOptions from "@/components/checkout-options";
import { getPricingCatalog } from "@/lib/payments";

export const metadata: Metadata = {
  title: "Choose your JARVIS licence",
  description: "Choose the JARVIS 56.0.0 one-time licence or a subscription for the latest premium JARVIS releases.",
};

const features = {
  lifetime: [
    "Permanent licence for JARVIS 56.0.0",
    "Download the 56.0.0 installer for supported desktop platforms",
    "Use the features included in the 56.0.0 release",
    "No recurring payments",
    "Security fixes for the 56.0.0 product line, where published",
  ],
  premium: [
    "Access to the latest JARVIS premium release",
    "Mark 56.0.2 and eligible future premium releases",
    "New premium capabilities and feature upgrades",
    "Priority feature improvements while subscribed",
    "Subscription entitlement checked before downloads",
  ],
};

export default function PricingPage() {
  const plans = getPricingCatalog();
  const lifetime = plans.find((plan) => plan.plan === "lifetime")!;
  const monthly = plans.find((plan) => plan.plan === "monthly")!;
  const yearly = plans.find((plan) => plan.plan === "yearly")!;
  return (
    <main className="inner-page pricing-page">
      <section className="page-hero section-wrap pricing-hero">
        <Reveal>
          <div className="eyebrow-pill"><span className="pill-spark">✳</span> JARVIS LICENCES</div>
          <h1>Choose how<br /><span>you work.</span></h1>
          <p className="page-lede">Own the classic JARVIS 56.0.0 release once, or subscribe for access to the evolving premium JARVIS experience.</p>
          <div className="download-state-pill"><ShieldCheck size={15} /> Secure checkout · Verified before download</div>
        </Reveal>
        <Reveal className="pricing-hero-note" delay={100}>
          <span className="section-eyebrow"><span className="eyebrow-mark" /> TWO WAYS TO GET JARVIS</span>
          <h2>One assistant.<br /><span>Two licence paths.</span></h2>
          <p>The one-time licence is intentionally tied to the 56.0.0 release. It does not include the premium features introduced in 56.0.2 or later subscription releases.</p>
          <Link className="text-link" href="/features">Compare JARVIS capabilities <ArrowRight size={15}/></Link>
        </Reveal>
      </section>

      <section className="page-content section-wrap pricing-content">
        <div className="pricing-grid">
          <Reveal>
            <article className="pricing-card">
              <div className="pricing-card-top"><span className="pricing-plan-icon"><InfinityIcon size={20}/></span><span className="availability-tag">ONE-TIME LICENCE</span></div>
              <p className="pricing-kicker">JARVIS CLASSIC</p>
              <h2>JARVIS 56.0.0</h2>
              <p className="pricing-description">Pay once. Keep using the classic release permanently.</p>
              <div className="pricing-price">{lifetime.displayPrice || "Price to be announced"}<small> one-time</small></div>
              <ul>{features.lifetime.map((feature) => <li key={feature}><Check size={15}/>{feature}</li>)}</ul>
              <CheckoutOptions plan="lifetime" configured={lifetime.configured} label="Buy JARVIS 56.0.0"/>
              {!lifetime.configured && <p className="pricing-config-note">Checkout will open when the one-time price and payment configuration are added.</p>}
            </article>
          </Reveal>

          <Reveal delay={80}>
            <article className="pricing-card pricing-card-premium">
              <div className="pricing-card-top"><span className="pricing-plan-icon"><Crown size={20}/></span><span className="availability-tag available">PREMIUM ACCESS</span></div>
              <p className="pricing-kicker">JARVIS PREMIUM</p>
              <h2>Latest JARVIS</h2>
              <p className="pricing-description">Keep up with the newest capabilities and premium releases.</p>
              <div className="pricing-price">Subscription<small> monthly or yearly</small></div>
              <ul>{features.premium.map((feature) => <li key={feature}><Sparkles size={15}/>{feature}</li>)}</ul>
              <div className="pricing-subscription-options">
                <div><strong>{monthly.displayPrice || "Monthly price to be configured"}</strong><span>Monthly billing</span><CheckoutOptions plan="monthly" configured={monthly.configured} label="Subscribe monthly"/></div>
                <div><strong>{yearly.displayPrice || "Yearly price to be configured"}</strong><span>Annual billing</span><CheckoutOptions plan="yearly" configured={yearly.configured} label="Subscribe yearly"/></div>
              </div>
              {(!monthly.configured || !yearly.configured) && <p className="pricing-config-note">Monthly and yearly options activate after their Paystack plans and display prices are configured.</p>}
            </article>
          </Reveal>
        </div>
        <p className="pricing-footnote"><ShieldCheck size={15}/> Payment is verified on the server before a download is unlocked. Subscription access can be suspended when the billing period expires or the subscription is disabled.</p>
      </section>
    </main>
  );
}
