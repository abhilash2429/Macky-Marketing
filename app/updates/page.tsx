import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { updates } from "@/lib/content";

export const metadata: Metadata = { title: "Updates" };

export default function UpdatesPage() {
  return (
    <PageShell>
      <main className="subpage">
        <section className="subpage-hero">
          <span className="eyebrow">Release notes</span>
          <h1>Updates</h1>
          <p>Recent product milestones from Macky&apos;s native app, realtime pipeline, and connected tool layer.</p>
        </section>
        <section className="updates-list">
          {updates.map((post) => (
            <Link className="update-card" href={`/updates/${post.slug}`} key={post.slug}>
              <time>{post.date}</time>
              <div>
                <h2>{post.title}</h2>
                <p>{post.intro[post.intro.length - 1]}</p>
                <span>Read update <ArrowUpRight size={17} /></span>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </PageShell>
  );
}
