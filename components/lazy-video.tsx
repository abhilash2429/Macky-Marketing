"use client";

import { useEffect, useRef, useState } from "react";

type LazyVideoProps = {
  src: string;
  className?: string;
  /** Eagerly warm the first paint for early rows */
  priority?: boolean;
};

export function LazyVideo({ src, className, priority = false }: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const [isReady, setIsReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setPrefersReducedMotion(motionQuery.matches);
    updateMotionPreference();
    motionQuery.addEventListener("change", updateMotionPreference);

    // Fetch well before the card enters view so the first frame is ready.
    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          loadObserver.disconnect();
        }
      },
      { rootMargin: "800px 0px", threshold: 0 },
    );

    const playObserver = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin: "80px 0px", threshold: 0.15 },
    );

    loadObserver.observe(video);
    playObserver.observe(video);

    return () => {
      motionQuery.removeEventListener("change", updateMotionPreference);
      loadObserver.disconnect();
      playObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    let cancelled = false;

    const markReady = () => {
      if (!cancelled) setIsReady(true);
    };

    if (video.readyState >= 2) {
      markReady();
    } else {
      video.addEventListener("loadeddata", markReady);
      video.addEventListener("canplay", markReady);
    }

    return () => {
      cancelled = true;
      video.removeEventListener("loadeddata", markReady);
      video.removeEventListener("canplay", markReady);
    };
  }, [shouldLoad, src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad || !isReady) return;

    if (isVisible && !prefersReducedMotion) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [isVisible, prefersReducedMotion, shouldLoad, isReady]);

  return (
    <video
      ref={videoRef}
      className={`lazy-video${isReady ? " is-ready" : ""}${className ? ` ${className}` : ""}`}
      src={shouldLoad ? src : undefined}
      muted
      loop
      playsInline
      preload={shouldLoad || priority ? "auto" : "none"}
      aria-hidden="true"
    />
  );
}
