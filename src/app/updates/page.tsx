import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CircleHelp, Download, FileCheck2, RefreshCw, ShieldCheck, Wifi } from "lucide-react";
import Reveal from "@/components/reveal";

export const metadata: Metadata = {
  title: "Updates",
  description: "Learn how JARVIS release checks and confirmation-based desktop updates are designed to work.",
};

const steps = [
  { number: "01", title: "Check for a stable release", body: "JARVIS checks official GitHub release metadata and compares the available release with the version installed on your computer.", state: "CHECK FOUNDATION" },
  { number: "02", title: "Prepare the correct package", body: "The update flow must select an installer for the current operating system and verify its checksum before offering it.", state: "IN DEVELOPMENT" },
  { number: "03", title: "Review the changes", body: "The release version and notes should be visible before installation. Your chosen policy requires confirmation before the update runs.", state: "IN DEVELOPMENT" },
  { number: "04", title: "Install and recover safely", body: "A complete updater still needs platform-specific installer hand-off, restart behavior, failure handling, and a recovery path.", state: "IN DEVELOPMENT" },
];

export default function UpdatesPage() {
  return (
    <main className="inner-page">
      <section className="page-hero section-wrap updates-page-hero">
        <Reveal><div className="eyebrow-pill"><span className="pill-spark">✳</span> RELEASES / YOUR CONTROL</div><h1>Stay current.<br /><span>Stay in control.</span></h1><p className="page-lede">The intended experience is straightforward: check quietly, prepare the update, explain what's changing, and ask before installing.</p><div className="hero-actions"><Link className="button button-primary" href="/downloads">View latest releases <ArrowRight size={16}/></Link><a className="button button-quiet" href="https://github.com/ibarakumo2000-stack/Mark-56/releases" target="_blank" rel="noreferrer">GitHub releases <ArrowUpRight size={15}/></a></div></Reveal>
        <Reveal className="update-status-card" delay={110}><span className="update-status-icon"><RefreshCw size={23}/></span><span className="footer-label">CURRENT UPDATE CAPABILITY</span><h2>Release check is available.</h2><p>The desktop app can check release metadata and report when no newer stable release is available. Secure, platform-specific automatic installation is still in development.</p><span className="update-status-note"><CircleHelp size={14}/> Checking for updates is not the same as installing them.</span></Reveal>
      </section>
      <section className="page-content section-wrap"><Reveal className="section-heading"><div className="section-eyebrow"><span className="eyebrow-mark"/> HOW UPDATES SHOULD WORK</div><h2>Four clear stages.<br/><span>No surprise installs.</span></h2><p>Update checks and installation are separate capabilities. This page states the current boundary instead of implying the whole updater has shipped.</p></Reveal>
        <div className="update-timeline">{steps.map((step,index)=><Reveal key={step.number} delay={index*60}><article className="update-timeline-item"><span className="update-step-number">{step.number}</span><div className="update-step-content"><h3>{step.title}</h3><p>{step.body}</p></div><span className={index===0?"timeline-status timeline-status-ready":"timeline-status"}>{step.state}</span></article></Reveal>)}</div>
      </section>
      <section className="update-safety-section"><div className="section-wrap update-safety-grid">
        <Reveal><ShieldCheck size={25}/><h3>Integrity comes first</h3><p>Published assets need checksums and a release source users can verify. Platform signing will be configured where supported.</p></Reveal>
        <Reveal delay={80}><Wifi size={25}/><h3>Internet required for updates</h3><p>Release checks and downloads need a connection. Local AI can remain usable offline when its runtime and model are installed.</p></Reveal>
        <Reveal delay={160}><FileCheck2 size={25}/><h3>Confirmation before install</h3><p>Updates should show the version and release notes and wait for your approval before changing the installed application.</p></Reveal>
      </div></section>
      <section className="page-cta-band section-wrap"><div className="cta-band-orbit" aria-hidden="true"><Download size={40}/></div><div><div className="section-eyebrow"><span className="eyebrow-mark"/> READY FOR RELEASES?</div><h2>See what's actually available.</h2><p>The download page reflects actual installer assets published on the official release channel.</p></div><div className="page-cta-actions"><Link className="button button-primary" href="/downloads">Open download center <ArrowRight size={15}/></Link><Link className="text-link" href="/faq">Read help & FAQ <ArrowUpRight size={15}/></Link></div></section>
    </main>
  );
}
