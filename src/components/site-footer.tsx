import Link from "next/link";
import { ArrowUpRight, Github, ShieldCheck } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="site-footer site-footer-global">
      <div className="footer-main section-wrap">
        <div className="footer-brand-column">
          <Link className="brand" href="/" aria-label="JARVIS home">
            <span className="brand-symbol"><span>J</span></span>
            <span className="brand-wordmark">JARVIS<span className="brand-period">.</span></span>
          </Link>
          <p>Local-first thinking. Thoughtful action. Your control.</p>
          <span className="footer-status"><span className="signal-dot" /> DESIGNED FOR THE DESKTOP</span>
        </div>
        <div className="footer-links-column">
          <span className="footer-label">EXPLORE</span>
          <Link href="/features">Capabilities</Link>
          <Link href="/offline">Offline AI</Link>
          <Link href="/downloads">Downloads</Link>
        </div>
        <div className="footer-links-column">
          <span className="footer-label">SUPPORT</span>
          <Link href="/updates">Updates</Link>
          <Link href="/faq">Help & FAQ</Link>
          <a href="https://github.com/ibarakumo2000-stack/Mark-56/issues" target="_blank" rel="noreferrer">Report an issue <ArrowUpRight size={13} /></a>
        </div>
        <div className="footer-trust">
          <ShieldCheck size={19} />
          <strong>Built around your control.</strong>
          <p>Clear network boundaries. Honest release status. Updates with confirmation.</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} JARVIS PROJECT</span>
        <span>BUILT FOR THE DESKTOP, DESIGNED AROUND YOU.</span>
        <a href="https://github.com/ibarakumo2000-stack/Jarvis-Website" target="_blank" rel="noreferrer"><Github size={14} /> Website source <ArrowUpRight size={12} /></a>
      </div>
    </footer>
  );
}
