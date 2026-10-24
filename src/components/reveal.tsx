"use client";

import { useEffect, useRef, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
};

export default function Reveal({
  children,
  className = "",
  delay = 0,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      element.classList.add("is-revealed");
      return;
    }

    element.style.setProperty("--reveal-delay", `${delay}ms`);
    element.classList.add("reveal-pending");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.classList.add("is-revealed");
            if (once) observer.unobserve(element);
          } else if (!once) {
            element.classList.remove("is-revealed");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay, once]);

  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}
