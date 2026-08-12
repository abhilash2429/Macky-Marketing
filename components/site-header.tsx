"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MackyLogo } from "@/components/macky-logo";
import { notchPath } from "@/components/notch-shape";

const navigation = [
  { label: "How it works", shortLabel: "How it works", href: "/#how-it-works", id: "how-it-works" },
  { label: "Capabilities", shortLabel: "Capabilities", href: "/#capabilities", id: "capabilities" },
  { label: "Memory & agents", shortLabel: "Memory", href: "/#memory-agents", id: "memory-agents" },
  { label: "FAQ", shortLabel: "FAQ", href: "/#faq", id: "faq" },
];

// Subpages without landing sections still compact on scroll.
const COMPACT_ON = 120;
const COMPACT_OFF = 48;
const SECTION_MARKER = 110;
const SECTION_EXPAND_BUFFER = 80;

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

  // Compact + section pill only after a landing section is reached.
  const activeItem = navigation.find((item) => item.id === activeSection) ?? null;
  const pillItem = activeItem ?? navigation[0];

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
      let current: string | null = null;
      let foundSection = false;

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (!section) continue;
        foundSection = true;
        // getBoundingClientRect avoids offsetParent bugs when sections nest
        // inside positioned wrappers (e.g. how-it-works inside hero-stage).
        if (section.getBoundingClientRect().top <= SECTION_MARKER) current = id;
      }

      // Only highlight on pages that have landing sections (e.g. home).
      return foundSection ? current : null;
    };

    const resolveCompact = (active: string | null) => {
      const firstSection = document.getElementById(sectionIds[0]);

      // Home: keep the full Macky nav through the entire hero; shrink only
      // once How it works (or a locked jump target) is in range.
      if (firstSection) {
        const top = firstSection.getBoundingClientRect().top;
        if (lockedSectionRef.current) return true;
        if (compactRef.current) return top <= SECTION_MARKER + SECTION_EXPAND_BUFFER;
        return active !== null || top <= SECTION_MARKER;
      }

      // Subpages: scroll-distance hysteresis.
      return compactRef.current
        ? window.scrollY > COMPACT_OFF
        : window.scrollY > COMPACT_ON;
    };

    const handleScroll = () => {
      const locked = lockedSectionRef.current;
      const active = locked ?? resolveActiveSection();
      const nextCompact = resolveCompact(active);

      if (nextCompact !== compactRef.current) {
        compactRef.current = nextCompact;
        setIsCompact(nextCompact);
      }

      if (locked) {
        setActiveSection(locked);
        // Hold the clicked section until scroll actually reaches it — otherwise
        // mid-page links like Capabilities flash blue while smooth-scrolling past.
        if (resolveActiveSection() === locked) {
          lockedSectionRef.current = null;
          if (unlockTimerRef.current) {
            window.clearTimeout(unlockTimerRef.current);
            unlockTimerRef.current = null;
          }
        }
        return;
      }

      setActiveSection(active);
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
    compactRef.current = true;
    setIsCompact(true);
    closeMenu();

    if (unlockTimerRef.current) window.clearTimeout(unlockTimerRef.current);
    // Fallback only — preferred unlock is when scroll reaches the section.
    unlockTimerRef.current = window.setTimeout(() => {
      lockedSectionRef.current = null;
      unlockTimerRef.current = null;
    }, 2500);
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
            onClick={() => {
              lockedSectionRef.current = null;
              setActiveSection(null);
              compactRef.current = false;
              setIsCompact(false);
              closeMenu();
            }}
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

        <Link
          className={`nav-active-section${isCompact ? "" : " is-empty"}`}
          href={pillItem.href}
          tabIndex={isCompact ? undefined : -1}
          aria-hidden={!isCompact}
          onClick={() => selectSection(pillItem.id)}
        >
          {pillItem.shortLabel}
        </Link>

        {(isOpen || isClosing) && (
          <div id="mobile-navigation" className={`mobile-nav ${isOpen ? "is-open" : "is-closing"}`} aria-hidden={!isOpen}>
            {navigation.map((item) => (
              <Link
                key={item.id}
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
