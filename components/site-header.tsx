"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MackyLogo } from "@/components/macky-logo";
import { notchPath } from "@/components/notch-shape";

const navigation = [
  { label: "How it works", href: "/#how-it-works", id: "how-it-works" },
  { label: "Capabilities", href: "/#capabilities", id: "capabilities" },
  { label: "Memory & agents", href: "/#memory-agents", id: "memory-agents" },
  { label: "FAQ", href: "/#faq", id: "faq" },
];

const COMPACT_ON = 120;
const COMPACT_OFF = 48;

/**
 * Paints the nav bar as the notch silhouette. Updates the path directly on
 * resize so the morph stays in sync with the CSS width animation.
 */
function NavShellShape() {
  const ref = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const nav = ref.current?.parentElement;
    if (!nav) return;

    const OVERHANG = 22;

    const paint = (entry: ResizeObserverEntry) => {
      const border = entry.borderBoxSize?.[0];
      const contentWidth = border ? border.inlineSize : entry.contentRect.width;
      const height = border ? border.blockSize : entry.contentRect.height;
      const width = contentWidth + OVERHANG * 2;
      const svg = ref.current;
      const path = pathRef.current;
      if (!svg || !path || contentWidth <= 0) return;

      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      path.setAttribute("d", notchPath(width, height, OVERHANG, 20));
    };

    const observer = new ResizeObserver(([entry]) => paint(entry));
    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  return (
    <svg ref={ref} className="nav-shell-shape" aria-hidden="true">
      <path ref={pathRef} fill="#000" />
    </svg>
  );
}

export function SiteHeader({ deferEntrance = false }: { deferEntrance?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [brandWidth, setBrandWidth] = useState(0);
  const [ctaWidth, setCtaWidth] = useState(0);
  const brandInnerRef = useRef<HTMLAnchorElement | null>(null);
  const ctaInnerRef = useRef<HTMLAnchorElement | null>(null);
  const lockedSectionRef = useRef<string | null>(null);
  const unlockTimerRef = useRef<number | null>(null);
  const compactRef = useRef(false);

  useEffect(() => {
    const measure = () => {
      if (brandInnerRef.current) setBrandWidth(brandInnerRef.current.scrollWidth);
      if (ctaInnerRef.current) setCtaWidth(ctaInnerRef.current.scrollWidth);
    };

    measure();
    document.fonts?.ready.then(measure).catch(() => undefined);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const sectionIds = navigation.map((item) => item.id);

    const resolveActiveSection = () => {
      if (window.scrollY < COMPACT_OFF) return null;

      const marker = window.scrollY + 96;
      let current: string | null = null;
      let foundSection = false;

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (!section) continue;
        foundSection = true;
        if (section.offsetTop <= marker) current = id;
      }

      // Only highlight on pages that have landing sections (e.g. home).
      return foundSection ? current : null;
    };

    const handleScroll = () => {
      // Hysteresis keeps the morph from flickering at the threshold — same on every page.
      const nextCompact = compactRef.current
        ? window.scrollY > COMPACT_OFF
        : window.scrollY > COMPACT_ON;

      if (nextCompact !== compactRef.current) {
        compactRef.current = nextCompact;
        setIsCompact(nextCompact);
      }

      if (lockedSectionRef.current) {
        setActiveSection(lockedSectionRef.current);
        return;
      }

      setActiveSection(resolveActiveSection());
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isClosing) return;

    const timer = window.setTimeout(() => setIsClosing(false), 180);
    return () => window.clearTimeout(timer);
  }, [isClosing]);

  const closeMenu = () => {
    setIsOpen(false);
    if (isOpen) setIsClosing(true);
  };

  const selectSection = (id: string) => {
    lockedSectionRef.current = id;
    setActiveSection(id);
    closeMenu();

    if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current);
    unlockTimerRef.current = window.setTimeout(() => {
      lockedSectionRef.current = null;
      unlockTimerRef.current = null;
    }, 900);
  };

  const toggleMenu = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsClosing(true);
      return;
    }

    setIsClosing(false);
    setIsOpen(true);
  };

  return (
    <header className="site-header">
      <nav
        className={`nav-shell${deferEntrance ? " nav-shell-delayed" : ""}${isCompact ? " is-compact" : ""}`}
        aria-label="Main navigation"
      >
        <NavShellShape />

        <div
          className="nav-collapse nav-collapse-brand"
          style={{ width: isCompact ? 0 : brandWidth || undefined }}
        >
          <Link
            ref={brandInnerRef}
            className="brand"
            href="/#hero"
            onClick={closeMenu}
            aria-hidden={isCompact}
            tabIndex={isCompact ? -1 : undefined}
          >
            <MackyLogo size={26} loading="eager" />
            <span>Macky</span>
          </Link>
        </div>

        <div className="desktop-nav">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={activeSection === item.id ? "is-active" : undefined}
              aria-current={activeSection === item.id ? "true" : undefined}
              onClick={() => selectSection(item.id)}
            >
              {item.label}
            </Link>
          ))}
          <div
            className="nav-collapse nav-collapse-cta"
            style={{ width: isCompact ? 0 : ctaWidth || undefined }}
          >
            <Link
              ref={ctaInnerRef}
              className="nav-download"
              href="/waitlist"
              target="_blank"
              rel="noopener noreferrer"
              aria-hidden={isCompact}
              tabIndex={isCompact ? -1 : undefined}
            >
              Early access <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        <button
          type="button"
          className="menu-button"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={toggleMenu}
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {(isOpen || isClosing) && (
          <div id="mobile-navigation" className={`mobile-nav ${isOpen ? "is-open" : "is-closing"}`} aria-hidden={!isOpen}>
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={activeSection === item.id ? "is-active" : undefined}
                aria-current={activeSection === item.id ? "true" : undefined}
                onClick={() => selectSection(item.id)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/waitlist" target="_blank" rel="noopener noreferrer" onClick={closeMenu}>
              Early access <ArrowUpRight size={14} />
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
