"use client";

import { type MouseEvent } from "react";
import { ArrowRight } from "lucide-react";

export function WaitlistSpotLink() {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    document.getElementById("waitlist-form")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    window.dispatchEvent(new Event("waitlist:typewriter"));
  }

  return (
    <a className="waitlist-scroll" href="#waitlist-form" onClick={handleClick}>
      Request a spot <ArrowRight size={16} />
    </a>
  );
}
