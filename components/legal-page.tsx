"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import type { LegalDocument } from "@/lib/content";

export function LegalPage({ document }: { document: LegalDocument }) {
  const pathname = usePathname();
  const isPrivacy = pathname.includes("privacy");
  const isTerms = pathname.includes("terms");

  return (
    <PageShell>
      <main className="legal-page">
        <div className="legal-container">
          <nav className="legal-tabs" aria-label="Legal documents navigation">
            <Link className={`legal-tab${isPrivacy ? " is-active" : ""}`} href="/privacy">
              Privacy &amp; Data
            </Link>
            <Link className={`legal-tab${isTerms ? " is-active" : ""}`} href="/terms">
              Terms of Use
            </Link>
          </nav>

          <article className="legal-document">
            <header className="legal-hero">
              <p className="legal-eyebrow">{document.eyebrow}</p>
              <h1>{document.title}</h1>
              <p className="legal-summary">{document.summary}</p>
              <dl className="legal-meta">
                <div><dt>Last updated</dt><dd>{document.lastUpdated}</dd></div>
                <div><dt>Applies to</dt><dd>Macky website &amp; service</dd></div>
              </dl>
            </header>

            {document.notice && <aside className="legal-notice" role="note"><p>{document.notice}</p></aside>}

            <section className="legal-highlights" aria-label="At a glance">
              {document.highlights.map((highlight) => (
                <div key={highlight.title}>
                  <h2>{highlight.title}</h2>
                  <p>{highlight.description}</p>
                </div>
              ))}
            </section>

            <div className="legal-sections">
              {document.sections.map((section, index) => (
                <section key={section.title}>
                  <p className="legal-section-number">{String(index + 1).padStart(2, "0")}</p>
                  <div>
                    <h2>{section.title}</h2>
                    {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </main>
    </PageShell>
  );
}
