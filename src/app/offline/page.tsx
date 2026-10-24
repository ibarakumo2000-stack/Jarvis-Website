import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, CloudOff, Cpu, Download, Globe, HardDrive, ShieldCheck, WifiOff } from "lucide-react";
import Reveal from "@/components/reveal";

export const metadata: Metadata = {
  title: "Offline AI",
  description: "Learn how to prepare JARVIS for supported offline AI tasks with Ollama and local models.",
};

const setup = [
  { number: "01", title: "Install the desktop app", body: "Install JARVIS on your computer. The website is just the download and help center; local AI runs inside the desktop environment." },
  { number: "02", title: "Install or start Ollama", body: "Ollama provides the local model runtime. Make sure its local service responds at http://127.0.0.1:11434 before testing JARVIS." },
  { number: "03", title: "Download the model you will use", body: "Pull the text model configured for JARVIS and, if you need image or screenshot understanding, a compatible vision model. Model choice affects RAM, disk space, and speed." },
  { number: "04", title: "Verify before going offline", body: "Test Ollama directly and then run the JARVIS local-model status check. After setup, disconnect briefly to verify the specific local features you rely on." },
];

export default function OfflinePage() {
  return (
    <main className="inner-page">
      <section className="page-hero section-wrap offline-page-hero">
        <Reveal><div className="eyebrow-pill"><span className="pill-spark">✳</span> LOCAL AI / YOUR DEVICE</div><h1>Your AI.<br /><span>Your machine.</span><br />Your choice.</h1><p className="page-lede">JARVIS is being designed to keep supported local tasks useful without a network. Prepare the app, runtime, and model before you disconnect.</p><div className="hero-actions"><a className="button button-primary" href="https://ollama.com/download" target="_blank" rel="noreferrer">Get Ollama <ArrowUpRight size={15} /></a><Link className="button button-quiet" href="/downloads">Desktop downloads <Download size={15} /></Link></div></Reveal>
        <Reveal className="offline-feature-panel" delay={110}><div className="panel-header"><span><span className="signal-dot" /> LOCAL RUNTIME</span><span>ON DEVICE</span></div><div className="offline-hero-icon"><Cpu size={38} strokeWidth={1.2} /></div><h2>Ollama + local model</h2><p>Supported prompts and model responses can be processed on your computer after setup.</p><div className="offline-chip-row"><span><Check size={13} /> Local inference</span><span><HardDrive size={13} /> Stored locally</span></div></Reveal>
      </section>
      <section className="offline-boundary-section"><div className="section-wrap offline-boundary-grid">
        <Reveal><div className="section-eyebrow"><span className="eyebrow-mark" /> KNOW THE DIFFERENCE</div><h2>Offline means<br /><span>prepared first.</span></h2><p className="muted">Downloading and configuring software needs a connection. Only features whose code, models, and dependencies are installed locally will work offline.</p></Reveal>
        <div className="boundary-cards"><Reveal><article className="boundary-card boundary-local"><div className="boundary-card-title"><WifiOff size={19} /><span>CAN WORK OFFLINE</span></div><h3>Local model tasks</h3><p>Supported local prompts, local image input when a vision model is installed, and workflows that don&apos;t call external services.</p></article></Reveal><Reveal delay={100}><article className="boundary-card boundary-online"><div className="boundary-card-title"><Globe size={19} /><span>NEEDS A CONNECTION</span></div><h3>Online services</h3><p>Web search, cloud AI, first-time downloads, version checks, and integrations hosted outside your computer.</p></article></Reveal></div>
      </div></section>
      <section className="page-content section-wrap">
        <Reveal className="section-heading"><div className="section-eyebrow"><span className="eyebrow-mark" /> GET OFFLINE-READY</div><h2>Four steps.<br /><span>No guesswork.</span></h2><p>Use this checklist to validate each layer. If any step fails, fix it before relying on the app offline.</p></Reveal>
        <div className="offline-steps">{setup.map((step,index)=><Reveal key={step.number} delay={index*60}><article className="offline-step"><span className="offline-step-number">{step.number}</span><div><h3>{step.title}</h3><p>{step.body}</p></div><Check size={17} className="offline-step-check" /></article></Reveal>)}</div>
      </section>
      <section className="model-command-section section-wrap">
        <Reveal className="model-command-copy"><div className="section-eyebrow"><span className="eyebrow-mark" /> QUICK CHECK</div><h2>Test the local engine.</h2><p>In Ubuntu Terminal, run these commands. If your model uses a different name, use the exact name shown by <code>ollama list</code>.</p></Reveal>
        <Reveal className="terminal-card" delay={100}><div className="terminal-header"><span><i /><i /><i /></span><span>UBUNTU TERMINAL</span><span className="terminal-badge">LOCAL CHECK</span></div><pre><code>ollama --version{"\n"}ollama list{"\n"}curl -s http://127.0.0.1:11434/api/tags</code></pre><p><ShieldCheck size={14} /> These commands check installation and local service visibility; they do not change system settings.</p></Reveal>
      </section>
      <section className="page-cta-band section-wrap"><div className="cta-band-orbit" aria-hidden="true"><CloudOff size={43} /></div><div><div className="section-eyebrow"><span className="eyebrow-mark" /> STAY IN CONTROL</div><h2>Know what works offline.</h2><p>Visit help for common issues, or check desktop availability.</p></div><div className="page-cta-actions"><Link className="button button-primary" href="/faq">Read help & FAQ <ArrowRight size={15} /></Link><Link className="text-link" href="/downloads">View downloads <ArrowUpRight size={15} /></Link></div></section>
    </main>
  );
}
