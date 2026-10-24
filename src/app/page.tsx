import Link from "next/link";
import { ArrowRight, ArrowUpRight, AudioLines, Check, CloudOff, Cpu, Download, LockKeyhole, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import Reveal from "@/components/reveal";
import InteractiveCore from "@/components/interactive-core";
import { getLatestDesktopRelease } from "@/lib/releases";

export default async function Home() {
  const release = await getLatestDesktopRelease();
  const availableCount = Object.values(release?.assets ?? {}).filter(Boolean).length;
  return (
    <main>
      <section className="hero section-wrap home-hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow-pill"><span className="pill-spark">✳</span> A DESKTOP AI, BUILT AROUND YOU</div>
          <h1>Intelligence.<br /><span>At your</span> command<span className="title-period">.</span></h1>
          <p className="hero-lede">A more thoughtful desktop companion. Bring local AI, useful automation, and a natural voice-and-chat experience into one focused workspace.</p>
          <div className="hero-actions"><Link className="button button-primary" href="/downloads">Explore JARVIS <ArrowRight size={16} /></Link><Link className="button button-quiet" href="/features">Discover capabilities <ArrowUpRight size={15} /></Link></div>
          <div className="hero-trust-row"><span><LockKeyhole size={14} /> Local-first direction</span><span><ShieldCheck size={14} /> You stay in control</span></div>
        </div>
        <Reveal className="hero-visual reveal-hero"><div className="visual-topline"><span>FIG. 001 — SYSTEM CORE</span><span>INTERFACE / PREVIEW</span></div><InteractiveCore /><div className="visual-footer"><span className="visual-status"><span className="signal-dot" /> DESIGNED FOR THE DESKTOP</span><span>CORE / 56</span></div></Reveal>
        <div className="hero-side-note"><span>01</span><span className="side-note-line" /> DESIGNED FOR THE DESKTOP</div>
      </section>
      <section className="signal-strip" aria-label="JARVIS principles"><div className="signal-strip-inner">
        <div><CloudOff size={17} /><span>OFFLINE-CAPABLE CORE</span></div><span className="strip-divider" />
        <div><ShieldCheck size={17} /><span>PRIVACY-CONSCIOUS</span></div><span className="strip-divider" />
        <div><Workflow size={17} /><span>PERMISSION-FIRST ACTIONS</span></div><span className="strip-divider" />
        <div><AudioLines size={17} /><span>VOICE + CHAT VISION</span></div>
      </div></section>

      <section className="intro-section section-wrap home-section">
        <Reveal className="section-heading"><div className="section-eyebrow"><span className="eyebrow-mark" /> MEET JARVIS</div><h2>One assistant.<br /><span>Different ways to work.</span></h2><p>Explore the system by what you want to do. Each page explains the feature, its current status, and the next step—without making you dig through a long landing page.</p></Reveal>
        <div className="home-feature-grid">
          <Reveal delay={30}><Link className="home-feature-card" href="/features"><span className="home-feature-icon"><Sparkles size={21} /></span><span className="home-feature-kicker">01 / CAPABILITIES</span><h3>Built for useful work</h3><p>Discover voice, automation, coding, and assistant workflows being built into JARVIS.</p><span className="home-card-link">Explore capabilities <ArrowUpRight size={15} /></span></Link></Reveal>
          <Reveal delay={100}><Link className="home-feature-card" href="/offline"><span className="home-feature-icon"><Cpu size={21} /></span><span className="home-feature-kicker">02 / OFFLINE AI</span><h3>Your machine. Your model.</h3><p>Understand setup, Ollama, model downloads, offline-ready checks, and what still needs internet.</p><span className="home-card-link">Prepare offline AI <ArrowUpRight size={15} /></span></Link></Reveal>
          <Reveal delay={170}><Link className="home-feature-card" href="/downloads"><span className="home-feature-icon"><Download size={21} /></span><span className="home-feature-kicker">03 / RELEASE CENTER</span><h3>Get JARVIS on desktop</h3><p>{availableCount ? `Verified installer packages are available for ${availableCount} platform(s).` : "Check the current release status and download an installer when a verified package is published."}</p><span className="home-card-link">View downloads <ArrowUpRight size={15} /></span></Link></Reveal>
        </div>
      </section>

      <section className="offline-section home-offline-preview"><div className="offline-orbit" aria-hidden="true"><div /><div /><div /></div><div className="offline-content section-wrap">
        <Reveal className="offline-copy"><div className="section-eyebrow"><span className="eyebrow-mark" /> LOCAL BY DESIGN</div><h2>Your AI.<br /><span>Your machine.</span><br />Your choice.</h2><p>Supported local tasks can continue after the app, local runtime, and model are installed. Cloud AI and web search stay separate, so you know which features need a connection.</p><Link className="text-link" href="/offline">Understand offline AI <ArrowUpRight size={16} /></Link></Reveal>
        <Reveal className="offline-panel" delay={120}><div className="panel-header"><span><span className="signal-dot" /> LOCAL RUNTIME</span><span>SETUP GUIDE</span></div><div className="panel-main"><div className="chip-visual"><Cpu size={28} strokeWidth={1.2} /><span className="chip-glow" /></div><div className="panel-main-copy"><span>ON-DEVICE INFERENCE</span><strong>Ollama + local model</strong><small>Runs on your computer after setup</small></div></div><div className="panel-rule" /><div className="panel-row"><span><Check size={15} /> Local prompts and responses</span><span className="panel-ok">OFFLINE</span></div><div className="panel-row"><span><Check size={15} /> Supported local workflows</span><span className="panel-ok">OFFLINE</span></div><div className="panel-row"><span><CloudOff size={15} /> Web search and cloud services</span><span className="panel-network">ONLINE</span></div><div className="panel-footnote"><LockKeyhole size={14} /> Initial setup and model downloads need a connection.</div></Reveal>
      </div></section>

      <section className="home-final section-wrap"><Reveal className="home-final-copy"><div className="section-eyebrow"><span className="eyebrow-mark" /> READY WHEN YOU ARE</div><h2>Find your next step.<br /><span>We&apos;ll make it clear.</span></h2><p>Start with the overview, prepare local AI, or go straight to the release center.</p><div className="hero-actions"><Link className="button button-primary" href="/downloads">Get JARVIS <Download size={16} /></Link><Link className="button button-quiet" href="/faq">Visit the help center <ArrowUpRight size={15} /></Link></div></Reveal><div className="home-final-mark" aria-hidden="true"><span>J</span><div /></div></section>
    </main>
  );
}
