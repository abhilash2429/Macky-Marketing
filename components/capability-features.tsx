"use client";

import { useEffect, useRef, useState } from "react";
import { LazyVideo } from "@/components/lazy-video";
import { Reveal } from "@/components/reveal";
import { capabilityVideos } from "@/lib/content";

function featureLabel(index: number) {
  return `0${index + 1} · ${capabilityVideos[index].label}`;
}

export function CapabilityFeatures() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [typedText, setTypedText] = useState(() =>
    Object.fromEntries(capabilityVideos.map((_, index) => [index, featureLabel(index)])),
  );
  const typedOnceRef = useRef<Set<number>>(new Set());
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const rows = Array.from(document.querySelectorAll<HTMLElement>("[data-capability-row]"));
    if (!rows.length) return;

    let frame = 0;

    const updateActive = () => {
      frame = 0;
      const marker = window.innerHeight * 0.42;
      let current = 0;

      for (let index = 0; index < rows.length; index += 1) {
        if (rows[index].getBoundingClientRect().top <= marker) current = index;
      }

      setActiveIndex((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const full = featureLabel(activeIndex);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      typedOnceRef.current.add(activeIndex);
      setTypedText((prev) => ({ ...prev, [activeIndex]: full }));
      return;
    }

    if (typedOnceRef.current.has(activeIndex)) {
      setTypedText((prev) => ({ ...prev, [activeIndex]: full }));
      return;
    }

    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    let index = 0;
    setTypedText((prev) => ({ ...prev, [activeIndex]: "" }));

    intervalRef.current = window.setInterval(() => {
      index += 1;
      setTypedText((prev) => ({ ...prev, [activeIndex]: full.slice(0, index) }));

      if (index >= full.length) {
        if (intervalRef.current !== null) {
          window.clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        typedOnceRef.current.add(activeIndex);
      }
    }, 32);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [activeIndex]);

  return (
    <>
      {capabilityVideos.map((feature, index) => {
        const full = featureLabel(index);
        const isActive = activeIndex === index;

        return (
          <Reveal className="feature-reveal" delay={Math.min(index * 60, 240)} key={feature.title}>
            <article
              className={`feature-row${index % 2 ? " feature-row-reverse" : ""}${isActive ? " is-active" : ""}`}
              data-capability-row
            >
              <div className="feature-copy">
                <span className={`feature-number${isActive ? " is-typing" : ""}`}>
                  <span className="feature-number-ghost" aria-hidden="true">
                    {full}
                  </span>
                  <span className="feature-number-typed">
                    {typedText[index] ?? full}
                    {isActive && (typedText[index] ?? "").length < full.length ? (
                      <span className="feature-number-caret" aria-hidden="true" />
                    ) : null}
                  </span>
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
              <div className="video-frame">
                <LazyVideo
                  src={feature.video}
                  poster={feature.poster}
                  priority={index === 0}
                  active={isActive}
                />
              </div>
            </article>
          </Reveal>
        );
      })}
    </>
  );
}
