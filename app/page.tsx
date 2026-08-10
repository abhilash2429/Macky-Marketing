import Image from "next/image";
import {
  Keyboard,
  Network,
} from "lucide-react";
import { FAQList } from "@/components/faq-list";
import { CapabilityFeatures } from "@/components/capability-features";
import { HeroCopy } from "@/components/hero-copy";
import { PageShell } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import { connectors } from "@/lib/content";

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
              <h2>
                Three steps. <em>One breath.</em>
              </h2>
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

        <section className="memory-story" id="memory-agents">
          <div className="memory-story-inner">
            <header className="memory-story-hero">
              <span className="eyebrow">Memory</span>
              <h2>
                Your memory that <em>closes open loops</em>
              </h2>
              <p>
                Most assistants forget the moment you let go of the key.
                Macky keeps a personal memory you own — unfinished work,
                decisions in flight, preferences that matter — so the next
                voice turn already knows what still belongs on your plate.
              </p>
            </header>

            <div className="memory-story-flow">
              <Reveal className="memory-beat" delay={0}>
                <span className="memory-beat-num">01</span>
                <h3>It finds what’s still open</h3>
                <p>
                  A follow-up you meant to send. A half-decision from yesterday.
                  A thread that never quite landed. Macky surfaces the high-value
                  open loops from your sessions — not as a chat archive you dig through,
                  but as living work that still needs a hand.
                </p>
              </Reveal>

              <Reveal className="memory-beat" delay={80}>
                <span className="memory-beat-num">02</span>
                <h3>Then it helps close them</h3>
                <p>
                  Memory isn’t a scrapbook. It traces what changed, what you decided,
                  and what’s left unfinished — then carries that forward until the loop
                  actually resolves. Context-switch freely. Macky doesn’t drop what
                  should still be on your plate.
                </p>
              </Reveal>

              <Reveal className="memory-beat" delay={160}>
                <span className="memory-beat-num">03</span>
                <h3>It stays on your Mac</h3>
                <p>
                  Your memory lives on-device. Preferences, project state, open loops —
                  reviewable, removable, yours. No silent cloud diary of your work life.
                  Nothing remembered unless it earns its place, and nothing you can’t erase.
                </p>
              </Reveal>
            </div>

            <Reveal className="memory-handoff" delay={80}>
              <div className="memory-handoff-copy">
                <span className="eyebrow">Sub-agents</span>
                <h3>When closing a loop takes more than a breath</h3>
                <p>
                  Some loops need research. Some need a follow-up across apps.
                  Some need a bounded chore you shouldn’t babysit. Macky keeps you
                  in the notch — the place you speak and decide — and hands the messy
                  middle to focused sub-agents. They work the piece. You get the result.
                  The loop can finally close.
                </p>
              </div>
              <ul className="memory-handoff-list">
                <li>
                  <strong>Research</strong>
                  <span>Pull context, compare options, bring back a clear answer.</span>
                </li>
                <li>
                  <strong>Follow-ups</strong>
                  <span>Chase the thread you opened without losing the thread you’re in.</span>
                </li>
                <li>
                  <strong>App work</strong>
                  <span>Bounded actions in the tools you already use — then report home.</span>
                </li>
              </ul>
            </Reveal>

            <div className="memory-ownership">
              <p>
                <strong>Stored on your Mac.</strong> Your memory isn’t trapped in someone else’s model.
              </p>
              <p>
                <strong>Visible when you want it.</strong> See what’s remembered. Delete what shouldn’t be.
              </p>
              <p>
                <strong>Built to finish work.</strong> Not to collect notes — to close the loop.
              </p>
            </div>
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
