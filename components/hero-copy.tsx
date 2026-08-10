"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { TextAnimate } from "@/registry/magicui/text-animate";

const descriptionLines = [
  "Macky lives in your Mac's notch until you need a hand.",
  "Hold Control + Option, say what you need, and it works across your apps.",
  "No extra windows. Just back to what you were doing.",
] as const;

export function HeroCopy() {
  const [isDescriptionComplete, setIsDescriptionComplete] = useState(false);

  return (
    <div className="hero-copy">
      <h1>
        <TextAnimate animation="blurInUp" as="span" by="character" delay={0.08} duration={0.35} once>
          Voice in.
        </TextAnimate>
        <TextAnimate animation="blurInUp" as="span" by="character" delay={0.32} duration={0.35} once className="hero-title-script">
          Action out.
        </TextAnimate>
      </h1>
      <motion.p
        className="hero-description"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: { delayChildren: 0.7, staggerChildren: 0.12 },
          },
        }}
        aria-label={descriptionLines.join(" ")}
      >
        <span className="sr-only">{descriptionLines.join(" ")}</span>
        <motion.span
          className="hero-description-line"
          aria-hidden="true"
          variants={{
            hidden: { opacity: 0, filter: "blur(10px)", y: 8 },
            show: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.35 } },
          }}
        >
          {descriptionLines[0]}
        </motion.span>
        <motion.span
          className="hero-description-line"
          aria-hidden="true"
          variants={{
            hidden: { opacity: 0, filter: "blur(10px)", y: 8 },
            show: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.35 } },
          }}
        >
          Hold{" "}
          <kbd className="hero-kbd" title="Control">⌃</kbd>
          <kbd className="hero-kbd" title="Option">⌥</kbd>
          , say what you need, and it works across your apps.
        </motion.span>
        <motion.span
          className="hero-description-line"
          aria-hidden="true"
          variants={{
            hidden: { opacity: 0, filter: "blur(10px)", y: 8 },
            show: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.35 } },
          }}
          onAnimationComplete={() => setIsDescriptionComplete(true)}
        >
          {descriptionLines[2]}
        </motion.span>
      </motion.p>
      <div className={`hero-actions${isDescriptionComplete ? " is-visible" : ""}`} aria-hidden={!isDescriptionComplete}>
        <a
          className="button button-dark"
          href="/waitlist"
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={isDescriptionComplete ? 0 : -1}
        >
          Request early access <ArrowUpRight size={18} />
        </a>
      </div>
    </div>
  );
}
