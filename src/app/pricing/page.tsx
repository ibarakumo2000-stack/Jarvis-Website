import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Crown, Infinity as InfinityIcon, ShieldCheck, Sparkles } from "lucide-react";
import Reveal from "@/components/reveal";
import CheckoutOptions from "@/components/checkout-options";
import { getPricingCatalog } from "@/lib/payments";

export const metadata: Metadata = {
  title: "Choose your JARVIS licence",
  description: "Get the JARVIS 56.0.2 one-time licence or choose monthly or yearly JARVIS Premium access.",
};

const classicFeatures = [
  "Permanent licence for JARVIS 56.0.2",
  "Access to the exact 56.0.2 release",
  "No recurring payments",
  "Security fixes for the 56.0.2 product line, where published",
];

const premiumFeatures = [
  "Access to the latest eligible JARVIS Premium release",
  "Mark 56.0.2 and eligible future premium releases",
  "New premium capabilities and feature upgrades",
  "Entitlement checked before each installer download",
];

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
          <p className="page-lede">Get JARVIS 56.0.2 with a single payment, or choose monthly or yearly Premium access for the evolving JARVIS experience.</p>
          <div className="download-state-pill"><ShieldCheck size={15} /> Secure checkout · Verified before download</div>
        </Reveal>
        <Reveal className="pricing-hero-note" delay={100}>
          <span className="section-eyebrow"><span className="eyebrow-mark" /> THREE CLEAR LICENCE OPTIONS</span>
          <h2>One assistant.<br /><span>Your way to access it.</span></h2>
          <p>The one-time licence is permanently tied to JARVIS 56.0.2. Premium subscriptions provide access to the latest eligible Premium release while the subscription remains active.</p>
          <Link className="text-link" href="/features">Compare JARVIS capabilities <ArrowRight size={15}/></Link>
        </Reveal>
      </section>

      <section className="page-content section-wrap pricing-content">
        <div className="pricing-grid">
          <Reveal>
            <article className="pricing-card">
              <div className="pricing-card-top"><span className="pricing-plan-icon"><InfinityIcon size={20}/></span><span className="availability-tag">ONE-TIME LICENCE</span></div>
              <p className="pricing-kicker">JARVIS CLASSIC</p>
              <h2>JARVIS 56.0.2</h2>
              <p className="pricing-description">Pay once and keep using this exact release permanently.</p>
              <div className="pricing-price">{lifetime.displayPrice || "₦1,000"}<small>one-time payment</small></div>
              <ul>{classicFeatures.map((feature) => <li key={feature}><Check size={15}/>{feature}</li>)}</ul>
              <CheckoutOptions plan="lifetime" configured={lifetime.configured} label="Buy JARVIS 56.0.2"/>
              {!lifetime.configured && <p className="pricing-config-note">Secure checkout activates after the payment, account, database and private-download settings are connected.</p>}
            </article>
          </Reveal>

          <Reveal delay={70}>
            <article className="pricing-card pricing-card-premium">
              <div className="pricing-card-top"><span className="pricing-plan-icon"><Crown size={20}/></span><span className="availability-tag available">PREMIUM ACCESS</span></div>
              <p className="pricing-kicker">JARVIS PREMIUM</p>
              <h2>Monthly</h2>
              <p className="pricing-description">Flexible access to the latest eligible Premium releases, billed monthly.</p>
              <div className="pricing-price">{monthly.displayPrice || "₦1,500"}<small>per month · recurring</small></div>
              <ul>{premiumFeatures.map((feature) => <li key={feature}><Sparkles size={15}/>{feature}</li>)}</ul>
              <CheckoutOptions plan="monthly" configured={monthly.configured} label="Subscribe monthly"/>
              {!monthly.configured && <p className="pricing-config-note">Monthly checkout activates after the Paystack monthly plan and account configuration are connected.</p>}
            </article>
          </Reveal>

          <Reveal delay={140}>
            <article className="pricing-card pricing-card-premium">
              <div className="pricing-card-top"><span className="pricing-plan-icon"><Sparkles size={20}/></span><span className="availability-tag available">PREMIUM ACCESS</span></div>
              <p className="pricing-kicker">JARVIS PREMIUM</p>
              <h2>Yearly</h2>
              <p className="pricing-description">Full-year access to the latest eligible Premium releases, billed annually.</p>
              <div className="pricing-price">{yearly.displayPrice || "₦2,000"}<small>per year · recurring</small></div>
              <ul>{premiumFeatures.map((feature) => <li key={feature}><Sparkles size={15}/>{feature}</li>)}</ul>
              <CheckoutOptions plan="yearly" configured={yearly.configured} label="Subscribe yearly"/>
              {!yearly.configured && <p className="pricing-config-note">Yearly checkout activates after the Paystack annual plan and account configuration are connected.</p>}
            </article>
          </Reveal>
        </div>
        <p className="pricing-footnote"><ShieldCheck size={15}/> Payments are verified on the server before an entitlement or download is issued. Recurring subscriptions use Paystack-supported recurring payment methods. Premium access can be suspended when the billing period expires or the subscription is disabled.</p>
      </section>
    </main>
  );
}
