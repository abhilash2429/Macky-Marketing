"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { TextAnimate } from "@/registry/magicui/text-animate";

export function HeroCopy() {
  const [isDescriptionComplete, setIsDescriptionComplete] = useState(false);

  return (
    <div className="hero-copy">
      <h1>
        <TextAnimate animation="blurInUp" as="span" by="character" delay={0.65} duration={0.65} once>
          Voice in.
        </TextAnimate>
        <TextAnimate animation="blurInUp" as="span" by="character" delay={1.15} duration={0.65} once className="hero-title-script">
          Action out.
        </TextAnimate>
      </h1>
      <TextAnimate
        animation="blurIn"
        as="p"
        by="line"
        delay={2.25}
        duration={0.6}
        once
        className="hero-description"
        onAnimationComplete={() => setIsDescriptionComplete(true)}
      >
        {`Macky lives quietly in your Mac's notch until you need a hand.
Hold a key, say what you need, and it gets to work across your apps.
No extra windows. No broken focus. Just back to what you were doing.`}
      </TextAnimate>
      <div className={`hero-actions${isDescriptionComplete ? " is-visible" : ""}`} aria-hidden={!isDescriptionComplete}>
        <a className="button button-dark" href="/waitlist" tabIndex={isDescriptionComplete ? 0 : -1}>
          Request early access <ArrowUpRight size={18} />
        </a>
      </div>
    </div>
  );
}
