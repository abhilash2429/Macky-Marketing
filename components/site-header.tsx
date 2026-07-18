"use client";

import Link from "next/link";
import { GitFork, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { MackyLogo } from "@/components/macky-logo";
import { sourceUrl } from "@/lib/content";

const navigation = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Capabilities", href: "/#capabilities" },
  { label: "Coming next", href: "/#coming-next" },
  { label: "FAQ", href: "/#faq" },
];

export function SiteHeader({ deferEntrance = false }: { deferEntrance?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

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
    <header className="site-header">
      <nav className={`nav-shell${deferEntrance ? " nav-shell-delayed" : ""}`} aria-label="Main navigation">
        <Link className="brand" href="/#hero" onClick={closeMenu}>
          <MackyLogo size={26} loading="eager" />
          <span>Macky</span>
        </Link>

        <div className="desktop-nav">
          {navigation.map((item) => <Link key={item.label} href={item.href}>{item.label}</Link>)}
          <a className="nav-download" href={sourceUrl} target="_blank" rel="noreferrer">
            <GitFork size={14} /> Get Macky
          </a>
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
            <a href={sourceUrl} target="_blank" rel="noreferrer" onClick={closeMenu}><GitFork size={14} /> Get Macky</a>
          </div>
        )}
      </nav>
    </header>
  );
}
