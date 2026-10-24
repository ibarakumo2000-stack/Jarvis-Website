import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Check,
  CloudOff,
  Cpu,
  Download,
  Github,
  LockKeyhole,
  Mic,
  Monitor,
  Radio,
  ShieldCheck,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
} from "lucide-react";

const releaseUrl =
  process.env.NEXT_PUBLIC_DESKTOP_RELEASES_URL ??
  "https://github.com/ibarakumo2000-stack/Mark-56/releases";

const capabilities = [
  {
    number: "01",
    icon: Cpu,
    title: "Local intelligence",
    label: "OFFLINE-CAPABLE",
    description:
      "Run supported AI models on your own machine. Once your local model and required components are installed, supported tasks can continue without an internet connection.",
  },
  {
    number: "02",
    icon: AudioLines,
    title: "A more natural interface",
    label: "VOICE + CHAT",
    description:
      "Bring voice and text into one assistant experience, with room for hands-free interaction as the desktop application evolves.",
  },
  {
    number: "03",
    icon: Workflow,
    title: "Useful action, with control",
    label: "PERMISSION-FIRST",
    description:
      "Build toward practical desktop workflows with clear boundaries around actions that affect your files, apps, or system.",
  },
  {
    number: "04",
    icon: Radio,
    title: "Online when you need it",
    label: "CONNECTED BY CHOICE",
    description:
      "Use internet-connected research and services when available. Local tasks should remain separate from features that genuinely need a network.",
  },
];

const platforms = [
  {
    name: "Windows",
    detail: "Windows 10 or later · 64-bit",
    format: "Planned package: .exe",
    icon: Monitor,
  },
  {
    name: "Ubuntu / Linux",
    detail: "64-bit Linux desktop",
    format: "Planned packages: AppImage / .deb",
    icon: Terminal,
  },
  {
    name: "macOS",
    detail: "Apple silicon and Intel targets",
    format: "Planned package: .dmg",
    icon: Sparkles,
  },
];

const setupSteps = [
  {
    number: "01",
    title: "Install JARVIS",
    description:
      "Download the installer for your operating system from the official release page when the first public build is available.",
  },
  {
    number: "02",
    title: "Prepare local AI",
    description:
      "The setup guide will help you check Ollama, choose a supported model, and download it before going offline.",
  },
  {
    number: "03",
    title: "Make it offline-ready",
    description:
      "Confirm the local model is installed and responds correctly. Cloud research and other online integrations still need a connection.",
  },
  {
    number: "04",
    title: "Stay up to date",
    description:
      "The planned updater will check for releases, download updates, and ask you before installing them.",
  },
];

const faqs = [
  {
    question: "Can JARVIS work without internet?",
    answer:
      "Supported local AI tasks can work offline after the application, local runtime, and model have been installed. Web search, cloud AI providers, and other online services still require a connection.",
  },
  {
    question: "Can I install JARVIS on a new computer?",
    answer:
      "That is the goal of this download hub. The first public desktop installers have not been published yet; this page will link to verified release assets once they are ready.",
  },
  {
    question: "Will updates install without asking me?",
    answer:
      "The chosen update policy is to check and download in the background, then ask before installing. Updates need an internet connection, and the installer must be signed or packaged appropriately for each platform.",
  },
  {
    question: "Does the website run the offline AI?",
    answer:
      "No. The website is the information and download hub. Local inference belongs inside the installed desktop app and runs on the user's computer.",
  },
];

function CoreGraphic() {
  return (
    <div className="core-stage" aria-label="JARVIS abstract system core illustration" role="img">
      <div className="core-grid" />
      <div className="core-coordinates coordinate-top">LOCAL INTELLIGENCE <span>01 / 04</span></div>
      <div className="core-coordinates coordinate-bottom">SYSTEM READY <span>LATENCY: LOW</span></div>
      <div className="orbit orbit-one" />
      <div className="orbit orbit-two" />
      <div className="orbit orbit-three" />
      <div className="orbit orbit-four" />
      <div className="core-halo" />
      <div className="core-disc">
        <div className="core-inner">
          <div className="core-glyph">J</div>
          <div className="core-line" />
          <div className="core-caption">J.A.R.V.I.S.</div>
        </div>
      </div>
      <div className="core-dot dot-one" />
      <div className="core-dot dot-two" />
      <div className="core-dot dot-three" />
      <div className="core-label label-left"><span className="signal-dot" /> LOCAL MODEL</div>
      <div className="core-label label-right"><span className="signal-dot signal-dot-gold" /> YOUR CONTROL</div>
      <div className="core-scanline" />
    </div>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="section-eyebrow">
      <span className="eyebrow-mark" />
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <div className="announcement">
        <span className="announcement-pulse" />
        <span>THE DESKTOP EXPERIENCE IS IN DEVELOPMENT</span>
        <a href="#downloads">Follow the first release <ArrowUpRight size={13} /></a>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="JARVIS home">
          <span className="brand-symbol"><span>J</span></span>
          <span className="brand-wordmark">JARVIS<span className="brand-period">.</span></span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#capabilities">Capabilities</a>
          <a href="#offline">Offline AI</a>
          <a href="#downloads">Downloads</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="header-cta" href="#downloads">Get JARVIS <ArrowUpRight size={15} /></a>
      </header>

      <section className="hero section-wrap" id="top">
        <div className="hero-copy">
          <div className="eyebrow-pill"><span className="pill-spark">✳</span> A DESKTOP AI, BUILT AROUND YOU</div>
          <h1>Intelligence.<br /><span>At your</span> command<span className="title-period">.</span></h1>
          <p className="hero-lede">
            Meet JARVIS: a desktop assistant designed to bring local AI,
            thoughtful automation, and a more natural way to work into one
            focused experience.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#downloads">Explore downloads <ArrowRight size={16} /></a>
            <a className="button button-quiet" href="#capabilities">Discover the system <ArrowDownRight size={16} /></a>
          </div>
          <div className="hero-trust-row">
            <span><LockKeyhole size={14} /> Local-first direction</span>
            <span><ShieldCheck size={14} /> You stay in control</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-topline"><span>FIG. 001 — SYSTEM CORE</span><span>BUILD 00.1 / PREVIEW</span></div>
          <CoreGraphic />
          <div className="visual-footer">
            <span className="visual-status"><span className="signal-dot" /> ARCHITECTURE IN PROGRESS</span>
            <span>CORE / 56</span>
          </div>
        </div>
        <div className="hero-side-note"><span>01</span><span className="side-note-line" /> DESIGNED FOR THE DESKTOP</div>
      </section>

      <section className="signal-strip" aria-label="Design principles">
        <div className="signal-strip-inner">
          <div><CloudOff size={17} /><span>OFFLINE-CAPABLE CORE</span></div>
          <span className="strip-divider" />
          <div><ShieldCheck size={17} /><span>PRIVACY-CONSCIOUS</span></div>
          <span className="strip-divider" />
          <div><Zap size={17} /><span>BUILT FOR REAL WORK</span></div>
          <span className="strip-divider" />
          <div><Mic size={17} /><span>VOICE + CHAT VISION</span></div>
        </div>
      </section>

      <section className="intro-section section-wrap" id="capabilities">
        <div className="section-heading">
          <SectionEyebrow>THE SYSTEM</SectionEyebrow>
          <h2>More than a chat window.<br /><span>A capable desktop companion.</span></h2>
          <p>
            JARVIS is being designed around a simple idea: your assistant should
            be useful on your machine, transparent about what needs the cloud,
            and careful with actions that affect your world.
          </p>
        </div>
        <div className="capability-grid">
          {capabilities.map((item) => {
            const Icon = item.icon;
            return (
              <article className="capability-card" key={item.number}>
                <div className="card-top"><span>{item.number}</span><Icon size={21} strokeWidth={1.5} /></div>
                <div className="card-label">{item.label}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="card-bottom"><span className="card-tick" /><span>CORE PRINCIPLE</span></div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="offline-section" id="offline">
        <div className="offline-orbit" aria-hidden="true"><div /><div /><div /></div>
        <div className="offline-content section-wrap">
          <div className="offline-copy">
            <SectionEyebrow>LOCAL BY DESIGN</SectionEyebrow>
            <h2>Your AI.<br /><span>Your machine.</span><br />Your choice.</h2>
            <p>
              The offline experience belongs to the installed desktop app—not
              this website. After initial setup and model downloads, supported
              local tasks can run on your computer without sending each prompt
              to a cloud AI service.
            </p>
            <a className="text-link" href="#setup">See how offline setup works <ArrowUpRight size={16} /></a>
          </div>
          <div className="offline-panel">
            <div className="panel-header"><span><span className="signal-dot" /> LOCAL RUNTIME</span><span>CONCEPT</span></div>
            <div className="panel-main">
              <div className="chip-visual"><Cpu size={28} strokeWidth={1.2} /><span className="chip-glow" /></div>
              <div className="panel-main-copy"><span>ON-DEVICE INFERENCE</span><strong>Ollama + local model</strong><small>Runs on your computer after setup</small></div>
            </div>
            <div className="panel-rule" />
            <div className="panel-row"><span><Check size={15} /> Local prompts and responses</span><span className="panel-ok">OFFLINE</span></div>
            <div className="panel-row"><span><Check size={15} /> Supported local workflows</span><span className="panel-ok">OFFLINE</span></div>
            <div className="panel-row"><span><Radio size={15} /> Web search and cloud services</span><span className="panel-network">ONLINE</span></div>
            <div className="panel-footnote"><LockKeyhole size={14} /> First install and model downloads need a connection.</div>
          </div>
        </div>
      </section>

      <section className="setup-section section-wrap" id="setup">
        <div className="setup-heading">
          <SectionEyebrow>FROM DOWNLOAD TO OFFLINE</SectionEyebrow>
          <h2>Four steps.<br /><span>One ready assistant.</span></h2>
          <p>We are building the setup experience to make the difference between installed and offline-ready clear.</p>
        </div>
        <div className="setup-list">
          {setupSteps.map((step) => (
            <article className="setup-step" key={step.number}>
              <div className="setup-number">{step.number}</div>
              <div className="setup-step-copy"><h3>{step.title}</h3><p>{step.description}</p></div>
              <ArrowUpRight className="setup-arrow" size={18} />
            </article>
          ))}
        </div>
      </section>

      <section className="download-section" id="downloads">
        <div className="section-wrap">
          <div className="download-heading">
            <div>
              <SectionEyebrow>THE RELEASE CENTER</SectionEyebrow>
              <h2>Meet JARVIS on<br /><span>your platform.</span></h2>
            </div>
            <p>
              One official destination for desktop releases, install instructions,
              and update notes. Platform packages will appear here after they are
              built and validated.
            </p>
          </div>
          <div className="release-notice">
            <div className="release-notice-icon"><Download size={19} /></div>
            <div className="release-notice-copy"><strong>First public installers are in preparation.</strong><span>No verified desktop installer has been published yet. We will not label a build as downloadable until its release assets are available.</span></div>
            <a href={releaseUrl} target="_blank" rel="noreferrer">Open release page <ArrowUpRight size={15} /></a>
          </div>
          <div className="platform-grid">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <article className="platform-card" key={platform.name}>
                  <div className="platform-icon"><Icon size={23} strokeWidth={1.5} /></div>
                  <div className="platform-status"><span className="status-indicator" /> BUILD PREPARATION</div>
                  <h3>{platform.name}</h3>
                  <p>{platform.detail}</p>
                  <div className="platform-format">{platform.format}</div>
                  <a className="platform-link" href={releaseUrl} target="_blank" rel="noreferrer">Check release assets <ArrowUpRight size={15} /></a>
                </article>
              );
            })}
          </div>
          <div className="release-foot"><ShieldCheck size={15} /><span>Updates are planned to download in the background and ask for your confirmation before installation.</span></div>
        </div>
      </section>

      <section className="principles-section section-wrap">
        <div className="principles-mark"><span>J</span><div /></div>
        <div className="principles-copy">
          <SectionEyebrow>BUILT ON TRUST</SectionEyebrow>
          <h2>Powerful should still<br /><span>feel like yours.</span></h2>
          <p>
            Local-first AI is one part of the design. Clear permissions, honest
            network boundaries, and verifiable releases matter too. JARVIS should
            help you act—not hide what it is doing.
          </p>
        </div>
        <div className="principles-points">
          <div><span>01</span><div><strong>Visible by default</strong><p>Know when a task is local or network-dependent.</p></div></div>
          <div><span>02</span><div><strong>Permission before action</strong><p>Important desktop actions should respect your consent.</p></div></div>
          <div><span>03</span><div><strong>Updates with a choice</strong><p>Review and confirm installation of new versions.</p></div></div>
        </div>
      </section>

      <section className="faq-section section-wrap" id="faq">
        <div className="faq-heading">
          <SectionEyebrow>GOOD QUESTIONS</SectionEyebrow>
          <h2>Before you<br /><span>install anything.</span></h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details className="faq-item" key={faq.question} open={index === 0}>
              <summary><span>{faq.question}</span><span className="faq-plus">+</span></summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="final-cta section-wrap">
        <div className="cta-grid" aria-hidden="true" />
        <div className="final-cta-copy">
          <SectionEyebrow>THE NEXT INTERFACE</SectionEyebrow>
          <h2>Your desktop.<br /><span>With a new point of view.</span></h2>
          <p>Follow the release hub as we prepare the first installable builds.</p>
          <a className="button button-primary" href={releaseUrl} target="_blank" rel="noreferrer">Follow JARVIS releases <ArrowUpRight size={16} /></a>
        </div>
        <div className="cta-endmark"><span>J</span><div className="cta-ring" /><div className="cta-ring cta-ring-two" /></div>
      </section>

      <footer className="site-footer">
        <div className="footer-top">
          <a className="brand" href="#top" aria-label="JARVIS home">
            <span className="brand-symbol"><span>J</span></span>
            <span className="brand-wordmark">JARVIS<span className="brand-period">.</span></span>
          </a>
          <p>Local-first thinking. Thoughtful action. Your control.</p>
          <a className="footer-github" href="https://github.com/ibarakumo2000-stack/Jarvis-Website" target="_blank" rel="noreferrer"><Github size={16} /> Website source <ArrowUpRight size={14} /></a>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} JARVIS PROJECT</span><span>BUILT FOR THE DESKTOP, DESIGNED AROUND YOU.</span><a href="#top">BACK TO TOP ↑</a></div>
      </footer>
    </main>
  );
}
