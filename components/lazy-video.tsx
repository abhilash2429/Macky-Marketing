"use client";

import { useEffect, useRef, useState } from "react";

type LazyVideoProps = {
  src: string;
  className?: string;
};

export function LazyVideo({ src, className }: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setPrefersReducedMotion(motionQuery.matches);
    updateMotionPreference();
    motionQuery.addEventListener("change", updateMotionPreference);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) setShouldLoad(true);
      },
      { rootMargin: "160px 0px", threshold: 0.01 },
    );

    observer.observe(video);

    return () => {
      motionQuery.removeEventListener("change", updateMotionPreference);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    if (isVisible && !prefersReducedMotion) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [isVisible, prefersReducedMotion, shouldLoad]);

  return (
    <video
      ref={videoRef}
      className={className}
      src={shouldLoad ? src : undefined}
      muted
      loop
      playsInline
      preload={shouldLoad ? "metadata" : "none"}
      aria-hidden="true"
    />
  );
}
