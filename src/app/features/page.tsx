import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, AudioLines, Code2, Cpu, MonitorCog, Search, ShieldCheck, Workflow } from "lucide-react";
import Reveal from "@/components/reveal";

export const metadata: Metadata = {
  title: "Capabilities",
  description: "Explore JARVIS desktop AI capabilities, local intelligence, voice, and permission-first automation.",
};

const capabilities = [
  { icon: AudioLines, number: "01", title: "Voice and conversation", status: "IN DEVELOPMENT", body: "A unified assistant experience for voice and text, designed to make interaction feel more natural. Supported offline voice capabilities depend on the local speech components configured in the installed app." },
  { icon: Cpu, number: "02", title: "Local AI intelligence", status: "LOCAL MODEL INTEGRATION", body: "Run supported language and vision models with Ollama on your own machine. Once the required model is present, supported requests can be processed without calling a cloud model." },
  { icon: Workflow, number: "03", title: "Desktop workflows", status: "PERMISSION-FIRST", body: "Build toward practical actions across apps and files, with clear confirmation for consequential operations and honest feedback when a capability is unavailable." },
  { icon: Code2, number: "04", title: "Build and create", status: "TOOLS EVOLVING", body: "Use coding and project-building tools, including a provider-independent static site builder for previewing and creating local starter websites." },
  { icon: Search, number: "05", title: "Connected research", status: "INTERNET REQUIRED", body: "Search and cloud-connected features can expand what the assistant can do, but they need an active connection and remain separate from offline local inference." },
  { icon: MonitorCog, number: "06", title: "System-aware desktop", status: "PLATFORM DEPENDENT", body: "The desktop app can expose system metrics and controls where the operating system and installed dependencies support them. Functionality differs between Windows, Linux, and macOS." },
];

export default function FeaturesPage() {
  return (
    <main className="inner-page">
      <section className="page-hero section-wrap">
        <Reveal>
          <div className="eyebrow-pill"><span className="pill-spark">✳</span> CAPABILITIES / THE SYSTEM</div>
          <h1>Designed for more<br /><span>than conversation.</span></h1>
          <p className="page-lede">JARVIS brings local intelligence and useful desktop tools into one workspace—with clear boundaries around what is ready, what is evolving, and what needs a connection.</p>
          <div className="hero-actions"><Link className="button button-primary" href="/downloads">Explore downloads <ArrowRight size={16} /></Link><Link className="button button-quiet" href="/offline">How offline AI works <ArrowUpRight size={15} /></Link></div>
        </Reveal>
        <Reveal className="page-stat-grid" delay={100}>
          <div><strong>LOCAL</strong><span>Where supported</span></div><div><strong>MODULAR</strong><span>Capabilities can evolve</span></div><div><strong>YOU FIRST</strong><span>Control stays visible</span></div>
        </Reveal>
      </section>
      <section className="page-content section-wrap">
        <Reveal className="section-heading"><div className="section-eyebrow"><span className="eyebrow-mark" /> THE TOOLSET</div><h2>Find what you need.<br /><span>Know what to expect.</span></h2><p>Each capability has a different role. Status labels are intentionally clear: they don&apos;t imply a feature works on every operating system or without its required setup.</p></Reveal>
        <div className="capability-page-grid">
          {capabilities.map((item, index) => {
            const Icon = item.icon;
            return <Reveal key={item.number} delay={index * 55}><article className="capability-page-card"><div className="cap-page-card-top"><span>{item.number}</span><Icon size={23} strokeWidth={1.5} /></div><span className="status-label"><i />{item.status}</span><h3>{item.title}</h3><p>{item.body}</p></article></Reveal>;
          })}
        </div>
      </section>
      <section className="page-cta-band section-wrap">
        <div className="cta-band-orbit" aria-hidden="true"><span>J</span></div><div><div className="section-eyebrow"><span className="eyebrow-mark" /> WHERE TO NEXT</div><h2>Start with your setup.</h2><p>Get clear instructions for local AI, then check the release center for desktop packages.</p></div>
        <div className="page-cta-actions"><Link className="button button-primary" href="/offline">Prepare offline AI <ArrowRight size={15} /></Link><Link className="text-link" href="/downloads">Open downloads <ArrowUpRight size={15} /></Link></div>
      </section>
    </main>
  );
}
