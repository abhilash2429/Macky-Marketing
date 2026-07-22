"use client";

import { useEffect, useRef, useState } from "react";
import { MackyLogo } from "@/components/macky-logo";

/**
 * The Macky logo suspended from the top edge of the footer by two ropes.
 * Idle: a slow pendulum swing. Grabbing and releasing it adds a decaying
 * spring wobble on top of the idle sway.
 */
export function HangingLogo() {
  const [angle, setAngle] = useState(0);
  const [isSwinging, setIsSwinging] = useState(false);
  const frame = useRef<number | undefined>(undefined);
  const velocity = useRef(0);
  const settled = useRef(0);

  const nudge = () => {
    // Kick the pendulum in a random direction.
    velocity.current += (Math.random() > 0.5 ? 1 : -1) * (2.6 + Math.random() * 1.8);
    setIsSwinging(true);
  };

  useEffect(() => {
    if (!isSwinging) return;

    const loop = () => {
      settled.current = 0;
      setAngle((current) => {
        // Spring toward rest with damping — classic pendulum decay.
        velocity.current += -current * 0.045;
        velocity.current *= 0.975;
        const next = current + velocity.current;

        if (Math.abs(next) < 0.05 && Math.abs(velocity.current) < 0.05) {
          velocity.current = 0;
          setIsSwinging(false);
          return 0;
        }

        return next;
      });
      frame.current = requestAnimationFrame(loop);
    };

    frame.current = requestAnimationFrame(loop);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [isSwinging]);

  return (
    <div className="hanging-logo" aria-hidden="true">
      <div
        className={`hang-pivot${isSwinging ? " is-swinging" : ""}`}
        style={isSwinging ? { transform: `rotate(${angle}deg)` } : undefined}
        onPointerEnter={nudge}
      >
        <span className="hang-rope hang-rope-left" />
        <span className="hang-rope hang-rope-right" />
        <span className="hang-bar" />
        <span className="hang-badge">
          <MackyLogo size={92} glow />
        </span>
      </div>
    </div>
  );
}
