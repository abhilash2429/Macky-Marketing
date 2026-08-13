import Image from "next/image";
import { FAQList } from "@/components/faq-list";
import { CapabilityFeatures } from "@/components/capability-features";
import { HeroCopy } from "@/components/hero-copy";
import { PageShell } from "@/components/page-shell";
import { MemoryPathMarquee } from "@/components/memory-path-marquee";
import { Reveal } from "@/components/reveal";
import { connectors } from "@/lib/content";
import { publicAssetSrc } from "@/lib/public-asset";

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
        <div className="hero-stage">
          <section className="hero" id="hero">
            <HeroCopy />
          </section>

          <section className="intro-section" id="how-it-works">
            <div className="section intro-content">
              <Reveal>
                <div className="section-heading centered how-heading">
                  <span className="eyebrow">How it works</span>
                  <h2>
                    Three steps. <br /> <em>One breath.</em>
                  </h2>
                  <p>Macky stays in the notch until you call it — then it gets out of the way.</p>
                </div>
              </Reveal>

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
        </div>

        <section className="feature-stack section" id="capabilities">
          <Reveal>
            <div className="section-heading centered how-heading capabilities-heading">
              <span className="eyebrow">What Macky can do</span>
            </div>
          </Reveal>
          <CapabilityFeatures />
        </section>

        <section className="memory-story" id="memory-agents">
          <div className="memory-story-inner">
            <div className="memory-story-lead">
              <Reveal className="memory-story-hero-reveal">
                <header className="memory-story-hero">
                  <span className="eyebrow">Memory</span>
                  <h2>
                    Remembers the stuff <em>you meant to finish</em>
                  </h2>
                  <p>
                    Most assistants wipe the slate the second you let go.
                    Macky keeps the unfinished bits — the reply you owe,
                    the decision you almost made, the thread you said you’d
                    come back to — so the next time you speak, you’re not
                    starting from zero.
                  </p>
                </header>
              </Reveal>

              <Reveal className="memory-story-macbook" delay={80}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={publicAssetSrc("/assets/macbook.png")}
                  alt="Macky drafting a follow-up email on a MacBook"
                  width={1495}
                  height={1052}
                />
              </Reveal>
            </div>

            <Reveal className="memory-thread" delay={40}>
              <MemoryPathMarquee />
            </Reveal>

            <div className="memory-story-flow">
              <Reveal className="memory-beat" delay={0}>
                <span className="memory-beat-num">01</span>
                <h3>It catches what you almost dropped</h3>
                <p>
                  That email you meant to send. The call you said you’d make.
                  The idea that never quite landed. Macky keeps those close —
                  not buried in old chat, but sitting where you can still
                  do something about them.
                </p>
              </Reveal>

              <Reveal className="memory-beat" delay={80}>
                <span className="memory-beat-num">02</span>
                <h3>Then it helps you wrap them up</h3>
                <p>
                  This isn’t a scrapbook of everything you’ve ever said.
                  It remembers what changed, what you chose, and what’s
                  still hanging — then brings it back until it’s actually done.
                  Jump between things freely. Macky won’t lose the ones
                  that still matter.
                </p>
              </Reveal>

              <Reveal className="memory-beat" delay={160}>
                <span className="memory-beat-num">03</span>
                <h3>It lives on your Mac</h3>
                <p>
                  Your preferences, projects, and unfinished work stay with you —
                  easy to check, easy to delete. No quiet cloud diary of your day.
                  If something shouldn’t be remembered, you can clear it.
                </p>
              </Reveal>
            </div>

            <Reveal className="memory-handoff" delay={80}>
              <div className="memory-handoff-copy">
                <span className="eyebrow">Sub-agents</span>
                <h3>When finishing takes more than a quick ask</h3>
                <p>
                  Sometimes you need research. Sometimes a chase across apps.
                  Sometimes a chore you shouldn’t sit and watch. Macky keeps
                  you in the notch — where you talk and decide — and hands
                  the messy middle to focused helpers. They do the dig.
                  You get the answer. Then you can move on.
                </p>
              </div>
              <ul className="memory-handoff-list">
                <li>
                  <strong>Research</strong>
                  <span>Look things up, weigh the options, bring back a clear take.</span>
                </li>
                <li>
                  <strong>Follow-ups</strong>
                  <span>Chase that thread without losing the one you’re in now.</span>
                </li>
                <li>
                  <strong>App work</strong>
                  <span>Handle a small job in the tools you already use — then come back.</span>
                </li>
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="section connector-showcase">
          <Reveal>
            <div className="section-heading centered">
              <h2>Your apps, one voice away.</h2>
            </div>
          </Reveal>
          <div className="connector-strip">
            {connectors.map((connector, index) => (
              <Reveal className="connector-reveal" key={connector.name} delay={index * 55}>
                <article><Image src={connector.icon} width={52} height={52} alt="" /><strong>{connector.name}</strong><small>&ldquo;{connector.example}&rdquo;</small></article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section faq-section" id="faq">
          <Reveal>
            <div className="section-heading">
              <h2>Frequently Asked Questions</h2>
              <p>What Macky does today, how permissions and context work, and what is still coming next.</p>
            </div>
          </Reveal>
          <FAQList />
        </section>

        </main>
    </PageShell>
  );
}
