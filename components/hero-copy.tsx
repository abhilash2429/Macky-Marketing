"use client";

import { useState } from "react";
import { GitFork } from "lucide-react";
import { sourceUrl } from "@/lib/content";
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
        {`Macky stays quietly in your Mac's notch, ready when you need a hand.
Hold a key, say what you need, and it gets to work across your apps.
No extra windows, no broken focus, and no need to pause your flow.`}
      </TextAnimate>
      <div className={`hero-actions${isDescriptionComplete ? " is-visible" : ""}`} aria-hidden={!isDescriptionComplete}>
        <a className="button button-dark" href={sourceUrl} target="_blank" rel="noreferrer" tabIndex={isDescriptionComplete ? 0 : -1}>
          <GitFork size={18} /> Get Macky for macOS
        </a>
      </div>
    </div>
  );
}
