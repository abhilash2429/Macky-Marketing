"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MackyLogo } from "@/components/macky-logo";
import { notchPath } from "@/components/notch-shape";

const navigation = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Capabilities", href: "/#capabilities" },
  { label: "Memory & agents", href: "/#memory-agents" },
  { label: "FAQ", href: "/#faq" },
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
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section2 = document.getElementById("how-it-works");
      let threshold = window.innerHeight * 1.4;
      if (section2) {
        threshold = section2.offsetTop + section2.offsetHeight - 80;
      }
      setIsHidden(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
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
    <header className={`site-header${isHidden ? " is-hidden" : ""}`}>
      <nav className={`nav-shell${deferEntrance ? " nav-shell-delayed" : ""}`} aria-label="Main navigation">
        <NavShellShape />

        <Link className="brand" href="/#hero" onClick={closeMenu}>
          <MackyLogo size={26} loading="eager" />
          <span>Macky</span>
        </Link>

        <div className="desktop-nav">
          {navigation.map((item) => <Link key={item.label} href={item.href}>{item.label}</Link>)}
          <Link className="nav-download" href="/waitlist">
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
              <Link key={item.label} href={item.href} onClick={closeMenu}>{item.label}</Link>
            ))}
            <Link href="/waitlist" onClick={closeMenu}>Early access <ArrowUpRight size={14} /></Link>
          </div>
        )}
      </nav>
    </header>
  );
}
