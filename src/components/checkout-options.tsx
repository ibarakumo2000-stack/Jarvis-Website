"use client";

import { useState } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";

type Props = { plan: "lifetime" | "monthly" | "yearly"; configured: boolean; label: string };

export default function CheckoutOptions({ plan, configured, label }: Props) {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function beginCheckout() {
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Enter a valid email address for your receipt and licence.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), plan }),
      });
      const result = await response.json() as { authorizationUrl?: string; error?: string };
      if (!response.ok || !result.authorizationUrl) throw new Error(result.error || "Checkout could not be started.");
      window.location.assign(result.authorizationUrl);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Checkout could not be started.");
      setBusy(false);
    }
  }

  return (
    <div className="checkout-options">
      {!open ? (
        <button className="button button-primary download-button" type="button" disabled={!configured} onClick={() => setOpen(true)}>
          {label} <ArrowUpRight size={16}/>
        </button>
      ) : (
        <div className="checkout-email-form">
          <label htmlFor={`checkout-email-${plan}`}>Email for your purchase</label>
          <input id={`checkout-email-${plan}`} type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
          {error && <p role="alert" className="checkout-error">{error}</p>}
          <button className="button button-primary download-button" type="button" disabled={busy} onClick={beginCheckout}>
            {busy ? <><LoaderCircle size={16} className="checkout-spinner"/> Connecting to Paystack…</> : <>Continue to secure checkout <ArrowUpRight size={16}/></>}
          </button>
          <button className="checkout-cancel" type="button" onClick={() => { setOpen(false); setError(""); }}>Cancel</button>
        </div>
      )}
    </div>
  );
}
