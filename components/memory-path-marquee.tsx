"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { notchPath } from "@/components/notch-shape";
import { DotmSquare12 } from "@/components/ui/dotm-square-12";

export const MEMORY_PATH_PHRASE =
  "the reply you owe · the decision you almost made · the thread you said you’d come back to · the email you meant to send · the call you said you’d make · the idea that never quite landed · so next time you speak you’re not starting from zero";

/** Short ribbon for narrow viewports — only a few words on screen. */
export const MEMORY_PATH_PHRASE_MOBILE = "the reply you owe";

export const MEMORY_PATH_D =
  "M-80 1.1 C-65 33.5, -41.8 135.9, 10.1 195.5 C62 255.1, 167.9 338, 231.5 358.7 C295.1 379.4, 354.6 343, 391.9 319.7 C429.2 296.4, 446.9 254.3, 455.2 219 C463.5 183.7, 461.7 138.8, 441.8 108.1 C421.9 77.4, 377.5 38.5, 335.8 34.7 C294.1 30.9, 217 48.5, 191.7 85.4 C166.4 122.3, 163.2 203.9, 184 256 C204.8 308.2, 247.1 372.1, 316.7 398.3 C386.3 424.5, 554.3 410.6, 601.9 413.1";

/**
 * One open loop on the left, then a short run into the centered notch.
 * Kept large enough that glyphs don’t pile up on themselves.
 */
export const MEMORY_PATH_D_MOBILE =
  "M0 70 C36 70, 42 18, 84 18 C136 18, 148 122, 84 122 C42 122, 50 70, 92 70 L210 70";

export const MEMORY_PATH_VIEWBOX = "-80 0 900 450";
export const MEMORY_PATH_VIEWBOX_MOBILE = "-4 0 220 140";

/** Seconds for one full phrase to travel the path. */
export const MEMORY_PATH_LOOP_SECONDS = 42;
export const MEMORY_PATH_LOOP_SECONDS_MOBILE = 10;

const MOBILE_MQ = "(max-width: 760px)";

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

function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    const mobile = window.matchMedia(MOBILE_MQ);
    const sync = () => setIsMobile(mobile.matches);
    sync();
    mobile.addEventListener("change", sync);
    return () => mobile.removeEventListener("change", sync);
  }, []);

  return isMobile;
}

function setTextPathOffset(el: SVGTextPathElement, value: number) {
  el.setAttribute("startOffset", String(value));
  const animated = el.startOffset;
  if (animated?.baseVal) {
    try {
      animated.baseVal.value = value;
    } catch {
      /* older WebKit may reject unitless assignment */
    }
  }
}

/**
 * Mobile ribbon: place glyphs with getPointAtLength.
 * Avoids SVG textPath startOffset, which iOS Safari often fails to animate.
 */
function MobilePathRibbon({
  className = "",
  pathD,
  viewBox,
  phrase,
  loopSeconds,
  pathRef,
  svgRef,
}: {
  className?: string;
  pathD: string;
  viewBox: string;
  phrase: string;
  loopSeconds: number;
  pathRef: RefObject<SVGPathElement | null>;
  svgRef: RefObject<SVGSVGElement | null>;
}) {
  const layerRef = useRef<SVGGElement>(null);
  const measureRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const layer = layerRef.current;
    const measure = measureRef.current;
    if (!path || !layer || !measure) return;

    const unit = `${phrase} · `;
    const pathLen = Math.max(path.getTotalLength(), 1);

    measure.textContent = unit;
    void measure.getBBox();
    let unitLen = measure.getComputedTextLength();
    if (!unitLen || unitLen < 2) {
      unitLen = unit.length * 8.2;
    }

    // Sample character advances once up front.
    const advances: number[] = [];
    let cursor = 0;
    for (let i = 0; i < unit.length; i += 1) {
      measure.textContent = unit.slice(0, i + 1);
      const next = measure.getComputedTextLength() || (i + 1) * (unitLen / unit.length);
      advances.push(Math.max(next - cursor, unitLen / unit.length));
      cursor = next;
    }
    measure.textContent = "";

    const copies = Math.max(3, Math.ceil(pathLen / unitLen) + 2);
    const chars: { ch: string; advance: number }[] = [];
    for (let c = 0; c < copies; c += 1) {
      for (let i = 0; i < unit.length; i += 1) {
        chars.push({ ch: unit[i], advance: advances[i] });
      }
    }

    // Build glyph nodes once; animate via transform attributes.
    layer.replaceChildren();
    const nodes = chars.map(({ ch }) => {
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("class", "memory-thread-glyph");
      text.textContent = ch;
      text.style.opacity = "0";
      layer.appendChild(text);
      return text;
    });

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const paint = (offset: number) => {
      let dist = -offset;
      for (let i = 0; i < chars.length; i += 1) {
        const node = nodes[i];
        const along = dist;
        dist += chars[i].advance;

        if (along < -4 || along > pathLen + 4) {
          node.style.opacity = "0";
          continue;
        }

        const p1 = path.getPointAtLength(Math.max(0, Math.min(pathLen, along)));
        const p2 = path.getPointAtLength(Math.max(0, Math.min(pathLen, along + 2)));
        const angle = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
        node.style.opacity = "1";
        node.setAttribute(
          "transform",
          `translate(${p1.x} ${p1.y}) rotate(${angle})`,
        );
      }
    };

    if (motionQuery.matches) {
      paint(0);
      return;
    }

    let offset = 0;
    let frame = 0;
    let last = performance.now();
    const speed = unitLen / (loopSeconds * 1000);

    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      offset = (offset + speed * dt) % unitLen;
      paint(offset);
      frame = requestAnimationFrame(tick);
    };

    paint(0);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      layer.replaceChildren();
    };
  }, [pathD, phrase, loopSeconds, pathRef]);

  return (
    <svg
      ref={svgRef}
      className={`memory-thread-path is-mobile-ribbon ${className}`.trim()}
      viewBox={viewBox}
      preserveAspectRatio="xMaxYMid meet"
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="none"
        pointerEvents="none"
      />
      <text
        ref={measureRef}
        className="memory-thread-loose-text"
        x={-9999}
        y={-9999}
        opacity={0}
      />
      <g ref={layerRef} className="memory-thread-glyph-layer" />
    </svg>
  );
}

function DesktopPathRibbon({
  className = "",
  pathD,
  viewBox,
  phrase,
  loopSeconds,
  pathRef,
  svgRef,
}: {
  className?: string;
  pathD: string;
  viewBox: string;
  phrase: string;
  loopSeconds: number;
  pathRef: RefObject<SVGPathElement | null>;
  svgRef: RefObject<SVGSVGElement | null>;
}) {
  const reactId = useId().replace(/:/g, "");
  const pathId = `memory-thread-loose-${reactId}`;
  const leadRef = useRef<SVGTextPathElement>(null);
  const gapRef = useRef<SVGTextPathElement>(null);
  const measureRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const lead = leadRef.current;
    const gap = gapRef.current;
    const measure = measureRef.current;
    if (!path || !lead || !gap || !measure) return;

    const unit = `${phrase} · `;
    const pathLen = path.getTotalLength();
    measure.textContent = unit;
    void measure.getBBox();
    let phraseLen = measure.getComputedTextLength();
    if (!phraseLen || phraseLen < 2) {
      phraseLen = unit.length * 11;
    }

    const repeats = Math.ceil((pathLen + phraseLen) / phraseLen) + 1;
    lead.textContent = unit.repeat(repeats);
    gap.textContent = unit;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      setTextPathOffset(lead, 0);
      setTextPathOffset(gap, -phraseLen);
      return;
    }

    let offset = 0;
    let frame = 0;
    let last = performance.now();
    const speed = phraseLen / (loopSeconds * 1000);

    const tick = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      offset = (offset + speed * dt) % phraseLen;
      setTextPathOffset(lead, offset);
      setTextPathOffset(gap, offset - phraseLen);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phrase, pathD, loopSeconds, pathRef]);

  return (
    <svg
      ref={svgRef}
      className={`memory-thread-path ${className}`.trim()}
      viewBox={viewBox}
      preserveAspectRatio="xMinYMin meet"
      aria-hidden="true"
    >
      <path
        id={pathId}
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="none"
        pointerEvents="none"
      />

      <text
        ref={measureRef}
        className="memory-thread-loose-text"
        x={-9999}
        y={-9999}
        opacity={0}
      />

      <text className="memory-thread-loose-text">
        <textPath ref={gapRef} href={`#${pathId}`} startOffset="0">
          {`${phrase} · `}
        </textPath>
      </text>
      <text className="memory-thread-loose-text">
        <textPath ref={leadRef} href={`#${pathId}`} startOffset="0">
          {`${phrase} · ${phrase} · ${phrase} · `}
        </textPath>
      </text>
    </svg>
  );
}

export function MemoryPathMarquee({ className = "" }: MemoryPathMarqueeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const notchRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const mobile = isMobile === true;
  const phrase = mobile ? MEMORY_PATH_PHRASE_MOBILE : MEMORY_PATH_PHRASE;
  const pathD = mobile ? MEMORY_PATH_D_MOBILE : MEMORY_PATH_D;
  const viewBox = mobile ? MEMORY_PATH_VIEWBOX_MOBILE : MEMORY_PATH_VIEWBOX;
  const loopSeconds = mobile ? MEMORY_PATH_LOOP_SECONDS_MOBILE : MEMORY_PATH_LOOP_SECONDS;
  const [phaseIndex, setPhaseIndex] = useState(0);
  const phase = PHASES[phaseIndex];
  const isClosing = phase.kind === "closing";
  const closingIndex = isClosing ? phase.index : -1;
  const notchLabel = isClosing ? CLOSED_LOOPS[phase.index].notch : "memorizing";
  const visibleCount = isClosing ? phase.index + 1 : 0;

  useEffect(() => {
    if (isMobile === null) return;

    const svg = svgRef.current;
    const path = pathRef.current;
    const notch = notchRef.current;
    if (!svg || !path || !notch) return;

    const place = () => {
      const len = path.getTotalLength();
      if (!len) return;
      const end = path.getPointAtLength(len);
      const ctm = svg.getScreenCTM();
      if (!ctm) return;

      const parent = notch.offsetParent as HTMLElement | null;
      const origin = parent?.getBoundingClientRect();
      if (!origin) return;

      const screen = new DOMPoint(end.x, end.y).matrixTransform(ctm);
      notch.style.left = `${screen.x - origin.left}px`;
      notch.style.top = `${screen.y - origin.top}px`;
      notch.dataset.placed = "true";
    };

    // Defer one frame so the active ribbon SVG has layout on iOS.
    const boot = window.requestAnimationFrame(place);
    const observer = new ResizeObserver(place);
    observer.observe(svg);
    window.addEventListener("resize", place);
    window.addEventListener("orientationchange", place);
    return () => {
      window.cancelAnimationFrame(boot);
      observer.disconnect();
      window.removeEventListener("resize", place);
      window.removeEventListener("orientationchange", place);
    };
  }, [pathD, isMobile]);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      setPhaseIndex(PHASES.length - 1);
      return;
    }

    const root = notchRef.current?.closest(".memory-thread") ?? notchRef.current;
    if (!root) return;

    let timer = 0;

    const advance = () => {
      setPhaseIndex((current) => (current + 1) % PHASES.length);
    };

    const arm = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(advance, PHASES[phaseIndex].ms);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(timer);
        if (entry.isIntersecting) arm();
      },
      { threshold: 0.15 },
    );

    observer.observe(root);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [phaseIndex]);

  return (
    <>
      {isMobile === null ? null : mobile ? (
        <MobilePathRibbon
          className={className}
          pathD={pathD}
          viewBox={viewBox}
          phrase={phrase}
          loopSeconds={loopSeconds}
          pathRef={pathRef}
          svgRef={svgRef}
        />
      ) : (
        <DesktopPathRibbon
          className={className}
          pathD={pathD}
          viewBox={viewBox}
          phrase={phrase}
          loopSeconds={loopSeconds}
          pathRef={pathRef}
          svgRef={svgRef}
        />
      )}

      <p className="sr-only">
        After memorizing, Macky closes the loops — a reply to Sam Altman, a Q3 report to Elon Musk,
        a follow-up with Jensen Huang, a calendar invite for Mark Zuck, and a Linear issue for Dario Amodei.
      </p>

      <div
        ref={notchRef}
        className={`memory-notch${isClosing ? " is-closing" : ""}${mobile ? " is-mobile" : ""}`}
        aria-hidden="true"
      >
        <ul className="memory-closed-stack">
          {CLOSED_LOOPS.map((loop, index) => {
            const shown = index < visibleCount;
            const current = isClosing && index === closingIndex;
            const slot =
              index === 0 ? "middle" : index % 2 === 1 ? "up" : "down";
            return (
              <li
                key={loop.name}
                className={`memory-loop-card is-slot-${index} is-${slot}${shown ? " is-in" : ""}${current ? " is-current" : ""}`}
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
