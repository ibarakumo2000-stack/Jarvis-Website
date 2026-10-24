import Link from "next/link";
import { ArrowLeft, ArrowRight, Cpu, Download, House } from "lucide-react";
import Reveal from "@/components/reveal";

export default function NotFound() {
  return (
    <main className="not-found-page section-wrap">
      <Reveal className="not-found-copy">
        <span className="not-found-code">ERROR / 404</span>
        <div className="not-found-orbit" aria-hidden="true"><span>J</span><i /><i /></div>
        <div className="section-eyebrow"><span className="eyebrow-mark" /> SIGNAL LOST · ROUTE NOT FOUND</div>
        <h1>We couldn&apos;t<br /><span>find that page.</span></h1>
        <p className="page-lede">That link may have changed or the page may not exist. Let&apos;s get you back to something useful.</p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/"><House size={15} /> Return home <ArrowRight size={15} /></Link>
          <Link className="button button-quiet" href="/downloads"><Download size={15} /> Browse downloads</Link>
        </div>
        <div className="not-found-links">
          <Link href="/features"><Cpu size={15} /> Explore capabilities <ArrowRight size={13} /></Link>
          <Link href="/offline"><ArrowLeft size={14} /> Read the offline AI guide</Link>
        </div>
      </Reveal>
    </main>
  );
}
