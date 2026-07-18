import { PageShell } from "@/components/page-shell";

export function LegalPage({ title, sections }: { title: string; sections: string[][] }) {
  return (
    <PageShell>
      <main className="legal-page">
        <article>
          <h1>{title}</h1>
          {sections.map((section, sectionIndex) => (
            <section key={`${section[0]}-${sectionIndex}`}>
              {section.map((paragraph, index) => {
                const isHeading = index === 0 && /^\d+\./.test(paragraph);
                if (isHeading) return <h2 key={paragraph}>{paragraph}</h2>;
                return <p className={sectionIndex === 0 && index === 0 ? "legal-date" : undefined} key={paragraph}>{paragraph}</p>;
              })}
            </section>
          ))}
        </article>
      </main>
    </PageShell>
  );
}
