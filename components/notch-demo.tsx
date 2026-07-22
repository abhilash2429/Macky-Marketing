"use client";

import { useEffect, useRef, useState } from "react";
import { MackyLogo } from "@/components/macky-logo";
import { NotchSpinner, NotchWaveform, type WaveMode } from "@/components/notch-waveform";
import { NOTCH_RADII, lerp, notchPath } from "@/components/notch-shape";

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

export function NotchDemo() {
  const [step, setStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const collapseTimer = useRef<number | undefined>(undefined);

  const state = CYCLE[step].state;
  const label = STATUS_LABEL[state];
  const isActive = state !== "idle";
  const showSpinner = state === "thinking" || state === "executing";

  useEffect(() => {
    const timer = window.setTimeout(() => setStep((value) => (value + 1) % CYCLE.length), CYCLE[step].hold);
    return () => window.clearTimeout(timer);
  }, [step]);

  useEffect(() => () => window.clearTimeout(collapseTimer.current), []);

  const open = () => {
    window.clearTimeout(collapseTimer.current);
    setIsOpen(true);
  };

  // Collapses ~500ms after the pointer leaves.
  const scheduleClose = () => {
    window.clearTimeout(collapseTimer.current);
    collapseTimer.current = window.setTimeout(() => setIsOpen(false), 500);
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
                  <span>Voice in. Action out.</span>
                </div>
                <NotchWaveform mode="speaking" />
              </div>

              <div className="nx-transcript">
                <p className="nx-you">&ldquo;What&apos;s on my calendar tomorrow?&rdquo;</p>
                <p className="nx-macky">
                  You have three events. Design review at 10, a one-on-one at 1:30, and the release sync at 4.
                </p>
              </div>

              <div className="nx-panel-actions">
                <span>Calendar</span>
                <span>Reminders</span>
                <span>Screen context</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="nx-hint">Hover the notch to expand it.</p>
    </div>
  );
}
