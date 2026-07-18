import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { updates } from "@/lib/content";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return updates.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = updates.find((item) => item.slug === slug);
  return { title: post?.title ?? "Update" };
}

export default async function UpdateDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = updates.find((item) => item.slug === slug);
  if (!post) notFound();

  return (
    <PageShell>
      <main className="article-page">
        <Link className="back-link" href="/updates"><ArrowLeft size={17} /> All updates</Link>
        <article className="release-note">
          <time>{post.date}</time>
          <h1>{post.title}</h1>
          {post.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <h2>What&apos;s new</h2>
          <ul>
            {post.items.map((item) => <li key={item}><Check size={18} /> <span>{item}</span></li>)}
          </ul>
          {post.outro && <p>{post.outro}</p>}
        </article>
      </main>
    </PageShell>
  );
}
