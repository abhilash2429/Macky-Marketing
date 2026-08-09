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

/**
 * Paints the nav bar as the notch silhouette: flat top edge, top corners
 * curving inward, bottom corners flaring outward. Measured rather than
 * scaled so the corner radii stay circular at any width.
 */
function NavShellShape() {
  const ref = useRef<SVGSVGElement | null>(null);
  const [box, setBox] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const nav = ref.current?.parentElement;
    if (!nav) return;

    const observer = new ResizeObserver(([entry]) => {
      const border = entry.borderBoxSize?.[0];
      const width = border ? border.inlineSize : entry.contentRect.width;
      const height = border ? border.blockSize : entry.contentRect.height;
      setBox({ width, height });
    });

    observer.observe(nav);
    return () => observer.disconnect();
  }, []);

  const OVERHANG = 22;
  const width = box.width + OVERHANG * 2;
  const height = box.height;
  const path = box.width > 0 ? notchPath(width, height, OVERHANG, 20) : "";

  return (
    <svg
      ref={ref}
      className="nav-shell-shape"
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      {path && <path d={path} fill="#000" />}
    </svg>
  );
}

export function SiteHeader({ deferEntrance = false }: { deferEntrance?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const lockedSectionRef = useRef<string | null>(null);
  const unlockTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const sectionIds = navigation.map((item) => item.id);

    const resolveActiveSection = () => {
      const hero = document.getElementById("hero");
      if (!hero) return null;

      const collapseAt = Math.min(120, hero.offsetHeight * 0.12);
      if (window.scrollY < collapseAt) return null;

      const marker = window.scrollY + 96;
      let current: string | null = null;

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (!section) continue;
        if (section.offsetTop <= marker) current = id;
      }

      return current;
    };

    const handleScroll = () => {
      const hero = document.getElementById("hero");
      if (!hero) {
        setIsCompact(false);
        setActiveSection(null);
        return;
      }

      // Collapse shortly after leaving the top of the hero — keep compact for the rest of the page.
      const collapseAt = Math.min(120, hero.offsetHeight * 0.12);
      setIsCompact(window.scrollY > collapseAt);

      // While animating to a clicked section, keep that highlight only — skip intermediates.
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

        <Link className="brand" href="/#hero" onClick={closeMenu} aria-hidden={isCompact} tabIndex={isCompact ? -1 : undefined}>
          <MackyLogo size={26} loading="eager" />
          <span>Macky</span>
        </Link>

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
          <Link className="nav-download" href="/waitlist" aria-hidden={isCompact} tabIndex={isCompact ? -1 : undefined}>
            Early access <ArrowUpRight size={14} />
          </Link>
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
            <Link href="/waitlist" onClick={closeMenu}>Early access <ArrowUpRight size={14} /></Link>
          </div>
        )}
      </nav>
    </header>
  );
}
