import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownToLine, ArrowRight, ArrowUpRight, CheckCircle2, CircleHelp, Download, Monitor, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import Reveal from "@/components/reveal";
import { getLatestDesktopRelease, type DesktopPlatform } from "@/lib/releases";

export const metadata: Metadata = {
  title: "Downloads",
  description: "Find verified JARVIS desktop installers for Windows, Ubuntu/Linux, and macOS.",
};

const platforms: { key: DesktopPlatform; name: string; description: string; requirements: string; icon: typeof Monitor; packageLabel: string }[] = [
  { key: "windows", name: "Windows", description: "64-bit Windows desktop", requirements: "Windows 10 or later", icon: Monitor, packageLabel: ".exe / .msi" },
  { key: "linux", name: "Ubuntu / Linux", description: "64-bit Linux desktop", requirements: "Ubuntu or compatible distro", icon: Terminal, packageLabel: ".AppImage / .deb / .rpm" },
  { key: "macos", name: "macOS", description: "Apple silicon or Intel, when published", requirements: "A compatible macOS release", icon: Sparkles, packageLabel: ".dmg / .pkg" },
];

function formatBytes(bytes?: number) {
  if (!bytes || bytes <= 0) return "";
  return bytes >= 1_000_000_000 ? `${(bytes / 1_000_000_000).toFixed(2)} GB` : `${(bytes / 1_000_000).toFixed(0)} MB`;
}

export default async function DownloadsPage() {
  const release = await getLatestDesktopRelease();
  const available = platforms.filter((platform) => release?.assets[platform.key]);
  return (
    <main className="inner-page">
      <section className="page-hero section-wrap downloads-page-hero">
        <Reveal><div className="eyebrow-pill"><span className="pill-spark">✳</span> OFFICIAL RELEASE CENTER</div><h1>Your next step<br /><span>starts here.</span></h1><p className="page-lede">One place to find the desktop installer, check platform availability, and get ready for local AI. We only enable downloads when a matching installer is attached to a stable release.</p><div className="download-state-pill">{available.length ? <CheckCircle2 size={15} /> : <CircleHelp size={15} />}{available.length ? `${available.length} platform package(s) available` : "First verified installer is being prepared"}</div></Reveal>
        <Reveal className="download-hero-card" delay={100}><div className="panel-header"><span><span className={available.length ? "signal-dot" : "status-indicator"} /> LATEST STABLE RELEASE</span><span>{release?.tag_name ?? "NOT PUBLISHED"}</span></div><div className="download-hero-icon"><Download size={30} strokeWidth={1.3} /></div><h2>{release ? `JARVIS ${release.tag_name}` : "A desktop installer is on the way."}</h2><p>{release ? "Review the packages available for your operating system below." : "The website checks the official release feed. When a verified installer is published, the matching download button will activate."}</p><a className="text-link" href={release?.html_url ?? "https://github.com/ibarakumo2000-stack/Mark-56/releases"} target="_blank" rel="noreferrer">Open official GitHub releases <ArrowUpRight size={15} /></a></Reveal>
      </section>
      <section className="page-content section-wrap">
        <Reveal className="section-heading"><div className="section-eyebrow"><span className="eyebrow-mark" /> CHOOSE YOUR PLATFORM</div><h2>Built for the computer<br /><span>you actually use.</span></h2><p>Choose your operating system. If a package is not published, its status stays visible and you won't be sent to a source-code download by mistake.</p></Reveal>
        <div className="download-platform-grid">{platforms.map((platform,index)=>{const Icon=platform.icon;const asset=release?.assets[platform.key];return <Reveal key={platform.key} delay={index*70}><article className={asset?"download-platform-card is-available":"download-platform-card"}><div className="download-platform-top"><span className="download-platform-icon"><Icon size={24} strokeWidth={1.5}/></span><span className={asset?"availability-tag available":"availability-tag"}>{asset?"AVAILABLE":"IN PREPARATION"}</span></div><h3>{platform.name}</h3><p>{platform.description}</p><div className="platform-requirements"><span>REQUIREMENTS</span><strong>{platform.requirements}</strong></div><div className="platform-requirements"><span>PACKAGE TYPE</span><strong>{asset?.name??platform.packageLabel}</strong></div>{asset?<a className="button button-primary download-button" href={`/api/download?platform=${platform.key}`}>Download for {platform.name}<ArrowDownToLine size={16}/></a>:<button type="button" className="button button-disabled download-button" disabled>Installer not published yet</button>}{asset&&<p className="asset-size">{formatBytes(asset.size)} · Official GitHub asset</p>}</article></Reveal>})}</div>
      </section>
      <section className="download-trust-section"><div className="section-wrap download-trust-grid">
        <Reveal><ShieldCheck size={28}/><h3>Verified release source</h3><p>Downloads are selected from the official stable release and filtered by platform and installer file type.</p></Reveal>
        <Reveal delay={80}><CheckCircle2 size={28}/><h3>Clear availability</h3><p>No fake download buttons. When a package isn't available, the page explains the status directly.</p></Reveal>
        <Reveal delay={160}><CircleHelp size={28}/><h3>Need help?</h3><p>Get installation and offline setup guidance, including which pieces need internet.</p><Link href="/offline">Read offline setup <ArrowRight size={14}/></Link></Reveal>
      </div></section>
    </main>
  );
}
