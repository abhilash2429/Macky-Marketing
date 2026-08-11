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

function unlockInlinePlayback(video: HTMLVideoElement) {
  // iOS Safari is strict: muted + playsinline must be set before play().
  video.defaultMuted = true;
  video.muted = true;
  video.playsInline = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
}

export function LazyVideo({
  src,
  poster,
  className,
  priority = false,
  active = false,
}: LazyVideoProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const [isInView, setIsInView] = useState(false);
  const [revealVisible, setRevealVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(motionQuery.matches);
    sync();
    motionQuery.addEventListener("change", sync);
    return () => motionQuery.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        loadObserver.disconnect();
      },
      { rootMargin: "360px 0px", threshold: 0.01 },
    );

    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting && entry.intersectionRatio >= 0.2);
      },
      { threshold: [0, 0.2, 0.4, 0.6] },
    );

    loadObserver.observe(shell);
    viewObserver.observe(shell);

    // Don't start playback under a still-hidden Reveal (opacity: 0 blacks out on iOS).
    const reveal = shell.closest(".reveal");
    let mutation: MutationObserver | null = null;

    const syncReveal = () => {
      if (!reveal) {
        setRevealVisible(true);
        return;
      }
      setRevealVisible(reveal.classList.contains("is-visible"));
    };

    syncReveal();
    if (reveal) {
      mutation = new MutationObserver(syncReveal);
      mutation.observe(reveal, { attributes: true, attributeFilter: ["class"] });
    }

    return () => {
      loadObserver.disconnect();
      viewObserver.disconnect();
      mutation?.disconnect();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    let cancelled = false;

    const markReady = () => {
      if (!cancelled) setIsReady(true);
    };

    // `playing` is the reliable mobile signal — Safari often skips loadeddata
    // when preload is metadata-only.
    video.addEventListener("playing", markReady);
    video.addEventListener("loadeddata", markReady);
    video.addEventListener("canplay", markReady);
    video.addEventListener("canplaythrough", markReady);

    if (video.readyState >= 2) markReady();

    // Force a load after src attaches — required on some iOS versions.
    unlockInlinePlayback(video);
    try {
      video.load();
    } catch {
      // ignore
    }

    return () => {
      cancelled = true;
      video.removeEventListener("playing", markReady);
      video.removeEventListener("loadeddata", markReady);
      video.removeEventListener("canplay", markReady);
      video.removeEventListener("canplaythrough", markReady);
    };
  }, [shouldLoad, src]);

  const shouldPlay = Boolean(
    active && isInView && revealVisible && shouldLoad && !prefersReducedMotion,
  );

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    unlockInlinePlayback(video);

    if (!shouldPlay) {
      video.pause();
      return;
    }

    let cancelled = false;

    const attemptPlay = () => {
      if (cancelled) return;
      unlockInlinePlayback(video);
      void video.play().catch(() => undefined);
    };

    // Double-rAF lets Reveal's opacity settle before iOS composites the layer.
    const raf = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(attemptPlay);
    });
    const retry = window.setTimeout(attemptPlay, 180);
    const retryLate = window.setTimeout(attemptPlay, 600);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
      window.clearTimeout(retry);
      window.clearTimeout(retryLate);
    };
  }, [shouldPlay, shouldLoad, src]);

  return (
    <div
      ref={shellRef}
      className={`lazy-video-shell${isReady ? " is-ready" : ""}${className ? ` ${className}` : ""}`}
    >
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
        autoPlay={shouldPlay}
        preload={shouldLoad ? "auto" : "none"}
        aria-hidden="true"
      />
    </div>
  );
}
