"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Download, Menu, X } from "lucide-react";

const navigation = [
  { href: "/", label: "Overview" },
  { href: "/features", label: "Capabilities" },
  { href: "/offline", label: "Offline AI" },
  { href: "/downloads", label: "Downloads" },
  { href: "/updates", label: "Updates" },
  { href: "/faq", label: "Help & FAQ" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <div className="site-announcement">
        <span className="announcement-pulse" />
        <span>LOCAL-FIRST AI · BUILT FOR YOUR DESKTOP</span>
        <Link href="/downloads">Explore releases <ArrowUpRight size={13} /></Link>
      </div>
      <header className="site-header site-header-global">
        <Link className="brand" href="/" aria-label="JARVIS home" onClick={closeMenu}>
          <span className="brand-symbol"><span>J</span></span>
          <span className="brand-wordmark">JARVIS<span className="brand-period">.</span></span>
        </Link>

        <nav className={`desktop-nav ${menuOpen ? "nav-open" : ""}`} aria-label="Main navigation">
          {navigation.map((item) => {
            const active = item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                href={item.href}
                key={item.href}
                aria-current={active ? "page" : undefined}
                className={active ? "nav-link nav-link-active" : "nav-link"}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            );
          })}
          <Link className="mobile-download-link" href="/downloads" onClick={closeMenu}>
            Get JARVIS <Download size={15} />
          </Link>
        </nav>

        <Link className="header-cta" href="/downloads">
          Get JARVIS <Download size={15} />
        </Link>

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>
    </>
  );
}
