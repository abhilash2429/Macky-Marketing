import Image from "next/image";
import {
  AppWindow,
  BrainCircuit,
  CalendarDays,
  Command,
  Eye,
  FileText,
  Keyboard,
  MousePointer2,
  Network,
  Workflow,
} from "lucide-react";
import { FAQList } from "@/components/faq-list";
import { CapabilityFeatures } from "@/components/capability-features";
import { HeroCopy } from "@/components/hero-copy";
import { MackyLogo } from "@/components/macky-logo";
import { PageShell } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import { connectors, nextCapabilities } from "@/lib/content";

const howSteps = [
  {
    number: "01",
    title: "Hold",
    detail: "Press your shortcut and keep holding.",
    visual: "hold" as const,
  },
  {
    number: "02",
    title: "Speak",
    detail: "Say what you need in plain language.",
    visual: "speak" as const,
  },
  {
    number: "03",
    title: "Done",
    detail: "Macky acts. You stay where you were.",
    visual: "done" as const,
  },
];

const nativeActions = [
  { icon: CalendarDays, title: "Calendar", description: "Read events, create meetings, and find open time." },
  { icon: Command, title: "System controls", description: "Change volume, toggle Do Not Disturb, or lock your Mac." },
  { icon: MousePointer2, title: "Visible UI", description: "Move, click, drag, and scroll when you ask Macky to operate the screen." },
  { icon: AppWindow, title: "Apps & websites", description: "Launch applications and open the right page without leaving your flow." },
  { icon: Eye, title: "Screen context", description: "A fresh screenshot is used only when a visual request needs it." },
  { icon: FileText, title: "Files", description: "Drop images, PDFs, and readable files into the active conversation." },
];

export default function HomePage() {
  return (
    <PageShell deferHeaderEntrance>
        <main>
        <section className="hero" id="hero">
          <div className="hero-bg" aria-hidden="true" />
          <HeroCopy />
        </section>

        <section className="intro-section" id="how-it-works">
          <div className="section intro-content">
            <div className="section-heading centered how-heading">
              <span className="eyebrow">How it works</span>
              <h2>From voice to action in three steps.</h2>
              <p>Macky stays in the notch until you call it — then it gets out of the way.</p>
            </div>

            <div className="how-stage">
              <div className="how-flow" aria-hidden="true">
                <span className="how-flow-track" />
                <span className="how-flow-pulse" />
              </div>

              <ol className="how-steps">
                {howSteps.map((step, index) => (
                  <li className="how-step-item" key={step.number}>
                    <Reveal className="how-step-reveal" delay={index * 110}>
                      <div className={`how-step is-${step.visual}`}>
                        <span className="how-step-watermark" aria-hidden="true">
                          {step.number}
                        </span>

                        <div className="how-step-visual" aria-hidden="true">
                          {step.visual === "hold" && (
                            <div className="how-keys">
                              <kbd>⌃</kbd>
                              <kbd>⌥</kbd>
                            </div>
                          )}
                          {step.visual === "speak" && (
                            <div className="how-notch">
                              <span className="how-wave">
                                <i /><i /><i /><i /><i /><i /><i />
                              </span>
                            </div>
                          )}
                          {step.visual === "done" && (
                            <div className="how-done" aria-hidden="true">
                              <svg className="how-done-check" viewBox="0 0 56 56" fill="none">
                                <circle className="how-done-circle" cx="28" cy="28" r="24" />
                                <path className="how-done-tick" d="M17.5 28.5L24.5 35.5L38.5 20.5" />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="how-step-copy">
                          <span className="how-step-number">{step.number}</span>
                          <h3>{step.title}</h3>
                          {step.visual === "hold" && (
                            <span className="sr-only">Control and Option</span>
                          )}
                          <p className="how-step-detail">{step.detail}</p>
                        </div>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="feature-stack section" id="capabilities">
          <div className="section-heading centered how-heading capabilities-heading">
            <span className="eyebrow">What Macky can do</span>
          </div>
          <CapabilityFeatures />
        </section>

        <section className="section organization-grid" id="memory-agents">
          <article className="organization-card category-card">
            <div>
              <span className="eyebrow"><BrainCircuit size={15} /> Here now</span>
              <h3>State Memory</h3>
              <p>{nextCapabilities[0].description}</p>
            </div>
            <div className="category-ui memory-ui">
              <div><span>Current project</span><small>active</small></div>
              <div><span>Your preferences</span><small>reviewable</small></div>
              <div><span>Recent decisions</span><small>controlled</small></div>
              <div><span>Remembered context</span><small>removable</small></div>
            </div>
          </article>
          <article className="organization-card filters-card">
            <div>
              <span className="eyebrow"><Workflow size={15} /> Here now</span>
              <h3>Sub-agents</h3>
              <p>{nextCapabilities[1].description}</p>
            </div>
            <div className="agent-orbit">
              <div className="main-agent"><MackyLogo size={56} glow /><span>Macky</span></div>
              <div className="agent-chip agent-chip-one">Research</div>
              <div className="agent-chip agent-chip-two">Code</div>
              <div className="agent-chip agent-chip-three">Apps</div>
            </div>
          </article>
        </section>

        <section className="section audience-section">
          <div className="section-heading">
            <span className="eyebrow"><Command size={16} /> Native to your workflow</span>
            <h2>Built for the things you do on a Mac.</h2>
            <p>Local macOS actions stay close to the machine. Connected services come in only when you choose to use them.</p>
          </div>
          <div className="audience-grid">
            {nativeActions.map(({ icon: Icon, title, description }) => (
              <article className="audience-card" key={title}>
                <span className="audience-icon"><Icon size={28} /></span><h3>{title}</h3><p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section connector-showcase">
          <div className="section-heading centered">
            <span className="eyebrow"><Network size={16} /> Connected when you choose</span>
            <h2>Your apps, one voice away.</h2>
          </div>
          <div className="connector-strip">
            {connectors.map((connector) => (
              <article key={connector.name}><Image src={connector.icon} width={52} height={52} alt="" /><strong>{connector.name}</strong><small>&ldquo;{connector.example}&rdquo;</small></article>
            ))}
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <div className="section-heading">
            <span className="eyebrow"><Keyboard size={16} /> Before you start</span>
            <h2>Frequently Asked Questions</h2>
            <p>What Macky does today, how permissions and context work, and what is still coming next.</p>
          </div>
          <FAQList />
        </section>

        </main>
    </PageShell>
  );
}
