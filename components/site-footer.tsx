import Link from "next/link";
import { GitFork } from "lucide-react";
import { HangingLogo } from "@/components/hanging-logo";
import { MackyLogo } from "@/components/macky-logo";
import { sourceUrl } from "@/lib/content";

const productLinks = [
  ["How it works", "/#how-it-works"],
  ["Capabilities", "/#capabilities"],
  ["State & Sub-agents", "/#memory-agents"],
  ["FAQ", "/#faq"],
];

const projectLinks = [
  ["Updates", "/updates"],
  ["Roadmap", "/roadmap"],
  ["Contact", "/contact"],
  ["Source code", sourceUrl],
];

const legalLinks = [["Privacy", "/privacy"], ["Terms", "/terms"]];

function FooterLinks({ title, links }: { title: string; links: string[][] }) {
  return (
    <div className="footer-links">
      <p>{title}</p>
      {links.map(([label, href]) => (
        <Link key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined}>{label}</Link>
      ))}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <HangingLogo />
      <div className="footer-brand">
        <div className="footer-logo">
          <MackyLogo size={46} glow />
          <div><strong>Macky</strong><span>Voice assistant for macOS</span></div>
        </div>
        <h2>Voice in.<span>Action out.</span></h2>
        <p>Hold a shortcut, say what you need, and Macky gets to work from your Mac&apos;s notch.</p>
        <a className="button button-light" href={sourceUrl} target="_blank" rel="noreferrer">
          <GitFork size={17} /> View on GitHub
        </a>
      </div>

      <div className="footer-directory">
        <FooterLinks title="Product" links={productLinks} />
        <FooterLinks title="Project" links={projectLinks} />
        <FooterLinks title="Legal" links={legalLinks} />
      </div>

      <div className="footer-bottom">
        <span>© 2026 Macky. Built for macOS 14.2 and later.</span>
        <span>Quiet when idle. Ready when called.</span>
      </div>
    </footer>
  );
}
