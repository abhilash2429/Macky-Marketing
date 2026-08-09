import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type FooterLink = readonly [label: string, href: string];

const productLinks: FooterLink[] = [
  ["How it works", "/#how-it-works"],
  ["Capabilities", "/#capabilities"],
  ["Memory & agents", "/#memory-agents"],
  ["FAQ", "/#faq"],
];

const legalLinks: FooterLink[] = [["Privacy", "/privacy"], ["Terms", "/terms"]];

function FooterLinks({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="footer-links">
      <p>{title}</p>
      {links.map(([label, href]) => {
        const isExternal = href.startsWith("http");

        return isExternal ? (
          <a key={label} href={href} target="_blank" rel="noreferrer">{label}</a>
        ) : (
          <Link key={label} href={href}>{label}</Link>
        );
      })}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <h2>Voice in.<span>Action out.</span></h2>
        <Link className="button button-light" href="/waitlist" target="_blank" rel="noopener noreferrer">
          Request early access <ArrowUpRight size={17} />
        </Link>
      </div>

      <div className="footer-directory">
        <FooterLinks title="Product" links={productLinks} />
        <FooterLinks title="Legal" links={legalLinks} />
      </div>

      <div className="footer-bottom">
        <span>© 2026 Macky. Built for macOS 14.2 and later.</span>
        <span>Quiet when idle. Ready when called.</span>
      </div>
    </footer>
  );
}
