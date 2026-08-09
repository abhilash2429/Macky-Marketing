import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown, Sparkles } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { WaitlistForm } from "@/components/waitlist-form";

export const metadata: Metadata = {
  title: "Request early access",
  description: "Join the Macky waitlist for early access to a voice assistant that lives in your Mac's notch.",
};

const reasonsToJoin = [
  ["Stay in your flow", "Macky lives in the notch, so help stays close without taking over the screen."],
  ["Use your own words", "Ask for a quick answer, a note, a reminder, or help with an app — the same way you would ask a person."],
  ["Keep the final say", "You choose the permissions, connected apps, and actions Macky can help with."],
];

const formApps = [
  { src: "/assets/gmail.svg", className: "is-gmail" },
  { src: "/assets/slack.svg", className: "is-slack" },
  { src: "/assets/notes.webp", className: "is-notes" },
  { src: "/assets/googlecalendar.svg", className: "is-calendar" },
];

export default function WaitlistPage() {
  return (
    <PageShell hideHeader>
      <main className="waitlist-page">
        <section className="waitlist-layout">
          <div className="waitlist-copy">
            <span className="eyebrow"><Sparkles size={16} /> Early access</span>
            <h1>Let Macky handle the little interruptions.</h1>
            <p>
              Macky is a voice assistant that stays in your Mac&apos;s notch until you need a hand. Say what you need,
              then get back to what you were doing.
            </p>
            <a className="waitlist-scroll" href="#waitlist-form">Request a spot <ArrowDown size={16} /></a>
          </div>

          <div className="waitlist-form-stage">
            <div className="waitlist-form-wash" aria-hidden="true" />
            <div className="waitlist-form-apps" aria-hidden="true">
              {formApps.map((app) => (
                <span key={app.className} className={`waitlist-app-chip ${app.className}`}>
                  <Image src={app.src} alt="" width={36} height={36} />
                </span>
              ))}
            </div>
            <aside className="waitlist-card" id="waitlist-form" aria-label="Request early access">
              <p className="waitlist-card-label">Get early access</p>
              <h2>Be one of the first to try Macky.</h2>
              <p>Access is opening gradually to keep the experience focused and useful.</p>
              <WaitlistForm />
            </aside>
          </div>
        </section>

        <section className="waitlist-reasons" aria-label="What early access includes">
          {reasonsToJoin.map(([title, description], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{title}</h2>
              <p>{description}</p>
            </article>
          ))}
        </section>
      </main>
    </PageShell>
  );
}
