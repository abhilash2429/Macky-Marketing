"use client";

import { useEffect, useRef, useState } from "react";
import { MackyLogo } from "@/components/macky-logo";
import { NotchSpinner, NotchWaveform, type WaveMode } from "@/components/notch-waveform";
import { NOTCH_RADII, lerp, notchPath } from "@/components/notch-shape";
import { useMackyDemo, type DemoState } from "@/lib/realtime-demo/useMackyDemo";

/** Closed cutout width — the hardware fallback from the shipping app. */
const CUTOUT_WIDTH = 185;
const BAR_HEIGHT = 32;
const STATUS_SLOT = 104;
const PANEL_WIDTH = 680;
const PANEL_HEIGHT = 340;

type OperationState = "idle" | "listening" | "thinking" | "speaking" | "executing";

const STATUS_LABEL: Record<OperationState, string> = {
  idle: "",
  listening: "Listening",
  thinking: "Thinking",
  speaking: "Speaking",
  executing: "Opening Calendar",
};

const CYCLE: { state: OperationState; hold: number }[] = [
  { state: "idle", hold: 1400 },
  { state: "listening", hold: 2600 },
  { state: "thinking", hold: 2000 },
  { state: "executing", hold: 2200 },
  { state: "speaking", hold: 2800 },
];

const WAVE_MODE: Record<OperationState, WaveMode> = {
  idle: "idle",
  listening: "listening",
  thinking: "pulse",
  speaking: "speaking",
  executing: "pulse",
};

/** Maps the live demo's states onto the notch's existing visual vocabulary. */
const LIVE_TO_OPERATION: Record<DemoState, OperationState> = {
  idle: "idle",
  "requesting-mic": "thinking",
  connecting: "thinking",
  listening: "listening",
  thinking: "thinking",
  speaking: "speaking",
  error: "idle",
  expired: "idle",
};

const LIVE_STATUS_LABEL: Partial<Record<DemoState, string>> = {
  "requesting-mic": "Mic…",
  connecting: "Connecting",
};

/** Live demo needs mic capture, worklets, and a precise-pointer desktop. */
function detectSupport(): boolean {
  if (typeof window === "undefined") return false;
  const hasMedia =
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof window.AudioContext !== "undefined" &&
    typeof window.AudioWorkletNode !== "undefined";
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const wideEnough = window.innerWidth >= 720;
  return hasMedia && finePointer && wideEnough;
}

export function NotchDemo() {
  const [step, setStep] = useState(0);
  const [hoverOpen, setHoverOpen] = useState(false);
  // Lazy initializer: SSR renders the simulated notch (true), the client resolves
  // real support on first render — no setState-in-effect needed.
  const [supported] = useState(() => (typeof window === "undefined" ? true : detectSupport()));
  const collapseTimer = useRef<number | undefined>(undefined);

  const demo = useMackyDemo();
  const live = demo.active;

  // The panel is forced open during a live session (to show the transcript);
  // otherwise it follows hover. Derived, so no effect writes it.
  const isOpen = live || hoverOpen;

  // Live mode drives the state from real audio; simulated mode uses the CYCLE.
  const simulatedState = CYCLE[step].state;
  const state: OperationState = live ? LIVE_TO_OPERATION[demo.state] : simulatedState;
  const label = live ? LIVE_STATUS_LABEL[demo.state] ?? STATUS_LABEL[state] : STATUS_LABEL[state];
  const isActive = state !== "idle";
  const showSpinner = state === "thinking" || state === "executing";

  // Only the simulated notch auto-advances. Live mode is driven by server events.
  useEffect(() => {
    if (live) return;
    const timer = window.setTimeout(() => setStep((value) => (value + 1) % CYCLE.length), CYCLE[step].hold);
    return () => window.clearTimeout(timer);
  }, [step, live]);

  useEffect(() => () => window.clearTimeout(collapseTimer.current), []);

  const open = () => {
    window.clearTimeout(collapseTimer.current);
    setHoverOpen(true);
  };

  // Collapses ~500ms after the pointer leaves (disabled during a live session).
  const scheduleClose = () => {
    if (live) return;
    window.clearTimeout(collapseTimer.current);
    collapseTimer.current = window.setTimeout(() => setHoverOpen(false), 500);
  };

  const progress = isOpen ? 1 : 0;
  const shellWidth = isOpen ? PANEL_WIDTH : isActive ? CUTOUT_WIDTH + STATUS_SLOT + 60 : CUTOUT_WIDTH;
  const shellHeight = isOpen ? PANEL_HEIGHT : BAR_HEIGHT;
  const topRadius = lerp(NOTCH_RADII.closed.top, NOTCH_RADII.open.top, progress);
  const bottomRadius = lerp(NOTCH_RADII.closed.bottom, NOTCH_RADII.open.bottom, progress);

  return (
    <div className="nx-stage">
      <div className="nx-screen">
        <div className="nx-menubar" aria-hidden="true">
          <span>Finder</span>
          <span className="nx-menubar-right">9:41</span>
        </div>

        <div
          className={`nx-notch${isOpen ? " is-open" : ""}${isActive ? " is-active" : ""}`}
          style={{ width: shellWidth, height: shellHeight }}
          onPointerEnter={open}
          onPointerLeave={scheduleClose}
          onFocus={open}
          onBlur={scheduleClose}
          tabIndex={0}
          role="button"
          aria-expanded={isOpen}
          aria-label={`Macky notch${label ? `: ${label}` : ""}. Hover to expand.`}
        >
          <svg className="nx-notch-shape" viewBox={`0 0 ${shellWidth} ${shellHeight}`} aria-hidden="true">
            <path d={notchPath(shellWidth, shellHeight, topRadius, bottomRadius)} fill="#000000" />
          </svg>

          {!isOpen && (
            <div className="nx-bar">
              <span className="nx-status">
                {label && <span key={label}>{label}</span>}
              </span>
              <span className="nx-bridge" />
              <span className="nx-indicator">
                {isActive && (showSpinner ? <NotchSpinner /> : <NotchWaveform mode={WAVE_MODE[state]} />)}
              </span>
            </div>
          )}

          {isOpen && (
            <div className="nx-panel">
              <div className="nx-panel-head">
                <MackyLogo size={30} glow />
                <div>
                  <strong>Macky</strong>
                  <span>{live ? "Live demo · voice only" : "Voice in. Action out."}</span>
                </div>
                <NotchWaveform mode={live ? WAVE_MODE[state] : "speaking"} />
              </div>

              {live ? (
                <LivePanel demo={demo} />
              ) : (
                <div className="nx-transcript">
                  <p className="nx-you">&ldquo;What&apos;s on my calendar tomorrow?&rdquo;</p>
                  <p className="nx-macky">
                    You have three events. Design review at 10, a one-on-one at 1:30, and the release sync at 4.
                  </p>
                </div>
              )}

              <div className="nx-panel-actions">
                <span>Calendar</span>
                <span>Reminders</span>
                <span>Screen context</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <DemoControl demo={demo} supported={supported} />
    </div>
  );
}

/** Live transcript + hold-to-talk instruction, rendered inside the open panel. */
function LivePanel({ demo }: { demo: ReturnType<typeof useMackyDemo> }) {
  const instruction =
    demo.state === "requesting-mic"
      ? "Allow microphone access to start."
      : demo.state === "connecting"
        ? "Connecting to Macky…"
        : demo.isHolding
          ? "Listening… release to send."
          : "Hold ⌃⌥ (Control + Option) and speak.";

  return (
    <div className="nx-transcript nx-live">
      {demo.userTranscript && <p className="nx-you">&ldquo;{demo.userTranscript}&rdquo;</p>}
      {demo.mackyTranscript && <p className="nx-macky">{demo.mackyTranscript}</p>}
      {!demo.userTranscript && !demo.mackyTranscript && (
        <p className="nx-macky nx-live-hint">{instruction}</p>
      )}
    </div>
  );
}

/** The affordance below the notch: start/stop the live demo, or fallback notes. */
function DemoControl({
  demo,
  supported,
}: {
  demo: ReturnType<typeof useMackyDemo>;
  supported: boolean;
}) {
  if (!supported) {
    return <p className="nx-hint">Hover the notch to preview it. The live voice demo needs a Mac and a microphone.</p>;
  }

  if (demo.state === "error") {
    return (
      <div className="nx-demo-control">
        <p className="nx-hint nx-hint-error">{demo.error}</p>
        <button className="nx-start" type="button" onClick={demo.start}>
          Try again
        </button>
      </div>
    );
  }

  if (demo.state === "expired") {
    return (
      <div className="nx-demo-control">
        <p className="nx-hint">That&apos;s the ~60-second demo. The real Macky has no timer.</p>
        <button className="nx-start" type="button" onClick={demo.start}>
          Run it again
        </button>
      </div>
    );
  }

  if (demo.active) {
    return (
      <div className="nx-demo-control">
        <p className="nx-hint">Hold <kbd>⌃⌥</kbd> and speak. Release to hear Macky answer.</p>
        <button className="nx-start nx-start-ghost" type="button" onClick={demo.stop}>
          End demo
        </button>
      </div>
    );
  }

  return (
    <div className="nx-demo-control">
      <button className="nx-start" type="button" onClick={demo.start}>
        Try the live demo
      </button>
      <p className="nx-hint">Talk to the real Macky in your browser. Uses your mic.</p>
    </div>
  );
}
