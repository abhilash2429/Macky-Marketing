"use client";

import { useEffect, useState } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { MackyLogo } from "@/components/macky-logo";

const states = ["Listening", "Thinking", "Opening Calendar", "Done"];

export function NotchDemo() {
  const [activeState, setActiveState] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActiveState((value) => (value + 1) % states.length), 1800);
    return () => window.clearInterval(timer);
  }, []);

  const state = states[activeState];

  return (
    <div className="mac-stage" aria-label={`Macky status: ${state}`}>
      <div className="mac-menu-bar"><span>● ● ●</span><span>9:41</span></div>
      <div className={`macky-notch state-${activeState}`}>
        <div className="notch-side notch-side-left">
          {activeState === 0 ? (
            <span className="voice-bars" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((bar) => <i key={bar} />)}
            </span>
          ) : <MackyLogo size={24} />}
        </div>
        <div className="notch-camera" />
        <div className="notch-side notch-side-right">
          {activeState === 3 ? <Check size={16} /> : activeState > 0 ? <LoaderCircle className="spin" size={16} /> : null}
        </div>
        <div className="notch-status">{state}</div>
      </div>
      <div className="voice-request">
        <span>You said</span>
        <strong>“What&apos;s on my calendar tomorrow?”</strong>
      </div>
      <div className="stage-grid" aria-hidden="true" />
    </div>
  );
}
