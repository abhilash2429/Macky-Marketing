"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const revealRef = useRef<HTMLDivElement>(null);
  const [visibility, setVisibility] = useState<"initial" | "hidden" | "visible">("initial");

  useEffect(() => {
    const node = revealRef.current;
    if (!node) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisibility(entry.isIntersecting ? "visible" : "hidden"),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const isVisible = visibility !== "hidden";
  const style = { "--reveal-delay": `${delay}ms` } as CSSProperties;

  return (
    <div ref={revealRef} className={`reveal ${isVisible ? "is-visible" : "is-hidden"} ${className}`} style={style}>
      {children}
    </div>
  );
}
