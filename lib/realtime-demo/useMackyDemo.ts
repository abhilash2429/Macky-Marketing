"use client";

/**
 * useMackyDemo — orchestrates the live in-browser Macky voice demo.
 *
 * Flow: user gesture → resume AudioContext + request mic → get a Turnstile token →
 * POST /demo/token → open the gated WebSocket → wait for session.updated → ready.
 * Then push-to-talk (hold ⌃⌥): clear buffer, stream mic chunks while held, and on
 * release commit + response.create only if the utterance was audible (RMS gate).
 * Server events drive the notch's visual state and the transcripts; the Worker
 * force-closes at 60s (demo.expired). Everything is torn down on stop/unmount/tab
 * hide so a live Azure session never leaks.
 *
 * The client never sends session.update — the Worker owns the one authoritative
 * config. This hook only ever sends the four push-to-talk frames.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  DEMO_SAMPLE_RATE,
  DEMO_TOKEN_URL,
  demoRealtimeUrl,
} from "./config";
import {
  arrayBufferToBase64,
  downsample,
  floatTo16BitPCM,
  isAudible,
} from "./pcm";
import { PlaybackQueue } from "./playback";
import { getTurnstileToken } from "./turnstile";

/** Visual/logical states, a superset of the notch's OperationState. */
export type DemoState =
  | "idle" // ready, waiting for the user to hold the key
  | "requesting-mic"
  | "connecting"
  | "listening" // key held, capturing
  | "thinking" // response.created, awaiting audio
  | "speaking" // audio deltas playing
  | "error"
  | "expired";

export interface MackyDemo {
  state: DemoState;
  active: boolean; // a live session has been started
  start: () => void;
  stop: () => void;
  isHolding: boolean;
  userTranscript: string;
  mackyTranscript: string;
  error: string | null;
}

const WORKLET_URL = "/realtime-demo-worklet.js";

export function useMackyDemo(): MackyDemo {
  const [state, setState] = useState<DemoState>("idle");
  const [active, setActive] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [userTranscript, setUserTranscript] = useState("");
  const [mackyTranscript, setMackyTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Long-lived audio/socket refs. Kept in refs (not state) so handlers always see
  // the current instances without re-subscribing.
  const socketRef = useRef<WebSocket | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const workletRef = useRef<AudioWorkletNode | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const playbackRef = useRef<PlaybackQueue | null>(null);

  const readyRef = useRef(false); // session.updated received → mic enabled
  const holdingRef = useRef(false); // key currently held
  const audibleRef = useRef(false); // any audible chunk this utterance
  const chunkCountRef = useRef(0);
  const stoppedRef = useRef(false); // guards teardown / stale async

  const send = useCallback((frame: Record<string, unknown>) => {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(frame));
    }
  }, []);

  // ── Teardown ───────────────────────────────────────────────────────────────
  const teardown = useCallback(() => {
    stoppedRef.current = true;
    readyRef.current = false;
    holdingRef.current = false;

    try {
      workletRef.current?.disconnect();
    } catch {}
    try {
      micSourceRef.current?.disconnect();
    } catch {}
    workletRef.current = null;
    micSourceRef.current = null;

    micStreamRef.current?.getTracks().forEach((track) => track.stop());
    micStreamRef.current = null;

    playbackRef.current?.flush();
    playbackRef.current = null;

    const socket = socketRef.current;
    socketRef.current = null;
    if (socket) {
      try {
        socket.close();
      } catch {}
    }

    const context = contextRef.current;
    contextRef.current = null;
    if (context && context.state !== "closed") {
      context.close().catch(() => {});
    }
  }, []);

  const stop = useCallback(() => {
    teardown();
    setActive(false);
    setIsHolding(false);
    setState("idle");
  }, [teardown]);

  const fail = useCallback(
    (message: string) => {
      teardown();
      setError(message);
      setActive(false);
      setIsHolding(false);
      setState("error");
    },
    [teardown]
  );

  // ── Server events ────────────────────────────────────────────────────────────
  const handleServerEvent = useCallback((raw: string) => {
    let event: { type?: string; transcript?: string; error?: unknown; delta?: string };
    try {
      event = JSON.parse(raw);
    } catch {
      return;
    }
    const type = event.type ?? "";

    switch (type) {
      case "session.updated":
        readyRef.current = true;
        if (!stoppedRef.current) setState("idle");
        break;

      case "response.created":
        if (!stoppedRef.current) {
          setMackyTranscript("");
          setState("thinking");
        }
        break;

      case "response.audio.delta":
      case "response.output_audio.delta":
        if (event.delta) playbackRef.current?.enqueue(event.delta);
        if (!stoppedRef.current) setState("speaking");
        break;

      case "conversation.item.input_audio_transcription.completed":
        if (typeof event.transcript === "string") setUserTranscript(event.transcript);
        break;

      case "response.audio_transcript.done":
      case "response.output_audio_transcript.done":
        if (typeof event.transcript === "string") setMackyTranscript(event.transcript);
        break;

      case "response.done":
        // If audio is still draining, let "speaking" persist; playback's
        // onPlayingChange flips us back to idle when the queue empties.
        if (!stoppedRef.current && !playbackRef.current?.isPlaying) {
          setState("idle");
        }
        break;

      case "demo.expired":
        teardown();
        setActive(false);
        setIsHolding(false);
        setState("expired");
        break;

      case "error":
        // Never surface raw JSON to the user.
        fail("Something went wrong with the demo. Please try again.");
        break;
    }
  }, [fail, teardown]);

  // ── Start ────────────────────────────────────────────────────────────────────
  const start = useCallback(async () => {
    if (active) return;
    stoppedRef.current = false;
    setError(null);
    setUserTranscript("");
    setMackyTranscript("");
    setActive(true);

    // The AudioContext must be created inside the user gesture or the first answer
    // is silent (autoplay policy). Force 24 kHz so playback needs no resampling.
    let context: AudioContext;
    try {
      context = new AudioContext({ sampleRate: DEMO_SAMPLE_RATE });
      await context.resume();
    } catch {
      fail("Audio isn't available in this browser.");
      return;
    }
    if (stoppedRef.current) return;
    contextRef.current = context;
    playbackRef.current = new PlaybackQueue(context, (playing) => {
      if (stoppedRef.current) return;
      // When playback finishes and we're not mid-turn, return to idle.
      if (!playing && !holdingRef.current) {
        setState((prev) => (prev === "speaking" ? "idle" : prev));
      }
    });

    // Mic permission — the real funnel step.
    setState("requesting-mic");
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 },
      });
    } catch {
      fail("Macky needs microphone access for the live demo.");
      return;
    }
    if (stoppedRef.current) {
      stream.getTracks().forEach((t) => t.stop());
      return;
    }
    micStreamRef.current = stream;

    // Turnstile token, then a single-use demo token from the Worker.
    setState("connecting");
    let demoToken: string;
    try {
      const turnstileToken = await getTurnstileToken();
      const response = await fetch(DEMO_TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: turnstileToken }),
      });
      if (response.status === 429) {
        fail("You've reached today's demo limit. Try again tomorrow.");
        return;
      }
      if (!response.ok) {
        fail("Couldn't start the demo right now. Please try again.");
        return;
      }
      const data = (await response.json()) as { token?: string };
      if (!data.token) {
        fail("Couldn't start the demo right now. Please try again.");
        return;
      }
      demoToken = data.token;
    } catch {
      fail("Couldn't reach the demo service. Check your connection and try again.");
      return;
    }
    if (stoppedRef.current) return;

    // Wire the capture worklet.
    try {
      await context.audioWorklet.addModule(WORKLET_URL);
    } catch {
      fail("Audio capture isn't supported in this browser.");
      return;
    }
    if (stoppedRef.current) return;

    const micSource = context.createMediaStreamSource(stream);
    const worklet = new AudioWorkletNode(context, "macky-capture-processor");
    micSource.connect(worklet);
    // Do NOT connect the worklet to the destination — we don't want to hear the
    // mic locally. It stays alive because process() returns true.
    micSourceRef.current = micSource;
    workletRef.current = worklet;

    const hardwareRate = context.sampleRate;
    worklet.port.onmessage = (event: MessageEvent<Float32Array>) => {
      if (stoppedRef.current || !holdingRef.current || !readyRef.current) return;
      const float = event.data;
      const resampled = downsample(float, hardwareRate, DEMO_SAMPLE_RATE);
      const pcm16 = floatTo16BitPCM(resampled);
      if (isAudible(pcm16)) audibleRef.current = true;
      chunkCountRef.current += 1;
      send({
        type: "input_audio_buffer.append",
        audio: arrayBufferToBase64(pcm16.buffer as ArrayBuffer),
      });
    };

    // Open the gated realtime socket.
    const socket = new WebSocket(demoRealtimeUrl(demoToken));
    socketRef.current = socket;
    socket.onmessage = (event) => {
      if (typeof event.data === "string") handleServerEvent(event.data);
    };
    socket.onerror = () => {
      if (!stoppedRef.current) fail("The demo connection dropped. Please try again.");
    };
    socket.onclose = () => {
      // A normal end (stop/expired) has already torn down; an unexpected close
      // while active surfaces as an error.
      if (!stoppedRef.current && state !== "expired") {
        fail("The demo connection closed. Please try again.");
      }
    };
    // session.created → the Worker sends session.update → we get session.updated,
    // which flips readyRef and enables the mic (handled in handleServerEvent).
  }, [active, fail, handleServerEvent, send, state]);

  // ── Push-to-talk (hold ⌃⌥) ───────────────────────────────────────────────────
  const beginHold = useCallback(() => {
    if (!readyRef.current || holdingRef.current || stoppedRef.current) return;
    holdingRef.current = true;
    audibleRef.current = false;
    chunkCountRef.current = 0;
    setIsHolding(true);
    // Barge-in: if Macky is mid-answer, stop it and start a fresh capture.
    playbackRef.current?.flush();
    send({ type: "input_audio_buffer.clear" });
    setState("listening");
  }, [send]);

  const endHold = useCallback(() => {
    if (!holdingRef.current) return;
    holdingRef.current = false;
    setIsHolding(false);
    // Silence guard: only commit an audible utterance, else return to idle.
    if (chunkCountRef.current > 0 && audibleRef.current) {
      send({ type: "input_audio_buffer.commit" });
      send({ type: "response.create" });
      setState("thinking");
    } else {
      setState((prev) => (prev === "listening" ? "idle" : prev));
    }
  }, [send]);

  useEffect(() => {
    if (!active) return;

    const isPttChord = (e: KeyboardEvent) => e.ctrlKey && e.altKey;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return; // ignore auto-repeat
      if (isPttChord(e)) {
        e.preventDefault();
        beginHold();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      // Releasing either Control or Option ends the turn.
      if (holdingRef.current && (e.key === "Control" || e.key === "Alt" || !isPttChord(e))) {
        endHold();
      }
    };
    // A lost keyup (window blur, tab switch) must still end a held turn.
    const onBlur = () => {
      if (holdingRef.current) endHold();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [active, beginHold, endHold]);

  // Tab hide → tear down so a live Azure session never leaks in the background.
  useEffect(() => {
    if (!active) return;
    const onVisibility = () => {
      if (document.visibilityState === "hidden") stop();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [active, stop]);

  // Unmount cleanup.
  useEffect(() => teardown, [teardown]);

  return {
    state,
    active,
    start: () => void start(),
    stop,
    isHolding,
    userTranscript,
    mackyTranscript,
    error,
  };
}
