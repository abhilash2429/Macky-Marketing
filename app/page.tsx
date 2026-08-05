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
  Sparkles,
  Workflow,
} from "lucide-react";
import { FAQList } from "@/components/faq-list";
import { HeroCopy } from "@/components/hero-copy";
import { LazyVideo } from "@/components/lazy-video";
import { MackyLogo } from "@/components/macky-logo";
import { PageShell } from "@/components/page-shell";
import { Reveal } from "@/components/reveal";
import { capabilityVideos, connectors, nextCapabilities } from "@/lib/content";

const featurePills = [
  "Talk naturally",
  "Act in real time",
  "Dictate with confidence",
  "Screen-aware help",
  "Control your Mac",
  "Files in context",
  "Connected workflows",
  "Interrupt anytime",
  "Stay in your flow",
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
          <div className="section-heading centered">
            <span className="eyebrow"><Sparkles size={16} /> Made for the moment</span>
            <h2>Your assistant, wherever you need.</h2>
            <p>
              Talk from any app, understand what is on screen when you ask, bring in files, dictate safely, and let
              Macky handle supported Mac and cloud actions — all from the notch.
            </p>
          </div>
          <div className="pill-cloud">{featurePills.map((pill) => <span key={pill}>{pill}</span>)}</div>
          </div>
        </section>

        <section className="feature-stack section" id="capabilities">
          {capabilityVideos.map((feature, index) => (
            <Reveal className="feature-reveal" delay={Math.min(index * 60, 240)} key={feature.title}>
              <article className={`feature-row ${index % 2 ? "feature-row-reverse" : ""}`}>
                <div className="feature-copy">
                  <span className="feature-number">0{index + 1} · {feature.label}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
                <div className="video-frame"><LazyVideo src={feature.video} /></div>
              </article>
            </Reveal>
          ))}
        </section>

        <section className="section quote-section">
          <div className="quote-mark">&ldquo;</div>
          <blockquote>Hold a key. Say what you need. Macky gets it done without turning your workflow into another chat window.</blockquote>
          <div className="quote-author">
            <MackyLogo size={48} glow />
            <div><strong>Macky</strong><span>Voice in. Action out.</span></div>
          </div>
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
