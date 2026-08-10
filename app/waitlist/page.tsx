import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { WaitlistForm } from "@/components/waitlist-form";
import { WaitlistSpotLink } from "@/components/waitlist-spot-link";

export const metadata: Metadata = {
  title: "Request early access",
  description: "Join the Macky waitlist for early access to a voice assistant that lives in your Mac's notch.",
};

const formApps = [
  { src: "/assets/gmail.svg", className: "is-gmail" },
  { src: "/assets/slack.svg", className: "is-slack" },
  { src: "/assets/notes.webp", className: "is-notes" },
  { src: "/assets/googlecalendar.svg", className: "is-calendar" },
];

export default function WaitlistPage() {
  return (
    <PageShell hideHeader hideFooter>
      <main className="waitlist-page">
        <section className="waitlist-layout">
          <div className="waitlist-copy">
            <h1>Let Macky handle the little interruptions.</h1>
            <p>
              Macky is a voice assistant that stays in your Mac&apos;s notch until you need a hand. Say what you need,
              then get back to what you were doing.
            </p>
            <WaitlistSpotLink />
          </div>

          <div className="waitlist-form-stage">
            <div className="waitlist-form-apps" aria-hidden="true">
              {formApps.map((app) => (
                <span key={app.className} className={`waitlist-app-chip ${app.className}`}>
                  <Image src={app.src} alt="" width={36} height={36} />
                </span>
              ))}
            </div>
            <aside className="waitlist-card" id="waitlist-form" aria-label="Request early access">
              <h2>Be one of the first to try Macky.</h2>
              <p>Access is opening gradually to keep the experience focused and useful.</p>
              <WaitlistForm />
            </aside>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
