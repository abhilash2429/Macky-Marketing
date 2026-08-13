"use client";

import { useEffect, useId, useRef, useState } from "react";
import { notchPath } from "@/components/notch-shape";
import { DotmSquare12 } from "@/components/ui/dotm-square-12";

export const MEMORY_PATH_PHRASE =
  "the reply you owe · the decision you almost made · the thread you said you’d come back to · the email you meant to send · the call you said you’d make · the idea that never quite landed · so next time you speak you’re not starting from zero";

export const MEMORY_PATH_D =
  "M-80 1.1 C-65 33.5, -41.8 135.9, 10.1 195.5 C62 255.1, 167.9 338, 231.5 358.7 C295.1 379.4, 354.6 343, 391.9 319.7 C429.2 296.4, 446.9 254.3, 455.2 219 C463.5 183.7, 461.7 138.8, 441.8 108.1 C421.9 77.4, 377.5 38.5, 335.8 34.7 C294.1 30.9, 217 48.5, 191.7 85.4 C166.4 122.3, 163.2 203.9, 184 256 C204.8 308.2, 247.1 372.1, 316.7 398.3 C386.3 424.5, 554.3 410.6, 601.9 413.1";

/** Seconds for one full phrase to travel the path. */
export const MEMORY_PATH_LOOP_SECONDS = 42;

const NOTCH_W = 268;
const NOTCH_H = 34;
const NOTCH_D = notchPath(NOTCH_W, NOTCH_H, 10, 18);

export const CLOSED_LOOPS = [
  {
    name: "Sam Altman",
    action: "Reply sent",
    app: "Gmail",
    icon: "/assets/gmail.svg",
    notch: "replying",
  },
  {
    name: "Elon Musk",
    action: "Q3 report sent",
    app: "Notion",
    icon: "/assets/notion.svg",
    notch: "sending",
  },
  {
    name: "Jensen Huang",
    action: "Follow-up sent",
    app: "Slack",
    icon: "/assets/slack.svg",
    notch: "following up",
  },
  {
    name: "Mark Zuck",
    action: "Invite sent",
    app: "Google Calendar",
    icon: "/assets/googlecalendar.svg",
    notch: "booking",
  },
  {
    name: "Dario Amodei",
    action: "Issue closed",
    app: "Linear",
    icon: "/assets/linear.svg",
    notch: "closing",
  },
] as const;

const PHASES = [
  { kind: "memorizing" as const, ms: 2400 },
  { kind: "closing" as const, index: 0, ms: 1300 },
  { kind: "closing" as const, index: 1, ms: 1300 },
  { kind: "closing" as const, index: 2, ms: 1300 },
  { kind: "closing" as const, index: 3, ms: 1300 },
  { kind: "closing" as const, index: 4, ms: 1900 },
];

type MemoryPathMarqueeProps = {
  className?: string;
};

function MemoryNotchCheck() {
  return (
    <svg className="memory-notch-check" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4.2 10.6 L8.1 14.4 L15.8 5.8" />
    </svg>
  );
}

export function MemoryPathMarquee({ className = "" }: MemoryPathMarqueeProps) {
  const reactId = useId().replace(/:/g, "");
  const pathId = `memory-thread-loose-${reactId}`;
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const leadRef = useRef<SVGTextPathElement>(null);
  const gapRef = useRef<SVGTextPathElement>(null);
  const measureRef = useRef<SVGTextElement>(null);
  const notchRef = useRef<HTMLDivElement>(null);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const phase = PHASES[phaseIndex];
  const isClosing = phase.kind === "closing";
  const closingIndex = isClosing ? phase.index : -1;
  const notchLabel = isClosing ? CLOSED_LOOPS[phase.index].notch : "memorizing";
  const visibleCount = isClosing ? phase.index + 1 : 0;

  useEffect(() => {
    const path = pathRef.current;
    const lead = leadRef.current;
    const gap = gapRef.current;
    const measure = measureRef.current;
    if (!path || !lead || !gap || !measure) return;

    const unit = `${MEMORY_PATH_PHRASE} · `;
    const pathLen = path.getTotalLength();
    measure.textContent = unit;
    const phraseLen = Math.max(measure.getComputedTextLength(), 1);

    // Lead: long ribbon covering the path from the moving head onward.
    // Gap: exactly ONE phrase — only plugs the empty left segment, so the
    // two streams meet at one point and never stack on top of each other.
    const repeats = Math.ceil((pathLen + phraseLen) / phraseLen) + 1;
    lead.textContent = unit.repeat(repeats);
    gap.textContent = unit;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      lead.setAttribute("startOffset", "0");
      gap.setAttribute("startOffset", String(-phraseLen));
      return;
    }

    let offset = 0;
    let frame = 0;
    let last = performance.now();
    const speed = phraseLen / (MEMORY_PATH_LOOP_SECONDS * 1000);

    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      // Forward (positive). Lead advances; gap rides one phrase behind and
      // only has one phrase of content, so it fills [0 → offset] without
      // redrawing over the rest of the path.
      offset = (offset + speed * dt) % phraseLen;
      lead.setAttribute("startOffset", String(offset));
      gap.setAttribute("startOffset", String(offset - phraseLen));
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    const notch = notchRef.current;
    if (!svg || !path || !notch) return;

    const place = () => {
      const len = path.getTotalLength();
      const end = path.getPointAtLength(len);
      const ctm = svg.getScreenCTM();
      if (!ctm) return;

      const pt = svg.createSVGPoint();
      pt.x = end.x;
      pt.y = end.y;
      const screen = pt.matrixTransform(ctm);
      const parent = notch.offsetParent as HTMLElement | null;
      const origin = parent?.getBoundingClientRect();
      if (!origin) return;

      notch.style.left = `${screen.x - origin.left}px`;
      notch.style.top = `${screen.y - origin.top}px`;
      notch.dataset.placed = "true";
    };

    const mobile = window.matchMedia("(max-width: 760px)");
    const placeIfDesktop = () => {
      if (mobile.matches) {
        notch.style.left = "";
        notch.style.top = "";
        return;
      }
      place();
    };

    placeIfDesktop();
    const observer = new ResizeObserver(placeIfDesktop);
    observer.observe(svg);
    window.addEventListener("resize", placeIfDesktop);
    mobile.addEventListener("change", placeIfDesktop);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", placeIfDesktop);
      mobile.removeEventListener("change", placeIfDesktop);
    };
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      setPhaseIndex(PHASES.length - 1);
      return;
    }

    const mobile = window.matchMedia("(max-width: 760px)");
    if (mobile.matches && phaseIndex === 0) {
      setPhaseIndex(1);
      return;
    }

    const root = notchRef.current?.closest(".memory-thread") ?? notchRef.current;
    if (!root) return;

    let timer = 0;
    let active = false;

    const advance = () => {
      setPhaseIndex((current) => (current + 1) % PHASES.length);
    };

    const arm = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(advance, PHASES[phaseIndex].ms);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        window.clearTimeout(timer);
        if (active) arm();
      },
      { threshold: 0.2 },
    );

    observer.observe(root);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [phaseIndex]);

  return (
    <>
      <svg
        ref={svgRef}
        className={`memory-thread-path ${className}`.trim()}
        viewBox="-80 0 900 450"
        preserveAspectRatio="xMinYMin meet"
        aria-hidden="true"
      >
        <defs>
          <path id={pathId} ref={pathRef} d={MEMORY_PATH_D} />
        </defs>

        <text
          ref={measureRef}
          className="memory-thread-loose-text"
          x={-9999}
          y={-9999}
          opacity={0}
        />

        <text className="memory-thread-loose-text">
          <textPath ref={gapRef} href={`#${pathId}`} startOffset="0">
            {`${MEMORY_PATH_PHRASE} · `}
          </textPath>
        </text>
        <text className="memory-thread-loose-text">
          <textPath ref={leadRef} href={`#${pathId}`} startOffset="0">
            {`${MEMORY_PATH_PHRASE} · ${MEMORY_PATH_PHRASE} · ${MEMORY_PATH_PHRASE} · `}
          </textPath>
        </text>
      </svg>

      <p className="sr-only">
        After memorizing, Macky closes the loops — a reply to Sam Altman, a Q3 report to Elon Musk,
        a follow-up with Jensen Huang, a calendar invite for Mark Zuck, and a Linear issue for Dario Amodei.
      </p>

      <div
        ref={notchRef}
        className={`memory-notch${isClosing ? " is-closing" : ""}`}
        aria-hidden="true"
      >
        <ul className="memory-closed-stack">
          {CLOSED_LOOPS.map((loop, index) => {
            const shown = index < visibleCount;
            const current = isClosing && index === closingIndex;
            return (
              <li
                key={loop.name}
                className={`memory-loop-card${shown ? " is-in" : ""}${current ? " is-current" : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={loop.icon} alt="" width={28} height={28} />
                <span className="memory-loop-copy">
                  <strong>{loop.action}</strong>
                  <small>
                    {loop.name}
                    <span aria-hidden="true"> · </span>
                    {loop.app}
                  </small>
                </span>
                <span className="memory-loop-check" aria-hidden="true">
                  <svg viewBox="0 0 16 16" fill="none">
                    <path d="M3.2 8.2 L6.4 11.3 L12.8 4.6" />
                  </svg>
                </span>
              </li>
            );
          })}
        </ul>
        <svg className="memory-notch-shape" viewBox={`0 0 ${NOTCH_W} ${NOTCH_H}`}>
          <path d={NOTCH_D} />
        </svg>
        <div className="memory-notch-bar">
          <span className="memory-notch-label" key={notchLabel}>
            {notchLabel}
          </span>
          {isClosing ? (
            <MemoryNotchCheck />
          ) : (
            <DotmSquare12
              className="memory-notch-loader"
              size={20}
              dotSize={2}
              color="#fff"
              speed={1.35}
              ariaLabel="Memorizing"
            />
          )}
        </div>
      </div>
    </>
  );
}
