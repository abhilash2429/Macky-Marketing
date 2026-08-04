import type { Metadata } from "next";
import { ArrowUpRight, CheckCircle2, CircleDashed, Lightbulb } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "Roadmap" };

const roadmapColumns = [
  {
    title: "Shipped",
    icon: CheckCircle2,
    items: [
      "Push-to-talk realtime assistant",
      "Safe Ctrl + Fn dictation",
      "On-demand screen context",
      "Native Mac actions & 7 connectors",
      "User-controlled State Memory",
      "Bounded sub-agent delegation",
    ],
  },
  {
    title: "Next up",
    icon: CircleDashed,
    items: [
      "Expanded Skill catalog",
      "Wire Skills into realtime behavior",
      "Visible delegated task progress",
      "Background-safe task continuation",
    ],
  },
  {
    title: "Exploring",
    icon: Lightbulb,
    items: [
      "Broader local Mac tool surface",
      "Custom local sub-agent models",
      "Team-shared memory spaces",
      "More connector workflows",
    ],
  },
];

export default function RoadmapPage() {
  return (
    <PageShell>
      <main className="roadmap-page">
        <section className="subpage-hero compact">
          <span className="eyebrow">What comes next</span>
          <h1>Roadmap</h1>
          <p>What works today, what comes next, and which ideas are still being shaped.</p>
          <a className="button button-dark" href="/contact">Send feedback <ArrowUpRight size={17} /></a>
        </section>
        <section className="roadmap-board">
          {roadmapColumns.map(({ title, icon: Icon, items }) => (
            <article key={title}>
              <h2><Icon size={20} /> {title}</h2>
              {items.map((item) => <div className="roadmap-item" key={item}>{item}</div>)}
            </article>
          ))}
        </section>
      </main>
    </PageShell>
  );
}
