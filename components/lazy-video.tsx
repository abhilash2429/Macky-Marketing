"use client";

import { useEffect, useRef, useState } from "react";

type LazyVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  /** Eagerly warm the first paint for early rows */
  priority?: boolean;
  /** Only the active capability row should decode/play */
  active?: boolean;
};

export function LazyVideo({
  src,
  poster,
  className,
  priority = false,
  active = false,
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
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

    // Warm nearby videos only — avoid fetching the whole page of media at once.
    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        loadObserver.disconnect();
      },
      { rootMargin: "280px 0px", threshold: 0.01 },
    );

    loadObserver.observe(video);

    return () => {
      motionQuery.removeEventListener("change", updateMotionPreference);
      loadObserver.disconnect();
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
    if (!video || !shouldLoad) return;

    if (active && !prefersReducedMotion) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [active, prefersReducedMotion, shouldLoad, isReady]);

  return (
    <div className={`lazy-video-shell${isReady ? " is-ready" : ""}${className ? ` ${className}` : ""}`}>
      {poster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="lazy-video-poster"
          src={poster}
          alt=""
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
        />
      ) : null}
      <video
        ref={videoRef}
        className="lazy-video"
        src={shouldLoad ? src : undefined}
        poster={poster}
        muted
        loop
        playsInline
        preload={shouldLoad ? "metadata" : "none"}
        aria-hidden="true"
      />
    </div>
  );
}
