import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Download, LifeBuoy, ShieldCheck, WifiOff } from "lucide-react";
import Reveal from "@/components/reveal";

export const metadata: Metadata = {
  title: "Help & FAQ",
  description: "Answers about installing JARVIS, offline AI, updates, and platform availability.",
};

const sections = [
  { title: "Getting started", questions: [
    { q: "Can I install JARVIS if I don't already have it?", a: "Yes, that is the goal of the official release center. The website links directly to a compatible installer when one is published. Until then, the first verified public installer is marked as in preparation, so unavailable packages are not presented as downloadable." },
    { q: "Which operating systems are supported?", a: "The release center is prepared for Windows, Ubuntu/Linux, and macOS. A platform is marked available only when a real installer for that system is published. Availability may differ by platform." },
    { q: "Do I need Python or a code editor?", a: "The packaged desktop installer is intended to include the runtime and required dependencies so users do not need Python or VS Code separately. Optional components may need their own setup." },
  ]},
  { title: "Offline AI and privacy", questions: [
    { q: "Does JARVIS work without internet?", a: "Supported local AI tasks can work offline after JARVIS, the local runtime, and the required model are installed. Web search, cloud AI, first-time downloads, and other network-based integrations still need internet." },
    { q: "What is Ollama?", a: "Ollama is the local model runtime used by the current offline integration. It runs on your computer and exposes a local API; JARVIS can use it when local-model mode is enabled." },
    { q: "Will every feature work offline?", a: "No. Only features whose code, models, and dependencies are installed locally can work offline. Voice, browser automation, and other integrations can have additional requirements." },
  ]},
  { title: "Updates and troubleshooting", questions: [
    { q: "Why does the website say an installer isn't published?", a: "The site reads the official stable release and checks for a valid platform-specific installer asset. Until that asset exists, the page keeps its download disabled instead of offering source code or a broken link." },
    { q: "What should an update check say when there's no update?", a: "When no newer stable release exists—including before the first stable release is published—the desktop check should report that JARVIS is up to date. A network failure should instead explain that the check could not complete." },
    { q: "Will updates install automatically?", a: "The intended behavior is to check and download in the background, then ask for confirmation. The desktop application currently has release-check behavior; secure automatic installation and rollback still need implementation and testing." },
  ]},
];

export default function FAQPage() {
  return (
    <main className="inner-page">
      <section className="page-hero section-wrap faq-page-hero">
        <Reveal><div className="eyebrow-pill"><span className="pill-spark">✳</span> HELP CENTER / YOUR QUESTIONS</div><h1>Clear answers.<br/><span>Fewer roadblocks.</span></h1><p className="page-lede">Practical guidance for installation, local models, updates, and what to expect from each platform.</p><div className="hero-actions"><Link className="button button-primary" href="/downloads">Visit downloads <Download size={15}/></Link><Link className="button button-quiet" href="/offline">Offline setup guide <ArrowRight size={15}/></Link></div></Reveal>
        <Reveal className="help-quick-links" delay={100}><span className="footer-label">POPULAR TOPICS</span><Link href="/downloads"><Download size={16}/> Installing JARVIS <ArrowUpRight size={14}/></Link><Link href="/offline"><WifiOff size={16}/> Running offline <ArrowUpRight size={14}/></Link><Link href="/updates"><ShieldCheck size={16}/> Update behavior <ArrowUpRight size={14}/></Link></Reveal>
      </section>
      <section className="page-content section-wrap faq-main">
        {sections.map((section, sectionIndex)=><section className="faq-category" key={section.title} aria-labelledby={`faq-${sectionIndex}`}><Reveal className="faq-category-heading"><span className="section-eyebrow"><span className="eyebrow-mark"/> 0{sectionIndex+1} / HELP TOPIC</span><h2 id={`faq-${sectionIndex}`}>{section.title}</h2></Reveal><div className="faq-list faq-list-page">{section.questions.map((item,index)=><Reveal key={item.q} delay={index*35}><details className="faq-item"><summary><span>{item.q}</span><span className="faq-plus">+</span></summary><p>{item.a}</p></details></Reveal>)}</div></section>)}
      </section>
      <section className="page-cta-band section-wrap"><div className="cta-band-orbit" aria-hidden="true"><LifeBuoy size={40}/></div><div><div className="section-eyebrow"><span className="eyebrow-mark"/> STILL NEED HELP?</div><h2>Start with the right guide.</h2><p>Review offline setup or report a reproducible problem in the project.</p></div><div className="page-cta-actions"><Link className="button button-primary" href="/offline">Offline AI guide <ArrowRight size={15}/></Link><a className="text-link" href="https://github.com/ibarakumo2000-stack/Mark-56/issues" target="_blank" rel="noreferrer">Report a problem <ArrowUpRight size={15}/></a></div></section>
    </main>
  );
}
