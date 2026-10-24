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
  { key: "linux", name: "Ubuntu / Linux", description: "64-bit Linux desktop", requirements: "Ubuntu or compatible distro", icon: Terminal, packageLabel: ".tar.gz installer bundle" },
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
        <Reveal className="download-hero-card" delay={100}><div className="panel-header"><span><span className={available.length ? "signal-dot" : "status-indicator"} /> LATEST STABLE RELEASE</span><span>{release?.tag_name ?? "NOT PUBLISHED"}</span></div><div className="download-hero-icon"><Download size={30} strokeWidth={1.3} /></div><h2>{release ? `JARVIS ${release.tag_name}` : "A desktop installer is on the way."}</h2><p>{release ? "Review the packages available for your operating system below." : "The website checks the official release feed. When a verified installer is published, the matching download button will activate."}</p>{release?.assets.windows && <Link className="button button-primary download-hero-download" href="/api/download?platform=windows">Download Windows installer <ArrowDownToLine size={15} /></Link>}<a className="text-link" href={release?.html_url ?? "https://github.com/ibarakumo2000-stack/Mark-56/releases"} target="_blank" rel="noreferrer">Open official GitHub releases <ArrowUpRight size={15} /></a></Reveal>
      </section>
      <section className="page-content section-wrap">
        <Reveal className="section-heading"><div className="section-eyebrow"><span className="eyebrow-mark" /> CHOOSE YOUR PLATFORM</div><h2>Built for the computer<br /><span>you actually use.</span></h2><p>Choose your operating system. If a package is not published, its status stays visible and you won&apos;t be sent to a source-code download by mistake.</p></Reveal>
        <div className="download-platform-grid">{platforms.map((platform,index)=>{const Icon=platform.icon;const asset=release?.assets[platform.key];return <Reveal key={platform.key} delay={index*70}><article className={asset?"download-platform-card is-available":"download-platform-card"}><div className="download-platform-top"><span className="download-platform-icon"><Icon size={24} strokeWidth={1.5}/></span><span className={asset?"availability-tag available":"availability-tag"}>{asset?"AVAILABLE":"IN PREPARATION"}</span></div><h3>{platform.name}</h3><p>{platform.description}</p><div className="platform-requirements"><span>REQUIREMENTS</span><strong>{platform.requirements}</strong></div><div className="platform-requirements"><span>PACKAGE TYPE</span><strong>{platform.key === "macos" && release?.macosVariants.arm64 && release?.macosVariants.x86_64 ? "Separate DMGs for Apple silicon and Intel" : asset?.name ?? platform.packageLabel}</strong></div>{platform.key === "macos" && (release?.macosVariants.arm64 || release?.macosVariants.x86_64) ? <div className="macos-download-options">{release?.macosVariants.arm64 && <a className="button button-primary download-button" href="/api/download?platform=macos&arch=arm64">Apple silicon <ArrowDownToLine size={16}/></a>}{release?.macosVariants.x86_64 && <a className="button button-primary download-button" href="/api/download?platform=macos&arch=x86_64">Intel Mac <ArrowDownToLine size={16}/></a>}</div> : asset ? <a className="button button-primary download-button" href={`/api/download?platform=${platform.key}`}>Download for {platform.name}<ArrowDownToLine size={16}/></a> : <button type="button" className="button button-disabled download-button" disabled>Installer not published yet</button>}{asset&&<p className="asset-size">{formatBytes(asset.size)} · Official GitHub asset</p>}{release?.checksums && <a className="checksum-link" href={release.checksums.url} target="_blank" rel="noreferrer">Verify SHA-256 checksum <ArrowUpRight size={13} /></a>}</article></Reveal>})}</div>
      </section>
      {release?.assets.windows && <section className="page-content section-wrap installer-guide-section">
        <Reveal className="section-heading"><div className="section-eyebrow"><span className="eyebrow-mark" /> WINDOWS QUICK START</div><h2>From download to<br /><span>first launch.</span></h2><p>The installer is published from the official Mark-56 release workflow. Use these steps after downloading the setup file.</p></Reveal>
        <div className="offline-steps">
          <Reveal className="offline-step"><span className="offline-step-number">01</span><div><h3>Download the official setup file</h3><p>Use the Windows download button above. For extra assurance, open the published SHA-256 checksum list and compare the checksum of the downloaded file.</p></div><CheckCircle2 className="offline-step-check" size={17} /></Reveal>
          <Reveal className="offline-step" delay={70}><span className="offline-step-number">02</span><div><h3>Run the installer</h3><p>Open the downloaded .exe and follow the setup prompts. The package is configured for a per-user installation, so a separate administrator prompt should not be needed.</p></div><CheckCircle2 className="offline-step-check" size={17} /></Reveal>
          <Reveal className="offline-step" delay={140}><span className="offline-step-number">03</span><div><h3>Launch JARVIS and finish setup</h3><p>Start JARVIS from the shortcut created by the installer, then configure your own AI provider credentials and any optional local model you plan to use.</p></div><CheckCircle2 className="offline-step-check" size={17} /></Reveal>
        </div>
        {release.checksums && <p className="installer-guide-checksum"><ShieldCheck size={16} /> Checksum file: <a href={release.checksums.url} target="_blank" rel="noreferrer">{release.checksums.name} <ArrowUpRight size={13} /></a></p>}
      </section>}
      {release?.assets.linux && <section className="page-content section-wrap installer-guide-section">
        <Reveal className="section-heading"><div className="section-eyebrow"><span className="eyebrow-mark" /> LINUX QUICK START</div><h2>Install on<br /><span>your Linux desktop.</span></h2><p>The Linux package contains its own Python runtime and application dependencies. A few native desktop or audio libraries may still come from your Linux distribution.</p></Reveal>
        <div className="offline-steps">
          <Reveal className="offline-step"><span className="offline-step-number">01</span><div><h3>Download and extract the bundle</h3><p>Download the Linux .tar.gz package, then extract it to a folder you can write to.</p></div><CheckCircle2 className="offline-step-check" size={17} /></Reveal>
          <Reveal className="offline-step" delay={70}><span className="offline-step-number">02</span><div><h3>Run the installer script</h3><p>Open a terminal in the extracted MARK-LV-Linux-x86_64 folder and run <strong>bash install.sh</strong>. On Ubuntu/Debian, the optional native libraries can be requested by running <strong>JARVIS_INSTALL_SYSTEM_LIBS=1 bash install.sh</strong>.</p></div><CheckCircle2 className="offline-step-check" size={17} /></Reveal>
          <Reveal className="offline-step" delay={140}><span className="offline-step-number">03</span><div><h3>Launch JARVIS</h3><p>Use the applications menu or run <strong>~/.local/bin/mark56</strong>. Configure your own AI provider credentials during first setup.</p></div><CheckCircle2 className="offline-step-check" size={17} /></Reveal>
        </div>
        {release.checksums && <p className="installer-guide-checksum"><ShieldCheck size={16} /> Checksum file: <a href={release.checksums.url} target="_blank" rel="noreferrer">{release.checksums.name} <ArrowUpRight size={13} /></a></p>}
      </section>}
      {release?.assets.macos && <section className="page-content section-wrap installer-guide-section">
        <Reveal className="section-heading"><div className="section-eyebrow"><span className="eyebrow-mark" /> macOS QUICK START</div><h2>Bring JARVIS to<br /><span>your Mac.</span></h2><p>Choose the installer that matches your Mac&apos;s processor: Apple silicon (M-series) or Intel.</p></Reveal>
        <div className="offline-steps">
          <Reveal className="offline-step"><span className="offline-step-number">01</span><div><h3>Select your Mac architecture</h3><p>Use the Apple silicon or Intel button on the macOS card above. The two disk images contain different native runtimes.</p></div><CheckCircle2 className="offline-step-check" size={17} /></Reveal>
          <Reveal className="offline-step" delay={70}><span className="offline-step-number">02</span><div><h3>Move the app into Applications</h3><p>Open the downloaded DMG and drag JARVIS.app into the Applications folder, then launch it from Applications.</p></div><CheckCircle2 className="offline-step-check" size={17} /></Reveal>
          <Reveal className="offline-step" delay={140}><span className="offline-step-number">03</span><div><h3>Review the security and privacy prompts</h3><p>These builds are not signed or notarized yet, so macOS may show a warning. Verify the download is from the official Mark-56 release before opening it, and grant microphone or screen permissions only for features you intend to use.</p></div><CheckCircle2 className="offline-step-check" size={17} /></Reveal>
        </div>
        {release.checksums && <p className="installer-guide-checksum"><ShieldCheck size={16} /> Checksum file: <a href={release.checksums.url} target="_blank" rel="noreferrer">{release.checksums.name} <ArrowUpRight size={13} /></a></p>}
      </section>}
      <section className="download-trust-section"><div className="section-wrap download-trust-grid">
        <Reveal><ShieldCheck size={28}/><h3>Verified release source</h3><p>Downloads are selected from the official stable release and filtered by platform and installer file type.</p></Reveal>
        <Reveal delay={80}><CheckCircle2 size={28}/><h3>Clear availability</h3><p>No fake download buttons. When a package isn&apos;t available, the page explains the status directly.</p></Reveal>
        <Reveal delay={160}><CircleHelp size={28}/><h3>Need help?</h3><p>Get installation and offline setup guidance, including which pieces need internet.</p><Link href="/offline">Read offline setup <ArrowRight size={14}/></Link></Reveal>
      </div></section>
    </main>
  );
}
