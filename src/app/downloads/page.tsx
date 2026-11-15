import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  BrainCircuit,
  Code2,
  Eye,
  Gauge,
  Layers3,
  LockKeyhole,
  Network,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Workflow,
} from "lucide-react";
import Reveal from "@/components/reveal";

export const metadata: Metadata = {
  title: "JARVIS skills & capabilities",
  description:
    "Discover the voice, desktop, local AI, coding, automation, plugin and companion-device capabilities built into JARVIS.",
};

const skills: {
  number: string;
  icon: typeof AudioLines;
  category: string;
  title: string;
  body: string;
  tags: string[];
  setup: string;
}[] = [
  {
    number: "01",
    icon: AudioLines,
    category: "VOICE & CONVERSATION",
    title: "Talk to your desktop.",
    body: "Move between text and live voice conversations in one assistant workspace. Ask questions, get help with tasks and keep your flow without jumping between separate tools.",
    tags: ["Voice + chat", "Live assistant", "Microphone controls"],
    setup: "Voice provider and microphone permissions required",
  },
  {
    number: "02",
    icon: Eye,
    category: "SCREEN AWARENESS",
    title: "Give JARVIS context.",
    body: "Use the screen agent to inspect visible content, read supported on-screen text and analyse what is happening. JARVIS can prepare a proposed action, while execution stays behind explicit confirmation.",
    tags: ["Screen analysis", "Text reading", "Confirmed actions"],
    setup: "Screen-capture permissions and OS support required",
  },
  {
    number: "03",
    icon: Workflow,
    category: "DESKTOP WORKFLOWS",
    title: "Turn repeat work into routines.",
    body: "Bring supported desktop actions, routines and quiet-hour controls into one place. Keep an eye on running tasks and see when an operating-system permission or dependency blocks an action.",
    tags: ["Actions", "Routines", "Task visibility"],
    setup: "Available actions vary by platform and permissions",
  },
  {
    number: "04",
    icon: Code2,
    category: "CODING & CREATION",
    title: "Build ideas into projects.",
    body: "Use the coding workspace and project tools to work through code, organise development tasks and create local starter websites with the website builder.",
    tags: ["Coding workspace", "Project tools", "Website builder"],
    setup: "AI provider configuration may be required",
  },
  {
    number: "05",
    icon: BrainCircuit,
    category: "LOCAL AI",
    title: "Keep supported AI work on your machine.",
    body: "Connect a local model runtime such as Ollama and use supported models for on-device requests. Choose local processing where it fits, and use connected cloud services when a task needs them.",
    tags: ["Ollama integration", "Model choice", "Offline-capable tasks"],
    setup: "Install a compatible model; performance depends on hardware",
  },
  {
    number: "06",
    icon: Layers3,
    category: "PLUGINS & EXTENSIONS",
    title: "Shape JARVIS around your work.",
    body: "Manage the modular toolset from the app: enable or disable supported plugins, add trusted local extensions and remove tools you no longer need.",
    tags: ["Plugin manager", "Extendable tools", "Your choice"],
    setup: "Only install plugins from sources you trust",
  },
  {
    number: "07",
    icon: Smartphone,
    category: "PHONE & CONNECTED DEVICES",
    title: "Take your assistant beyond the PC.",
    body: "Pair the companion app through an authenticated QR flow, manage paired devices and use supported remote-control and notification features from your phone.",
    tags: ["Phone pairing", "Device management", "Remote access"],
    setup: "Companion app, local network and approved permissions required",
  },
  {
    number: "08",
    icon: Network,
    category: "CONNECTED RESEARCH",
    title: "Bring the wider web into your workflow.",
    body: "Use supported web research and connected AI providers when a task benefits from current online information, while keeping local-model work separate.",
    tags: ["Web research", "Cloud providers", "Connected tools"],
    setup: "Internet access and any required provider credentials",
  },
  {
    number: "09",
    icon: Gauge,
    category: "SYSTEM AWARENESS",
    title: "See what your system is telling you.",
    body: "Follow supported system and network signals, task activity and platform-readiness information from the command centre, so limitations are easier to understand.",
    tags: ["System telemetry", "Network activity", "Platform awareness"],
    setup: "Available signals depend on your operating system",
  },
];

const principles = [
  {
    icon: LockKeyhole,
    title: "Control stays with you",
    body: "Permissions remain visible. Sensitive or consequential actions require the appropriate approval rather than silently running in the background.",
  },
  {
    icon: ShieldCheck,
    title: "Local when it makes sense",
    body: "Supported local models can process work on your own computer. Cloud features are separate and clearly need a connection.",
  },
  {
    icon: Sparkles,
    title: "A toolkit that can grow",
    body: "A modular plugin system lets you shape the assistant around your tools and the way you prefer to work.",
  },
];

export default function DownloadsPage() {
  return (
    <main className="inner-page skills-page">
      <section className="page-hero section-wrap skills-page-hero">
        <Reveal>
          <div className="eyebrow-pill"><span className="pill-spark">✳</span> THE JARVIS TOOLKIT / 56</div>
          <h1>More than an assistant.<br /><span>A partner for your desktop.</span></h1>
          <p className="page-lede">Voice, screen awareness, local AI, coding tools, automation and connected devices—brought together in one focused desktop workspace.</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/pricing">Explore plans &amp; pricing <ArrowRight size={16} /></Link>
            <Link className="button button-quiet" href="/offline">Understand local AI <ArrowUpRight size={15} /></Link>
          </div>
          <div className="skills-hero-proof">
            <span><ShieldCheck size={14} /> Permission-aware tools</span>
            <span><CpuIcon /> Local + connected AI</span>
            <span><Layers3 size={14} /> Modular capabilities</span>
          </div>
        </Reveal>
        <Reveal className="skills-hero-console" delay={110}>
          <div className="skills-console-top"><span><i /> JARVIS / WORKSPACE</span><span>CAPABILITY OVERVIEW</span></div>
          <div className="skills-console-title"><span>ONE DESKTOP.</span><strong>MANY WAYS<br />TO GET THINGS DONE.</strong></div>
          <div className="skills-console-list">
            <div><AudioLines size={16}/><span>Voice &amp; conversation</span><b>01</b></div>
            <div><Eye size={16}/><span>Screen understanding</span><b>02</b></div>
            <div><Code2 size={16}/><span>Coding &amp; creation</span><b>03</b></div>
            <div><BrainCircuit size={16}/><span>Local intelligence</span><b>04</b></div>
            <div><Workflow size={16}/><span>Workflows &amp; plugins</span><b>05</b></div>
          </div>
          <div className="skills-console-foot"><span>BUILT AROUND YOUR WORKFLOW</span><span>MARK 56</span></div>
        </Reveal>
      </section>

      <section className="page-content section-wrap skills-library-section">
        <Reveal className="section-heading">
          <div className="section-eyebrow"><span className="eyebrow-mark" /> EXPLORE THE SKILLSET</div>
          <h2>One assistant.<br /><span>A whole desktop toolkit.</span></h2>
          <p>Explore the ways JARVIS can help. Some capabilities need a connected provider, local model, device permission or operating-system support; each card explains what is required.</p>
        </Reveal>
        <div className="skills-library-grid">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <Reveal key={skill.number} delay={index * 45}>
                <article className="skills-library-card">
                  <div className="skills-card-top"><span>{skill.number} / {skill.category}</span><Icon size={22} strokeWidth={1.5}/></div>
                  <h3>{skill.title}</h3>
                  <p>{skill.body}</p>
                  <div className="skills-card-tags">{skill.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <div className="skills-card-setup"><i /><span>{skill.setup}</span></div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="skills-principles-section">
        <div className="section-wrap">
          <Reveal className="section-heading">
            <div className="section-eyebrow"><span className="eyebrow-mark" /> THE JARVIS APPROACH</div>
            <h2>Capable by design.<br /><span>Thoughtful by default.</span></h2>
            <p>Power is only useful when you understand what is happening and remain in control of what the assistant can do.</p>
          </Reveal>
          <div className="skills-principles-grid">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              return <Reveal key={principle.title} delay={index * 75}><article className="skills-principle-card"><Icon size={23}/><h3>{principle.title}</h3><p>{principle.body}</p></article></Reveal>;
            })}
          </div>
        </div>
      </section>

      <section className="page-content section-wrap skills-start-section">
        <Reveal className="section-heading">
          <div className="section-eyebrow"><span className="eyebrow-mark" /> YOUR NEXT STEP</div>
          <h2>Choose the access<br /><span>that fits your workflow.</span></h2>
          <p>Start with the permanent Classic licence or choose Premium for eligible future releases and ongoing feature upgrades.</p>
        </Reveal>
        <div className="skills-start-grid">
          <Reveal><article><span>01 / PICK YOUR PLAN</span><h3>Choose Classic or Premium.</h3><p>Compare the one-time and subscription options, including exactly what each licence covers.</p><Link href="/pricing">Compare plans <ArrowUpRight size={14}/></Link></article></Reveal>
          <Reveal delay={70}><article><span>02 / SET UP YOUR ASSISTANT</span><h3>Connect the tools you need.</h3><p>Choose an AI provider, add an optional local model and grant only the desktop permissions you want to use.</p><Link href="/offline">Explore local AI <ArrowUpRight size={14}/></Link></article></Reveal>
          <Reveal delay={140}><article><span>03 / MAKE IT YOURS</span><h3>Build your own workflow.</h3><p>Enable trusted plugins, configure routines and pair supported companion devices as your setup allows.</p><Link href="/features">See all capabilities <ArrowUpRight size={14}/></Link></article></Reveal>
        </div>
        <Reveal className="skills-payment-note" delay={190}>
          <LockKeyhole size={18}/>
          <div><strong>Secure checkout is being prepared.</strong><p>Plans and prices are visible now. Payment activation will follow Paystack merchant-account setup.</p></div>
          <Link className="button button-primary" href="/pricing">View JARVIS pricing <ArrowRight size={15}/></Link>
        </Reveal>
      </section>
    </main>
  );
}

function CpuIcon() {
  return <BrainCircuit size={14} />;
}
