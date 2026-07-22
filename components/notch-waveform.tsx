"use client";

import { useEffect, useRef, useState } from "react";

/** Relative bar shape — tallest in the middle. */
const SHAPE = [0.42, 0.72, 1.0, 0.78, 0.48];
const MIN_SCALE = 0.14;
const IDLE_SCALE = 0.18;

export type WaveMode = "speaking" | "listening" | "idle" | "pulse";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Five center-anchored bars. Amplitude is driven by a synthetic 0–1 level,
 * since the marketing site has no microphone input.
 */
export function NotchWaveform({ mode }: { mode: WaveMode }) {
  const [scales, setScales] = useState<number[]>(() => SHAPE.map(() => IDLE_SCALE));
  const frame = useRef<number | undefined>(undefined);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Idle needs no animation loop — the resting scale is applied below.
    if (mode === "idle") return;

    if (mode === "pulse") {
      const tick = () => {
        setScales(SHAPE.map((shape) => clamp(shape * (0.35 + Math.random() * 0.35), MIN_SCALE, 1)));
        timer.current = window.setTimeout(tick, 180 + Math.random() * 100);
      };
      tick();
      return () => window.clearTimeout(timer.current);
    }

    const start = performance.now();
    const loop = (now: number) => {
      const time = (now - start) / 1000;
      setScales(
        SHAPE.map((shape, index) => {
          // Layered sines give a natural, non-repeating amplitude envelope.
          const amp =
            0.5 +
            0.5 * Math.sin(time * (mode === "speaking" ? 6.5 : 3.1) + index * 0.9) *
              Math.sin(time * 1.7 + index * 0.4);

          return mode === "speaking"
            ? clamp(shape * (0.3 + amp * 0.8), MIN_SCALE, 1)
            : clamp(0.16 + amp * shape * 0.5, MIN_SCALE, 0.62);
        })
      );
      frame.current = requestAnimationFrame(loop);
    };

    frame.current = requestAnimationFrame(loop);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [mode]);

  // Idle eases every bar to the resting scale rather than driving a loop.
  const rendered = mode === "idle" ? SHAPE.map(() => IDLE_SCALE) : scales;

  return (
    <span className="nx-wave" aria-hidden="true">
      {rendered.map((scale, index) => (
        <i
          key={index}
          style={{
            transform: `scaleY(${scale})`,
            transitionDuration: mode === "idle" ? "0.4s" : mode === "pulse" ? "0.2s" : "0.07s",
          }}
        />
      ))}
    </span>
  );
}

const GRID = 5;
const CENTER = 2;

/** 5×5 dot grid rippling outward from the center cell. */
export function NotchSpinner() {
  const dots = [];
  for (let row = 0; row < GRID; row += 1) {
    for (let col = 0; col < GRID; col += 1) {
      const distance = Math.abs(row - CENTER) + Math.abs(col - CENTER);
      dots.push(
        <i key={`${row}-${col}`} style={{ animationDelay: `${distance * 0.16}s`, ["--ring" as string]: distance }} />
      );
    }
  }

  return (
    <span className="nx-spinner" aria-hidden="true">
      {dots}
    </span>
  );
}
