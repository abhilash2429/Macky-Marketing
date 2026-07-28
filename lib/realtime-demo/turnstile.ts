"use client";

/**
 * Lazy Cloudflare Turnstile integration for the voice demo.
 *
 * The Turnstile script is loaded only on the first demo start (keeps it off the
 * critical path and out of every page load). We render a one-off invisible widget,
 * execute it to get a response token, then clean it up. The token is POSTed to the
 * Worker's /demo/token, which verifies it against the secret before minting a demo
 * token. The site key is public by design.
 */

import { TURNSTILE_SITE_KEY } from "./config";

const SCRIPT_URL =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      size?: "invisible" | "normal" | "compact" | "flexible";
      callback: (token: string) => void;
      "error-callback"?: () => void;
      "timeout-callback"?: () => void;
    }
  ) => string;
  execute: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<TurnstileApi> | null = null;

function loadScript(): Promise<TurnstileApi> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<TurnstileApi>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Turnstile requires a browser"));
      return;
    }
    if (window.turnstile) {
      resolve(window.turnstile);
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error("Turnstile failed to initialize"));
    };
    script.onerror = () => reject(new Error("Turnstile failed to load"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Loads Turnstile if needed, runs an invisible challenge, and resolves with a
 * one-time response token. Rejects on load/challenge failure or a 15s timeout.
 */
export async function getTurnstileToken(): Promise<string> {
  const turnstile = await loadScript();

  return new Promise<string>((resolve, reject) => {
    const container = document.createElement("div");
    container.style.display = "none";
    document.body.appendChild(container);

    let widgetId: string | null = null;
    let settled = false;

    const cleanup = () => {
      if (widgetId) {
        try {
          turnstile.remove(widgetId);
        } catch {}
      }
      container.remove();
    };

    const timeout = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error("Turnstile timed out"));
    }, 15_000);

    try {
      widgetId = turnstile.render(container, {
        sitekey: TURNSTILE_SITE_KEY,
        size: "invisible",
        callback: (token: string) => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timeout);
          cleanup();
          resolve(token);
        },
        "error-callback": () => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timeout);
          cleanup();
          reject(new Error("Turnstile challenge failed"));
        },
        "timeout-callback": () => {
          if (settled) return;
          settled = true;
          window.clearTimeout(timeout);
          cleanup();
          reject(new Error("Turnstile challenge timed out"));
        },
      });
      turnstile.execute(widgetId);
    } catch (err) {
      if (!settled) {
        settled = true;
        window.clearTimeout(timeout);
        cleanup();
        reject(err instanceof Error ? err : new Error("Turnstile error"));
      }
    }
  });
}
