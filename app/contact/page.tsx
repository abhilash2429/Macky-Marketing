import type { Metadata } from "next";
import { ArrowUpRight, BookOpen, Bug, GitFork } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { sourceUrl } from "@/lib/content";

export const metadata: Metadata = { title: "Contact" };

const contactOptions = [
  {
    icon: Bug,
    title: "Report an issue",
    description: "Share a reproducible bug, permission problem, connector failure, or unexpected behavior.",
    href: `${sourceUrl}/issues/new`,
    action: "Open an issue",
  },
  {
    icon: GitFork,
    title: "Contribute",
    description: "Inspect the source, propose a focused change, or contribute to the native app and Worker.",
    href: sourceUrl,
    action: "View repository",
  },
  {
    icon: BookOpen,
    title: "Set up Macky",
    description: "Follow the current requirements, permission, sign-in, connector, and self-hosting guide.",
    href: `${sourceUrl}/blob/master/README.md`,
    action: "Read the guide",
  },
];

export default function ContactPage() {
  return (
    <PageShell>
      <main className="subpage contact-page">
        <section className="subpage-hero">
          <span className="eyebrow">Support and collaboration</span>
          <h1>Talk to the project.</h1>
          <p>Macky is under active development. Use the repository for issues, implementation questions, and contributions.</p>
        </section>
        <section className="contact-grid">
          {contactOptions.map(({ icon: Icon, title, description, href, action }) => (
            <a key={title} href={href} target="_blank" rel="noreferrer">
              <Icon size={24} />
              <h2>{title}</h2>
              <p>{description}</p>
              <span>{action} <ArrowUpRight size={16} /></span>
            </a>
          ))}
        </section>
      </main>
    </PageShell>
  );
}
