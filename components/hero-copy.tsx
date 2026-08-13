"use client";

import { useEffect, useState } from "react";
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
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 720px)");

    const sync = () => {
      setReduceMotion(motionQuery.matches);
      setIsMobile(mobileQuery.matches);
    };

    sync();
    motionQuery.addEventListener("change", sync);
    mobileQuery.addEventListener("change", sync);

    if (motionQuery.matches || mobileQuery.matches) {
      const timer = window.setTimeout(() => setIsDescriptionComplete(true), 200);
      return () => {
        window.clearTimeout(timer);
        motionQuery.removeEventListener("change", sync);
        mobileQuery.removeEventListener("change", sync);
      };
    }

    return () => {
      motionQuery.removeEventListener("change", sync);
      mobileQuery.removeEventListener("change", sync);
    };
  }, []);

  const useLiteHero = reduceMotion || isMobile;

  return (
    <div className="hero-copy">
      <h1>
        {useLiteHero ? (
          <>
            <span className="hero-title-main">Voice in.</span>
            <span className="hero-title-script">Action out.</span>
          </>
        ) : (
          <>
            <TextAnimate animation="blurInUp" as="span" by="character" delay={0.08} duration={0.35} once>
              Voice in.
            </TextAnimate>
            <TextAnimate
              animation="blurInUp"
              as="span"
              by="character"
              delay={0.32}
              duration={0.35}
              once
              className="hero-title-script"
            >
              Action out.
            </TextAnimate>
          </>
        )}
      </h1>

      {useLiteHero ? (
        <p className="hero-description is-static is-mobile-tight">
          <span className="hero-description-line">
            Macky lives in your Mac&apos;s notch.
          </span>
          <span className="hero-description-line">
            Hold{" "}
            <kbd className="hero-kbd" title="Control">⌃</kbd>
            <kbd className="hero-kbd" title="Option">⌥</kbd>
            {" "}— works across your apps.
          </span>
          <span className="hero-description-line">
            No extra windows. Back to it.
          </span>
        </p>
      ) : (
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
      )}

      <div
        className={`hero-actions${isDescriptionComplete || useLiteHero ? " is-visible" : ""}`}
        aria-hidden={!(isDescriptionComplete || useLiteHero)}
      >
        <a
          className="button button-hero"
          href="/waitlist"
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={isDescriptionComplete || useLiteHero ? 0 : -1}
        >
          Request early access <ArrowUpRight size={18} />
        </a>
      </div>
    </div>
  );
}
