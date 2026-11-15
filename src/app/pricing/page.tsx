import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Crown, Infinity as InfinityIcon, LockKeyhole, ShieldCheck, Sparkles, CreditCard } from "lucide-react";
import Reveal from "@/components/reveal";
import { getPricingCatalog } from "@/lib/payments";

export const metadata: Metadata = {
  title: "JARVIS plans & pricing",
  description: "Choose JARVIS Classic or JARVIS Premium. Clear one-time and subscription pricing for the JARVIS desktop assistant.",
};

const classicFeatures = [
  "Permanent licence for JARVIS 56.0.0",
  "Download the 56.0.0 installer for supported desktop platforms",
  "Features included in the 56.0.0 release",
  "One payment — no recurring billing",
  "Security fixes for the 56.0.0 product line, where published",
];

const premiumFeatures = [
  "Access to the latest JARVIS premium release",
  "Mark 56.0.2 and eligible future premium releases",
  "New premium capabilities and feature upgrades",
  "Priority feature improvements while subscribed",
  "Subscription entitlement checked before downloads",
];

function PaymentComingSoon() {
  return (
    <div className="payment-coming-soon" aria-live="polite">
      <span className="payment-coming-soon-icon"><LockKeyhole size={15}/></span>
      <span><strong>Secure checkout coming soon</strong><small>Payment activation will follow Paystack account setup.</small></span>
    </div>
  );
}

export default function PricingPage() {
  const plans = getPricingCatalog();
  const lifetime = plans.find((plan) => plan.plan === "lifetime")!;
  const monthly = plans.find((plan) => plan.plan === "monthly")!;
  const yearly = plans.find((plan) => plan.plan === "yearly")!;

  return (
    <main className="inner-page pricing-page">
      <section className="page-hero section-wrap pricing-hero">
        <Reveal>
          <div className="eyebrow-pill"><span className="pill-spark">✳</span> JARVIS PLANS &amp; PRICING</div>
          <h1>The right plan.<br /><span>Your kind of intelligence.</span></h1>
          <p className="page-lede">Start with the classic JARVIS experience or choose Premium for ongoing releases, new capabilities, and continuous improvements.</p>
          <div className="download-state-pill"><ShieldCheck size={15}/> Transparent pricing · Secure payment setup in progress</div>
        </Reveal>
        <Reveal className="pricing-hero-note" delay={100}>
          <span className="section-eyebrow"><span className="eyebrow-mark"/> SIMPLE. CLEAR. YOURS.</span>
          <h2>One assistant.<br/><span>Three ways to get JARVIS.</span></h2>
          <p>Choose a one-time Classic licence or select the Premium billing schedule that works for you. Each plan clearly explains what is included before payment is enabled.</p>
          <Link className="text-link" href="/features">Explore JARVIS capabilities <ArrowRight size={15}/></Link>
        </Reveal>
      </section>

      <section className="page-content section-wrap pricing-content">
        <div className="pricing-section-heading">
          <div><span className="section-eyebrow"><span className="eyebrow-mark"/> CHOOSE YOUR ACCESS</span><h2>Plans built around <em>your workflow.</em></h2></div>
          <p>All prices are displayed in Nigerian naira (NGN).</p>
        </div>

        <div className="pricing-grid pricing-grid-three">
          <Reveal>
            <article className="pricing-card pricing-card-classic">
              <div className="pricing-card-top"><span className="pricing-plan-icon"><InfinityIcon size={20}/></span><span className="availability-tag">ONE-TIME</span></div>
              <p className="pricing-kicker">JARVIS CLASSIC</p>
              <h2>Classic 56.0.0</h2>
              <p className="pricing-description">A permanent licence for the classic JARVIS desktop release.</p>
              <div className="pricing-price">{lifetime.displayPrice || "₦1,000"}<small>one-time payment</small></div>
              <div className="pricing-card-divider"/>
              <p className="pricing-includes-label">WHAT'S INCLUDED</p>
              <ul>{classicFeatures.map((feature) => <li key={feature}><Check size={15}/>{feature}</li>)}</ul>
              <PaymentComingSoon/>
              <span className="pricing-plan-foot">No subscription. No recurring charges.</span>
            </article>
          </Reveal>

          <Reveal delay={70}>
            <article className="pricing-card pricing-card-premium">
              <div className="pricing-card-top"><span className="pricing-plan-icon"><Sparkles size={20}/></span><span className="availability-tag available">FLEXIBLE BILLING</span></div>
              <p className="pricing-kicker">JARVIS PREMIUM</p>
              <h2>Monthly</h2>
              <p className="pricing-description">Premium access with the flexibility to manage your subscription month by month.</p>
              <div className="pricing-price">{monthly.displayPrice || "₦1,500"}<small>per month</small></div>
              <div className="pricing-card-divider"/>
              <p className="pricing-includes-label">PREMIUM INCLUDES</p>
              <ul>{premiumFeatures.map((feature) => <li key={feature}><Check size={15}/>{feature}</li>)}</ul>
              <PaymentComingSoon/>
              <span className="pricing-plan-foot">Recurring monthly billing. Manage your subscription.</span>
            </article>
          </Reveal>

          <Reveal delay={140}>
            <article className="pricing-card pricing-card-yearly">
              <div className="pricing-recommended"><Crown size={12}/> BEST VALUE</div>
              <div className="pricing-card-top"><span className="pricing-plan-icon"><Crown size={20}/></span><span className="availability-tag available">ANNUAL ACCESS</span></div>
              <p className="pricing-kicker">JARVIS PREMIUM</p>
              <h2>Yearly</h2>
              <p className="pricing-description">Stay current with JARVIS Premium for a full year.</p>
              <div className="pricing-price">{yearly.displayPrice || "₦2,000"}<small>per year</small></div>
              <div className="pricing-card-divider"/>
              <p className="pricing-includes-label">EVERYTHING IN PREMIUM</p>
              <ul>{premiumFeatures.map((feature) => <li key={feature}><Check size={15}/>{feature}</li>)}</ul>
              <PaymentComingSoon/>
              <span className="pricing-plan-foot">Recurring annual billing. Manage your subscription.</span>
            </article>
          </Reveal>
        </div>

        <div className="payment-information">
          <div className="payment-information-icon"><CreditCard size={19}/></div>
          <div className="payment-information-copy"><strong>Secure payments are being prepared</strong><p>Checkout will be activated after the Paystack merchant account is ready. Your plan selection and pricing are displayed now; no payment will be collected at this stage.</p></div>
          <span className="payment-status-tag"><span/> PAYMENT SETUP PENDING</span>
        </div>

        <p className="pricing-footnote"><ShieldCheck size={15}/> Your licence is associated with your purchase email. Premium access is subject to an active subscription and its billing period. The Classic licence applies only to JARVIS 56.0.0 and does not include later Premium releases.</p>
      </section>
    </main>
  );
}
